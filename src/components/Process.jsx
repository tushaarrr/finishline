import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const Process = () => {
    const processSteps = [
        {
            id: 1,
            title: "Control your spend",
            desc: "Set granular limits on virtual cards and approve expenses in real-time. No more end-of-month surprises.",
            features: ["Custom limits per card", "Real-time approvals", "Category restrictions"],
            imageBg: "var(--accent-mint)",
            reverse: false
        },
        {
            id: 2,
            title: "Automate accounting",
            desc: "Sync transactions directly to your preferred accounting software. Say goodbye to manual data entry.",
            features: ["Direct integration", "Auto-categorization", "Receipt matching"],
            imageBg: "var(--accent-lavender)",
            reverse: true
        }
    ];

    return (
        <section className="section-padding" style={{ backgroundColor: 'white' }}>
            <div className="container">
                {processSteps.map((step, idx) => (
                    <div key={step.id} style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                        gap: '80px',
                        alignItems: 'center',
                        marginBottom: idx !== processSteps.length - 1 ? '120px' : 0
                    }}>
                        {/* Image Side */}
                        <motion.div
                            initial={{ opacity: 0, x: step.reverse ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.6 }}
                            style={{
                                order: step.reverse ? 2 : 1,
                                height: '500px',
                                backgroundColor: step.imageBg,
                                borderRadius: '32px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '80%',
                                height: '70%',
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                padding: '32px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                {/* Mock Content */}
                                <div style={{ width: '40%', height: '24px', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }} />
                                <div style={{ width: '100%', height: '100px', backgroundColor: 'var(--bg-light)', borderRadius: '12px', marginTop: '16px' }} />
                                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                    <div style={{ width: '50%', height: '60px', backgroundColor: 'var(--bg-light)', borderRadius: '12px' }} />
                                    <div style={{ width: '50%', height: '60px', backgroundColor: 'var(--bg-light)', borderRadius: '12px' }} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Content Side */}
                        <motion.div
                            initial={{ opacity: 0, x: step.reverse ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.6 }}
                            style={{ order: step.reverse ? 1 : 2 }}
                        >
                            <h3 style={{ fontSize: '40px', letterSpacing: '-1px', marginBottom: '24px' }}>
                                {step.title}
                            </h3>
                            <p style={{ fontSize: '18px', color: 'var(--text-secondary-dark)', lineHeight: '1.6', marginBottom: '32px' }}>
                                {step.desc}
                            </p>

                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {step.features.map((feature, fIdx) => (
                                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: 600 }}>
                                        <CheckCircle2 size={24} color="#10B981" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Process;
