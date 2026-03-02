import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, TrendingUp, Shield, Sparkles } from 'lucide-react';

const StickyFeatures = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Content fade mapping for the 3 steps
    // Content fade mapping for the text (crossfades cleanly)
    const step1TextOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);
    const step2TextOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
    const step3TextOpacity = useTransform(scrollYProgress, [0.6, 0.7, 1], [0, 1, 1]);

    // Screen mapped opacities (layered on top of each other, they don't fade out once visible, to prevent seeing the transparent layers mixing)
    const step1ScreenOpacity = 1; // Always visible at the bottom
    const step2ScreenOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
    const step3ScreenOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);

    const steps = [
        {
            subtitle: "Step 1",
            title: "Link your accounts",
            description: "Securely connect your bank and brokerage accounts to get a real-time, unified view of your net worth."
        },
        {
            subtitle: "Step 2",
            title: "Salary Autopilot",
            description: "Set your rules once. When your paycheck hits, FinishLine automatically routes it to your TFSA, RRSP, and bills."
        },
        {
            subtitle: "Step 3",
            title: "AI Wealth Advisor",
            description: "Chat with our financial AI to find hidden tax optimizations, analyze your portfolio, and plan for big purchases."
        }
    ];

    return (
        <section ref={containerRef} style={{
            position: 'relative',
            backgroundColor: 'currentColor', // Will inherit from parent or we set explicit white if needed
            // The height determines how long they have to scroll
            height: '300vh',
            color: 'var(--text-primary-dark)'
        }}>
            {/* The sticky wrapper */}
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '80px' }}>

                    {/* Left side: Text that fades based on scroll */}
                    <div style={{ flex: 1, position: 'relative', height: '300px' }}>

                        {/* Step 1 Text */}
                        <motion.div style={{ position: 'absolute', top: 0, left: 0, opacity: step1TextOpacity }}>
                            <div style={{ color: 'var(--cta-bg)', fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>{steps[0].subtitle}</div>
                            <h2 style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-2px', marginBottom: '24px', lineHeight: 1.1 }}>{steps[0].title}</h2>
                            <p style={{ fontSize: '20px', color: 'var(--text-secondary-dark)', lineHeight: 1.6, fontWeight: 500, maxWidth: '400px' }}>
                                {steps[0].description}
                            </p>
                        </motion.div>

                        {/* Step 2 Text */}
                        <motion.div style={{ position: 'absolute', top: 0, left: 0, opacity: step2TextOpacity }}>
                            <div style={{ color: 'var(--cta-bg)', fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>{steps[1].subtitle}</div>
                            <h2 style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-2px', marginBottom: '24px', lineHeight: 1.1 }}>{steps[1].title}</h2>
                            <p style={{ fontSize: '20px', color: 'var(--text-secondary-dark)', lineHeight: 1.6, fontWeight: 500, maxWidth: '400px' }}>
                                {steps[1].description}
                            </p>
                        </motion.div>

                        {/* Step 3 Text */}
                        <motion.div style={{ position: 'absolute', top: 0, left: 0, opacity: step3TextOpacity }}>
                            <div style={{ color: 'var(--cta-bg)', fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>{steps[2].subtitle}</div>
                            <h2 style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-2px', marginBottom: '24px', lineHeight: 1.1 }}>{steps[2].title}</h2>
                            <p style={{ fontSize: '20px', color: 'var(--text-secondary-dark)', lineHeight: 1.6, fontWeight: 500, maxWidth: '400px' }}>
                                {steps[2].description}
                            </p>
                        </motion.div>

                    </div>

                    {/* Right side: iPhone Mockup background container */}
                    <div style={{
                        flex: 1,
                        backgroundColor: '#F3F3F3', // Light gray background box like Nova template
                        borderRadius: '40px',
                        height: '700px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>

                        {/* iPhone Frame */}
                        <div style={{
                            position: 'relative',
                            width: '320px',
                            height: '620px',
                            backgroundColor: '#000000',
                            borderRadius: '48px 48px 0 0',
                            padding: '10px 10px 0 10px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            zIndex: 2,
                            transform: 'translateY(20px)' // Sink it into the bottom slightly
                        }}>
                            {/* Dynamic Island */}
                            <div style={{
                                position: 'absolute',
                                top: '22px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '100px',
                                height: '28px',
                                backgroundColor: '#000000',
                                borderRadius: '20px',
                                zIndex: 10,
                            }} />

                            {/* Screen Background */}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '38px 38px 0 0',
                                overflow: 'hidden',
                                position: 'relative',
                            }}>

                                {/* Step 1 Screen: Connect Accounts */}
                                <motion.div style={{ position: 'absolute', inset: 0, opacity: step1ScreenOpacity, padding: '70px 24px 20px', backgroundColor: '#FFFFFF' }}>
                                    <motion.h3
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', letterSpacing: '-0.5px' }}
                                    >
                                        Syncing accounts...
                                    </motion.h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {[
                                            { name: 'RBC Royal Bank', loc: 'CHECKING •• 4092', icon: '🏦', status: 'Synced' },
                                            { name: 'TD Canada Trust', loc: 'SAVINGS •• 1104', icon: '🏢', status: 'Synced' },
                                            { name: 'Wealthsimple', loc: 'TFSA •• 9921', icon: '📈', status: 'Syncing...' }
                                        ].map((bank, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.4, duration: 0.5 }}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid var(--border-color)' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#F3F3F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                                        {bank.icon}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '15px' }}>{bank.name}</div>
                                                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary-dark)' }}>{bank.loc}</div>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '11px', fontWeight: 700, color: bank.status === 'Synced' ? '#10B981' : 'var(--text-secondary-dark)' }}>
                                                    <motion.span animate={bank.status === 'Syncing...' ? { opacity: [0.4, 1, 0.4] } : {}} transition={{ duration: 1.5, repeat: Infinity }}>
                                                        {bank.status}
                                                    </motion.span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <motion.div
                                        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        style={{ marginTop: '40px', textAlign: 'center' }}
                                    >
                                        <Shield size={32} color="var(--cta-bg)" />
                                    </motion.div>
                                </motion.div>

                                {/* Step 2 Screen: Salary Autopilot */}
                                <motion.div style={{ position: 'absolute', inset: 0, opacity: step2ScreenOpacity, backgroundColor: '#FFFFFF', padding: '70px 24px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--cta-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                        </div>
                                        <h3 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Autopilot</h3>
                                    </div>

                                    {/* Flowchart animation */}
                                    <div style={{ position: 'relative', height: '300px' }}>
                                        {/* Main Paycheck Node */}
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10B981', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}
                                        >
                                            <span style={{ fontSize: '11px', opacity: 0.9 }}>PAYROLL DIRECT DEP</span>
                                            <span style={{ fontSize: '18px' }}>+$4,200.00</span>
                                        </motion.div>

                                        {/* Animated routing lines (SVG) */}
                                        <svg style={{ position: 'absolute', top: '60px', left: 0, width: '100%', height: '100px', zIndex: 1 }}>
                                            <path d="M 136 0 V 40 H 40 V 80" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                                            <path d="M 136 0 V 80" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                                            <path d="M 136 0 V 40 H 232 V 80" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />

                                            {/* Glowing dots moving along paths continuously */}
                                            <circle cx="0" cy="0" r="4" fill="var(--text-secondary-dark)">
                                                <animateMotion path="M 136 0 V 40 H 40 V 80" dur="2s" repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="0" cy="0" r="4" fill="var(--cta-bg)">
                                                <animateMotion path="M 136 0 V 80" dur="2s" repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="0" cy="0" r="4" fill="var(--text-secondary-dark)">
                                                <animateMotion path="M 136 0 V 40 H 232 V 80" dur="2s" repeatCount="indefinite" />
                                            </circle>
                                        </svg>

                                        {/* Split Nodes */}
                                        <div style={{ position: 'absolute', top: '140px', left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
                                            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2, ease: "easeInOut" }} style={{ backgroundColor: '#F3F3F3', padding: '12px 8px', borderRadius: '12px', textAlign: 'center', width: '31%' }}>
                                                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary-dark)' }}>BILLS</div>
                                                <div style={{ fontSize: '14px', fontWeight: 600 }}>$1,200</div>
                                            </motion.div>
                                            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4, ease: "easeInOut" }} style={{ backgroundColor: '#EEF2FF', padding: '12px 8px', borderRadius: '12px', textAlign: 'center', width: '31%', border: '1px solid var(--cta-bg)' }}>
                                                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--cta-bg)' }}>TFSA</div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cta-bg)' }}>$1,500</div>
                                            </motion.div>
                                            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6, ease: "easeInOut" }} style={{ backgroundColor: '#F3F3F3', padding: '12px 8px', borderRadius: '12px', textAlign: 'center', width: '31%' }}>
                                                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary-dark)' }}>SPEND</div>
                                                <div style={{ fontSize: '14px', fontWeight: 600 }}>$1,500</div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Step 3 Screen: AI Tips */}
                                <motion.div style={{ position: 'absolute', inset: 0, opacity: step3ScreenOpacity, backgroundColor: '#FFFFFF', padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>

                                    <div style={{ width: '100%', padding: '60px 20px 20px', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cta-bg), #1B2BB8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Sparkles size={16} color="white" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: 600 }}>AI Advisor</div>
                                            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>● Online</div>
                                        </div>
                                    </div>

                                    {/* Chat Messages */}
                                    <div style={{ flex: 1, width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 0.5 }}
                                            style={{ alignSelf: 'flex-start', backgroundColor: '#F3F3F3', borderRadius: '16px 16px 16px 0', padding: '12px 16px', fontSize: '13px', fontWeight: 500, maxWidth: '85%' }}
                                        >
                                            I noticed you have $12,500 sitting in your checking account earning 0%.
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 1.5 }}
                                            style={{ alignSelf: 'flex-start', backgroundColor: '#F3F3F3', borderRadius: '16px 16px 16px 0', padding: '12px 16px', fontSize: '13px', fontWeight: 500, maxWidth: '85%' }}
                                        >
                                            You also have $5,000 in unused TFSA room for this year.
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 3.0 }}
                                            style={{ alignSelf: 'flex-end', backgroundColor: 'var(--cta-bg)', color: 'white', borderRadius: '16px 16px 0 16px', padding: '12px 16px', fontSize: '13px', fontWeight: 500, maxWidth: '85%' }}
                                        >
                                            What should I do?
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 4.5 }}
                                            style={{ alignSelf: 'flex-start', backgroundColor: '#EEF2FF', border: '1px solid var(--cta-bg)', borderRadius: '16px 16px 16px 0', padding: '12px 16px', fontSize: '13px', fontWeight: 500, maxWidth: '85%' }}
                                        >
                                            Move $5,000 to your Wealthsimple TFSA to invest in Cash.to for 4.5% yield.
                                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                                                <button style={{ backgroundColor: 'var(--cta-bg)', color: 'white', border: 'none', borderRadius: '100px', padding: '6px 12px', fontSize: '11px', fontWeight: 600 }}>Execute now</button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default StickyFeatures;
