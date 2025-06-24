import React, { useState, useEffect } from 'react';
interface AirAlert {
  id: number;
  city: string;
  region: string;
  level: 'info' | 'warning' | 'danger' | 'critical' | 'good';
  pollutant: string;
  value: number;
  threshold: number;
  unit: string;
  message: string;
  recommendations: string[];
  timestamp: Date;
  duration: string;
}

const airAlerts: AirAlert[] = [
  {
    id: 1,
    city: "Bordeaux Centre",
    region: "Bordeaux Métropole",
    level: 'good',
    pollutant: 'PM2.5',
    value: 18,
    threshold: 25,
    unit: 'µg/m³',
    message: 'Qualité de l\'air satisfaisante',
    recommendations: [
      'Conditions favorables pour les activités extérieures',
      'Bon moment pour aérer votre logement',
      'Privilégiez les déplacements à pied ou à vélo'
    ],
    timestamp: new Date(),
    duration: '12h'
  },
  {
    id: 2,
    city: "Pessac",
    region: "Bordeaux Métropole",
    level: 'warning',
    pollutant: 'NO2',
    value: 45,
    threshold: 40,
    unit: 'µg/m³',
    message: 'Pic de dioxyde d\'azote détecté',
    recommendations: [
      'Évitez les axes de circulation dense',
      'Privilégiez les transports en commun',
      'Limitez les efforts physiques intenses près des routes'
    ],
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    duration: '6-8h'
  },
  {
    id: 3,
    city: "Mérignac",
    region: "Bordeaux Métropole",
    level: 'info',
    pollutant: 'O3',
    value: 165,
    threshold: 180,
    unit: 'µg/m³',
    message: 'Niveau d\'ozone en surveillance',
    recommendations: [
      'Surveillez l\'évolution dans l\'après-midi',
      'Évitez les activités intenses entre 12h et 16h',
      'Hydratez-vous régulièrement'
    ],
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    duration: '4-6h'
  },
  {
    id: 4,
    city: "Talence",
    region: "Bordeaux Métropole",
    level: 'good',
    pollutant: 'PM10',
    value: 22,
    threshold: 50,
    unit: 'µg/m³',
    message: 'Particules en suspension : niveau bas',
    recommendations: [
      'Excellentes conditions pour les activités extérieures',
      'Moment idéal pour le sport en plein air',
      'Pensez à aérer votre logement'
    ],
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    duration: '8-12h'
  }
];

const getAlertConfig = (level: AirAlert['level']) => {
  switch (level) {
    case 'info':
      return { 
        color: '#3b82f6', 
        bg: '#dbeafe', 
        icon: 'ℹ️', 
        title: 'Information' 
      };
    case 'warning':
      return { 
        color: '#f59e0b', 
        bg: '#fef3c7', 
        icon: '⚠️', 
        title: 'Attention' 
      };
    case 'danger':
      return { 
        color: '#ef4444', 
        bg: '#fee2e2', 
        icon: '🚨', 
        title: 'Alerte' 
      };
    case 'critical':
      return { 
        color: '#7c2d12', 
        bg: '#fecaca', 
        icon: '🆘', 
        title: 'Critique' 
      };
    case 'good':
      return { 
        color: '#10b981', 
        bg: '#d1fae5', 
        icon: '✅', 
        title: 'Bon' 
      };
    default:
      return { 
        color: '#64748b', 
        bg: '#f1f5f9', 
        icon: '❓', 
        title: 'Inconnu' 
      };
  }
};

const AirAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AirAlert[]>(airAlerts);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'danger' | 'critical' | 'good'>('all');
  const [notifications, setNotifications] = useState(true);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `Il y a ${diffInHours}h`;
  };

  const dismissAlert = (alertId: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.level === filter);

  const criticalCount = alerts.filter(a => a.level === 'critical' || a.level === 'danger').length;

  return (
    <section className="air-alerts">
      <div className="alerts-container">
        <div className="alerts-header">
          <div className="header-content">
            <h2 className="alerts-title">Qualité de l'Air - Bordeaux Métropole</h2>
            <p className="alerts-subtitle">
              Surveillance en temps réel des 28 communes de la métropole
            </p>
          </div>
          
          <div className="header-controls">
            <div className="notifications-toggle">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                Notifications
              </label>
            </div>
            
            {criticalCount > 0 && (
              <div className="critical-badge">
                {criticalCount} alerte{criticalCount > 1 ? 's' : ''} critique{criticalCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="alerts-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({alerts.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'info' ? 'active' : ''}`}
            onClick={() => setFilter('info')}
          >
            Info ({alerts.filter(a => a.level === 'info').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
            onClick={() => setFilter('warning')}
          >
            Attention ({alerts.filter(a => a.level === 'warning').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'good' ? 'active' : ''}`}
            onClick={() => setFilter('good')}
          >
            Bon ({alerts.filter(a => a.level === 'good').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'danger' ? 'active' : ''}`}
            onClick={() => setFilter('danger')}
          >
            Alerte ({alerts.filter(a => a.level === 'danger').length})
          </button>
        </div>

        <div className="alerts-list">
          {filteredAlerts.length === 0 ? (
            <div className="no-alerts">
              <div className="no-alerts-icon">✅</div>
              <h3>Aucune alerte active</h3>
              <p>La qualité de l'air est bonne sur Bordeaux Métropole</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const config = getAlertConfig(alert.level);
              
              return (
                <div 
                  key={alert.id} 
                  className={`alert-card ${alert.level}`}
                  style={{ 
                    backgroundColor: config.bg,
                    borderLeftColor: config.color 
                  }}
                >
                  <div className="alert-header">
                    <div className="alert-title-section">
                      <span className="alert-icon">{config.icon}</span>
                      <div className="alert-location">
                        <h3 className="alert-city">{alert.city}</h3>
                        <span className="alert-region">{alert.region}</span>
                      </div>
                    </div>
                    
                    <div className="alert-meta">
                      <span className="alert-time">{formatTimeAgo(alert.timestamp)}</span>
                      <button 
                        className="dismiss-btn"
                        onClick={() => dismissAlert(alert.id)}
                        title="Ignorer cette alerte"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="alert-content">
                    <div className="alert-message">
                      <h4 style={{ color: config.color }}>{alert.message}</h4>
                      <div className="pollutant-info">
                        <span className="pollutant-name">{alert.pollutant}</span>
                        <span className="pollutant-value">
                          {alert.value} {alert.unit}
                        </span>
                        <span className="threshold-info">
                          (seuil: {alert.threshold} {alert.unit})
                        </span>
                      </div>
                    </div>

                    <div className="alert-details">
                      <div className="duration">
                        <span className="duration-label">Durée estimée:</span>
                        <span className="duration-value">{alert.duration}</span>
                      </div>
                      
                      <div className="recommendations">
                        <h5>Recommandations:</h5>
                        <ul>
                          {alert.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="progress-indicator">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${Math.min((alert.value / alert.threshold) * 100, 100)}%`,
                          backgroundColor: config.color 
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {Math.round((alert.value / alert.threshold) * 100)}% du seuil
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="alerts-footer">
          <div className="footer-info">
            <p>
              <strong>Source:</strong> ATMO Nouvelle-Aquitaine • 
              Données Bordeaux Métropole • 
              Mise à jour toutes les heures • 
              <a href="#" className="footer-link">En savoir plus</a>
            </p>
          </div>
          
          <div className="legend">
            <h4>Niveaux d'alerte:</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
                Information
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
                Attention
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
                Alerte
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#7c2d12' }}></span>
                Critique
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirAlerts;