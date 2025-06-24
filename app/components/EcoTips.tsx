import React, { useState, useEffect } from 'react';

interface EcoTip {
  id: number;
  category: 'transport' | 'energy' | 'food' | 'waste' | 'water';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  co2Saved: number; // kg CO2/an
  icon: string;
}

const ecoTips: EcoTip[] = [
  {
    id: 1,
    category: 'transport',
    title: 'Utilisez le vélo pour les trajets courts',
    description: 'Remplacez la voiture par le vélo pour les trajets de moins de 5 km. Bon pour la santé et l\'environnement !',
    impact: 'high',
    difficulty: 'easy',
    co2Saved: 480,
    icon: '🚴‍♀️'
  },
  {
    id: 2,
    category: 'energy',
    title: 'Baissez le chauffage de 1°C',
    description: 'Réduire la température de 1°C peut diminuer votre consommation de chauffage de 7%.',
    impact: 'medium',
    difficulty: 'easy',
    co2Saved: 240,
    icon: '🌡️'
  },
  {
    id: 3,
    category: 'food',
    title: 'Réduisez votre consommation de viande',
    description: 'Remplacez 2 repas avec viande par semaine par des alternatives végétales.',
    impact: 'high',
    difficulty: 'medium',
    co2Saved: 650,
    icon: '🥬'
  },
  {
    id: 4,
    category: 'waste',
    title: 'Compostez vos déchets organiques',
    description: 'Le compostage réduit les déchets de 30% et crée un engrais naturel pour vos plantes.',
    impact: 'medium',
    difficulty: 'medium',
    co2Saved: 180,
    icon: '🗂️'
  },
  {
    id: 5,
    category: 'water',
    title: 'Prenez des douches plus courtes',
    description: 'Réduire le temps de douche de 2 minutes économise 20 litres d\'eau chaude.',
    impact: 'low',
    difficulty: 'easy',
    co2Saved: 95,
    icon: '🚿'
  },
  {
    id: 6,
    category: 'energy',
    title: 'Débranchez vos appareils électroniques',
    description: 'Les appareils en veille consomment jusqu\'à 10% de votre facture électrique.',
    impact: 'medium',
    difficulty: 'easy',
    co2Saved: 120,
    icon: '🔌'
  },
  {
    id: 7,
    category: 'transport',
    title: 'Privilégiez les transports en commun',
    description: 'Un bus peut remplacer jusqu\'à 40 voitures en heure de pointe.',
    impact: 'high',
    difficulty: 'easy',
    co2Saved: 920,
    icon: '🚌'
  },
  {
    id: 8,
    category: 'food',
    title: 'Achetez local et de saison',
    description: 'Les produits locaux réduisent l\'empreinte transport et soutiennent l\'économie locale.',
    impact: 'medium',
    difficulty: 'medium',
    co2Saved: 280,
    icon: '🥕'
  }
];

const categories = {
  transport: { name: 'Transport', color: '#3b82f6' },
  energy: { name: 'Énergie', color: '#f59e0b' },
  food: { name: 'Alimentation', color: '#10b981' },
  waste: { name: 'Déchets', color: '#8b5cf6' },
  water: { name: 'Eau', color: '#06b6d4' }
};

const EcoTips: React.FC = () => {
  const [currentTip, setCurrentTip] = useState<EcoTip>(ecoTips[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [likedTips, setLikedTips] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomTip = ecoTips[Math.floor(Math.random() * ecoTips.length)];
      setCurrentTip(randomTip);
    }, 10000); // Change toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  const getImpactColor = (impact: EcoTip['impact']) => {
    switch (impact) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
    }
  };

  const getDifficultyText = (difficulty: EcoTip['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
    }
  };

  const toggleLike = (tipId: number) => {
    setLikedTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  const filteredTips = filterCategory === 'all' 
    ? ecoTips 
    : ecoTips.filter(tip => tip.category === filterCategory);

  return (
    <section className="eco-tips">
      <div className="tips-container">
        <div className="tips-header">
          <h2 className="tips-title">Conseils Écologiques</h2>
          <p className="tips-subtitle">
            Des gestes simples pour réduire votre impact environnemental
          </p>
        </div>

        {/* Conseil du moment */}
        <div className="featured-tip">
          <div className="featured-tip-header">
            <span className="featured-label">💡 Conseil du moment</span>
            <span 
              className="tip-category-badge"
              style={{ backgroundColor: categories[currentTip.category].color }}
            >
              {categories[currentTip.category].name}
            </span>
          </div>
          
          <div className="featured-tip-content">
            <div className="tip-icon">{currentTip.icon}</div>
            <div className="tip-details">
              <h3 className="tip-title">{currentTip.title}</h3>
              <p className="tip-description">{currentTip.description}</p>
              
              <div className="tip-metrics">
                <div className="metric">
                  <span className="metric-label">Impact CO2</span>
                  <span className="metric-value">{currentTip.co2Saved} kg/an</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Difficulté</span>
                  <span className="metric-value">{getDifficultyText(currentTip.difficulty)}</span>
                </div>
                <div 
                  className="impact-indicator"
                  style={{ backgroundColor: getImpactColor(currentTip.impact) }}
                >
                  Impact {currentTip.impact === 'low' ? 'Faible' : currentTip.impact === 'medium' ? 'Moyen' : 'Fort'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="filters">
          <button 
            className={`filter-button ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            Tous
          </button>
          {Object.entries(categories).map(([key, category]) => (
            <button 
              key={key}
              className={`filter-button ${filterCategory === key ? 'active' : ''}`}
              onClick={() => setFilterCategory(key)}
              style={{ 
                borderColor: filterCategory === key ? category.color : undefined,
                color: filterCategory === key ? category.color : undefined
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grille des conseils */}
        <div className="tips-grid">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="tip-card">
              <div className="tip-card-header">
                <span className="tip-card-icon">{tip.icon}</span>
                <button 
                  className={`like-button ${likedTips.includes(tip.id) ? 'liked' : ''}`}
                  onClick={() => toggleLike(tip.id)}
                >
                  {likedTips.includes(tip.id) ? '❤️' : '🤍'}
                </button>
              </div>
              
              <h4 className="tip-card-title">{tip.title}</h4>
              <p className="tip-card-description">{tip.description}</p>
              
              <div className="tip-card-footer">
                <span 
                  className="category-tag"
                  style={{ backgroundColor: categories[tip.category].color }}
                >
                  {categories[tip.category].name}
                </span>
                <span className="co2-saving">-{tip.co2Saved} kg CO2/an</span>
              </div>
            </div>
          ))}
        </div>

        {/* Statistiques */}
        <div className="stats-section">
          <h3 className="stats-title">Votre Impact Potentiel</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🌱</div>
              <div className="stat-content">
                <span className="stat-value">{likedTips.length}</span>
                <span className="stat-label">Conseils suivis</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💨</div>
              <div className="stat-content">
                <span className="stat-value">
                  {likedTips.reduce((total, tipId) => {
                    const tip = ecoTips.find(t => t.id === tipId);
                    return total + (tip ? tip.co2Saved : 0);
                  }, 0)} kg
                </span>
                <span className="stat-label">CO2 économisé/an</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🌍</div>
              <div className="stat-content">
                <span className="stat-value">
                  {Math.round(likedTips.reduce((total, tipId) => {
                    const tip = ecoTips.find(t => t.id === tipId);
                    return total + (tip ? tip.co2Saved : 0);
                  }, 0) / 2000 * 100)}%
                </span>
                <span className="stat-label">Vers l'objectif 2030</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcoTips;