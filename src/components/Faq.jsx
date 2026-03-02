import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: "How fast can I get set up with Finix?",
            a: "Most businesses can get set up and start issuing virtual cards within 15 minutes of approval. Physical cards typically arrive within 3-5 business days."
        },
        {
            q: "Are there any hidden fees?",
            a: "No. Our pricing is completely transparent. The monthly SAAS fee covers all core platform features. There are no setup fees, domestic wire fees, or ACH transfer fees."
        },
        {
            q: "Can I integrate Finix with my accounting software?",
            a: "Yes, Finix offers native, real-time integrations with QuickBooks, Xero, NetSuite, and Sage. Transactions sync automatically with categorized data and receipt attachments."
        },
        {
            q: "Is my business money safe?",
            a: "Absolutely. Funds are held at our partner banks, which are Members FDIC, and are insured up to $250,000. Our platform utilizes bank-grade 256-bit encryption for all data."
        }
    ];

    return (
        <section className="section-padding" style={{ backgroundColor: 'var(--bg-light)' }}>
            <div className="container-narrow">
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '48px', letterSpacing: '-1.5px', marginBottom: '24px' }}>
                        Frequently Asked Questions
                    </h2>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary-dark)' }}>
                        Everything you need to know about the product and billing.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '24px',
                                    border: '1px solid var(--border-color)',
                                    overflow: 'hidden'
                                }}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                    style={{
                                        width: '100%',
                                        padding: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ fontSize: '18px', fontWeight: 600 }}>{faq.q}</span>
                                    <div style={{
                                        minWidth: '32px', height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: isOpen ? 'var(--bg-dark)' : 'var(--bg-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isOpen ? 'white' : 'var(--bg-dark)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div style={{ padding: '0 32px 32px 32px', color: 'var(--text-secondary-dark)', lineHeight: '1.6' }}>
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Faq;
