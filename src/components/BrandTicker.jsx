import React from 'react';

const BrandTicker = () => {
    return (
        <div style={{ padding: '60px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: 0.5,
                    fontWeight: 800,
                    fontSize: '24px',
                    letterSpacing: '2px'
                }}>
                    {['ACME CORP', 'GLOBAL INC', 'TECHSTARS', 'VENTURES', 'INNOVATE'].map((brand, idx) => (
                        <div key={idx}>{brand}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandTicker;
