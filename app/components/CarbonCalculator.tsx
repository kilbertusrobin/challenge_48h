import React, { useState } from 'react';

interface EmissionFactors {
  transport: {
    car: number;      // kg CO2/km
    bus: number;
    train: number;
    plane: number;
  };
  energy: {
    electricity: number; // kg CO2/kWh
    gas: number;        // kg CO2/kWh
    heating: number;    // kg CO2/kWh
  };
  food: {
    meat: number;      // kg CO2/portion
    fish: number;
    vegetarian: number;
    vegan: number;
  };
}

const emissionFactors: EmissionFactors = {
  transport: {
    car: 0.12,
    bus: 0.08,
    train: 0.04,
    plane: 0.25
  },
  energy: {
    electricity: 0.0571,
    gas: 0.2016,
    heating: 0.234
  },
  food: {
    meat: 3.3,
    fish: 1.6,
    vegetarian: 1.0,
    vegan: 0.63
  }
};

interface CalculatorData {
  transport: {
    carKm: number;
    busKm: number;
    trainKm: number;
    planeKm: number;
  };
  energy: {
    electricityKwh: number;
    gasKwh: number;
    heatingKwh: number;
  };
  food: {
    meatMeals: number;
    fishMeals: number;
    vegetarianMeals: number;
    veganMeals: number;
  };
}

