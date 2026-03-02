import React, { useEffect, useState } from 'react';
import { Filter, Loader2, RefreshCw, Zap } from 'lucide-react';
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
        <div className="pill-badge" style={{ backgroundColor: s.bg, color: s.text, fontSize: '13px', padding: '4px 12px', border: 'none' }}>
            {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium'}
        </div>
    );
};

const Opportunities = () => {
    const { authFetch } = useAuth();
    const [opps, setOpps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [filter, setFilter] = useState('All');
    const [executingOpp, setExecutingOpp] = useState(null);

    useEffect(() => {
        loadOpportunities();
    }, []);

    const loadOpportunities = async () => {
        try {
            const res = await authFetch('/opportunities');
            if (res.ok) {
                const data = await res.json();
                setOpps(data.opportunities || []);
            }
        } catch (err) {
            console.error('Load opportunities error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async () => {
        setScanning(true);
        try {
            const res = await authFetch('/opportunities/scan', { method: 'POST' });
            if (res.ok) {
                await loadOpportunities();
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
        // Call the real approve endpoint
        try {
            await authFetch(`/opportunities/${oppId}/approve`, { method: 'POST' });
        } catch (err) {
            console.error('approve error:', err);
        }
        setOpps(prev => prev.filter(o => o.id !== oppId));
        setExecutingOpp(null);
    };

    const handleSkip = async (id) => {
        try {
            const res = await authFetch(`/opportunities/${id}/skip`, { method: 'POST' });
            if (res.ok) {
                setOpps(prev => prev.filter(o => o.id !== id));
            }
        } catch (err) {
            console.error('skip error:', err);
        }
    };

    const formatMoney = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const filteredOpps = filter === 'All' ? opps : opps.filter(o => (o.priority || '').toLowerCase() === filter.toLowerCase());

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--text-secondary-dark)' }} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Filtering Bar */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Filter size={20} color="var(--text-secondary-dark)" />
                    {['All', 'Urgent', 'High', 'Medium'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '8px 20px', borderRadius: '999px', border: 'none',
                            backgroundColor: filter === f ? 'var(--cta-bg)' : 'transparent',
                            color: filter === f ? 'var(--cta-text)' : 'var(--text-secondary-dark)',
                            fontWeight: 700, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Manrope, sans-serif'
                        }}>
                            {f}
                        </button>
                    ))}
                </div>

                <button onClick={handleScan} disabled={scanning} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={16} className={scanning ? 'spin' : ''} />
                    {scanning ? 'Scanning...' : 'Run AI Scan'}
                </button>
            </div>

            {/* Opportunities Grid */}
            {filteredOpps.length === 0 ? (
                <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
                    <Zap size={48} style={{ color: 'var(--text-secondary-dark)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>No pending opportunities</h3>
                    <p style={{ color: 'var(--text-secondary-dark)', fontSize: '16px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                        Connect bank accounts and run an AI scan to detect financial optimization opportunities.
                    </p>
                    <button onClick={handleScan} disabled={scanning} className="btn btn-primary" style={{ padding: '14px 28px' }}>
                        {scanning ? 'Scanning...' : 'Run AI Scan'}
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                    {filteredOpps.map((opp) => (
                        <div key={opp.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <PriorityBadge priority={opp.priority} />
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 700 }}>{opp.type?.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="pill-badge" style={{ backgroundColor: 'white', color: 'var(--success)', fontSize: '15px' }}>
                                    {formatMoney(opp.impact_value)}/yr
                                </div>
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>{opp.title}</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', lineHeight: '1.6', marginBottom: '32px', flex: 1 }}>
                                {opp.brief_text || opp.impact_text}
                            </p>

                            <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                                <button onClick={() => handleApproveClick(opp)} className="btn btn-primary" style={{ flex: 1 }}>Yes, approve</button>
                                <button onClick={() => handleSkip(opp.id)} className="btn btn-secondary" style={{ flex: 1 }}>Skip</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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

export default Opportunities;
