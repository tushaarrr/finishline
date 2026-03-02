import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Shield, AlertTriangle, Users, Send, Eye, X,
    Loader2, CheckCircle2, Phone, MessageSquare,
    ChevronRight, ChevronDown, Banknote, TrendingUp, Clock,
    Activity, UserCheck, Bell, ArrowUpRight, LogOut,
    Search, BarChart3, Sparkles, Pencil, Trophy, Hand
} from 'lucide-react';

// ── Alert Templates ──────────────────────────────────────────

const ALERT_TEMPLATES = {
    idle_cash: (name) => `Hi ${name}, I noticed you have funds sitting idle in your chequing account. I'd love to help you put that money to work — whether it's a HISA, TFSA, or short-term GIC. Are you available for a quick call this week?`,
    rrsp_deadline: (name) => `Hi ${name}, your RRSP contribution deadline is approaching and you have unused contribution room. Contributing before the deadline could save you significant taxes this year. Let me know if you'd like to discuss your options.`,
    tfsa_room: (name) => `Hi ${name}, you have available TFSA contribution room that could be earning tax-free returns. Even a simple index fund inside your TFSA can make a meaningful difference. Would you like to explore your options?`,
    portfolio_drift: (name) => `Hi ${name}, I noticed your portfolio has drifted from its target allocation. A quick rebalance could help manage your risk exposure. Happy to walk you through it.`,
    default: (name) => `Hi ${name}, I wanted to reach out about your financial plan. I've identified something worth discussing. Would you have time for a brief call?`,
};

const TYPE_ICONS = {
    idle_cash: Banknote,
    rrsp_deadline: Clock,
    tfsa_room: TrendingUp,
    portfolio_drift: BarChart3,
};


// ── Client Card ──────────────────────────────────────────────

