import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TextRevealSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const text = "FinishLine helps you make sense of your money. It connects to your bank accounts and tracks your spending automatically.";
    const words = text.split(" ");

    return (
        <section ref={containerRef} style={{
            backgroundColor: 'var(--bg-light)',
            padding: '120px 0',
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '48px',
                    fontWeight: 500,
                    lineHeight: '1.2',
                    letterSpacing: '-1.5px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '12px'
                }}>
                    {words.map((word, i) => {
                        const start = i / words.length;
                        const end = start + (1 / words.length);
                        return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>
                    })}
                </h2>
            </div>
        </section>
    );
};

const Word = ({ children, progress, range }) => {
    const color = useTransform(progress, range, ['#D1D1D1', '#000000']);
    return (
        <span style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', opacity: 0 }}>{children}</span>
            <motion.span style={{ color }}>{children}</motion.span>
        </span>
    );
};

export default TextRevealSection;
