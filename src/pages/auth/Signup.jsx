import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('CA');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await signup(email, password, fullName, country);
            // Advisors (@finishline.com) go straight to advisor dashboard
            if (data.user?.role === 'advisor') {
                navigate('/advisor');
            } else {
                navigate('/onboarding');
            }
        } catch (err) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split-layout">
            <div className="auth-card" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>

                <div className="auth-left">
                    <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                        <div className="pill-badge" style={{ marginBottom: '32px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-lavender)', marginRight: '8px' }} />
                            Get Started Free
                        </div>

                        <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1.5px', color: 'var(--text-primary-dark)' }}>
                            Create Account
                        </h1>
                        <p style={{ color: 'var(--text-secondary-dark)', marginBottom: '32px', fontSize: '16px' }}>
                            Your AI financial copilot awaits.
                        </p>

                        {error && (
                            <div style={{ padding: '12px 16px', marginBottom: '20px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>Full Name</label>
                                <input type="text" className="input-field" placeholder="Tushar Shandilya" value={fullName} onChange={e => setFullName(e.target.value)} required />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>Email Address</label>
                                <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>Password</label>
                                <input type="password" className="input-field" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>Country</label>
                                <select className="input-field" value={country} onChange={e => setCountry(e.target.value)}>
                                    <option value="CA">Canada</option>
                                    <option value="US">United States</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '16px', marginTop: '16px', opacity: loading ? 0.7 : 1 }}>
                                {loading ? <Loader2 size={18} className="spin" /> : <>Create Account <ArrowRight size={18} /></>}
                            </button>
                        </form>

                        <div className="auth-divider">Or continue with</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="btn-social">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                                Continue with Google
                            </button>
                            <button className="btn-social">
                                <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="Apple" width="20" height="20" />
                                Continue with Apple
                            </button>
                        </div>

                        <div style={{ marginTop: '32px', textAlign: 'center' }}>
                            <Link to="/login" style={{ color: 'var(--text-secondary-dark)', fontSize: '14px', fontWeight: 600 }}>
                                Already have an account? <span style={{ color: 'var(--text-primary-dark)', fontWeight: 700 }}>Sign in</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Graphic Side */}
                <div className="auth-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', height: '500px' }}>
                        <div style={{ position: 'absolute', top: '40px', left: '-20px', width: '320px', height: '200px', backgroundColor: 'var(--accent-purple)', borderRadius: '24px', opacity: 0.9, transform: 'rotate(-8deg)', zIndex: 1 }} />
                        <div style={{ position: 'absolute', bottom: '60px', right: '-40px', width: '280px', height: '180px', backgroundColor: 'var(--highlight-peach)', borderRadius: '24px', opacity: 0.9, transform: 'rotate(12deg)', zIndex: 2 }} />
                        <div style={{ position: 'absolute', top: '100px', left: '20px', right: '20px', height: '300px', backgroundColor: '#1A1A1A', borderRadius: '32px', zIndex: 3, padding: '40px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px', lineHeight: 1.2 }}>
                                AI-powered<br />financial<br />clarity.
                            </h2>
                            <p style={{ color: 'var(--text-secondary-light)', fontSize: '16px' }}>
                                Detect opportunities. Approve with one tap.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
