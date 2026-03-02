import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Wallet, TrendingUp, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const BentoGrid = () => {
    const containerVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 40 },
        show: {
            opacity: 1, scale: 1, y: 0,
            transition: { type: "spring", stiffness: 260, damping: 25 }
        }
    };

    const hoverSpring = { type: "spring", stiffness: 400, damping: 25 };

    return (
        <section className="section-padding" id="features" style={{ perspective: '1500px', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ textAlign: 'center', marginBottom: '80px' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', borderRadius: '100px', marginBottom: '24px',
                            backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                        }}
                    >
                        <Sparkles size={14} color="var(--cta-bg)" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary-dark)' }}>Why FinishLine</span>
                    </motion.div>
                    <h2 style={{ fontSize: '56px', letterSpacing: '-2px', marginBottom: '24px', fontWeight: 700, color: 'var(--text-primary-dark)' }}>
                        Everything your wealth needs
                    </h2>
                    <p style={{ fontSize: '20px', color: 'var(--text-secondary-dark)', margin: '0 auto', maxWidth: '600px', fontWeight: 500 }}>
                        One platform to detect, optimize, and grow your finances — powered by AI, secured by Plaid.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', transformStyle: 'preserve-3d' }}
                >
                    {/* Top Full Width — AI Chatbot (Dark Card) */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ scale: 1.01 }}
                        style={{
                            gridColumn: '1 / -1',
                            backgroundColor: '#000000',
                            borderRadius: '32px', padding: '56px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            position: 'relative', overflow: 'hidden', cursor: 'pointer', color: 'white',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Ambient glow in blue */}
                        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(27, 43, 184, 0.4) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%' }} />

                        <div style={{ maxWidth: '460px', zIndex: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--cta-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bot size={18} color="white" />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: 'white', textTransform: 'uppercase' }}>AI Personal CFO</span>
                            </div>
                            <h3 style={{ fontSize: '40px', letterSpacing: '-1.5px', marginBottom: '16px', fontWeight: 700, lineHeight: 1.1 }}>
                                Ask anything about<br />your finances
                            </h3>
                            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: 1.6 }}>
                                "How much TFSA room do I have?" — AI answers with your real account data, tax rules, and live balances.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={hoverSpring}>
                                <span style={{ padding: '14px 28px', borderRadius: '999px', backgroundColor: 'white', color: '#000000', fontWeight: 700, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    Try the Chat <ArrowRight size={18} />
                                </span>
                            </motion.div>
                        </div>

                        {/* Chat mockup (Desktop Window Style) */}
                        <div style={{ position: 'relative', width: '400px', zIndex: 1, paddingRight: '20px' }}>
                            <motion.div
                                animate={{ y: [-4, 4, -4] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px',
                                    border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)', overflow: 'hidden'
                                }}
                            >
                                {/* Mac Window Header */}
                                <div style={{ height: '32px', backgroundColor: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '6px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                                    <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--cta-bg)', padding: '12px 18px', borderRadius: '16px 16px 4px 16px', fontSize: '14px', fontWeight: 500, maxWidth: '240px' }}>
                                        How much TFSA room do I have?
                                    </div>
                                    <div style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', color: '#000000', padding: '16px 20px', borderRadius: '16px 16px 16px 4px', fontSize: '14px', fontWeight: 500, maxWidth: '280px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                                        You have <strong>$23,000</strong> in TFSA room. Your TD chequing has $4,200 — want me to move it?
                                    </div>
                                    <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--cta-bg)', padding: '12px 18px', borderRadius: '16px 16px 4px 16px', fontSize: '14px', fontWeight: 500 }}>
                                        Move $500 to my TFSA
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                                        <span style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: '#000000', color: 'white', fontSize: '13px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)' }}>✓ Approve</span>
                                        <span style={{ padding: '10px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Bottom Left — Salary Autopilot (White Card) */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ scale: 1.015, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '32px', padding: '48px',
                            display: 'flex', flexDirection: 'column',
                            position: 'relative', overflow: 'hidden', cursor: 'pointer',
                            border: '1px solid var(--border-color)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F3F3F3', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                <Zap size={16} color="var(--text-primary-dark)" />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--text-primary-dark)', textTransform: 'uppercase' }}>Autopilot</span>
                        </div>
                        <h3 style={{ fontSize: '32px', letterSpacing: '-1px', marginBottom: '16px', fontWeight: 700, color: 'var(--text-primary-dark)' }}>
                            Salary lands,<br />AI splits it instantly
                        </h3>
                        <p style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', lineHeight: 1.6, marginBottom: '32px', fontWeight: 500 }}>
                            RRSP, credit card, TFSA, buffer — all optimized in one tap when your paycheck arrives.
                        </p>

                        {/* Split breakdown mockup */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                            {[
                                { label: '📊 RRSP', amount: '$800', width: '35%' },
                                { label: '💳 CC Debt', amount: '$780', width: '32%' },
                                { label: '🏦 TFSA', amount: '$600', width: '25%' },
                                { label: '🔒 Buffer', amount: '$2,500', width: '80%' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: item.width }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 100 }}
                                    style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '12px 16px', borderRadius: '8px',
                                        backgroundColor: '#F3F3F3', fontSize: '13px', fontWeight: 700,
                                        minWidth: '200px', color: 'var(--text-primary-dark)'
                                    }}
                                >
                                    <span>{item.label}</span>
                                    <span>{item.amount}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Bottom Right — Security (White Card) */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ scale: 1.015, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '32px', padding: '48px',
                            display: 'flex', flexDirection: 'column',
                            position: 'relative', overflow: 'hidden', cursor: 'pointer',
                            border: '1px solid var(--border-color)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F3F3F3', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                <Shield size={16} color="var(--text-primary-dark)" />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--text-primary-dark)', textTransform: 'uppercase' }}>Security</span>
                        </div>
                        <h3 style={{ fontSize: '32px', letterSpacing: '-1px', marginBottom: '16px', fontWeight: 700, color: 'var(--text-primary-dark)' }}>
                            Read-only access,<br />bank-grade security
                        </h3>
                        <p style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', lineHeight: 1.6, marginBottom: '32px', fontWeight: 500 }}>
                            Connected via Plaid's encrypted infrastructure. We never see your credentials — only read your data.
                        </p>

                        {/* Security badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'auto' }}>
                            {['256-bit AES', 'SOC 2', 'Read-Only', 'Plaid Certified', 'PIPEDA'].map((badge, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + i * 0.08 }}
                                    style={{
                                        padding: '10px 18px', borderRadius: '100px', fontSize: '12px', fontWeight: 700,
                                        backgroundColor: '#FFFFFF', color: 'var(--text-primary-dark)',
                                        border: '1px solid var(--border-color)',
                                    }}
                                >
                                    {badge}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>


                </motion.div>
            </div>
        </section>
    );
};

export default BentoGrid;
