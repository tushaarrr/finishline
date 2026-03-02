import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import TextRevealSection from '../../components/TextRevealSection';
import StickyFeatures from '../../components/StickyFeatures';
import Features from '../../components/Features';
import BentoGrid from '../../components/BentoGrid';
import Testimonials from '../../components/Testimonials';
import CTASection from '../../components/CTASection';
import Footer from '../../components/Footer';
import GridLines from '../../components/layout/GridLines';

const LandingPage = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-light)', position: 'relative' }}>
            <GridLines />
            <Navbar />

            <main>
                <Hero />
                <TextRevealSection />
                <StickyFeatures />
                <Features />
                <BentoGrid />
                <Testimonials />
                <CTASection />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
