import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, TrendingUp, CheckCircle2, Scan, Brain, HandCoins } from 'lucide-react';

const Features = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
    const yCards = useTransform(smoothProgress, [0, 1], [60, -60]);

    const features = [
        {
            icon: <Scan size={26} color="var(--cta-bg)" />,
            title: "Connect in 30 seconds",
            desc: "Link your bank via Plaid — encrypted, read-only. We never see your password.",
            step: '01',
        },
        {
            icon: <Brain size={26} color="var(--cta-bg)" />,
            title: "AI scans your money",
            desc: "Finds idle cash, unused TFSA/RRSP room, credit card debt — and builds an action plan.",
            step: '02',
        },
        {
            icon: <HandCoins size={26} color="var(--cta-bg)" />,
            title: "You approve, we act",
            desc: "One tap to approve. Money moves, taxes saved, debt crushed — zero research needed.",
            step: '03',
        },
    ];

    const containerVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1, y: 0,
            transition: { type: "spring", stiffness: 260, damping: 25 }
        }
    };

    return (
        <section ref={sectionRef} id="how-it-works" className="section-padding" style={{ perspective: '1200px', backgroundColor: 'var(--bg-light)' }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ textAlign: 'center', marginBottom: '80px' }}
                >
                    <h2 style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-2px', marginBottom: '24px', color: 'var(--text-primary-dark)' }}>
                        How it works
                    </h2>
                    <p style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-secondary-dark)', maxWidth: '450px', margin: '0 auto' }}>
                        Three steps. No spreadsheets. No guesswork.
                    </p>
                </motion.div>

                <motion.div
                    className="grid-3"
                    style={{ gap: '24px', y: yCards }}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={cardVariants}
                            whileHover={{
                                y: -12,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                            }}
                            style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid var(--border-color)',
                                borderRadius: '28px',
                                padding: '48px',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            {/* Step number watermark */}
                            <span style={{
                                position: 'absolute', top: '24px', right: '32px',
                                fontSize: '80px', fontWeight: 800, color: 'rgba(0,0,0,0.04)',
                                lineHeight: 1, letterSpacing: '-4px',
                            }}>
                                {feature.step}
                            </span>

                            <div style={{
                                width: '64px', height: '64px', backgroundColor: '#F3F3F3',
                                borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '32px', border: '1px solid var(--border-color)'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: 700, lineHeight: '1.3', marginBottom: '16px', letterSpacing: '-0.5px', color: 'var(--text-primary-dark)' }}>
                                {feature.title}
                            </h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', lineHeight: '1.6', fontWeight: 500 }}>
                                {feature.desc}
                            </p>

                            {/* Bottom accent line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    height: '4px', width: '48px', backgroundColor: 'var(--cta-bg)', borderRadius: '4px',
                                    marginTop: '32px', transformOrigin: 'left',
                                }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
