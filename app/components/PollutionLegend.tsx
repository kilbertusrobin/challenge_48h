import React from 'react';
import { Thermometer } from 'lucide-react';
import './PollutionLegend.css';

const PollutionLegend: React.FC = () => {
  return (
    <div className="legend-container">
      <div className="legend-header">
        <div className="legend-icon">
          <Thermometer width={16} height={16} />
        </div>
        <h3>Indice de Pollution</h3>
      </div>
      <div className="legend-content">
        <p>
          L'indice de pollution va de 0 (faible) à 20 (très élevé). La couleur sur la carte correspond à cet indice.
        </p>
        <div className="legend-gradient"></div>
        <div className="legend-labels">
          <span>0 (Faible)</span>
          <span>10 (Modéré)</span>
          <span>20 (Élevé)</span>
        </div>
        <div className="legend-extra">
          <div className="legend-extra-color"></div>
          <span>Supérieur à 20: Extrême</span>
        </div>
      </div>
    </div>
  );
};

export default PollutionLegend;