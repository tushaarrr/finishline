import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
    const footerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: footerRef,
        offset: ["0 1", "0.5 1"] // Trigger as soon as top hits bottom of screen, finish by mid-screen
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });

    // The "Curvature Entrance" effect
    const scale = useTransform(smoothProgress, [0, 1], [0.95, 1]);
    const opacity = useTransform(smoothProgress, [0, 1], [0.5, 1]);
    const borderRadius = useTransform(smoothProgress, [0, 1], ['64px', '0px']);

    const columnVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } }
    };
    const linkVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 25 } }
    };
    const hoverSpring = { type: "spring", stiffness: 500, damping: 15 };

    return (
        <motion.footer
            ref={footerRef}
            style={{
                backgroundColor: '#FFFFFF', // Clean white footer
                padding: '120px 0 60px',
                scale,
                opacity,
                borderRadius,
                transformOrigin: 'bottom',
                overflow: 'hidden',
                color: 'var(--text-primary-dark)',
                borderTop: '1px solid var(--border-color)'
            }}
        >
            <div className="container">
                <motion.div
                    variants={columnVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-50px' }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '60px',
                        marginBottom: '80px'
                    }}
                >
                    <motion.div variants={linkVariants} style={{ gridColumn: '1 / -1', maxWidth: '300px' }}>
                        <div style={{ fontWeight: 800, fontSize: '32px', letterSpacing: '-1px', marginBottom: '24px', color: 'var(--text-primary-dark)' }}>
                            FinishLine.
                        </div>
                        <p style={{ color: 'var(--text-secondary-dark)', lineHeight: '1.6', fontWeight: 500 }}>
                            The intelligent financial platform built to power the next generation of wealth creation.
                        </p>
                    </motion.div>

                    <motion.div variants={columnVariants}>
                        <motion.h4 variants={linkVariants} style={{ fontSize: '16px', marginBottom: '24px', color: 'var(--text-primary-dark)', fontWeight: 700 }}>Product</motion.h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>
                            {['Features', 'Pricing', 'Security'].map((link) => (
                                <motion.a key={link} variants={linkVariants} whileHover={{ x: 5, color: 'var(--cta-bg)' }} transition={hoverSpring} href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {link}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={columnVariants}>
                        <motion.h4 variants={linkVariants} style={{ fontSize: '16px', marginBottom: '24px', color: 'var(--text-primary-dark)', fontWeight: 700 }}>Company</motion.h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>
                            {['About Us', 'Careers', 'Blog'].map((link) => (
                                <motion.a key={link} variants={linkVariants} whileHover={{ x: 5, color: 'var(--cta-bg)' }} transition={hoverSpring} href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {link}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={columnVariants}>
                        <motion.h4 variants={linkVariants} style={{ fontSize: '16px', marginBottom: '24px', color: 'var(--text-primary-dark)', fontWeight: 700 }}>Legal</motion.h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                                <motion.a key={link} variants={linkVariants} whileHover={{ x: 5, color: 'var(--cta-bg)' }} transition={hoverSpring} href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {link}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '40px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--text-secondary-dark)',
                        fontSize: '14px',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}
                >
                    <div style={{ fontWeight: 600 }}>© {new Date().getFullYear()} FinishLine Technologies. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                            <motion.a
                                key={i}
                                href="#"
                                whileHover={{ scale: 1.2, rotate: 5, color: 'var(--cta-bg)' }}
                                whileTap={{ scale: 0.9 }}
                                transition={hoverSpring}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                                <Icon size={20} />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;
