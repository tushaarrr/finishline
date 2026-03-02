import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah K.',
        role: 'Freelance Designer',
        text: "FinishLine found $3,200 in unused TFSA room I didn't even know I had. One tap and it was done.",
        avatar: '🎨',
        color: '#F3F3F3', // Muted background
    },
    {
        name: 'Marcus T.',
        role: 'Software Engineer',
        text: 'Salary Autopilot is insane — my paycheck splits automatically into RRSP, TFSA, and debt. I don\'t think about money anymore.',
        avatar: '💻',
        color: '#F3F3F3',
    },
    {
        name: 'Aisha P.',
        role: 'Med Student',
        text: "I asked the AI 'should I buy NVDA?' and it told me my portfolio was already 40% tech. Saved me from a bad move.",
        avatar: '🩺',
        color: '#F3F3F3',
    },
    {
        name: 'James L.',
        role: 'Product Manager',
        text: "The advisor escalation is so smooth. Said 'I want a human' in chat and got a call within hours.",
        avatar: '📊',
        color: '#F3F3F3',
    },
];

const Testimonials = () => {
    return (
        <section className="section-padding" style={{ overflow: 'hidden', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ textAlign: 'center', marginBottom: '80px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="var(--cta-bg)" color="var(--cta-bg)" />)}
                    </div>
                    <h2 style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-2px', marginBottom: '24px', color: 'var(--text-primary-dark)' }}>
                        People love FinishLine
                    </h2>
                    <p style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-secondary-dark)', maxWidth: '550px', margin: '0 auto' }}>
                        Real users, real results. Here's what they're saying.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 25 }}
                            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                            style={{
                                backgroundColor: '#FFFFFF', borderRadius: '32px', padding: '40px',
                                border: '1px solid var(--border-color)', cursor: 'default',
                                display: 'flex', flexDirection: 'column',
                            }}
                        >
                            <Quote size={28} color="var(--border-color)" style={{ marginBottom: '20px' }} />
                            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-primary-dark)', fontWeight: 500, flex: 1, marginBottom: '32px' }}>
                                "{t.text}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px', backgroundColor: t.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                                }}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary-dark)' }}>{t.name}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
