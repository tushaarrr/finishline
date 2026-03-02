import React, { useEffect, useState } from 'react';
import { BuildingIcon, RotateCw, Trash2, Loader2, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Accounts = () => {
    const { authFetch } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const res = await authFetch('/accounts');
            if (res.ok) {
                const data = await res.json();
                setAccounts(data.accounts || []);
            }
        } catch (err) {
            console.error('Load accounts error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async (accountId) => {
        setSyncing(accountId);
        try {
            const res = await authFetch(`/accounts/${accountId}/sync`, { method: 'POST' });
            if (res.ok) {
                await loadAccounts(); // Refresh the list
            }
        } catch (err) {
            console.error('Sync error:', err);
        } finally {
            setSyncing(null);
        }
    };

    const handleDelete = async (accountId) => {
        if (!confirm('Disconnect this account?')) return;
        setDeleting(accountId);
        try {
            const res = await authFetch(`/accounts/${accountId}`, { method: 'DELETE' });
            if (res.ok) {
                setAccounts(prev => prev.filter(a => a.id !== accountId));
            }
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setDeleting(null);
        }
    };

    const formatMoney = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const colors = ['var(--accent-light-mint)', 'var(--accent-yellow)', 'var(--accent-lavender)', 'var(--highlight-peach)', 'var(--accent-purple)', 'var(--bg-light)'];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--text-secondary-dark)' }} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Connected Accounts List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>Connected Accounts</h2>
                    <p style={{ color: 'var(--text-secondary-dark)', fontSize: '16px' }}>FinishLine uses read-only access via Plaid to analyze your transactions.</p>
                </div>

                {accounts.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                        <BuildingIcon size={48} style={{ color: 'var(--text-secondary-dark)', marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No accounts connected</h3>
                        <p style={{ color: 'var(--text-secondary-dark)', fontSize: '15px' }}>
                            Connect a bank account below to start scanning for opportunities.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {accounts.map((acc, idx) => (
                            <div key={acc.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center', backgroundColor: 'white', padding: '24px 32px', borderBottom: idx !== accounts.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '48px', height: '48px', backgroundColor: colors[idx % colors.length], borderRadius: '16px' }} />
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '16px' }}>{acc.institution_name || 'Bank Account'}</div>
                                        <div style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>{acc.account_type}</div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '18px' }}>{formatMoney(acc.balance)}</div>
                                <div className="pill-badge" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', justifySelf: 'start', backgroundColor: 'var(--bg-light)', border: 'none' }}>
                                    {acc.last_synced ? new Date(acc.last_synced).toLocaleDateString() : 'Not synced'}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button
                                        onClick={() => handleSync(acc.id)}
                                        disabled={syncing === acc.id}
                                        className="btn btn-secondary"
                                        style={{ padding: '8px 16px', fontSize: '13px' }}
                                    >
                                        <RefreshCw size={14} className={syncing === acc.id ? 'spin' : ''} />
                                        {syncing === acc.id ? 'Syncing...' : 'Sync'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(acc.id)}
                                        disabled={deleting === acc.id}
                                        style={{ border: 'none', background: 'none', color: 'var(--text-secondary-light)', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary */}
            {accounts.length > 0 && (
                <div className="card" style={{ backgroundColor: 'var(--accent-light-mint)', border: 'none', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#065F46', marginBottom: '4px' }}>Total across {accounts.length} accounts</div>
                        <div style={{ fontSize: '32px', fontWeight: 800, color: '#065F46', letterSpacing: '-1px' }}>
                            {formatMoney(accounts.reduce((sum, a) => sum + (a.balance || 0), 0))}
                        </div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#065F46' }}>
                        All data from Plaid Sandbox
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;
