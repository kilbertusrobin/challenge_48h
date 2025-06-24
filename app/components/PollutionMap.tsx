import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Rectangle, Circle } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import type { PollutionData, PollutionZone } from '../types/pollution';
import 'leaflet/dist/leaflet.css';
import './PollutionMap.css';

interface PollutionMapProps {
  pollutionData: PollutionData[];
  pollutionZones: PollutionZone[];
  onPointSelect: (data: PollutionData) => void;
}

const PollutionMap: React.FC<PollutionMapProps> = ({ 
  pollutionData, 
  pollutionZones, 
  onPointSelect 
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Centre sur Bordeaux ou sur le premier point si dispo
  const bordeauxCenter: [number, number] = pollutionData.length > 0 ? pollutionData[0].coordinates : [44.8378, -0.5792];

  // Fonction pour créer une icône personnalisée selon le niveau de pollution
  const createCustomIcon = (level: string, aqi: number) => {
    // Couleur forcée pour test visibilité
    const color = '#dc2626'; // rouge vif
    const textColor = '#ffffff';
    return new DivIcon({
      className: 'custom-pollution-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${textColor};
          font-weight: bold;
          font-size: 12px;
        ">
          ${aqi}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // Fonction pour obtenir la couleur selon le niveau
  const getZoneColor = (level: string) => {
    switch (level) {
      case 'excellent': return '#dbe4d1';
      case 'good': return '#6aa839';
      case 'moderate': return '#eab308';
      case 'unhealthy': return '#f97316';
      case 'hazardous': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Bon';
      case 'moderate': return 'Modéré';
      case 'unhealthy': return 'Mauvais';
      case 'hazardous': return 'Dangereux';
      default: return 'Inconnu';
    }
  };

  // Fonction utilitaire pour la couleur (vert -> jaune selon la valeur)
  function getPollutionColor(valeur: number): string {
    // S'assure que la valeur est entre 0 et 20
    const v = Math.max(0, Math.min(20, valeur));
    
    // Interpole la couleur entre vert (0) et jaune (20)
    // Vert: hsl(120, 100%, 50%)
    // Jaune: hsl(60, 100%, 50%)
    const hue = 120 - (v / 20) * 60;
    
    return `hsl(${hue}, 100%, 45%)`;
  }

  if (!isClient) {
    return null;
  }

  console.log('pollutionData (avant render)', pollutionData);
  if (pollutionData.length > 0) {
    console.log('Premier point', pollutionData[0]);
  }

  return (
    <div className="map-container-full">
      <MapContainer
        center={bordeauxCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Points de mesure dynamiques sous forme de Rectangles */}
        {pollutionData.map((point) => {
          const lat = point.coordinates[0];
          const lon = point.coordinates[1];
          // Utilise la valeur de NO2 pour la couleur
          const color = getPollutionColor(point.no2);
          return (
            <Circle
              key={point.id}
              center={[lat, lon]}
              radius={1900}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.7,
                color: color,
                weight: 2,
              }}
              eventHandlers={{
                click: () => {
                  onPointSelect(point);
                },
              }}
            />
          );
        })}

        {/* Zones de pollution */}
        {pollutionZones.map((zone) => (
          <Rectangle
            key={zone.id}
            bounds={zone.bounds}
            pathOptions={{
              fillColor: getZoneColor(zone.level),
              fillOpacity: 0.3,
              color: getZoneColor(zone.level),
              weight: 2,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default PollutionMap;