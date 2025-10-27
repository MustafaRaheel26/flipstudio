// src/sections/BrandCarousel.jsx
import React from 'react';
import './BrandCarousel.css';

// Import all logos
import Logo1 from '../assets/Logo1.png';
import Logo2 from '../assets/Logo2.png';
import Logo3 from '../assets/Logo3.png';
import Logo4 from '../assets/Logo4.png';
import Logo5 from '../assets/Logo5.png';
import Logo6 from '../assets/Logo6.png';
import Logo7 from '../assets/Logo7.png';
import Logo8 from '../assets/Logo8.png';
import Logo9 from '../assets/Logo9.png';
import Logo10 from '../assets/Logo10.png';
import Logo11 from '../assets/Logo11.png';
import Logo12 from '../assets/Logo12.png';

const LOGOS = [
  Logo1, Logo2, Logo3, Logo4, Logo5, Logo6,
  Logo7, Logo8, Logo9, Logo10, Logo11, Logo12
];

const BRAND_NAMES = [
  "ADIA", "ADNOC", "ARADA", "AUROBINDO", "BBZ", 
  "DAIKIN", "MUBADALA", "GRANULES", "JAMIE'S", "J&J", 
  "LDC", "TAJ"
];

export default function BrandCarousel() {
  const duplicatedLogos = [...LOGOS, ...LOGOS, ...LOGOS];
  const duplicatedNames = [...BRAND_NAMES, ...BRAND_NAMES, ...BRAND_NAMES];

  return (
    <section className="brands-section">
      <div className="brands-inner">
        <div className="brands-track">
          {duplicatedLogos.map((src, i) => (
            <div className="brand-item" key={i}>
              <div className="brand-card">
                <div className="brand-front">
                  <img 
                    src={src} 
                    alt={duplicatedNames[i]} 
                  />
                </div>
                <div className="brand-back">
                  <span>{duplicatedNames[i]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}