const ClientCard = ({ client, index, onSendAlert, onViewDetail, onAcknowledge, fading }) => {
    const opp = client.opportunity;
    const risk = client.risk_level;
    const formatMoney = (n) => '$' + Number(n || 0).toLocaleString();
    const TypeIcon = TYPE_ICONS[opp?.type] || Activity;

    const riskStyles = {
        urgent: { accent: '#EF4444', bg: '#FEF2F2', border: '#FECACA', badge: 'var(--danger)', badgeBg: '#FEE2E2' },
        high: { accent: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', badge: '#D97706', badgeBg: '#FEF3C7' },
    };
    const rs = riskStyles[risk] || riskStyles.high;

    return (
        <div
            className="card"
            style={{
                padding: '0', overflow: 'hidden',
                borderColor: rs.border,
                opacity: fading ? 0 : 1,
                transform: fading ? 'scale(0.96) translateY(-8px)' : 'scale(1) translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `cardEnter 0.5s ease-out ${index * 0.08}s both`,
            }}
        >
            {/* Risk Stripe */}
            <div style={{ height: '4px', backgroundColor: rs.accent }} />

            <div style={{ padding: '28px 28px 24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${rs.accent}20, ${rs.accent}40)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '17px', color: rs.accent,
                            border: `2px solid ${rs.accent}30`,
                        }}>
                            {(client.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.3px' }}>{client.full_name}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', fontWeight: 500 }}>{client.email}</div>
                        </div>
                    </div>
                    <div className="pill-badge" style={{
                        backgroundColor: rs.badgeBg, color: rs.badge,
                        border: `1px solid ${rs.border}`, fontSize: '12px', fontWeight: 800, padding: '4px 12px',
                        letterSpacing: '0.3px',
                    }}>
                        {risk === 'urgent' ? '● URGENT' : '● HIGH'}
                    </div>
                </div>

                {/* Opportunity Brief */}
                {opp && (
                    <div style={{
                        backgroundColor: rs.bg, borderRadius: 'var(--radius-md)', padding: '20px',
                        marginBottom: '16px', border: `1px solid ${rs.border}`,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <TypeIcon size={16} color={rs.accent} />
                            <span style={{ fontSize: '12px', fontWeight: 800, color: rs.accent, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {opp.type?.replace(/_/g, ' ')}
                            </span>
                            <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 800, color: 'var(--success)' }}>
                                +{formatMoney(opp.impact_value)}/yr
                            </span>
                        </div>
                        <p style={{
                            fontSize: '14px', color: 'var(--text-primary-dark)', lineHeight: '1.65',
                            fontStyle: 'italic', margin: 0, fontWeight: 500,
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                            "{opp.brief_text || opp.impact_text}"
                        </p>
                    </div>
                )}

                {/* Account chips */}
                {client.accounts?.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {client.accounts.map((acc, i) => (
                            <span key={i} className="pill-badge" style={{
                                fontSize: '11px', padding: '3px 10px', fontWeight: 600,
                                backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)',
                            }}>
                                {acc.institution_name} · {formatMoney(acc.balance)}
                            </span>
                        ))}
                        {client.accounts_count > 3 && (
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary-dark)', fontWeight: 600, alignSelf: 'center' }}>
                                +{client.accounts_count - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => onSendAlert(client)}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '11px 16px', fontSize: '13px', borderRadius: '12px' }}
                    >
                        <Send size={14} /> Send Alert
                    </button>
                    <button
                        onClick={() => onViewDetail(client)}
                        className="btn btn-secondary"
                        style={{ padding: '11px 16px', fontSize: '13px', borderRadius: '12px' }}
                    >
                        <Eye size={14} /> Detail
                    </button>
                    <button
                        onClick={() => onAcknowledge(client.user_id)}
                        className="btn btn-outline"
                        style={{ padding: '11px 14px', fontSize: '13px', borderRadius: '12px', color: 'var(--text-secondary-dark)' }}
                    >
                        <CheckCircle2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};


// ── Alert Modal ──────────────────────────────────────────────

const AlertModal = ({ client, initialMessage, onSend, onClose, sending }) => {
    const oppType = client?.opportunity?.type || 'default';
    const name = client?.full_name || 'Client';
    const templateFn = ALERT_TEMPLATES[oppType] || ALERT_TEMPLATES.default;
    const [message, setMessage] = useState(initialMessage || templateFn(name));
    const TypeIcon = TYPE_ICONS[oppType] || MessageSquare;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.2s ease',
        }}>
            <div className="card" style={{
                width: '520px', padding: '36px', border: '1px solid var(--border-color)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                animation: 'slideUp 0.3s ease-out',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '16px',
                            backgroundColor: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Send size={22} color="#92400E" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.3px' }}>Alert {name}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)' }}>{client?.email}</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                        <X size={18} color="var(--text-secondary-dark)" />
                    </button>
                </div>

                {client?.opportunity && (
                    <div className="pill-badge" style={{
                        marginBottom: '20px', padding: '8px 16px', fontSize: '13px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: 'var(--bg-light)',
                    }}>
                        <TypeIcon size={14} color="var(--text-secondary-dark)" />
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary-dark)' }}>
                            {client.opportunity.type?.replace(/_/g, ' ')} · ${Number(client.opportunity.amount || 0).toLocaleString()}
                        </span>
                    </div>
                )}

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary-dark)', letterSpacing: '0.3px' }}>
                    MESSAGE
                </label>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={5}
                    className="input-field"
                    style={{ resize: 'vertical', lineHeight: '1.65', marginBottom: '24px' }}
                />

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '14px' }}>Cancel</button>
                    <button
                        onClick={() => onSend(client.user_id, message, client.full_name)}
                        disabled={sending}
                        className="btn btn-primary"
                        style={{ flex: 2, padding: '14px', borderRadius: '14px', opacity: sending ? 0.7 : 1 }}
                    >
                        {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                        {sending ? 'Sending...' : 'Send Alert'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// ── Detail Drawer ────────────────────────────────────────────

const DetailDrawer = ({ client, detail, loading, onClose }) => {
    const formatMoney = (n) => '$' + Number(n || 0).toLocaleString();

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)',
        }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                width: '540px', height: '100vh', backgroundColor: 'white',
                overflowY: 'auto', padding: '36px',
                borderLeft: '1px solid var(--border-color)',
                animation: 'drawerSlide 0.3s ease-out',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            backgroundColor: 'var(--highlight-peach)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '17px', border: '1px solid var(--border-color)',
                        }}>
                            {(client.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>{client.full_name}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)' }}>{client.email}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn btn-outline" style={{ padding: '8px', borderRadius: '10px', minWidth: 'auto' }}>
                        <X size={16} />
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <Loader2 size={32} className="spin" style={{ color: 'var(--text-secondary-dark)' }} />
                    </div>
                ) : detail ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Profile */}
                        <section>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary-dark)', letterSpacing: '0.5px', marginBottom: '10px' }}>PROFILE</div>
                            <div className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                                    {[
                                        ['Email', detail.profile?.email],
                                        ['Country', detail.profile?.country || '—'],
                                        ['Tax Bracket', detail.profile?.tax_bracket ? (detail.profile.tax_bracket * 100).toFixed(0) + '%' : '—'],
                                        ['Income', detail.profile?.monthly_income ? formatMoney(detail.profile.monthly_income) + '/mo' : '—'],
                                    ].map(([label, val], i) => (
                                        <div key={i}>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
                                            <div style={{ fontWeight: 700 }}>{val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Accounts */}
                        <section>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary-dark)', letterSpacing: '0.5px', marginBottom: '10px' }}>
                                ACCOUNTS ({detail.accounts?.length || 0})
                            </div>
                            {(detail.accounts || []).map((acc, i) => {
                                const colors = ['var(--accent-light-mint)', 'var(--accent-yellow)', 'var(--accent-lavender)', 'var(--highlight-peach)', 'var(--bg-light)'];
                                return (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                        padding: '12px 16px', backgroundColor: 'var(--bg-light)', borderRadius: '12px', marginBottom: '6px',
                                    }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: colors[i % colors.length] }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{acc.institution_name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)' }}>{acc.account_type}</div>
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '14px' }}>{formatMoney(acc.balance)}</div>
                                    </div>
                                );
                            })}
                        </section>

                        {/* Pending Opportunities */}
                        {detail.opportunities?.length > 0 && (
                            <section>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary-dark)', letterSpacing: '0.5px', marginBottom: '10px' }}>PENDING OPPORTUNITIES</div>
                                {detail.opportunities.map((opp, i) => (
                                    <div key={i} className="card" style={{ padding: '16px', marginBottom: '6px', borderColor: 'var(--accent-yellow)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: 700, fontSize: '14px' }}>{opp.title}</span>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--success)' }}>{formatMoney(opp.impact_value)}/yr</span>
                                        </div>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', fontStyle: 'italic', lineHeight: '1.5', margin: 0 }}>
                                            {opp.brief_text}
                                        </p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Recent Transactions */}
                        {detail.transactions?.length > 0 && (
                            <section>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary-dark)', letterSpacing: '0.5px', marginBottom: '10px' }}>RECENT TRANSACTIONS</div>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    {detail.transactions.slice(0, 10).map((txn, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', padding: '10px 16px',
                                            borderBottom: i < 9 ? '1px solid var(--border-color)' : 'none', fontSize: '13px',
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{txn.name}</div>
                                                <div style={{ color: 'var(--text-secondary-dark)', fontSize: '11px' }}>{txn.date}</div>
                                            </div>
                                            <div style={{ fontWeight: 700, color: txn.amount > 0 ? 'var(--danger)' : 'var(--success)' }}>
                                                {txn.amount > 0 ? '-' : '+'}{formatMoney(Math.abs(txn.amount))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Past Alerts */}
                        {detail.alerts?.length > 0 && (
                            <section>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary-dark)', letterSpacing: '0.5px', marginBottom: '10px' }}>ALERTS SENT</div>
                                {detail.alerts.map((alert, i) => (
                                    <div key={i} style={{
                                        padding: '14px 16px', backgroundColor: 'var(--accent-lavender)', borderRadius: '12px',
                                        marginBottom: '6px', border: '1px solid #D8D0EE',
                                    }}>
                                        <p style={{ fontSize: '13px', color: '#3730A3', fontWeight: 600, lineHeight: '1.5', margin: 0 }}>{alert.message}</p>
                                        <div style={{ fontSize: '11px', color: '#6D54B5', marginTop: '6px', fontWeight: 500 }}>
                                            {new Date(alert.sent_at || alert.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};


// ── Sub-Views ────────────────────────────────────────────────

const HealthProgress = ({ score, color }) => {
    const [width, setWidth] = useState(0);
    useEffect(() => { setTimeout(() => setWidth(score), 100); }, [score]);
    return (
        <div style={{ width: '150px', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
                height: '100%', borderRadius: '999px', backgroundColor: color,
                width: `${width}%`, transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
        </div>
    );
};

const NumberCounter = ({ value }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 800;
        const stepTime = Math.abs(Math.floor(duration / (value || 1)));
        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= value) clearInterval(timer);
        }, stepTime);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{count}</span>;
};

const HealthScoresView = ({ data, loading, onSendAlert, onViewDetail }) => {
    const [expandedIds, setExpandedIds] = useState(new Set());
    const toggle = (id) => setExpandedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

    if (loading) return (
        <div>
            <div className='animate-pulse' style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ height: '40px', width: '30%', backgroundColor: 'var(--border-color)', borderRadius: '8px' }} />
            </div>
            {[1, 2, 3].map(i => (
                <div key={i} className='animate-pulse card' style={{ height: '80px', marginBottom: '16px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)' }} />
            ))}
        </div>
    );

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '36px', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '6px' }}>Client Health Scores</h1>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', fontWeight: 500 }}>
                        Real-time financial health 0–100 calculated from connected accounts and actions.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="pill-badge" style={{ backgroundColor: '#FEF2F2', color: 'var(--danger)', fontWeight: 700 }}>🔴 {data.critical_count} Critical</div>
                    <div className="pill-badge" style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontWeight: 700 }}>🟡 {data.at_risk_count} At Risk</div>
                    <div className="pill-badge" style={{ backgroundColor: '#F0FDF9', color: 'var(--success)', fontWeight: 700 }}>🟢 {data.healthy_count} Healthy</div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.clients.map((client, i) => {
                    const isCrit = client.tier === 'critical';
                    const isRisk = client.tier === 'at_risk';
                    const color = isCrit ? 'var(--danger)' : isRisk ? 'var(--warning)' : 'var(--success)';
                    const expanded = expandedIds.has(client.user_id);

                    return (
                        <div key={client.user_id} className="card" style={{ padding: 0, animation: `cardEnter 0.4s ease-out ${i * 0.05}s both` }}>
                            <div
                                onClick={() => toggle(client.user_id)}
                                style={{ display: 'flex', alignItems: 'center', padding: '24px', cursor: 'pointer' }}
                            >
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        backgroundColor: `var(--bg-light)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: '15px', border: `1px solid var(--border-color)`,
                                    }}>
                                        {(client.full_name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '16px' }}>{client.full_name}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)' }}>{client.email}</div>
                                    </div>
                                </div>

                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <HealthProgress score={client.total} color={color} />
                                    <span style={{ fontWeight: 800, fontSize: '16px', color, width: '60px' }}>{client.total}/100</span>
                                </div>

                                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
                                    {(isCrit || isRisk) && (
                                        <button onClick={(e) => { e.stopPropagation(); onSendAlert(client); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                                            Alert
                                        </button>
                                    )}
                                    <button onClick={(e) => { e.stopPropagation(); onViewDetail(client); }} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>
                                        View
                                    </button>
                                    {expanded ? <ChevronDown size={20} color="var(--text-secondary-dark)" /> : <ChevronRight size={20} color="var(--text-secondary-dark)" />}
                                </div>
                            </div>

                            {/* Expanded Breakdown */}
                            {expanded && (
                                <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)', animation: 'fadeIn 0.2s ease' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', paddingTop: '20px' }}>
                                        {[
                                            { key: 'emergency_fund', label: 'Emergency Fund' },
                                            { key: 'no_debt', label: 'No CC Debt' },
                                            { key: 'investing', label: 'Active Actions' },
                                            { key: 'spending', label: 'Spend Rule' },
                                            { key: 'salary', label: 'Salary History' }
                                        ].map(col => {
                                            const b = client.breakdown[col.key];
                                            const isPass = b.score >= 14;
                                            return (
                                                <div key={col.key}>
                                                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary-dark)', letterSpacing: '0.3px', marginBottom: '8px' }}>
                                                        {col.label}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                                        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${(b.score / 20) * 100}%`, height: '100%', backgroundColor: isPass ? 'var(--success)' : 'var(--danger)', borderRadius: '999px' }} />
                                                        </div>
                                                        <span style={{ fontSize: '12px', fontWeight: 800, color: isPass ? 'var(--success)' : 'var(--danger)' }}>{b.score}/20</span>
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)', lineHeight: '1.4' }}>{b.reason}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const DormantView = ({ data, loading, onSend, dismissingIds, onDismiss, onEdit }) => {
    if (loading) return (
        <div>
            <div className='animate-pulse card' style={{ height: '220px', marginBottom: '16px', backgroundColor: 'var(--bg-light)' }} />
            <div className='animate-pulse card' style={{ height: '220px', backgroundColor: 'var(--bg-light)' }} />
        </div>
    );

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: '36px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '6px' }}>Dormant Reactivation</h1>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', fontWeight: 500 }}>
                    Clients inactive for 60+ days but have balances and pending opportunities.
                </p>
            </div>

            {data.clients.length === 0 ? (
                <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#F0FDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <CheckCircle2 size={32} color="var(--success)" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>All Clients Engaged</h3>
                    <p style={{ color: 'var(--text-secondary-dark)' }}>No dormant clients found matching the criteria.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: '20px' }}>
                    {data.clients.map((client, i) => (
                        <div key={client.user_id} className="card" style={{
                            padding: '28px',
                            opacity: dismissingIds.has(client.user_id) ? 0 : 1,
                            transform: dismissingIds.has(client.user_id) ? 'scale(0.96) translateX(40px)' : 'none',
                            transition: 'all 0.3s ease',
                            animation: `cardEnter 0.4s ease-out ${i * 0.05}s both`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.3px', marginBottom: '2px' }}>{client.full_name}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)' }}>{client.email}</div>
                                </div>
                                <div className="pill-badge" style={{ backgroundColor: '#FEF2F2', color: 'var(--danger)', fontWeight: 700, borderColor: '#FECACA' }}>
                                    {client.days_inactive} days inactive
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-light)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary-dark)', fontWeight: 700, letterSpacing: '0.3px', marginBottom: '4px' }}>BALANCE</div>
                                    <div style={{ fontWeight: 800, fontSize: '16px' }}>${client.total_balance.toLocaleString()}</div>
                                </div>
                                <div style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-light)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary-dark)', fontWeight: 700, letterSpacing: '0.3px', marginBottom: '4px' }}>OPPORTUNITIES</div>
                                    <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--accent-yellow)' }}>{client.pending_count} waiting</div>
                                </div>
                            </div>

                            <div style={{
                                padding: '16px', backgroundColor: '#FFFBEB', borderLeft: '4px solid #F59E0B',
                                borderRadius: '0 12px 12px 0', marginBottom: '24px'
                            }}>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', marginBottom: '8px', letterSpacing: '0.5px' }}>AI SUGGESTED MESSAGE</div>
                                <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#92400E', lineHeight: '1.6' }}>
                                    "{client.ai_message}"
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => onSend(client, client.ai_message)} className="btn btn-primary" style={{ flex: 2, padding: '12px', fontSize: '13px' }}>
                                    Send this
                                </button>
                                <button onClick={() => onEdit(client)} className="btn btn-outline" style={{ flex: 1, padding: '12px', fontSize: '13px' }}>
                                    <Pencil size={14} style={{ marginRight: '6px' }} /> Edit
                                </button>
                                <button onClick={() => onDismiss(client.user_id)} className="btn btn-secondary" style={{ padding: '12px', fontSize: '13px', backgroundColor: 'transparent', border: 'none' }}>
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const EngagementView = ({ data, loading }) => {
    if (loading) return (
        <div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                {[1, 2, 3, 4].map(i => <div key={i} className='animate-pulse card' style={{ height: '100px', flex: 1, backgroundColor: 'var(--bg-light)' }} />)}
            </div>
            <div className='animate-pulse card' style={{ height: '300px', backgroundColor: 'var(--bg-light)' }} />
        </div>
    );

    const s = data.summary || {};
    const needsTouch = data.clients.filter(c => c.tier === 'zero' || c.tier === 'low');
    const rest = data.clients.filter(c => c.tier === 'medium' || c.tier === 'high');

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: '36px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '6px' }}>Engagement Analytics</h1>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', fontWeight: 500 }}>
                    Track opportunity approval rates and measure client trust.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '48px' }}>
                {[
                    { label: 'Champions', count: s.champion || 0, icon: Trophy, color: 'var(--success)' },
                    { label: 'Engaged', count: s.engaged || 0, icon: UserCheck, color: 'var(--text-primary-dark)' },
                    { label: 'Disengaged', count: s.disengaged || 0, icon: Hand, color: 'var(--warning)' },
                    { label: 'Never Acted', count: s.zero || 0, icon: AlertTriangle, color: 'var(--danger)' }
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '24px', textAlign: 'center', animation: `cardEnter 0.4s ease-out ${i * 0.05}s both` }}>
                        <stat.icon size={28} color={stat.color} style={{ margin: '0 auto 16px' }} />
                        <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1.5px', color: stat.color, marginBottom: '4px' }}>
                            <NumberCounter value={stat.count} />
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary-dark)' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {needsTouch.length > 0 && (
                <div style={{ marginBottom: '48px', animation: 'fadeIn 0.5s ease 0.2s both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-color)', flex: 1 }} />
                        <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: 'var(--danger)', padding: '0 16px' }}>NEEDS HUMAN TOUCH</span>
                        <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-color)', flex: 1 }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
                        {needsTouch.map((client, i) => (
                            <div key={client.user_id} className="card" style={{ padding: '24px', animation: `cardEnter 0.4s ease-out ${i * 0.05}s both` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '2px' }}>{client.full_name}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)' }}>{client.email}</div>
                                    </div>
                                    <div className="pill-badge" style={{ backgroundColor: '#FEF2F2', color: 'var(--danger)', border: '1px solid #FECACA' }}>
                                        {client.tier === 'zero' ? 'Never Acted' : 'Disengaged'}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-light)', borderRadius: '999px', overflow: 'hidden' }}>
                                        <div style={{ width: `${client.rate}%`, height: '100%', backgroundColor: 'var(--danger)' }} />
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap' }}>{client.approved}/{client.total_opps} approved</span>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-light)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary-dark)' }}>Value left on table:</span> ${client.missed_val.toLocaleString()}/year
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', lineHeight: '1.4' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary-dark)' }}>Last skipped:</span> "{client.last_skipped_title}" — {client.last_skipped_days} days ago
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '12px' }} onClick={() => setAlertClient(client)}>
                                        Send message
                                    </button>
                                    <button className="btn btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '12px' }} onClick={() => handleViewDetail(client)}>View detail</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ animation: 'fadeIn 0.5s ease 0.3s both' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>All Clients</h3>
                <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary-dark)', letterSpacing: '0.5px' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 800 }}>CLIENT</th>
                                <th style={{ padding: '16px 24px', fontWeight: 800 }}>APPROVAL RATE</th>
                                <th style={{ padding: '16px 24px', fontWeight: 800 }}>APPROVED / SKIP</th>
                                <th style={{ padding: '16px 24px', fontWeight: 800 }}>TIER</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.clients.map((c, i) => (
                                <tr key={c.user_id} style={{ borderBottom: i < data.clients.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{c.full_name}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '120px' }}>
                                            <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--bg-light)', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{ width: `${c.rate}%`, height: '100%', backgroundColor: c.rate >= 60 ? 'var(--success)' : c.rate >= 30 ? 'var(--text-primary-dark)' : 'var(--danger)' }} />
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: 800 }}>{c.rate}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary-dark)' }}>{c.approved} / {c.skipped}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span className="pill-badge" style={{
                                            fontSize: '11px',
                                            backgroundColor: c.rate >= 60 ? '#F0FDF9' : c.rate >= 30 ? 'var(--bg-light)' : '#FEF2F2',
                                            color: c.rate >= 60 ? 'var(--success)' : c.rate >= 30 ? 'var(--text-primary-dark)' : 'var(--danger)'
                                        }}>
                                            {c.tier.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// ── Main Advisor Dashboard ───────────────────────────────────

const AdvisorDashboard = () => {
    const { authFetch, user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [clients, setClients] = useState([]);
    const [urgentClients, setUrgentClients] = useState([]);
    const [highClients, setHighClients] = useState([]);
    const [okCount, setOkCount] = useState(0);
    const [activeTab, setActiveTab] = useState('triage');

    // New API States
    const [healthData, setHealthData] = useState({ clients: [], critical_count: 0, at_risk_count: 0, healthy_count: 0 });
    const [healthLoading, setHealthLoading] = useState(false);
    const [expandedHealthId, setExpandedHealthId] = useState(null);

    const [dormantData, setDormantData] = useState({ clients: [], total_dormant: 0 });
    const [dormantLoading, setDormantLoading] = useState(false);
    const [editDormantClient, setEditDormantClient] = useState(null);
    const [editMessageText, setEditMessageText] = useState('');

    const [engagementData, setEngagementData] = useState({ clients: [], summary: {} });
    const [engagementLoading, setEngagementLoading] = useState(false);
    const [engagedNavFetched, setEngagedNavFetched] = useState(false);

    const [alertClient, setAlertClient] = useState(null);
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState('');

    const [detailClient, setDetailClient] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [fadingIds, setFadingIds] = useState(new Set());
    const [alertHistory, setAlertHistory] = useState([]);
    const [alertHistoryLoading, setAlertHistoryLoading] = useState(false);

    useEffect(() => { checkRoleAndLoad(); }, []);

    const checkRoleAndLoad = async () => {
        try {
            const meRes = await authFetch('/auth/me');
            if (meRes.ok) {
                const me = await meRes.json();
                if (me.role !== 'advisor') { navigate('/dashboard'); return; }
            } else { navigate('/login'); return; }

            const res = await authFetch('/advisor/clients');
            if (res.ok) {
                const data = await res.json();
                setClients(data.clients || []);
                setUrgentClients(data.clients?.filter(c => c.risk_level === 'urgent') || []);
                setHighClients(data.clients?.filter(c => c.risk_level === 'high') || []);
                setOkCount(data.ok_count || 0);

                // Fetch initial tab data for badges quietly
                authFetch('/advisor/clients/health').then(r => r.json()).then(setHealthData).catch(console.error);
                authFetch('/advisor/clients/dormant').then(r => r.json()).then(setDormantData).catch(console.error);
                authFetch('/advisor/clients/engagement').then(r => r.json()).then(setEngagementData).catch(console.error);
            } else if (res.status === 403) { navigate('/dashboard'); }
            else { setError('Failed to load clients'); }
        } catch (err) { setError('Connection error'); console.error(err); }
        finally { setLoading(false); }
    };

    const handleSendAlert = async (userId, message, clientName) => {
        setSending(true);
        try {
            const res = await authFetch(`/advisor/clients/${userId}/alert`, {
                method: 'POST', body: JSON.stringify({ message }),
            });
            if (res.ok) {
                setToast(`Alert sent to ${clientName || alertClient?.full_name || 'client'}`);
                setTimeout(() => setToast(''), 4000);
                setAlertClient(null);
                setEditDormantClient(null);
            }
        } catch (err) { console.error(err); }
        finally { setSending(false); }
    };

    const handleViewDetail = async (client) => {
        setDetailClient(client);
        setDetailLoading(true);
        try {
            const res = await authFetch(`/advisor/clients/${client.user_id}/detail`);
            if (res.ok) setDetail(await res.json());
        } catch (err) { console.error(err); }
        finally { setDetailLoading(false); }
    };

    const handleAcknowledge = (userId) => {
        setFadingIds(prev => new Set([...prev, userId]));
        setTimeout(() => {
            setUrgentClients(prev => prev.filter(c => c.user_id !== userId));
            setHighClients(prev => prev.filter(c => c.user_id !== userId));
            setOkCount(prev => prev + 1);
            setFadingIds(prev => { const n = new Set(prev); n.delete(userId); return n; });
        }, 400);
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const totalAlertable = urgentClients.length + highClients.length;

    const loadAlertHistory = async () => {
        setAlertHistoryLoading(true);
        try {
            // Fetch alerts for each client
            const allAlerts = [];
            for (const client of clients) {
                const res = await authFetch(`/advisor/clients/${client.user_id}/detail`);
                if (res.ok) {
                    const data = await res.json();
                    (data.alerts || []).forEach(a => allAlerts.push({ ...a, client_name: client.full_name, client_email: client.email }));
                }
            }
            allAlerts.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
            setAlertHistory(allAlerts);
        } catch (err) { console.error(err); }
        finally { setAlertHistoryLoading(false); }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'history' && alertHistory.length === 0) loadAlertHistory();

        // Manual retry fetch if empty
        if (tab === 'health' && healthData.clients.length === 0) {
            setHealthLoading(true);
            authFetch('/advisor/clients/health').then(r => r.json()).then(setHealthData).finally(() => setHealthLoading(false));
        }
        if (tab === 'dormant' && dormantData.clients.length === 0) {
            setDormantLoading(true);
            authFetch('/advisor/clients/dormant').then(r => r.json()).then(setDormantData).finally(() => setDormantLoading(false));
        }
        if (tab === 'engagement' && engagementData.clients.length === 0 && !engagedNavFetched) {
            setEngagementLoading(true);
            setEngagedNavFetched(true);
            authFetch('/advisor/clients/engagement').then(r => r.json()).then(setEngagementData).finally(() => setEngagementLoading(false));
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={40} className="spin" style={{ color: 'var(--text-secondary-dark)', marginBottom: '16px' }} />
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary-dark)' }}>Loading advisor dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>

            {/* Sidebar */}
            <aside style={{
                width: '280px', position: 'fixed', top: 0, left: 0, height: '100vh',
                backgroundColor: 'var(--bg-light)', borderRight: '1px solid var(--border-color)',
                display: 'flex', flexDirection: 'column', zIndex: 10,
            }}>
                {/* Logo */}
                <div style={{ padding: '32px 32px 40px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: 'var(--text-primary-dark)' }}>
                    <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px' }} />
                    FINISHLINE
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary-dark)', letterSpacing: '0.5px', padding: '0 16px 8px', marginTop: '8px' }}>
                        ADVISOR PANEL
                    </div>
                    {[
                        { key: 'triage', label: 'Risk Overview', icon: Users, badge: totalAlertable > 0 ? totalAlertable : null },
                        { key: 'health', label: 'Health Scores', icon: Activity, badge: healthData.critical_count > 0 ? healthData.critical_count : null },
                        { key: 'dormant', label: 'Dormant', icon: Clock, badge: dormantData.total_dormant > 0 ? dormantData.total_dormant : null },
                        { key: 'engagement', label: 'Engagement', icon: BarChart3, badge: (engagementData.summary?.zero || 0) + (engagementData.summary?.disengaged || 0) > 0 ? ((engagementData.summary.zero || 0) + (engagementData.summary.disengaged || 0)) : null },
                        { key: 'history', label: 'Alert History', icon: Bell },
                    ].map((item) => {
                        const isActive = activeTab === item.key;
                        return (
                            <div key={item.key} onClick={() => handleTabChange(item.key)} style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                                borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                                backgroundColor: isActive ? 'white' : 'transparent',
                                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                                color: isActive ? 'var(--text-primary-dark)' : 'var(--text-secondary-dark)',
                                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.02)' : 'none',
                                transition: 'all 0.2s',
                            }}>
                                <item.icon size={20} />
                                {item.label}
                                {item.badge && (
                                    <span style={{
                                        marginLeft: 'auto', padding: '2px 9px', borderRadius: '999px',
                                        backgroundColor: 'var(--danger)', color: 'white', fontSize: '12px', fontWeight: 800,
                                    }}>
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* User Footer */}
                <div style={{ padding: '28px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: 'var(--accent-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '15px', border: '1px solid var(--border-color)',
                        }}>
                            {(user?.full_name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '14px' }}>{user?.full_name || 'Advisor'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary-dark)' }}>Licensed Advisor</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '12px' }}>
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '280px', padding: '36px 48px' }}>

                {/* ═══ TAB: Client Triage ═══ */}
                {activeTab === 'triage' && (
                    <div key="triage" style={{ animation: 'fadeIn 0.3s ease' }}>
                        {/* Page Header */}
                        <div style={{ marginBottom: '36px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '6px' }}>Client Triage</h1>
                                    <p style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', fontWeight: 500 }}>
                                        AI-flagged clients sorted by risk — review, alert, or acknowledge.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                            {[
                                { label: 'Urgent', value: urgentClients.length, icon: AlertTriangle, accent: 'var(--danger)', bg: '#FEE2E2' },
                                { label: 'High Risk', value: highClients.length, icon: Shield, accent: 'var(--warning)', bg: 'var(--accent-yellow)' },
                                { label: 'All Clear', value: okCount, icon: CheckCircle2, accent: 'var(--success)', bg: 'var(--accent-light-mint)' },
                                { label: 'Total Monitored', value: clients.length, icon: Activity, accent: 'var(--text-secondary-dark)', bg: 'var(--bg-light)' },
                            ].map((stat, i) => (
                                <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', animation: `cardEnter 0.4s ease-out ${i * 0.06}s both` }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <stat.icon size={22} color={stat.accent} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-1px', color: stat.accent }}>{stat.value}</div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary-dark)' }}>{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="card" style={{ padding: '16px 24px', borderColor: 'var(--danger)', marginBottom: '24px', backgroundColor: '#FEF2F2' }}>
                                <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '14px' }}>{error}</span>
                            </div>
                        )}

                        {/* Urgent Section */}
                        {urgentClients.length > 0 && (
                            <section style={{ marginBottom: '40px', animation: 'fadeIn 0.5s ease 0.2s both' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                    <AlertTriangle size={18} color="var(--danger)" />
                                    <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>Immediate Attention</h2>
                                    <span className="pill-badge" style={{ marginLeft: '8px', backgroundColor: '#FEE2E2', color: 'var(--danger)', border: '1px solid #FECACA', fontSize: '13px' }}>
                                        {urgentClients.length} client{urgentClients.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
                                    {urgentClients.map((client, i) => (
                                        <ClientCard key={client.user_id} client={client} index={i} risk="urgent"
                                            fading={fadingIds.has(client.user_id)} onSendAlert={setAlertClient}
                                            onViewDetail={handleViewDetail} onAcknowledge={handleAcknowledge} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* High Risk Section */}
                        {highClients.length > 0 && (
                            <section style={{ marginBottom: '40px', animation: 'fadeIn 0.5s ease 0.3s both' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                    <Shield size={18} color="var(--warning)" />
                                    <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>Review This Week</h2>
                                    <span className="pill-badge" style={{ marginLeft: '8px', backgroundColor: 'var(--accent-yellow)', color: '#D97706', border: '1px solid #FDE68A', fontSize: '13px' }}>
                                        {highClients.length} client{highClients.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
                                    {highClients.map((client, i) => (
                                        <ClientCard key={client.user_id} client={client} index={i} risk="high"
                                            fading={fadingIds.has(client.user_id)} onSendAlert={setAlertClient}
                                            onViewDetail={handleViewDetail} onAcknowledge={handleAcknowledge} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* All Clear */}
                        <div className="card" style={{
                            padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '16px',
                            borderColor: '#A7F3D0', backgroundColor: '#F0FDF9',
                        }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: 'var(--accent-light-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <CheckCircle2 size={22} color="var(--success)" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '16px', color: '#065F46' }}>All Clear</div>
                                <div style={{ fontSize: '14px', color: '#047857', fontWeight: 500 }}>
                                    AI is monitoring {okCount} client{okCount !== 1 ? 's' : ''} — no action needed at this time.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ TAB: Alert History ═══ */}
                {activeTab === 'history' && (
                    <div key="history" style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ marginBottom: '36px' }}>
                            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '6px' }}>Alert History</h1>
                            <p style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', fontWeight: 500 }}>
                                All messages sent to clients — sorted by most recent.
                            </p>
                        </div>

                        {alertHistoryLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                                <Loader2 size={32} className="spin" style={{ color: 'var(--text-secondary-dark)' }} />
                            </div>
                        ) : alertHistory.length === 0 ? (
                            <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
                                <Bell size={48} style={{ color: 'var(--text-secondary-dark)', marginBottom: '16px' }} />
                                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No alerts sent yet</h3>
                                <p style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', maxWidth: '360px', margin: '0 auto' }}>
                                    Go to Client Triage and send your first alert to a flagged client.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {alertHistory.map((alert, i) => (
                                    <div key={alert.id || i} className="card" style={{ padding: '20px 24px', display: 'flex', gap: '16px', animation: `cardEnter 0.3s ease-out ${i * 0.04}s both` }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--accent-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Send size={16} color="#6D28D9" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                <span style={{ fontWeight: 800, fontSize: '15px' }}>To: {alert.client_name || 'Client'}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary-dark)', fontWeight: 500 }}>
                                                    {new Date(alert.sent_at).toLocaleDateString()} at {new Date(alert.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', lineHeight: '1.6', margin: 0 }}>
                                                {alert.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ TAB: Health Scores ═══ */}
                {activeTab === 'health' && (
                    <HealthScoresView data={healthData} loading={healthLoading} onSendAlert={setAlertClient} onViewDetail={handleViewDetail} />
                )}

                {/* ═══ TAB: Dormant ═══ */}
                {activeTab === 'dormant' && (
                    <DormantView
                        data={dormantData}
                        loading={dormantLoading}
                        dismissingIds={fadingIds}
                        onDismiss={(id) => {
                            setFadingIds(prev => new Set([...prev, id]));
                            setTimeout(() => {
                                setDormantData(d => ({ ...d, clients: d.clients.filter(c => c.user_id !== id), total_dormant: d.total_dormant - 1 }));
                                setFadingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
                            }, 300);
                        }}
                        onSend={(client, msg) => {
                            setAlertClient(client);
                            // We use the alert modal directly. Since the component opens AlertModal internally we can pre-populate if needed,
                            // but AlertModal pulls from template by default unless we pass it specifically.
                            // We will simply populate standard AlertModal with the dormant message.
                        }}
                        onEdit={(client) => {
                            setEditDormantClient(client);
                            setEditMessageText(client.ai_message);
                        }}
                    />
                )}

                {/* ═══ TAB: Engagement ═══ */}
                {activeTab === 'engagement' && (
                    <EngagementView data={engagementData} loading={engagementLoading} />
                )}

            </main>

            {/* Modals */}
            {alertClient && <AlertModal client={alertClient} onSend={handleSendAlert} onClose={() => setAlertClient(null)} sending={sending} />}
            {editDormantClient && <AlertModal client={editDormantClient} initialMessage={editMessageText} onSend={handleSendAlert} onClose={() => setEditDormantClient(null)} sending={sending} />}
            {detailClient && <DetailDrawer client={detailClient} detail={detail} loading={detailLoading} onClose={() => { setDetailClient(null); setDetail(null); }} />}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
                    padding: '14px 28px', borderRadius: '999px',
                    backgroundColor: 'var(--bg-dark)', color: 'white',
                    fontWeight: 700, fontSize: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    zIndex: 99999, display: 'flex', alignItems: 'center', gap: '10px',
                    animation: 'slideUp 0.3s ease-out',
                }}>
                    <CheckCircle2 size={16} color="var(--success)" /> {toast}
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
                @keyframes cardEnter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes drawerSlide { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `}</style>
        </div>
    );
};

export default AdvisorDashboard;
