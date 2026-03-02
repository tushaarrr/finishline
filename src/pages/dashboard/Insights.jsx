import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Insights = () => {
    const { authFetch } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        try {
            const res = await authFetch('/dashboard/summary');
            if (res.ok) {
                setSummary(await res.json());
            }
        } catch (err) {
            console.error('Load insights error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatMoney = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--text-secondary-dark)' }} />
            </div>
        );
    }

    const s = summary || {};

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Top Stats from real API */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                <div className="card">
                    <div style={{ color: 'var(--text-secondary-dark)', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Total Net Worth</div>
                    <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>{formatMoney(s.net_worth)}</div>
                </div>
                <div className="card" style={{ backgroundColor: 'var(--bg-dark)', color: 'white' }}>
                    <div style={{ color: 'var(--text-secondary-light)', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Optimized This Year</div>
                    <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', color: 'var(--highlight-mint)' }}>{formatMoney(s.optimized_this_year)}</div>
                </div>
                <div className="card">
                    <div style={{ color: 'var(--text-secondary-dark)', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Action Rate</div>
                    <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>{s.action_rate || 0}%</div>
                </div>
                <div className="card">
                    <div style={{ color: 'var(--text-secondary-dark)', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Pending Opportunities</div>
                    <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>{s.opportunity_count || 0}</div>
                </div>
            </div>

            {/* Net Worth Display */}
            <div className="card">
                <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '32px' }}>Net Worth Summary</h2>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-2px', color: 'var(--text-primary-dark)', marginBottom: '8px' }}>
                            {formatMoney(s.net_worth)}
                        </div>
                        <div style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>
                            Current net worth from all connected Plaid accounts
                        </div>
                    </div>
                </div>
            </div>

            {/* Optimization Breakdown */}
            <div className="card">
                <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '32px' }}>Optimization Breakdown</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ padding: '32px', backgroundColor: 'var(--accent-light-mint)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#065F46', fontWeight: 700, marginBottom: '8px' }}>Optimized This Year</div>
                        <div style={{ fontSize: '32px', fontWeight: 800, color: '#065F46', letterSpacing: '-1px' }}>{formatMoney(s.optimized_this_year)}</div>
                    </div>
                    <div style={{ padding: '32px', backgroundColor: 'var(--accent-yellow)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#92400E', fontWeight: 700, marginBottom: '8px' }}>Opportunities Found</div>
                        <div style={{ fontSize: '32px', fontWeight: 800, color: '#92400E', letterSpacing: '-1px' }}>{s.opportunity_count || 0}</div>
                    </div>
                    <div style={{ padding: '32px', backgroundColor: 'var(--accent-lavender)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#3730A3', fontWeight: 700, marginBottom: '8px' }}>Approval Rate</div>
                        <div style={{ fontSize: '32px', fontWeight: 800, color: '#3730A3', letterSpacing: '-1px' }}>{s.action_rate || 0}%</div>
                    </div>
                    <div style={{ padding: '32px', backgroundColor: 'var(--bg-light)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 700, marginBottom: '8px' }}>AI Status</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary-dark)' }}>Active & Monitoring</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
