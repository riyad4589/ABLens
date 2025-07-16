import React from 'react';
import abcircle from '../assets/abcircle.png';

// Loader personnalisé avec image et animation CSS
export function CssLoader({ size = 48 }) {
  return (
    <div style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <img
        src={abcircle}
        alt="Chargement..."
        style={{
          width: '100%',
          height: '100%',
          animation: 'spin 1.2s linear infinite',
          display: 'block',
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 