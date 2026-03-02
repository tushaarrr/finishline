import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DarkSection = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const card1Y = useTransform(scrollYProgress, [0, 1], [150, -150]);

    return (
        <section ref={containerRef} className="section-padding" style={{
            backgroundColor: 'var(--bg-dark)',
            color: 'white',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <div className="container">

                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.6 }}
                        style={{ fontSize: '56px', letterSpacing: '-2px', marginBottom: '24px' }}
                    >
                        Discover the possibilities<br />with our card
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ color: 'var(--text-secondary-light)', fontSize: '20px', maxWidth: '600px', margin: '0 auto', marginBottom: '40px' }}
                    >
                        Unlock advanced financial tools that grow with you. Issue unlimited virtual cards.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <button className="btn btn-outline">Discover More</button>
                    </motion.div>
                </div>

                {/* Central Card Visual */}
                <div style={{ position: 'relative', height: '400px', display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                        style={{
                            width: '500px',
                            height: '320px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '24px',
                            y: card1Y,
                            zIndex: 2,
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '32px', letterSpacing: '4px', opacity: 0.9 }}>SLOPE</div>
                                <div style={{ fontSize: '14px', opacity: 0.6, marginTop: '8px' }}>Business Rewards</div>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ffbd2e', marginLeft: '-12px' }} />
                            </div>
                        </div>
                        <div style={{ width: '60px', height: '40px', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '6px' }} />
                        <div>
                            <div style={{ letterSpacing: '4px', fontFamily: 'monospace', fontSize: '24px', color: 'white', marginBottom: '12px' }}>•••• •••• •••• 9012</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: 0.8 }}>
                                <span>JOHN DOE</span>
                                <span>12/28</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Yellow Glow Behind Card */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        height: '400px',
                        backgroundColor: 'var(--highlight-yellow)',
                        filter: 'blur(150px)',
                        opacity: 0.15,
                        zIndex: 1
                    }} />
                </div>
            </div>
        </section>
    );
};

export default DarkSection;
