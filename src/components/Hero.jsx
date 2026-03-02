import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Mouse, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const MARQUEE_ITEMS = [
    '💰 TFSA Optimization', '📊 AI-Powered', '🔒 Bank-Grade Security', '⚡ Real-Time Alerts',
    '🏦 Plaid Connected', '🤖 Smart CFO', '📈 Wealth Tracking', '🎯 Goal-Based',
    '💎 Tax Savings', '🚀 Autopilot Mode',
];

const Hero = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
    const yHeroText = useTransform(smoothProgress, [0, 1], [0, 150]);
    const bounceTransition = { type: "spring", stiffness: 400, damping: 25 };

    const headlineWords = "Your money should work harder than you do.".split(" ");

    return (
        <section ref={heroRef} style={{
            position: 'relative',
            paddingTop: '80px',
            paddingBottom: '100px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-light)',
        }}>
            {/* Extremely subtle background gradients (Nova style) */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', top: '0%', left: '10%', width: '400px', height: '400px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(27, 43, 184, 0.05) 0%, transparent 70%)',
                    filter: 'blur(80px)', animation: 'heroOrb1 15s ease-in-out infinite alternate',
                }} />
                <div style={{
                    position: 'absolute', top: '40%', right: '-5%', width: '500px', height: '500px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 0, 0, 0.03) 0%, transparent 70%)',
                    filter: 'blur(80px)', animation: 'heroOrb2 12s ease-in-out infinite alternate-reverse',
                }} />
            </div>

            <div className="container" style={{ zIndex: 2, position: 'relative' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    maxWidth: '800px',
                    margin: '0 auto',
                    marginBottom: '80px'
                }}>
                    {/* Live pulse badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', borderRadius: '100px',
                            backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)',
                            marginBottom: '32px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                        }}
                    >
                        <span style={{
                            width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--cta-bg)',
                            animation: 'heroPulse 2s ease-in-out infinite', display: 'block',
                        }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary-dark)' }}>
                            2,847 users optimizing now
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        style={{ y: yHeroText }}
                    >
                        <h1 style={{
                            fontSize: '72px', fontWeight: 700, lineHeight: '1.05',
                            letterSpacing: '-2px', color: 'var(--text-primary-dark)',
                            marginBottom: '24px'
                        }}>
                            Your money should work <span style={{ background: 'linear-gradient(135deg, #1B2BB8, #4A65FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>harder</span> than you do.
                        </h1>
                        <p style={{
                            fontSize: '20px', lineHeight: '1.5', color: 'var(--text-secondary-dark)',
                            marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto',
                            fontWeight: 500
                        }}>
                            AI detects opportunities in your accounts — you just approve. No spreadsheets, no guesswork, just pure growth.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
                            <motion.div whileHover={{ scale: 1.05, backgroundColor: 'var(--highlight-blue)' }} whileTap={{ scale: 0.95 }} transition={bounceTransition} style={{ borderRadius: '999px', overflow: 'hidden' }}>
                                <Link to="/signup" className="btn" style={{
                                    padding: '18px 36px', backgroundColor: 'var(--cta-bg)', color: 'white', border: 'none',
                                    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600,
                                    borderRadius: '999px'
                                }}>
                                    Start tracking for free <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={bounceTransition}>
                                <a href="#how-it-works" className="btn" style={{
                                    padding: '18px 36px', backgroundColor: '#FFFFFF', color: 'var(--text-primary-dark)',
                                    border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px',
                                    fontSize: '16px', fontWeight: 600, borderRadius: '999px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                                }}>
                                    How it works
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* iOS & Mac Mockup 3D Layout */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '60px', padding: '0 20px', height: 'auto', minHeight: '600px' }}>

                    {/* Desktop Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '900px',
                            height: '560px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '24px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            zIndex: 1,
                            marginRight: '120px' // Leave space for iPhone on the right
                        }}
                    >
                        {/* Mac Window Header */}
                        <div style={{ height: '40px', backgroundColor: '#F3F3F3', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
                        </div>

                        {/* Desktop App Layout */}
                        <div style={{ display: 'flex', flex: 1, backgroundColor: '#FAFAFA' }}>
                            {/* Sidebar */}
                            <div style={{ width: '220px', borderRight: '1px solid var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#FFFFFF' }}>
                                <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px', color: 'var(--text-primary-dark)' }}>FinishLine</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {['Dashboard', 'Net Worth', 'Autopilot', 'AI Advisor', 'Tax Optimization'].map((item, i) => (
                                        <div key={item} style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: i === 0 ? 'var(--bg-light)' : 'transparent', color: i === 0 ? 'var(--text-primary-dark)' : 'var(--text-secondary-dark)', fontWeight: i === 0 ? 600 : 500, fontSize: '14px', cursor: 'pointer' }}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Desktop Content */}
                            <div style={{ flex: 1, padding: '32px', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Portfolio Overview</h2>
                                    <div style={{ padding: '8px 16px', backgroundColor: 'var(--cta-bg)', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>+ Add Account</div>
                                </div>

                                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                                    <div style={{ flex: 2, backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                        <div style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 600, marginBottom: '8px' }}>Total Net Worth</div>
                                        <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px' }}>$342,890.50</div>
                                        {/* Fake Chart Lines */}
                                        <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                                            {[40, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                                                <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: 'rgba(27, 43, 184, 0.1)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', backgroundColor: 'var(--cta-bg)', borderRadius: '4px 4px 0 0' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', fontWeight: 600, marginBottom: '4px' }}>Cash Yield</div>
                                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>+4.5% APY</div>
                                        </div>
                                        <div style={{ flex: 1, backgroundColor: '#1B2BB8', padding: '20px', borderRadius: '16px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.2 }}><Sparkles size={100} /></div>
                                            <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8, marginBottom: '4px' }}>AI Suggestion</div>
                                            <div style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.3 }}>Move $10k to TFSA to save $450 in taxes this year.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating 3D Shapes overlapping Desktop */}
                    <motion.div
                        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            left: '5%',
                            top: '10%',
                            width: '120px',
                            height: '120px',
                            zIndex: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ position: 'absolute', width: '24px', height: '120px', background: 'linear-gradient(135deg, #4A65FF, #1B2BB8)', borderRadius: '20px', transform: 'rotate(0deg)', boxShadow: '-10px 10px 20px rgba(27,43,184,0.3)' }} />
                        <div style={{ position: 'absolute', width: '24px', height: '120px', background: 'linear-gradient(135deg, #4A65FF, #1B2BB8)', borderRadius: '20px', transform: 'rotate(60deg)', boxShadow: '-10px 10px 20px rgba(27,43,184,0.3)' }} />
                        <div style={{ position: 'absolute', width: '24px', height: '120px', background: 'linear-gradient(135deg, #4A65FF, #1B2BB8)', borderRadius: '20px', transform: 'rotate(-60deg)', boxShadow: '-10px 10px 20px rgba(27,43,184,0.3)' }} />
                    </motion.div>

                    <motion.div
                        animate={{ y: [15, -15, 15], rotate: [0, -10, 0] }}
                        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, delay: 1 }}
                        style={{
                            position: 'absolute',
                            right: 'calc(50% + 250px)',
                            bottom: '0%',
                            width: '90px',
                            height: '90px',
                            zIndex: 3,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle at 30% 30%, #4A65FF, #1B2BB8 70%)',
                            boxShadow: 'inset -15px -15px 30px rgba(0,0,0,0.2), 15px 15px 30px rgba(27,43,184,0.3)',
                        }}
                    >
                    </motion.div>

                    {/* iPhone Frame overlaps Desktop at bottom right */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: 20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ type: 'spring', stiffness: 260, damping: 25, delay: 0.4 }}
                        style={{
                            position: 'absolute',
                            right: '5%',
                            bottom: '-40px',
                            width: '280px', // slightly smaller relative to desktop
                            height: '580px',
                            backgroundColor: '#000000',
                            borderRadius: '40px',
                            padding: '8px',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255,255,255,0.1), -20px 20px 60px rgba(0,0,0,0.2)',
                            zIndex: 4,
                        }}
                    >
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

                        {/* Screen Content */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#F5F5F7',
                            borderRadius: '34px',
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            color: '#000000',
                        }}>
                            {/* Mockup Header */}
                            <div style={{ padding: '60px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#D1D1D1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#ECC94B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🧑🏽</div>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Hello, Mary</div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Sparkles size={18} color="var(--text-primary-dark)" />
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--text-primary-dark)' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Mockup Balances */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                style={{ padding: '0 20px 20px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>Net Worth</div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <span style={{ fontSize: '9px', fontWeight: 800, color: 'white', backgroundColor: '#10B981', padding: '4px 8px', borderRadius: '4px' }}>+12%</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>$124,568.67</h2>
                                </div>
                            </motion.div>

                            {/* Cards */}
                            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>

                                {/* Salary Routing Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    style={{ display: 'flex', gap: '12px' }}
                                >
                                    <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={12} color="var(--cta-bg)" /> Autopilot</div>
                                        <div style={{ fontSize: '16px', fontWeight: 700 }}>Active</div>
                                    </div>
                                    <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)', fontWeight: 600, marginBottom: '8px' }}>Unused TFSA</div>
                                        <div style={{ fontSize: '16px', fontWeight: 700 }}>$5,200</div>
                                    </div>
                                </motion.div>

                                {/* AI Optimization alert */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, type: 'spring' }}
                                    style={{ backgroundColor: 'var(--cta-bg)', borderRadius: '16px', padding: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', position: 'relative' }}
                                >
                                    {/* Shimmer effect inside card using framer-motion */}
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transform: 'skewX(-20deg)' }}
                                    />
                                    <span style={{ fontSize: '13px', fontWeight: 600, zIndex: 1 }}>AI found $240 in tax savings</span>
                                    <span style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '100px' }}>Review</span>
                                </motion.div>

                                {/* My Goals Preview - Animated Ring */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6, type: 'spring' }}
                                    style={{ marginTop: '16px' }}
                                >
                                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Tax-Free Goals</div>
                                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)', fontWeight: 600, marginBottom: '4px' }}>House Down Payment</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '20px', fontWeight: 700 }}>$62,203.60</div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>Optimized by AI</div>
                                            </div>
                                            <div style={{ position: 'relative', width: '44px', height: '44px' }}>
                                                {/* Background track */}
                                                <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} viewBox="0 0 44 44">
                                                    <circle cx="22" cy="22" r="18" fill="none" stroke="#F3F3F3" strokeWidth="4" />
                                                    {/* Animated progress ring */}
                                                    <motion.circle
                                                        cx="22" cy="22" r="18" fill="none" stroke="#10B981" strokeWidth="4"
                                                        strokeLinecap="round"
                                                        initial={{ strokeDasharray: 113, strokeDashoffset: 113 }}
                                                        whileInView={{ strokeDashoffset: 113 * 0.3 }} // 70% complete representation
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                                                    />
                                                </svg>
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                                                    🏠
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                        </div>
                    </motion.div>
                </div>

                {/* Infinite Marquee Ticker below card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{
                        overflow: 'hidden', marginTop: '60px', marginBottom: '20px',
                        padding: '24px 0',
                    }}
                >
                    <div className="hero-marquee-track">
                        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                            <span key={i} style={{
                                fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary-dark)',
                                whiteSpace: 'nowrap', padding: '0 32px',
                            }}>
                                • {item}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

            <style>{`
                @keyframes heroPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(27,43,184,0.3); }
                    50% { box-shadow: 0 0 0 6px rgba(27,43,184,0); }
                }
                @keyframes heroOrb1 {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(50px, 30px) scale(1.1); }
                }
                @keyframes heroOrb2 {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(-30px, -50px) scale(1.05); }
                }
                .hero-marquee-track {
                    display: flex;
                    width: max-content;
                    animation: heroMarquee 35s linear infinite;
                }
                @keyframes heroMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
            `}</style>
        </section>
    );
};

export default Hero;
