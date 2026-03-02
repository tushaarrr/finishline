import React, { useEffect, useState } from 'react';
import { TrendingUp, Zap, Clock, ArrowRight, HandCoins, Loader2, RefreshCw, Bell, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ExecutionModal from '../../components/ExecutionModal';

const PriorityBadge = ({ priority }) => {
    const styles = {
        urgent: { bg: 'var(--accent-yellow)', text: '#92400E' },
        high: { bg: 'var(--accent-purple)', text: '#3730A3' },
        medium: { bg: 'var(--bg-light)', text: 'var(--text-secondary-dark)' },
        low: { bg: 'var(--bg-light)', text: 'var(--text-secondary-dark)' },
    };
    const s = styles[priority] || styles.medium;
    return (
        <div className="pill-badge" style={{ backgroundColor: s.bg, color: s.text, fontSize: '12px', padding: '4px 10px', border: 'none' }}>
            {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium'} Priority
        </div>
    );
};

const DashboardHome = () => {
    const { authFetch } = useAuth();
    const [summary, setSummary] = useState({ net_worth: 0, opportunity_count: 0, optimized_this_year: 0, action_rate: 0 });
    const [opportunities, setOpportunities] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [executingOpp, setExecutingOpp] = useState(null);
    const [advisorAlerts, setAdvisorAlerts] = useState([]);
    const [dismissedAlerts, setDismissedAlerts] = useState(() => {
        try {
            const stored = localStorage.getItem('fl_dismissed_alerts');
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch { return new Set(); }
    });

    useEffect(() => {
        loadDashboard();
        loadAdvisorAlerts();
        const interval = setInterval(loadAdvisorAlerts, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadAdvisorAlerts = async () => {
        try {
            const res = await authFetch('/advisor/my-alerts');
            if (res.ok) {
                const data = await res.json();
                setAdvisorAlerts(data.alerts || []);
            }
        } catch (err) { /* silent */ }
    };

    const dismissAlert = (alertId) => {
        setDismissedAlerts(prev => {
            const next = new Set([...prev, alertId]);
            localStorage.setItem('fl_dismissed_alerts', JSON.stringify([...next]));
            return next;
        });
    };

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const [summaryRes, oppsRes, acctsRes] = await Promise.all([
                authFetch('/dashboard/summary'),
                authFetch('/opportunities'),
                authFetch('/accounts'),
            ]);
            if (summaryRes.ok) setSummary(await summaryRes.json());
            if (oppsRes.ok) {
                const data = await oppsRes.json();
                setOpportunities(data.opportunities || []);
            }
            if (acctsRes.ok) {
                const data = await acctsRes.json();
                setAccounts(data.accounts || []);
            }
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async () => {
        setScanning(true);
        try {
            const res = await authFetch('/opportunities/scan', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                if (data.opportunities?.length > 0) {
                    setOpportunities(prev => [...data.opportunities, ...prev]);
                }
                const summaryRes = await authFetch('/dashboard/summary');
                if (summaryRes.ok) setSummary(await summaryRes.json());
            }
        } catch (err) {
            console.error('Scan error:', err);
        } finally {
            setScanning(false);
        }
    };

    const handleApproveClick = (opp) => {
        setExecutingOpp(opp);
    };

    const handleExecutionComplete = async (oppId) => {
        try {
            await authFetch(`/opportunities/${oppId}/approve`, { method: 'POST' });
        } catch (err) {
            console.error('approve error:', err);
        }
        setOpportunities(prev => prev.filter(o => o.id !== oppId));
        setSummary(prev => ({ ...prev, opportunity_count: Math.max(0, prev.opportunity_count - 1) }));
        setExecutingOpp(null);
    };

    const handleSkip = async (oppId) => {
        try {
            const res = await authFetch(`/opportunities/${oppId}/skip`, { method: 'POST' });
            if (res.ok) {
                setOpportunities(prev => prev.filter(o => o.id !== oppId));
                setSummary(prev => ({ ...prev, opportunity_count: Math.max(0, prev.opportunity_count - 1) }));
            }
        } catch (err) {
            console.error('skip error:', err);
        }
    };

    const formatMoney = (n) => {
        if (n === undefined || n === null) return '$0';
        return '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--text-secondary-dark)' }} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Advisor Alert Notifications */}
            {advisorAlerts.filter(a => !dismissedAlerts.has(a.id)).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.4s ease' }}>
                    {advisorAlerts.filter(a => !dismissedAlerts.has(a.id)).map((alert) => (
                        <div key={alert.id} className="card" style={{
                            padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px',
                            borderColor: 'var(--accent-purple)', backgroundColor: '#F5F3FF',
                            animation: 'cardEnter 0.3s ease-out',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                                backgroundColor: 'var(--accent-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Bell size={18} color="#6D28D9" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: '#6D28D9', letterSpacing: '0.3px', marginBottom: '4px' }}>
                                    MESSAGE FROM YOUR ADVISOR
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--text-primary-dark)', lineHeight: '1.6', margin: 0, fontWeight: 500 }}>
                                    {alert.message}
                                </p>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)', marginTop: '6px', fontWeight: 500 }}>
                                    {new Date(alert.sent_at).toLocaleString()}
                                </div>
                            </div>
                            <button onClick={() => dismissAlert(alert.id)} style={{
                                border: 'none', background: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px', flexShrink: 0,
                            }}>
                                <X size={16} color="var(--text-secondary-dark)" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {[
                    { label: 'Total Net Worth', value: formatMoney(summary.net_worth), icon: TrendingUp, bg: 'var(--accent-light-mint)', color: '#065F46' },
                    { label: 'Opportunities', value: String(summary.opportunity_count), icon: Zap, bg: 'var(--accent-yellow)', color: '#92400E', desc: summary.opportunity_count > 0 ? 'Needs review' : 'All clear' },
                    { label: 'Optimized This Year', value: formatMoney(summary.optimized_this_year), icon: HandCoins, bg: 'var(--accent-lavender)', color: '#3730A3' },
                    { label: 'Action Rate', value: `${summary.action_rate || 0}%`, icon: Clock, bg: 'var(--bg-light)', color: 'var(--text-primary-dark)', desc: summary.action_rate >= 80 ? 'Highly engaged' : 'Keep going' },
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: stat.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <stat.icon color={stat.color} size={24} />
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '4px', color: 'var(--text-primary-dark)' }}>{stat.value}</div>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary-dark)' }}>{stat.label}</div>
                        </div>
                        {stat.desc && <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary-light)' }}>{stat.desc}</div>}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>

                {/* Opportunities Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>AI Opportunities</h2>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button
                                onClick={handleScan}
                                disabled={scanning}
                                className="btn btn-outline"
                                style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <RefreshCw size={14} className={scanning ? 'spin' : ''} /> {scanning ? 'Scanning...' : 'Run Scan'}
                            </button>
                            <Link to="/dashboard/opportunities" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {opportunities.length === 0 ? (
                        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                            <Zap size={40} style={{ color: 'var(--text-secondary-dark)', marginBottom: '16px' }} />
                            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No pending opportunities</h3>
                            <p style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', marginBottom: '24px' }}>
                                Connect a bank account and run a scan to find financial opportunities.
                            </p>
                            <button onClick={handleScan} disabled={scanning} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                                {scanning ? 'Scanning...' : 'Run AI Scan'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {opportunities.map((opp) => (
                                <div key={opp.id} className="card" style={{ padding: '32px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <PriorityBadge priority={opp.priority} />
                                            <span style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>{opp.type?.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div className="pill-badge" style={{ backgroundColor: 'var(--highlight-mint)', color: '#065F46', border: 'none', fontSize: '15px' }}>
                                            {formatMoney(opp.impact_value)}/yr
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px' }}>{opp.title}</h3>

                                    {/* Salary Autopilot — show moves breakdown */}
                                    {opp.type === 'salary_autopilot' && opp.moves && opp.moves.length > 0 ? (
                                        <>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                                                {opp.moves.map((move, i) => {
                                                    const moveColors = {
                                                        rrsp: { bg: '#DCFCE7', accent: '#059669', icon: '📊' },
                                                        debt: { bg: '#FEE2E2', accent: '#DC2626', icon: '💳' },
                                                        tfsa: { bg: '#EDE9FE', accent: '#7C3AED', icon: '🏦' },
                                                        keep: { bg: 'var(--bg-light)', accent: 'var(--text-secondary-dark)', icon: '🔒' },
                                                    };
                                                    const mc = moveColors[move.type] || moveColors.keep;
                                                    return (
                                                        <div key={i} style={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            padding: '14px 18px', borderRadius: '12px', backgroundColor: mc.bg,
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <span style={{ fontSize: '18px' }}>{mc.icon}</span>
                                                                <span style={{ fontSize: '14px', fontWeight: 600, color: mc.accent }}>{move.label}</span>
                                                            </div>
                                                            <span style={{ fontSize: '16px', fontWeight: 800, color: mc.accent }}>${Number(move.amount).toLocaleString()}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <button onClick={() => handleApproveClick(opp)} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                                                    ✓ Approve All Moves
                                                </button>
                                                <button onClick={() => handleSkip(opp.id)} className="btn btn-outline" style={{ padding: '12px 24px' }}>Skip</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', lineHeight: '1.6', marginBottom: '32px' }}>
                                                {opp.brief_text || opp.impact_text}
                                            </p>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <button onClick={() => handleApproveClick(opp)} className="btn btn-primary" style={{ padding: '12px 24px' }}>Yes, do it</button>
                                                <button onClick={() => handleSkip(opp.id)} className="btn btn-outline" style={{ padding: '12px 24px' }}>Skip</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right — Accounts + Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* Connected Accounts */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>Connected Accounts</h3>
                            <Link to="/dashboard/accounts" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary-dark)' }}>Manage</Link>
                        </div>

                        {accounts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', marginBottom: '16px' }}>No accounts connected yet</p>
                                <Link to="/dashboard/accounts" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>Connect Bank</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {accounts.slice(0, 5).map((acc, i) => {
                                    const colors = ['var(--accent-light-mint)', 'var(--accent-yellow)', 'var(--accent-lavender)', 'var(--highlight-peach)', 'var(--bg-light)'];
                                    return (
                                        <div key={acc.id || i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', backgroundColor: colors[i % colors.length], borderRadius: '12px' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: '15px' }}>{acc.institution_name || 'Account'}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>{acc.account_type}</div>
                                            </div>
                                            <div style={{ fontWeight: 800, fontSize: '16px' }}>{formatMoney(acc.balance)}</div>
                                        </div>
                                    );
                                })}
                                {accounts.length > 5 && (
                                    <Link to="/dashboard/accounts" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary-dark)', textAlign: 'center' }}>
                                        +{accounts.length - 5} more accounts
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Execution Modal */}
            {executingOpp && (
                <ExecutionModal
                    opportunity={executingOpp}
                    onComplete={handleExecutionComplete}
                    onClose={() => setExecutingOpp(null)}
                />
            )}
        </div>
    );
};

export default DashboardHome;
