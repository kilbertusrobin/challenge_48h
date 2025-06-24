import type { PollutionData, PollutionZone, BordeauxApiResponse, BordeauxPollutionRecord } from '../types/pollution';

export class PollutionApiService {
  private static baseUrl = 'https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/gir_concentration-polluant-jour-atmo/records';

  // Fonction pour calculer l'AQI basé sur les polluants
  private static calculateAQI(pm25: number, pm10: number, no2: number, o3: number): number {
    // Calcul simplifié de l'AQI basé sur les seuils européens
    const pm25Index = Math.min((pm25 / 25) * 50, 300);
    const pm10Index = Math.min((pm10 / 50) * 50, 300);
    const no2Index = Math.min((no2 / 200) * 100, 300);
    const o3Index = Math.min((o3 / 180) * 100, 300);
    
    return Math.round(Math.max(pm25Index, pm10Index, no2Index, o3Index));
  }

  // Fonction pour déterminer le niveau basé sur l'AQI
  private static getLevel(aqi: number): 'excellent' | 'good' | 'moderate' | 'unhealthy' | 'hazardous' {
    if (aqi <= 25) return 'excellent';
    if (aqi <= 100) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 10) return 'unhealthy';
    return 'hazardous';
  }

  // Fonction pour obtenir les données les plus récentes par station
  private static getLatestDataByStation(records: any[]): Map<string, any> {
    const stationLatestData = new Map<string, any>();

    records.forEach(record => {
      const stationName = record.nom_station;
      const date = record.date_debut;
      
      if (!stationName || !date) return;

      // Créer une clé unique pour la station
      const key = stationName;
      
      // Vérifier si on a déjà des données pour cette station
      const existing = stationLatestData.get(key);
      
      if (!existing || new Date(date) > new Date(existing.date)) {
        // Si c'est la première fois qu'on voit cette station ou si la date est plus récente
        if (!existing) {
          stationLatestData.set(key, {
            station: stationName,
            date: date,
            coordinates: record.geo_point_2d ? [record.geo_point_2d.lat, record.geo_point_2d.lon] : null,
            pollutants: new Map()
          });
        }
        
        // Ajouter le polluant actuel
        const pollutantName = record.nom_poll?.toLowerCase() || '';
        const value = record.valeur;
        
        if (value !== undefined && value !== null) {
          let standardPollutant = '';
          
          if (pollutantName.includes('pm2,5') || pollutantName.includes('pm2.5') || pollutantName.includes('pm25')) {
            standardPollutant = 'pm25';
          } else if (pollutantName.includes('pm10')) {
            standardPollutant = 'pm10';
          } else if (pollutantName.includes('no2') || pollutantName.includes('dioxyde d\'azote')) {
            standardPollutant = 'no2';
          } else if (pollutantName.includes('o3') || pollutantName.includes('ozone')) {
            standardPollutant = 'o3';
          }
          
          if (standardPollutant) {
            stationLatestData.get(key)!.pollutants.set(standardPollutant, value);
          }
        }
      }
    });

    return stationLatestData;
  }

  // Récupère les données de pollution actuelles
  static async getCurrentPollutionData(): Promise<PollutionData[]> {
    try {
      const url = this.baseUrl + '?where=nom_dept%3A%22GIRONDE%22&limit=100&lang=fr';
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('FETCH API DATA (getCurrentPollutionData):', data);

      if (!data.results || data.results.length === 0) {
        return [];
      }

      // Grouper par station et garder la mesure la plus récente pour chaque polluant
      const stationMap: Record<string, any> = {};
      data.results.forEach((record: any) => {
        const station = record.nom_station;
        const date = record.date_debut;
        let coordinates: [number, number] | null = null;
        if (record.geo_point_2d && record.geo_point_2d.lat && record.geo_point_2d.lon) {
          coordinates = [record.geo_point_2d.lat, record.geo_point_2d.lon];
        } else if (record.geo_shape && record.geo_shape.geometry && Array.isArray(record.geo_shape.geometry.coordinates)) {
          const [lon, lat] = record.geo_shape.geometry.coordinates;
          coordinates = [lat, lon];
        }
        if (!station || !date || !coordinates) return;
        if (!stationMap[station]) {
          stationMap[station] = {
            id: station.replace(/\s+/g, '-').toLowerCase(),
            name: station,
            coordinates: coordinates,
            pm25: 0,
            pm10: 0,
            no2: 0,
            o3: 0,
            timestamp: date
          };
        }
        const pollutant = (record.nom_poll || '').toLowerCase();
        const value = record.valeur;
        // Pour chaque polluant, ne garder que la valeur la plus récente
        if (pollutant.includes('pm2,5') || pollutant.includes('pm2.5') || pollutant.includes('pm25')) {
          if (!stationMap[station].pm25Date || new Date(date) > new Date(stationMap[station].pm25Date)) {
            stationMap[station].pm25 = value;
            stationMap[station].pm25Date = date;
          }
        } else if (pollutant.includes('pm10')) {
          if (!stationMap[station].pm10Date || new Date(date) > new Date(stationMap[station].pm10Date)) {
            stationMap[station].pm10 = value;
            stationMap[station].pm10Date = date;
          }
        } else if (pollutant.includes('no2') || pollutant.includes('dioxyde d\'azote')) {
          if (!stationMap[station].no2Date || new Date(date) > new Date(stationMap[station].no2Date)) {
            stationMap[station].no2 = value;
            stationMap[station].no2Date = date;
          }
        } else if (pollutant.includes('o3') || pollutant.includes('ozone')) {
          if (!stationMap[station].o3Date || new Date(date) > new Date(stationMap[station].o3Date)) {
            stationMap[station].o3 = value;
            stationMap[station].o3Date = date;
          }
        }
      });

      const pollutionData: PollutionData[] = Object.values(stationMap).map((point: any) => {
        const aqi = this.calculateAQI(point.pm25, point.pm10, point.no2, point.o3);
        const level = this.getLevel(aqi);
        return {
          id: point.id,
          name: point.name,
          coordinates: point.coordinates,
          aqi,
          pm25: point.pm25,
          pm10: point.pm10,
          no2: point.no2,
          o3: point.o3,
          level,
          timestamp: point.timestamp
        };
      });
      return pollutionData.length > 0 ? pollutionData : [];
    } catch (error) {
      return [];
    }
  }

  // Version alternative avec différentes approches pour l'URL
  static async getCurrentPollutionDataAlternative(): Promise<PollutionData[]> {
    const urlVariants = [
      // Variant 1: URL de base simple (celle qui fonctionne)
      this.baseUrl,
      
      // Variant 2: Avec limit seulement
      `${this.baseUrl}?limit=200`,
      
      // Variant 3: Avec offset pour paginer
      `${this.baseUrl}?offset=0&limit=200`,
      
      // Variant 4: Essayer avec select pour optimiser
      `${this.baseUrl}?select=nom_station,nom_poll,valeur,date_debut,geo_point_2d,nom_dept`,
    ];

    for (const url of urlVariants) {
      try {
        console.log('Tentative avec URL:', url);
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Succès avec URL:', url);
          console.log('Données reçues:', data);
          
          if (data.results && data.results.length > 0) {
            return this.processApiData(data.results);
          }
        }
      } catch (error) {
        console.log('Échec avec URL:', url, error);
        continue;
      }
    }
    
    console.log('Toutes les tentatives ont échoué, utilisation des données de fallback');
    return [];
  }

  // Méthode séparée pour traiter les données de l'API
  private static processApiData(results: any[]): PollutionData[] {
    // Filtrer les données pour la Gironde côté client si nécessaire
    const girondeData = results.filter((record: any) => 
      record.nom_dept?.toUpperCase() === 'GIRONDE' ||
      record.nom_station?.toLowerCase().includes('bordeaux') ||
      record.nom_station?.toLowerCase().includes('talence') ||
      record.nom_station?.toLowerCase().includes('mérignac')
    );

    // Grouper ensuite par station + date pour collecter tous les polluants
    const groupedData: Record<string, any> = {};
    
    const recordsToProcess = girondeData.length > 0 ? girondeData : results;
    
    recordsToProcess.forEach((record: any) => {
      const station = record.nom_station;
      const date = record.date_debut;
      const key = `${station}__${date}`;
      let coordinates: [number, number] | null = null;
      if (record.geo_point_2d && record.geo_point_2d.lat && record.geo_point_2d.lon) {
        coordinates = [record.geo_point_2d.lat, record.geo_point_2d.lon];
      } else if (record.geo_shape && record.geo_shape.geometry && Array.isArray(record.geo_shape.geometry.coordinates)) {
        const [lon, lat] = record.geo_shape.geometry.coordinates;
        coordinates = [lat, lon];
      }
      if (!station || !date || !coordinates) return;
      if (!groupedData[key]) {
        groupedData[key] = {
          id: key.replace(/\s+/g, '-').toLowerCase(),
          name: station,
          coordinates: coordinates,
          pm25: 0,
          pm10: 0,
          no2: 0,
          o3: 0,
          timestamp: date
        };
      }
      
      // Mapper les polluants
      const pollutantName = record.nom_poll?.toLowerCase() || '';
      const value = record.valeur || 0;
      
      if (pollutantName.includes('pm2,5') || pollutantName.includes('pm2.5') || pollutantName.includes('pm25')) {
        groupedData[key].pm25 = value;
      } else if (pollutantName.includes('pm10')) {
        groupedData[key].pm10 = value;
      } else if (pollutantName.includes('no2') || pollutantName.includes('dioxyde d\'azote')) {
        groupedData[key].no2 = value;
      } else if (pollutantName.includes('o3') || pollutantName.includes('ozone')) {
        groupedData[key].o3 = value;
      }
    });

    // Obtenir seulement les données les plus récentes par station
    const latestByStation: Record<string, any> = {};
    Object.values(groupedData).forEach((item: any) => {
      const station = item.name;
      if (!latestByStation[station] || new Date(item.timestamp) > new Date(latestByStation[station].timestamp)) {
        latestByStation[station] = item;
      }
    });

    const pollutionData: PollutionData[] = Object.values(latestByStation).map((point: any) => {
      const aqi = this.calculateAQI(point.pm25, point.pm10, point.no2, point.o3);
      const level = this.getLevel(aqi);
      return {
        ...point,
        aqi,
        level
      };
    });

    return pollutionData;
  }

  // Récupère les données pour une zone spécifique
  static async getPollutionByZone(zoneId: string): Promise<PollutionData[]> {
    try {
      const allData = await this.getCurrentPollutionData();
      return allData.filter(data => 
        data.name.toLowerCase().includes(zoneId.toLowerCase())
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des données par zone:', error);
      throw error;
    }
  }

  // Nouvelle méthode pour récupérer tous les points par pagination
  static async getAllCurrentPollutionData(): Promise<PollutionData[]> {
    const allResults: any[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const url = this.baseUrl + `?where=nom_dept%3A%22GIRONDE%22&limit=${limit}&offset=${offset}&lang=fr`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        allResults.push(...data.results);
        offset += limit;
        // Si on a reçu moins que le limit, c'est fini
        if (data.results.length < limit) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    // On réutilise le parsing de processApiData
    return this.processApiData(allResults);
  }

  // Récupère les données pour une liste de stations (multi-fetch)
  static async getPollutionDataForStations(): Promise<PollutionData[]> {
    const stations = [
      "Bassens",
      "Talence",
      "Bordeaux - Gautier",
      "Bordeaux - Grand Parc",
      "Mérignac",
      "Bordeaux - Bastide",
      "Floirac - Branne",
      "Ambès",
      "Le Temple"
    ];

    const fetches = stations.map(station => {
      const url = `${this.baseUrl}?limit=100&lang=fr&refine=nom_station%3A%22${encodeURIComponent(station)}%22`;
      return fetch(url)
        .then(res => res.json())
        .then(data => data.results || []);
    });

    const allResults = (await Promise.all(fetches)).flat();
    return this.processApiData(allResults);
  }
}

// DEBUG : fetch et log brut de l'API à l'URL fournie
(async () => {
  const url = 'https://opendata.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/gir_concentration-polluant-jour-atmo/records?limit=20&lang=fr&refine=nom_station%3A%22Bordeaux%20-%20Grand%20Parc%22&refine=nom_station%3A%22M%C3%A9rignac%22&refine=nom_station%3A%22Bassens%22&refine=nom_station%3A%22Bordeaux%20-%20Gautier%22&refine=nom_station%3A%22Talence%22&refine=nom_station%3A%22Bordeaux%20-%20Bastide%22&refine=nom_station%3A%22Floirac%20-%20Branne%22&refine=nom_station%3A%22Amb%C3%A8s%22&refine=nom_station%3A%22Le%20Temple%22';
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('DEBUG API DATA:', data);
  } catch (e) {
    console.error('DEBUG API ERROR:', e);
  }
})();