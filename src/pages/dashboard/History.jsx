import React, { useEffect, useState } from 'react';
import { Filter, Download, Loader2, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ActionHistory = () => {
    const { authFetch } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await authFetch('/opportunities?status=all');
            if (res.ok) {
                const data = await res.json();
                setHistory(data.opportunities || []);
            }
        } catch (err) {
            console.error('Load history error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatMoney = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const formatDate = (d) => {
        if (!d) return '—';
        const date = new Date(d);
        const now = new Date();
        const diff = now - date;
        if (diff < 86400000) return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diff < 172800000) return 'Yesterday';
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const filteredHistory = filter === 'All' ? history : history.filter(h => {
        const status = (h.status || '').toLowerCase();
        return status === filter.toLowerCase();
    });

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--text-secondary-dark)' }} />
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Top Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Filter size={20} color="var(--text-secondary-dark)" />
                    {['All', 'Approved', 'Skipped', 'Pending'].map(f => (
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
                <div className="pill-badge" style={{ fontSize: '13px', border: 'none', backgroundColor: 'var(--bg-light)' }}>
                    {history.length} total actions
                </div>
            </div>

            {/* Table */}
            {filteredHistory.length === 0 ? (
                <div style={{ padding: '64px', textAlign: 'center' }}>
                    <Zap size={40} style={{ color: 'var(--text-secondary-dark)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No action history yet</h3>
                    <p style={{ color: 'var(--text-secondary-dark)', fontSize: '15px' }}>
                        Approve or skip opportunities to see them here.
                    </p>
                </div>
            ) : (
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-secondary-dark)', fontSize: '13px', backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '20px 32px', fontWeight: 700 }}>Opportunity</th>
                                <th style={{ padding: '20px 32px', fontWeight: 700 }}>Type</th>
                                <th style={{ padding: '20px 32px', fontWeight: 700 }}>Amount</th>
                                <th style={{ padding: '20px 32px', fontWeight: 700 }}>Impact</th>
                                <th style={{ padding: '20px 32px', fontWeight: 700 }}>Status</th>
                                <th style={{ padding: '20px 32px', fontWeight: 700 }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((row) => (
                                <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                                    <td style={{ padding: '24px 32px', fontWeight: 800, fontSize: '15px', color: 'var(--text-primary-dark)' }}>{row.title}</td>
                                    <td style={{ padding: '24px 32px', fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>{(row.type || '').replace(/_/g, ' ')}</td>
                                    <td style={{ padding: '24px 32px', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary-dark)' }}>{formatMoney(row.amount)}</td>
                                    <td style={{ padding: '24px 32px', fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>{row.impact_text}</td>
                                    <td style={{ padding: '24px 32px' }}>
                                        <span className="pill-badge" style={{
                                            fontSize: '13px', padding: '6px 16px', border: 'none',
                                            backgroundColor: row.status === 'approved' ? 'var(--accent-light-mint)' : row.status === 'skipped' ? 'var(--bg-light)' : 'var(--accent-yellow)',
                                            color: row.status === 'approved' ? '#065F46' : row.status === 'skipped' ? 'var(--text-secondary-dark)' : '#92400E'
                                        }}>
                                            {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Pending'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '24px 32px', fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>{formatDate(row.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActionHistory;
