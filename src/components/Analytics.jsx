import React from 'react';
import { motion } from 'framer-motion';

const Analytics = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: 'white' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '48px', letterSpacing: '-1.5px', marginBottom: '80px' }}>
                    Deep insights into your<br />financial health
                </h2>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    style={{
                        maxWidth: '1000px',
                        margin: '0 auto',
                        height: '500px',
                        backgroundColor: 'var(--bg-light)',
                        borderRadius: '32px',
                        border: '1px solid var(--border-color)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '40px'
                    }}
                >
                    {/* Mock Dashboard UI inside Analytics section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ width: '120px', height: '80px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)' }}>Revenue</div>
                                <div style={{ fontSize: '20px', fontWeight: 700 }}>$142K</div>
                            </div>
                            <div style={{ width: '120px', height: '80px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)' }}>Expenses</div>
                                <div style={{ fontSize: '20px', fontWeight: 700 }}>$84K</div>
                            </div>
                        </div>
                        <div style={{ width: '200px', height: '40px', backgroundColor: 'var(--border-color)', borderRadius: '8px' }} />
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                        {[30, 45, 25, 60, 80, 50, 95, 70, 40, 65, 85, 40, 100].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                                style={{
                                    flex: 1,
                                    backgroundColor: i === 6 ? 'var(--highlight-mint)' : 'var(--border-color)',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Analytics;
