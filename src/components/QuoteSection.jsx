import React from 'react';
import { motion } from 'framer-motion';

const QuoteSection = () => {
    return (
        <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="container">
                <div className="grid-2" style={{ alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 style={{
                            fontSize: '48px',
                            lineHeight: '1.1',
                            letterSpacing: '-1.5px',
                            maxWidth: '90%'
                        }}>
                            "Financial transactions should be more than just a mundane task."
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <p style={{
                            fontSize: '20px',
                            lineHeight: '1.6',
                            color: 'var(--text-secondary-dark)',
                            maxWidth: '480px'
                        }}>
                            We believe banking should feel effortless. That's why we've designed a platform that removes friction, automating the complex logic so you can focus entirely on growing your business.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default QuoteSection;
