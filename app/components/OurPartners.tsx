import React from 'react';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

// Vos partenaires - ajustez les chemins selon votre structure de projet
const partners: Partner[] = [
  {
    id: 1,
    name: "Enlight",
    logo: "/images/enlight.jpg"
  },
  {
    id: 2,
    name: "Université de Bordeaux",
    logo: "/images/logo-universite-bordeaux-300x88.png"
  },
  {
    id: 3,
    name: "Freshmile",
    logo: "/images/téléchargement.png"
  },
  {
    id: 4,
    name: "Alec",
    logo: "/images/alec_logo.png"
  },
  {
    id: 6,
    name: "Atmo Nouvelle-Aquitaine",
    logo: "/images/Atmo-Nouvelle-Aquitaine-Logo.png"
  }
];

const OurPartners: React.FC = () => {
  // Dupliquer les partenaires pour un défilement continu
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="partners-section">
      <div className="partners-container">
        <h2 className="partners-title">Nos Partenaires</h2>
        
        <div className="partners-marquee">
          <div className="partners-track">
            {duplicatedPartners.map((partner, index) => (
              <div 
                key={`${partner.id}-${index}`} 
                className="partner-item"
                title={partner.name}
              >
                <img 
                  src={partner.logo} 
                  alt={`Logo ${partner.name}`}
                  className="partner-logo"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPartners;