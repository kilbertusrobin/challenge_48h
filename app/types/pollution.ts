export interface PollutionData {
  id: string;
  name: string;
  coordinates: [number, number];
  aqi: number; // Air Quality Index
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  level: 'excellent' | 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  timestamp: string;
}

export interface PollutionZone {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]];
  level: 'excellent' | 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  aqi: number;
}

// Interface pour l'API de Bordeaux Métropole
export interface BordeauxPollutionRecord {
  recordid: string;
  fields: {
    nom_station: string;
    date_debut: string;
    date_fin: string;
    polluant: string;
    valeur: number;
    unite: string;
    statut_validation: string;
    geo_point_2d?: [number, number];
    x_l93?: number;
    y_l93?: number;
  };
  geometry?: {
    type: string;
    coordinates: [number, number];
  };
}

export interface BordeauxApiResponse {
  nhits: number;
  parameters: any;
  records: BordeauxPollutionRecord[];
}