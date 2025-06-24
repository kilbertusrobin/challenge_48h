import React from 'react';
import type { PollutionData } from '../types/pollution';
import { Wind, Thermometer, Eye, Droplet, MapPin } from 'lucide-react';
import './PollutionDetails.css';

interface PollutionDetailsProps {
  data: PollutionData | null;
}

const PollutionDetails: React.FC<PollutionDetailsProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="details-placeholder">
        <div className="details-header">
          <div className="details-header-icon">
            <Eye width={16} height={16} />
          </div>
          <h3>Détails de la Pollution</h3>
        </div>
        <div className="placeholder-content">
          <div className="placeholder-icon-wrapper">
            <Wind />
          </div>
          <p>Cliquez sur un point de mesure pour voir les détails</p>
        </div>
      </div>
    );
  }

  // Fonction pour obtenir la couleur selon la valeur de pollution
  function getPollutionColor(valeur: number): string {
    // S'assure que la valeur est entre 0 et 20
    const v = Math.max(0, Math.min(20, valeur));
    // Interpole la couleur entre vert (0) et jaune (20)
    // Vert: hsl(120, 100%, 50%)
    // Jaune: hsl(60, 100%, 50%)
    const hue = 120 - (v / 20) * 60;
    return `hsl(${hue}, 100%, 45%)`;
  }

  return (
    <div className="details-container">
      <div className="details-main-header">
        <div className="details-station-name">
          <div className="details-header-icon">
            <MapPin width={16} height={16} />
          </div>
          <h3>{data.name}</h3>
        </div>
        <div
          className="details-no2-badge"
          style={{ backgroundColor: getPollutionColor(data.no2) }}
        >

        </div>
      </div>

      <div className="details-grid">
        <div className="metric-card">
          <div className="metric-icon pm25">
            <Wind width={16} height={16} />
          </div>
          <div className="metric-text">
            <p>PM2.5</p>
            <p>{data.pm25} µg/m³</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon pm10">
            <Droplet width={16} height={16} />
          </div>
          <div className="metric-text">
            <p>PM10</p>
            <p>{data.pm10} µg/m³</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon no2">
            <Thermometer width={16} height={16} />
          </div>
          <div className="metric-text">
            <p>NO₂</p>
            <p>{data.no2} µg/m³</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon o3">
            <Eye width={16} height={16} />
          </div>
          <div className="metric-text">
            <p>O₃</p>
            <p>{data.o3} µg/m³</p>
          </div>
        </div>
      </div>

      <div className="details-footer">
        <p>
          Dernière mise à jour: {new Date(data.timestamp).toLocaleString('fr-FR')}
        </p>
      </div>
    </div>
  );
};

export default PollutionDetails;