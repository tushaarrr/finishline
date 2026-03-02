import React from 'react';

const GridLines = () => {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: -1,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            padding: '0 24px',
        }}>
            {/* 5 lines to create 4 columns */}
            <div style={{ borderLeft: '1px solid rgba(0,0,0,0.03)', height: '100%' }} />
            <div style={{ borderLeft: '1px solid rgba(0,0,0,0.03)', height: '100%' }} />
            <div style={{ borderLeft: '1px solid rgba(0,0,0,0.03)', height: '100%' }} />
            <div style={{ borderLeft: '1px solid rgba(0,0,0,0.03)', borderRight: '1px solid rgba(0,0,0,0.03)', height: '100%' }} />

            {/* Background Glowing Animated Orbs */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '50vw',
                height: '50vw',
                background: 'radial-gradient(circle, rgba(213,201,248,0.4) 0%, rgba(213,201,248,0) 70%)',
                borderRadius: '50%',
                animation: 'floatOrb 15s ease-in-out infinite alternate',
                filter: 'blur(60px)'
            }} />
            <div style={{
                position: 'absolute',
                top: '40%',
                right: '-10%',
                width: '40vw',
                height: '40vw',
                background: 'radial-gradient(circle, rgba(204,246,234,0.4) 0%, rgba(204,246,234,0) 70%)',
                borderRadius: '50%',
                animation: 'floatOrb 20s ease-in-out infinite alternate-reverse',
                filter: 'blur(60px)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                left: '20%',
                width: '60vw',
                height: '60vw',
                background: 'radial-gradient(circle, rgba(255,213,191,0.3) 0%, rgba(255,213,191,0) 70%)',
                borderRadius: '50%',
                animation: 'floatOrb 18s ease-in-out infinite alternate',
                filter: 'blur(60px)'
            }} />

            <style>{`
        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.05); }
          100% { transform: translate(-5%, 10%) scale(0.95); }
        }
      `}</style>
        </div>
    );
};

export default GridLines;
