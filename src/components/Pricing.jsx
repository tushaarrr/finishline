import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section className="section-padding" style={{ backgroundColor: 'white' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '48px', letterSpacing: '-1.5px', marginBottom: '24px' }}>
                        Simple, transparent pricing
                    </h2>

                    <div style={{
                        display: 'inline-flex',
                        backgroundColor: 'var(--bg-light)',
                        padding: '4px',
                        borderRadius: '999px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <button
                            onClick={() => setIsAnnual(false)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '999px',
                                border: 'none',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                backgroundColor: !isAnnual ? 'white' : 'transparent',
                                boxShadow: !isAnnual ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                color: !isAnnual ? 'black' : 'var(--text-secondary-dark)',
                                transition: 'all 0.2s'
                            }}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '999px',
                                border: 'none',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                backgroundColor: isAnnual ? 'white' : 'transparent',
                                boxShadow: isAnnual ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                color: isAnnual ? 'black' : 'var(--text-secondary-dark)',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Annually <span style={{ backgroundColor: 'var(--highlight-mint)', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', color: 'black' }}>Save 20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid-2" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {/* Base Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: '32px',
                            padding: '48px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Starter</h3>
                        <p style={{ color: 'var(--text-secondary-dark)', marginBottom: '32px' }}>For small teams starting out.</p>
                        <div style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-2px', marginBottom: '8px' }}>
                            ${isAnnual ? '0' : '0'} <span style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', fontWeight: 500, letterSpacing: '0' }}>/mo</span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', marginBottom: '40px' }}>Free forever for up to 5 users.</p>

                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px', flex: 1 }}>
                            {['5 team members', 'Unlimited virtual cards', 'Basic spend controls', 'Email support'].map(feature => (
                                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                                    <Check size={18} color="#10B981" /> {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="btn btn-secondary" style={{ width: '100%' }}>Get Started Free</button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                            backgroundColor: 'var(--bg-dark)',
                            color: 'white',
                            borderRadius: '32px',
                            padding: '48px',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--accent-mint)', color: 'black', padding: '8px 24px', borderBottomLeftRadius: '24px', fontWeight: 600, fontSize: '14px' }}>
                            Most Popular
                        </div>

                        <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Scale</h3>
                        <p style={{ color: 'var(--text-secondary-light)', marginBottom: '32px' }}>For growing teams scaling operations.</p>
                        <div style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-2px', marginBottom: '8px' }}>
                            ${isAnnual ? '49' : '59'} <span style={{ fontSize: '16px', color: 'var(--text-secondary-light)', fontWeight: 500, letterSpacing: '0' }}>/mo</span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary-light)', marginBottom: '40px' }}>Per user, billed {isAnnual ? 'annually' : 'monthly'}.</p>

                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px', flex: 1 }}>
                            {['Unlimited team members', 'Advanced approval workflows', 'Accounting integrations', '24/7 Priority support'].map(feature => (
                                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                                    <Check size={18} color="#10B981" /> {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="btn btn-white" style={{ width: '100%' }}>Start 14-Day Free Trial</button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
