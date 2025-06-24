import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Quelles sont les conséquences d'un air de mauvaise qualité sur la santé ?",
    answer: "La pollution de l'air peut causer de nombreux problèmes de santé : irritations des yeux et des voies respiratoires, aggravation de l'asthme, bronchites chroniques, maladies cardiovasculaires, et même certains cancers. Les particules fines (PM2.5 et PM10) sont particulièrement dangereuses car elles pénètrent profondément dans les poumons et peuvent atteindre la circulation sanguine. Les personnes les plus vulnérables sont les enfants, les personnes âgées et celles souffrant déjà de pathologies respiratoires ou cardiaques."
  },
  {
    id: 2,
    question: "Comment puis-je améliorer mon empreinte environnementale au quotidien ?",
    answer: "Plusieurs actions simples peuvent réduire votre impact : privilégiez les transports en commun, le vélo ou la marche ; réduisez votre consommation d'énergie (LED, appareils économes, isolation) ; adoptez une alimentation plus locale et moins carnée ; réduisez, réutilisez et recyclez vos déchets ; choisissez des produits durables et éco-responsables. Même de petits gestes quotidiens, multipliés par des millions de personnes, ont un impact significatif sur l'environnement."
  },
  {
    id: 3,
    question: "Comment savoir si la qualité de l'air est bonne dans ma région ?",
    answer: "Plusieurs outils vous permettent de suivre la qualité de l'air : consultez les indices ATMO disponibles sur les sites des AASQA (Associations Agrées de Surveillance de la Qualité de l'Air) de votre région, utilisez des applications mobiles comme Air Quality Index ou Plume Labs, ou consultez les prévisions météo qui incluent souvent ces informations. L'indice va de 1 (très bon) à 10 (très mauvais) avec des codes couleurs. En cas de pic de pollution, limitez les activités physiques intenses en extérieur."
  },
  {
    id: 4,
    question: "Quels sont les principaux polluants atmosphériques à surveiller ?",
    answer: "Les polluants les plus préoccupants sont : les particules fines (PM2.5 et PM10) issues du trafic routier et du chauffage ; l'ozone (O3) formé par réaction photochimique en été ; le dioxyde d'azote (NO2) produit par les véhicules et l'industrie ; le dioxyde de soufre (SO2) émis par l'industrie et le chauffage au fioul. Ces polluants sont mesurés en continu par des stations de surveillance et font l'objet de seuils réglementaires pour protéger la santé publique."
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Questions Fréquentes</h2>
          <p className="faq-subtitle">
            Tout ce que vous devez savoir sur la qualité de l'air et l'environnement
          </p>
        </div>

        <div className="faq-list">
          {faqData.map((item) => (
            <div 
              key={item.id} 
              className={`faq-item ${openItems.includes(item.id) ? 'open' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleItem(item.id)}
                aria-expanded={openItems.includes(item.id)}
              >
                <span className="question-text">{item.question}</span>
                <span className="question-icon">
                  {openItems.includes(item.id) ? '−' : '+'}
                </span>
              </button>
              
              <div className="faq-answer">
                <div className="answer-content">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;