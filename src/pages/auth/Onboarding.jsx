import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:8000/api';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const { authFetch, token } = useAuth();

    // Step 1 state
    const [country, setCountry] = useState('CA');
    const [incomeRange, setIncomeRange] = useState('$100k - $150k');
    const [taxBracket, setTaxBracket] = useState(0.314);

    // Step 2 state
    const [connecting, setConnecting] = useState(false);
    const [connectResult, setConnectResult] = useState(null);
    const [connectError, setConnectError] = useState('');

    // Step 3 state
    const [goalName, setGoalName] = useState('Emergency Fund');
    const [goalTarget, setGoalTarget] = useState('');
    const [goalDeadline, setGoalDeadline] = useState('');
    const [savingGoal, setSavingGoal] = useState(false);

    // Step 4 state
    const [scanning, setScanning] = useState(false);
    const [scanDone, setScanDone] = useState(false);

    const incomeMap = {
        '< $50k': { bracket: 0.20, income: 3500 },
        '$50k - $100k': { bracket: 0.25, income: 6250 },
        '$100k - $150k': { bracket: 0.314, income: 10416 },
        '> $150k': { bracket: 0.431, income: 16666 },
    };

    const handleStep1 = async () => {
        const info = incomeMap[incomeRange] || incomeMap['$100k - $150k'];
        setTaxBracket(info.bracket);
        try {
            await authFetch('/auth/me', {
                method: 'PATCH',
                body: JSON.stringify({
                    country: country,
                    tax_bracket: info.bracket,
                    monthly_income: info.income,
                }),
            });
        } catch (err) {
            console.error('Save profile error:', err);
        }
        setStep(2);
    };

    const handleConnectBank = async () => {
        setConnecting(true);
        setConnectError('');

        try {
            // Step 1: Get sandbox public_token
            const tokenRes = await fetch(`${API}/accounts/plaid/sandbox-token`, { method: 'POST' });
            if (!tokenRes.ok) throw new Error('Failed to create sandbox token');
            const { public_token } = await tokenRes.json();

            // Step 2: Exchange for access token
            const exchangeRes = await authFetch('/accounts/plaid/exchange', {
                method: 'POST',
                body: JSON.stringify({
                    public_token: public_token,
                    institution_name: 'First Platypus Bank',
                }),
            });
            if (!exchangeRes.ok) throw new Error('Failed to exchange token');
            const exchangeData = await exchangeRes.json();
            const accounts = exchangeData.accounts || [];

            // Step 3: Sync each account
            for (const acc of accounts) {
                try {
                    await authFetch(`/accounts/${acc.id}/sync`, { method: 'POST' });
                } catch {
                    // Continue syncing others
                }
            }

            setConnectResult({ count: accounts.length });
        } catch (err) {
            setConnectError(err.message || 'Connection failed');
        } finally {
            setConnecting(false);
        }
    };

    const handleStep3 = async () => {
        if (goalTarget && goalDeadline) {
            setSavingGoal(true);
            try {
                await authFetch('/goals', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: goalName,
                        type: 'savings',
                        target_amount: parseFloat(goalTarget),
                        deadline: goalDeadline,
                    }),
                });
            } catch (err) {
                console.error('Create goal error:', err);
            } finally {
                setSavingGoal(false);
            }
        }
        setStep(4);
        // Auto-run scan
        setScanning(true);
        try {
            await authFetch('/opportunities/scan', { method: 'POST' });
        } catch { }
        setScanning(false);
        setScanDone(true);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                <div style={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px', color: 'var(--text-primary-dark)' }}>
                    FINISHLINE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: step === s ? 'var(--cta-bg)' : step > s ? 'var(--highlight-mint)' : 'var(--bg-light)',
                                color: step === s ? 'white' : step > s ? '#065F46' : 'var(--text-secondary-light)',
                                fontWeight: 800, fontSize: '14px', border: step < s ? '1px solid var(--border-color)' : 'none'
                            }}>
                                {step > s ? <Check size={16} strokeWidth={3} /> : s}
                            </div>
                            {s !== 4 && <div style={{ width: '40px', height: '2px', backgroundColor: step > s ? 'var(--highlight-mint)' : 'var(--border-color)' }} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '48px', border: '1px solid var(--border-color)', boxShadow: '0 12px 32px rgba(0,0,0,0.03)' }}>

                    {step === 1 && (
                        <div>
                            <div className="pill-badge" style={{ marginBottom: '24px' }}>Step 1 of 4</div>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>Country & Tax Info</h2>
                            <p style={{ color: 'var(--text-secondary-dark)', fontSize: '16px', marginBottom: '32px' }}>This helps us calculate your exact marginal rates.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '15px' }}>Country</label>
                                    <select className="input-field" value={country} onChange={e => setCountry(e.target.value)}>
                                        <option value="CA">Canada</option>
                                        <option value="US">United States</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '15px' }}>Approximate Income Range</label>
                                    <select className="input-field" value={incomeRange} onChange={e => setIncomeRange(e.target.value)}>
                                        <option>{'< $50k'}</option>
                                        <option>$50k - $100k</option>
                                        <option>$100k - $150k</option>
                                        <option>{'> $150k'}</option>
                                    </select>
                                </div>

                                <div style={{ backgroundColor: 'var(--accent-lavender)', borderRadius: '16px', padding: '24px', border: '1px dashed #A78BFA' }}>
                                    <div style={{ fontSize: '14px', color: '#4C1D95', fontWeight: 700, marginBottom: '4px' }}>Estimated Marginal Tax Bracket</div>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#312E81', letterSpacing: '-1px' }}>
                                        {((incomeMap[incomeRange]?.bracket || 0.314) * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleStep1}>
                                Continue <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <div className="pill-badge" style={{ marginBottom: '24px' }}>Step 2 of 4</div>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>Connect Bank Account</h2>
                            <p style={{ color: 'var(--text-secondary-dark)', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>We connect via Plaid with read-only access. In sandbox mode, we auto-connect to First Platypus Bank with test data.</p>

                            {connectError && (
                                <div style={{ padding: '12px 16px', marginBottom: '20px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
                                    {connectError}
                                </div>
                            )}

                            {connectResult ? (
                                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--highlight-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                        <CheckCircle2 size={32} color="#065F46" />
                                    </div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Connected!</h3>
                                    <p style={{ color: 'var(--text-secondary-dark)', fontSize: '16px', marginBottom: '32px' }}>
                                        {connectResult.count} accounts linked from First Platypus Bank
                                    </p>
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(3)}>
                                        Continue <ArrowRight size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleConnectBank} disabled={connecting}>
                                        {connecting ? (
                                            <><Loader2 size={18} className="spin" /> Connecting to Plaid Sandbox...</>
                                        ) : (
                                            'Connect Sandbox Bank'
                                        )}
                                    </button>
                                    <button className="btn btn-outline" style={{ width: '100%', border: 'none' }} onClick={() => setStep(3)}>Skip for now</button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <div className="pill-badge" style={{ marginBottom: '24px' }}>Step 3 of 4</div>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>Set First Goal</h2>
                            <p style={{ color: 'var(--text-secondary-dark)', fontSize: '16px', marginBottom: '32px' }}>AI will build a pacing plan tailored to your timeline.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '15px' }}>Goal Name</label>
                                    <input type="text" className="input-field" value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="Emergency Fund" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '15px' }}>Target Amount ($)</label>
                                        <input type="number" className="input-field" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} placeholder="20000" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '15px' }}>Target Date</label>
                                        <input type="date" className="input-field" value={goalDeadline} onChange={e => setGoalDeadline(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleStep3} disabled={savingGoal}>
                                    {savingGoal ? <Loader2 size={18} className="spin" /> : 'Save Goal & Run AI Scan'}
                                </button>
                                <button className="btn btn-outline" style={{ width: '100%', border: 'none' }} onClick={() => { setStep(4); setScanning(true); authFetch('/opportunities/scan', { method: 'POST' }).then(() => { setScanning(false); setScanDone(true); }).catch(() => setScanning(false)); }}>
                                    Skip for now
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            {scanning ? (
                                <div>
                                    <Loader2 size={48} className="spin" style={{ color: 'var(--text-primary-dark)', marginBottom: '24px' }} />
                                    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Running AI Scan...</h2>
                                    <p style={{ color: 'var(--text-secondary-dark)', fontSize: '16px' }}>Claude is analyzing your accounts for opportunities.</p>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--highlight-mint)', marginBottom: '32px' }}>
                                        <CheckCircle2 size={40} color="#065F46" />
                                    </div>
                                    <h2 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px' }}>You're all set!</h2>
                                    <p style={{ color: 'var(--text-secondary-dark)', fontSize: '18px', marginBottom: '48px', maxWidth: '400px', margin: '0 auto 48px auto' }}>
                                        Your accounts are connected and AI has scanned for opportunities. Head to your dashboard.
                                    </p>
                                    <button className="btn btn-primary" style={{ width: '100%', maxWidth: '300px', padding: '16px' }} onClick={() => navigate('/dashboard')}>
                                        Go to Dashboard <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
