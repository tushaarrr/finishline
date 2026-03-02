import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const FeatureFocus = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: 'white' }}>
            <div className="container">
                <div className="grid-2" style={{ alignItems: 'center' }}>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 style={{ fontSize: '48px', letterSpacing: '-1.5px', marginBottom: '24px', lineHeight: '1.1' }}>
                            Send, receive, or swap.<br />All in one place.
                        </h2>
                        <p style={{ fontSize: '18px', color: 'var(--text-secondary-dark)', lineHeight: '1.6', marginBottom: '40px' }}>
                            Handle all your domestic and international transfers securely. Convert currencies instantly with transparent rates and zero hidden fees.
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[
                                { title: 'Global transfers in seconds', desc: 'Send money to over 100 countries almost instantly.' },
                                { title: 'Real-time competitive forex', desc: 'Exchange currencies at interbank rates with zero markup.' },
                                { title: 'Automated recurring payments', desc: 'Set up schedules for vendors and payroll easily.' }
                            ].map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        minWidth: '24px', height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--bg-dark)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginTop: '4px'
                                    }}>
                                        <Check size={14} color="white" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{item.title}</div>
                                        <div style={{ color: 'var(--text-secondary-dark)', lineHeight: '1.5' }}>{item.desc}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{
                            backgroundColor: 'var(--accent-lavender)',
                            borderRadius: '32px',
                            height: '600px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Mock App Interface inside Image container */}
                        <div style={{
                            width: '320px',
                            height: '480px',
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>Send</div>
                                <div style={{ fontSize: '32px', fontWeight: 700 }}>$1,200.00</div>
                            </div>

                            <div style={{ height: '60px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-light)' }} />
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>USD Balance</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)' }}>$42,400.00</div>
                                </div>
                            </div>

                            <div style={{ height: '60px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-dark)' }} />
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Jane Cooper</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)' }}>Design Services</div>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', height: '48px', backgroundColor: 'var(--bg-dark)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                                Confirm Transfer
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeatureFocus;