const CarbonCalculator: React.FC = () => {
  const [data, setData] = useState<CalculatorData>({
    transport: { carKm: 0, busKm: 0, trainKm: 0, planeKm: 0 },
    energy: { electricityKwh: 0, gasKwh: 0, heatingKwh: 0 },
    food: { meatMeals: 0, fishMeals: 0, vegetarianMeals: 0, veganMeals: 0 }
  });

  const [result, setResult] = useState<{
    transport: number;
    energy: number;
    food: number;
    total: number;
  } | null>(null);

  const calculateEmissions = () => {
    const transportEmissions = 
      data.transport.carKm * emissionFactors.transport.car +
      data.transport.busKm * emissionFactors.transport.bus +
      data.transport.trainKm * emissionFactors.transport.train +
      data.transport.planeKm * emissionFactors.transport.plane;

    const energyEmissions = 
      data.energy.electricityKwh * emissionFactors.energy.electricity +
      data.energy.gasKwh * emissionFactors.energy.gas +
      data.energy.heatingKwh * emissionFactors.energy.heating;

    const foodEmissions = 
      data.food.meatMeals * emissionFactors.food.meat +
      data.food.fishMeals * emissionFactors.food.fish +
      data.food.vegetarianMeals * emissionFactors.food.vegetarian +
      data.food.veganMeals * emissionFactors.food.vegan;

    const total = transportEmissions + energyEmissions + foodEmissions;

    setResult({
      transport: transportEmissions,
      energy: energyEmissions,
      food: foodEmissions,
      total
    });
  };

  const updateValue = (category: keyof CalculatorData, field: string, value: number) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const getAdvice = (total: number) => {
    if (total < 50) return "Excellent ! Votre empreinte carbone est très faible.";
    if (total < 100) return "Bien ! Continuez vos efforts pour réduire votre impact.";
    if (total < 200) return "Modéré. Il y a des améliorations possibles.";
    return "Élevé. Pensez à adopter des habitudes plus écologiques.";
  };

  return (
    <section className="carbon-calculator">
      <div className="calculator-container">
        <div className="calculator-header">
          <h2 className="calculator-title">Calculateur d'Empreinte Carbone</h2>
          <p className="calculator-subtitle">
            Estimez vos émissions de CO2 hebdomadaires
          </p>
        </div>

        <div className="calculator-content">
          <div className="calculator-form">
            <div className="form-grid">
              {/* Transport */}
              <div className="category-section">
                <h3 className="category-title">🚗 Transport (km/semaine)</h3>
                <div className="input-grid">
                  <div className="input-group">
                    <label>Voiture</label>
                    <input 
                      type="number" 
                      value={data.transport.carKm}
                      onChange={(e) => updateValue('transport', 'carKm', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="input-group">
                    <label>Bus/Métro</label>
                    <input 
                      type="number" 
                      value={data.transport.busKm}
                      onChange={(e) => updateValue('transport', 'busKm', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="input-group">
                    <label>Train</label>
                    <input 
                      type="number" 
                      value={data.transport.trainKm}
                      onChange={(e) => updateValue('transport', 'trainKm', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="input-group">
                    <label>Avion</label>
                    <input 
                      type="number" 
                      value={data.transport.planeKm}
                      onChange={(e) => updateValue('transport', 'planeKm', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Énergie */}
              <div className="category-section">
                <h3 className="category-title">⚡ Énergie (kWh/semaine)</h3>
                <div className="input-grid">
                  <div className="input-group">
                    <label>Électricité</label>
                    <input 
                      type="number" 
                      value={data.energy.electricityKwh}
                      onChange={(e) => updateValue('energy', 'electricityKwh', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="input-group">
                    <label>Gaz</label>
                    <input 
                      type="number" 
                      value={data.energy.gasKwh}
                      onChange={(e) => updateValue('energy', 'gasKwh', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="input-group">
                    <label>Chauffage</label>
                    <input 
                      type="number" 
                      value={data.energy.heatingKwh}
                      onChange={(e) => updateValue('energy', 'heatingKwh', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Alimentation */}
              <div className="category-section">
                <h3 className="category-title">🍽️ Alimentation (repas/semaine)</h3>
                <div className="input-grid">
                  <div className="input-group">
                    <label>Avec viande</label>
                    <input 
                      type="number" 
                      value={data.food.meatMeals}
                      onChange={(e) => updateValue('food', 'meatMeals', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="input-group">
                    <label>Avec poisson</label>
                    <input 
                      type="number" 
                      value={data.food.fishMeals}
                      onChange={(e) => updateValue('food', 'fishMeals', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="input-group">
                    <label>Végétarien</label>
                    <input 
                      type="number" 
                      value={data.food.vegetarianMeals}
                      onChange={(e) => updateValue('food', 'vegetarianMeals', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="input-group">
                    <label>Végan</label>
                    <input 
                      type="number" 
                      value={data.food.veganMeals}
                      onChange={(e) => updateValue('food', 'veganMeals', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="calculate-button"
              onClick={calculateEmissions}
            >
              Calculer mon empreinte
            </button>
          </div>

          {result && (
            <div className="results-section">
              <h3 className="results-title">Vos émissions hebdomadaires</h3>
              
              <div className="results-grid">
                <div className="result-card transport">
                  <div className="result-icon">🚗</div>
                  <div className="result-content">
                    <span className="result-label">Transport</span>
                    <span className="result-value">{result.transport.toFixed(1)} kg CO2</span>
                  </div>
                </div>

                <div className="result-card energy">
                  <div className="result-icon">⚡</div>
                  <div className="result-content">
                    <span className="result-label">Énergie</span>
                    <span className="result-value">{result.energy.toFixed(1)} kg CO2</span>
                  </div>
                </div>

                <div className="result-card food">
                  <div className="result-icon">🍽️</div>
                  <div className="result-content">
                    <span className="result-label">Alimentation</span>
                    <span className="result-value">{result.food.toFixed(1)} kg CO2</span>
                  </div>
                </div>

                <div className="result-card total">
                  <div className="result-icon">🌍</div>
                  <div className="result-content">
                    <span className="result-label">Total</span>
                    <span className="result-value">{result.total.toFixed(1)} kg CO2</span>
                  </div>
                </div>
              </div>

              <div className="advice-section">
                <p className="advice-text">{getAdvice(result.total)}</p>
                <div className="comparison">
                  <span>Équivalent annuel : <strong>{(result.total * 52).toFixed(0)} kg CO2</strong></span>
                  <span>Objectif français 2030 : <strong>2 000 kg CO2/an</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CarbonCalculator;