import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                    style={{
                        position: 'relative', overflow: 'hidden',
                        backgroundColor: '#000000',
                        borderRadius: '48px', padding: '100px 60px',
                        textAlign: 'center', color: 'white',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* Animated ambient glows — tailored to Nova's blue */}
                    <div style={{
                        position: 'absolute', top: '-100px', left: '-50px', width: '400px', height: '400px',
                        background: 'radial-gradient(circle, rgba(27, 43, 184, 0.5) 0%, transparent 70%)',
                        filter: 'blur(80px)', borderRadius: '50%', animation: 'ctaGlow1 8s ease-in-out infinite',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-80px', right: '-40px', width: '350px', height: '350px',
                        background: 'radial-gradient(circle, rgba(27, 43, 184, 0.3) 0%, transparent 70%)',
                        filter: 'blur(60px)', borderRadius: '50%', animation: 'ctaGlow2 10s ease-in-out infinite',
                    }} />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        style={{ position: 'relative', zIndex: 2 }}
                    >
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                            borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)', marginBottom: '32px',
                        }}>
                            <Sparkles size={16} color="white" />
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Free to start — no credit card needed</span>
                        </div>

                        <h2 style={{ fontSize: '64px', fontWeight: 700, letterSpacing: '-2.5px', marginBottom: '24px', lineHeight: 1.05 }}>
                            Stop leaving money<br />on the table
                        </h2>
                        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: '540px', margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 500 }}>
                            The average Canadian leaves $4,200/year in unused tax room. FinishLine finds it in seconds.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                                <Link to="/signup" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '18px 40px', borderRadius: '100px',
                                    backgroundColor: 'var(--cta-bg)',
                                    color: 'white', fontWeight: 700, fontSize: '16px', textDecoration: 'none',
                                    boxShadow: '0 10px 30px rgba(27, 43, 184, 0.3)',
                                }}>
                                    Start Optimizing <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                                <Link to="/login" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '18px 40px', borderRadius: '100px',
                                    backgroundColor: 'white',
                                    color: '#000000', fontWeight: 700, fontSize: '16px', textDecoration: 'none',
                                }}>
                                    Sign In
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <style>{`
                @keyframes ctaGlow1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(40px, 20px) scale(1.1); }
                }
                @keyframes ctaGlow2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-30px, -20px) scale(1.05); }
                }
            `}</style>
        </section>
    );
};

export default CTASection;
