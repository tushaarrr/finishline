import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);
            // Advisors (@finishline.com) go to advisor dashboard
            if (data.user?.role === 'advisor') {
                navigate('/advisor');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split-layout">
            <div className="auth-card" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>

                {/* Left Form Side */}
                <div className="auth-left">
                    <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                        <div className="pill-badge" style={{ marginBottom: '32px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', marginRight: '8px' }} />
                            Welcome Back
                        </div>

                        <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1.5px', color: 'var(--text-primary-dark)' }}>
                            Sign In
                        </h1>
                        <p style={{ color: 'var(--text-secondary-dark)', marginBottom: '32px', fontSize: '16px' }}>
                            Access your financial dashboard.
                        </p>

                        {error && (
                            <div style={{
                                padding: '12px 16px', marginBottom: '20px', borderRadius: '12px',
                                backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
                                fontSize: '14px', fontWeight: 600
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>Email Address</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Link to="/signup" style={{ color: 'var(--text-secondary-dark)', fontSize: '14px', fontWeight: 600 }}>
                                    Need an account? Sign up
                                </Link>
                                <Link to="/forgot-password" style={{ color: 'var(--text-primary-dark)', fontSize: '14px', fontWeight: 700 }}>
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ width: '100%', padding: '16px', marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? <Loader2 size={18} className="spin" /> : <>Sign In <ArrowRight size={18} /></>}
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

                        <div style={{ marginTop: 'auto', paddingTop: '60px', color: 'var(--text-secondary-light)', fontSize: '12px', textAlign: 'center' }}>
                            @2026 FinishLine Formatted
                        </div>
                    </div>
                </div>

                {/* Right Graphic Side */}
                <div className="auth-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', height: '500px' }}>
                        <div style={{
                            position: 'absolute', top: 0, right: '-20px', width: '300px', height: '180px',
                            backgroundColor: 'var(--highlight-peach)', borderRadius: '24px', opacity: 0.9,
                            transform: 'rotate(10deg)', zIndex: 1,
                            animation: 'loginFloat1 6s ease-in-out infinite',
                        }} />
                        <div style={{
                            position: 'absolute', bottom: '40px', left: '-20px', width: '280px', height: '220px',
                            backgroundColor: 'var(--highlight-mint)', borderRadius: '24px', opacity: 0.9,
                            transform: 'rotate(-15deg)', zIndex: 2,
                            animation: 'loginFloat2 7s ease-in-out infinite',
                        }} />
                        <div style={{
                            position: 'absolute', top: '100px', left: '20px', right: '20px', height: '300px',
                            backgroundColor: '#1A1A1A', borderRadius: '32px', zIndex: 3, padding: '40px',
                            border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                            animation: 'loginFloat3 8s ease-in-out infinite',
                        }}>
                            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.2 }}>
                                AI-driven<br />wealth<br />optimization.
                            </h2>
                            <p style={{ color: 'var(--text-secondary-light)', fontSize: '16px' }}>
                                Secure, read-only analytics to maximize your net worth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes loginFloat1 {
                    0%, 100% { transform: rotate(10deg) translateY(0px); }
                    50% { transform: rotate(14deg) translateY(-18px); }
                }
                @keyframes loginFloat2 {
                    0%, 100% { transform: rotate(-15deg) translateX(0px) translateY(0px); }
                    50% { transform: rotate(-12deg) translateX(10px) translateY(-14px); }
                }
                @keyframes loginFloat3 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
};

export default Login;

