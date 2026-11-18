import React from 'react';

function MelaLogo({ compact = false }) {
  return (
    <span className={`mela-logo${compact ? ' mela-logo-compact' : ''}`} aria-hidden="true">
      <svg className="mela-logo-mark" viewBox="0 0 48 48" role="img">
        <defs>
          <linearGradient id="mela-purple" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9b82df" />
            <stop offset="1" stopColor="#6348ad" />
          </linearGradient>
        </defs>
        <path d="M8 10.5C8 7.46 10.46 5 13.5 5h21C37.54 5 40 7.46 40 10.5v21C40 34.54 37.54 37 34.5 37H13.5A5.5 5.5 0 0 1 8 31.5v-21Z" fill="url(#mela-purple)" />
        <path d="M14.8 27.8V14.9l7.2 9.2 7.2-9.2v12.9" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="35" cy="35" r="6" fill="#f2a07f" />
        <path d="M35 31.9v6.2M31.9 35h6.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className="mela-logo-word">
          mela<span className="mela-logo-period">.</span>
        </span>
      )}
    </span>
  );
}

export default MelaLogo;
