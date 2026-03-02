import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroVisual = () => {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
    const y3 = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    return (
        <section style={{ position: 'relative', height: '600px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '100%' }}>
                {/* Left Card (Peach) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        left: '10%',
                        top: '100px',
                        width: '280px',
                        height: '380px',
                        backgroundColor: 'var(--accent-peach)',
                        borderRadius: '24px',
                        rotate: '-12deg',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        padding: '32px',
                        y: y1,
                        zIndex: 1
                    }}
                    initial={{ opacity: 0, x: -50, rotate: 0 }}
                    animate={{ opacity: 1, x: 0, rotate: -12 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '1px' }}>FINIX</div>
                    <div style={{ marginTop: 'auto', paddingTop: '220px' }}>
                        <div style={{ fontSize: '14px', opacity: 0.6 }}>Balance</div>
                        <div style={{ fontSize: '32px', fontWeight: 700 }}>$12,400</div>
                    </div>
                </motion.div>

                {/* Center Card (Black) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '40px',
                        marginLeft: '-170px',
                        width: '340px',
                        height: '460px',
                        backgroundColor: 'var(--bg-dark)',
                        color: 'white',
                        borderRadius: '32px',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                        padding: '40px',
                        y: y2,
                        zIndex: 3
                    }}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div style={{ fontWeight: 800, fontSize: '24px', letterSpacing: '2px' }}>SLOPE</div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ffbd2e', marginLeft: '-8px' }} />
                        </div>
                    </div>
                    <div style={{ height: '60px', width: '48px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', marginBottom: '140px' }} />
                    <div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary-light)', marginBottom: '8px' }}>Card Number</div>
                        <div style={{ letterSpacing: '3px', fontFamily: 'monospace', fontSize: '18px' }}>•••• •••• •••• 4289</div>
                    </div>
                </motion.div>

                {/* Right Card (Mint) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        right: '10%',
                        top: '140px',
                        width: '260px',
                        height: '340px',
                        backgroundColor: 'var(--accent-mint)',
                        borderRadius: '24px',
                        rotate: '8deg',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        padding: '32px',
                        y: y3,
                        zIndex: 2
                    }}
                    initial={{ opacity: 0, x: 50, rotate: 0 }}
                    animate={{ opacity: 1, x: 0, rotate: 8 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '1px' }}>FINIX</div>
                    <div style={{ marginTop: 'auto', paddingTop: '180px' }}>
                        <div style={{ fontSize: '14px', opacity: 0.6 }}>Limit</div>
                        <div style={{ fontSize: '28px', fontWeight: 700 }}>$50,000</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroVisual;
