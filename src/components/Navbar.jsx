import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'rgba(243, 243, 243, 0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--border-color)',
            }}
        >
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
                <Link to="/" style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: 'var(--text-primary-dark)' }}>
                    FinishLine
                </Link>

                <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    {['Features', 'How it works', 'Testimonials', 'Pricing'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                            style={{
                                fontSize: '15px',
                                fontWeight: 500,
                                color: 'var(--text-secondary-dark)',
                                transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary-dark)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary-dark)'}
                        >
                            {item}
                        </a>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary-dark)', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary-dark)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary-dark)'}>
                        All Pages <ChevronDown size={16} />
                    </div>
                </nav>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                        <Link to="/login" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary-dark)', textDecoration: 'none' }}>
                            Log in
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05, backgroundColor: 'var(--highlight-blue)' }} whileTap={{ scale: 0.95 }} style={{ borderRadius: '999px', overflow: 'hidden' }}>
                        <Link to="/signup" className="btn" style={{ padding: '12px 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', backgroundColor: 'var(--cta-bg)', color: 'white', borderRadius: '999px', fontSize: '15px', fontWeight: 600 }}>
                            Get Started
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
};

export default Navbar;
