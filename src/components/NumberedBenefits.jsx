import React from 'react';
import { motion } from 'framer-motion';

const NumberedBenefits = () => {
    const benefits = [
        { title: "Convenience", desc: "Access your funds globally without worrying about banking hours or physical branches." },
        { title: "Time-Saving", desc: "Automate reconciliation and accounting workflows that traditionally take days." },
        { title: "Enhanced Security", desc: "Benefit from multi-factor authentication and real-time fraud monitoring." },
        { title: "Access to Innovative Tools", desc: "Leverage intelligent analytics to forecast runway and manage burn rate." }
    ];

    return (
        <section className="section-padding" style={{ backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
                <div className="grid-2">

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {benefits.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                style={{ display: 'flex', gap: '24px' }}
                            >
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    color: 'var(--accent-purple)',
                                    fontFamily: 'monospace'
                                }}>
                                    0{index + 1}.
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '24px', letterSpacing: '-0.5px', marginBottom: '12px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', lineHeight: '1.6' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                        style={{
                            backgroundColor: 'var(--accent-mint)',
                            borderRadius: '32px',
                            height: '100%',
                            minHeight: '500px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div style={{
                            width: '70%',
                            height: '70%',
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative mock card stack inside */}
                            <div style={{ position: 'absolute', top: '20px', left: '20px', width: '200px', height: '120px', backgroundColor: 'var(--bg-dark)', borderRadius: '16px', rotate: '-5deg', zIndex: 1 }} />
                            <div style={{ position: 'absolute', top: '40px', left: '30px', width: '200px', height: '120px', backgroundColor: 'var(--highlight-peach)', borderRadius: '16px', rotate: '5deg', zIndex: 2 }} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default NumberedBenefits;
