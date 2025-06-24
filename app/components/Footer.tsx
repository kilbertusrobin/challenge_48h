import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Qualité de l'Air. Tous droits réservés.</p>
    </footer>
  );
};

export default Footer; 