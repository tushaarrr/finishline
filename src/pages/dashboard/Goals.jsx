import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Goals = () => {
    const { authFetch } = useAuth();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', type: 'savings', target_amount: '', deadline: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const res = await authFetch('/goals');
            if (res.ok) {
                const data = await res.json();
                setGoals(data.goals || []);
            }
        } catch (err) {
            console.error('Load goals error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newGoal.name || !newGoal.target_amount || !newGoal.deadline) return;
        setSaving(true);
        try {
            const res = await authFetch('/goals', {
                method: 'POST',
                body: JSON.stringify({
                    name: newGoal.name,
                    type: newGoal.type,
                    target_amount: parseFloat(newGoal.target_amount),
                    deadline: newGoal.deadline,
                }),
            });
            if (res.ok) {
                const created = await res.json();
                setGoals(prev => [created, ...prev]);
                setShowModal(false);
                setNewGoal({ name: '', type: 'savings', target_amount: '', deadline: '' });
            }
        } catch (err) {
            console.error('Create goal error:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (goalId) => {
        if (!confirm('Delete this goal?')) return;
        try {
            const res = await authFetch(`/goals/${goalId}`, { method: 'DELETE' });
            if (res.ok) {
                setGoals(prev => prev.filter(g => g.id !== goalId));
            }
        } catch (err) {
            console.error('Delete goal error:', err);
        }
    };

    const formatMoney = (n) => '$' + Number(n || 0).toLocaleString();

    const goalEmojis = { savings: '💰', emergency: '🛡️', travel: '✈️', home: '🏠', car: '🚗', education: '📚', retirement: '🏖️', other: '🎯' };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--text-secondary-dark)' }} />
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>

                {/* Existing Goals from API */}
                {goals.map(g => {
                    const percent = g.target_amount > 0 ? Math.round((g.current_amount / g.target_amount) * 100) : 0;
                    const emoji = goalEmojis[g.type] || '🎯';
                    return (
                        <div key={g.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ fontSize: '40px', backgroundColor: 'var(--bg-light)', padding: '12px', borderRadius: '16px' }}>{emoji}</div>
                                    <div>
                                        <h3 style={{ fontSize: '20px', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>{g.name}</h3>
                                        <div style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 600, marginTop: '4px' }}>
                                            Target: {g.deadline}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(g.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary-light)', cursor: 'pointer', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary-light)'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' }}>
                                    <span style={{ fontWeight: 800 }}>{formatMoney(g.current_amount)}</span>
                                    <span style={{ color: 'var(--text-secondary-dark)', fontWeight: 600 }}>of {formatMoney(g.target_amount)}</span>
                                </div>
                                <div style={{ height: '12px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(percent, 100)}%`, height: '100%', backgroundColor: 'var(--cta-bg)', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                                </div>
                                <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--cta-bg)', fontWeight: 800, textAlign: 'right' }}>
                                    {percent}% complete
                                </div>
                            </div>

                            {g.monthly_contribution > 0 && (
                                <div style={{ backgroundColor: 'var(--accent-light-mint)', padding: '16px', borderRadius: '12px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#065F46', fontWeight: 700 }}>Monthly needed</span>
                                    <span style={{ fontWeight: 800, color: '#065F46', fontSize: '16px' }}>{formatMoney(g.monthly_contribution)} / mo</span>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add New Goal Card */}
                <button
                    onClick={() => setShowModal(true)}
                    className="card"
                    style={{ border: '2px dashed var(--border-color)', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', minHeight: '300px', cursor: 'pointer', transition: 'all 0.2s', padding: 0, boxShadow: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-primary-dark)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                    <div style={{ width: '56px', height: '56px', backgroundColor: 'var(--bg-light)', color: 'var(--text-primary-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={24} strokeWidth={3} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-secondary-dark)', letterSpacing: '-0.5px' }}>Create New Goal</span>
                </button>
            </div>

            {/* Add Goal Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px', letterSpacing: '-1px' }}>Add New Goal</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '15px' }}>Goal Name</label>
                                <input type="text" className="input-field" placeholder="e.g. Emergency Fund"
                                    value={newGoal.name} onChange={e => setNewGoal(p => ({ ...p, name: e.target.value }))} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '15px' }}>Type</label>
                                <select className="input-field" value={newGoal.type} onChange={e => setNewGoal(p => ({ ...p, type: e.target.value }))}>
                                    <option value="savings">💰 Savings</option>
                                    <option value="emergency">🛡️ Emergency</option>
                                    <option value="travel">✈️ Travel</option>
                                    <option value="home">🏠 Home</option>
                                    <option value="car">🚗 Car</option>
                                    <option value="education">📚 Education</option>
                                    <option value="retirement">🏖️ Retirement</option>
                                    <option value="other">🎯 Other</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '15px' }}>Target Amount ($)</label>
                                    <input type="number" className="input-field" placeholder="50000"
                                        value={newGoal.target_amount} onChange={e => setNewGoal(p => ({ ...p, target_amount: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '15px' }}>Target Date</label>
                                    <input type="date" className="input-field"
                                        value={newGoal.deadline} onChange={e => setNewGoal(p => ({ ...p, deadline: e.target.value }))} />
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'var(--accent-purple)', padding: '20px', borderRadius: '16px', fontSize: '14px', color: '#3730A3', lineHeight: '1.6' }}>
                                <strong style={{ fontWeight: 800 }}>Note:</strong> FinishLine will automatically calculate the required monthly contribution based on your target and deadline.
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} disabled={saving} onClick={handleCreate}>
                                    {saving ? 'Saving...' : 'Save Goal'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
