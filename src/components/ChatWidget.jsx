import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, CheckCircle2, AlertTriangle, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SUGGESTED_PROMPTS = [
    'How much TFSA room do I have?',
    'Should I buy NVDA?',
    'Move $500 to my TFSA',
    'I want to talk to a human advisor',
];

const ChatWidget = () => {
    const { authFetch } = useAuth();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [actionMsgIdx, setActionMsgIdx] = useState(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const sendMessage = async (text) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;
        setInput('');

        const userMsg = { role: 'user', content: msg, type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await authFetch('/chat', {
                method: 'POST',
                body: JSON.stringify({ message: msg }),
            });
            const data = await res.json();

            if (data.escalated) {
                setMessages(prev => [...prev, {
                    role: 'assistant', content: data.response, type: 'escalation',
                }]);
            } else if (data.is_action) {
                const idx = messages.length + 1; // +1 for user msg just added
                setPendingAction(data.pending_action);
                setActionMsgIdx(idx);
                setMessages(prev => [...prev, {
                    role: 'assistant', content: data.response, type: 'action',
                    pending_action: data.pending_action,
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant', content: data.response, type: 'text',
                }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant', content: 'Connection error — please try again.', type: 'error',
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleExecute = async () => {
        if (!pendingAction) return;
        setLoading(true);
        try {
            const res = await authFetch('/chat/execute', {
                method: 'POST',
                body: JSON.stringify(pendingAction),
            });
            const data = await res.json();
            if (data.executed) {
                setMessages(prev => {
                    const updated = [...prev];
                    // Mark the action message as resolved
                    if (actionMsgIdx !== null && updated[actionMsgIdx]) {
                        updated[actionMsgIdx] = { ...updated[actionMsgIdx], type: 'text', resolved: true };
                    }
                    return [...updated, { role: 'assistant', content: data.message, type: 'success' }];
                });
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.detail || 'Execution failed.', type: 'error' }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Execution error — please try again.', type: 'error' }]);
        } finally {
            setPendingAction(null);
            setActionMsgIdx(null);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setMessages(prev => {
            const updated = [...prev];
            if (actionMsgIdx !== null && updated[actionMsgIdx]) {
                updated[actionMsgIdx] = { ...updated[actionMsgIdx], type: 'text', resolved: true };
            }
            return [...updated, { role: 'assistant', content: 'Okay, cancelled.', type: 'text' }];
        });
        setPendingAction(null);
        setActionMsgIdx(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!open && (
                <button
                    id="chat-toggle"
                    onClick={() => setOpen(true)}
                    style={{
                        position: 'fixed', bottom: '28px', right: '28px', zIndex: 9990,
                        width: '60px', height: '60px', borderRadius: '50%',
                        backgroundColor: 'var(--bg-dark)', color: 'white', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.target.style.transform = 'scale(1.08)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Chat Panel */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: '28px', right: '28px', zIndex: 9990,
                    width: '400px', height: '600px', maxHeight: 'calc(100vh - 60px)',
                    backgroundColor: 'white', borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: 'chatPanelIn 0.3s ease-out',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px 24px', borderBottom: '1px solid var(--border-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        backgroundColor: 'var(--bg-dark)', color: 'white',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #34D399, #60A5FA)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Bot size={18} color="white" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.3px' }}>FinishLine AI</div>
                                <div style={{ fontSize: '11px', opacity: 0.7, fontWeight: 500 }}>Your personal CFO</div>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} style={{
                            border: 'none', background: 'rgba(255,255,255,0.1)', cursor: 'pointer',
                            padding: '8px', borderRadius: '10px', color: 'white', display: 'flex',
                        }}>
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '20px',
                        display: 'flex', flexDirection: 'column', gap: '12px',
                        backgroundColor: '#FAFAFA',
                    }}>
                        {/* Empty state */}
                        {messages.length === 0 && !loading && (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '18px',
                                    background: 'linear-gradient(135deg, var(--accent-light-mint), var(--accent-lavender))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Bot size={28} color="#3730A3" />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 800, fontSize: '17px', marginBottom: '6px', letterSpacing: '-0.3px' }}>Ask me anything</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', fontWeight: 500 }}>
                                        I know your accounts, balances, and tax rules.
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(prompt)}
                                            style={{
                                                padding: '12px 16px', borderRadius: '12px',
                                                border: '1px solid var(--border-color)',
                                                backgroundColor: 'white', cursor: 'pointer',
                                                fontSize: '13px', fontWeight: 600, textAlign: 'left',
                                                color: 'var(--text-primary-dark)',
                                                transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={e => { e.target.style.backgroundColor = 'var(--bg-light)'; e.target.style.borderColor = 'var(--text-secondary-dark)'; }}
                                            onMouseLeave={e => { e.target.style.backgroundColor = 'white'; e.target.style.borderColor = 'var(--border-color)'; }}
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Message bubbles */}
                        {messages.map((msg, i) => {
                            const isUser = msg.role === 'user';
                            const isAction = msg.type === 'action' && !msg.resolved;
                            const isEscalation = msg.type === 'escalation';
                            const isSuccess = msg.type === 'success';

                            return (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
                                    animation: 'chatMsgIn 0.25s ease-out',
                                }}>
                                    <div style={{
                                        maxWidth: '85%', padding: '12px 16px', borderRadius: '16px',
                                        fontSize: '14px', lineHeight: '1.5', fontWeight: 500,
                                        ...(isUser ? {
                                            backgroundColor: 'var(--bg-dark)', color: 'white',
                                            borderBottomRightRadius: '4px',
                                        } : isEscalation ? {
                                            backgroundColor: '#FEF3C7', color: '#92400E',
                                            border: '1px solid #FDE68A', borderBottomLeftRadius: '4px',
                                        } : isSuccess ? {
                                            backgroundColor: '#D1FAE5', color: '#065F46',
                                            border: '1px solid #A7F3D0', borderBottomLeftRadius: '4px',
                                        } : isAction ? {
                                            backgroundColor: 'white', color: 'var(--text-primary-dark)',
                                            border: '1px solid var(--border-color)', borderBottomLeftRadius: '4px',
                                        } : {
                                            backgroundColor: 'white', color: 'var(--text-primary-dark)',
                                            border: '1px solid var(--border-color)', borderBottomLeftRadius: '4px',
                                        }),
                                    }}>
                                        {isEscalation && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.3px' }}>
                                                <AlertTriangle size={14} /> ADVISOR ESCALATION
                                            </div>
                                        )}
                                        {isSuccess && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.3px' }}>
                                                <CheckCircle2 size={14} /> EXECUTED
                                            </div>
                                        )}
                                        {msg.content}

                                        {/* Action buttons */}
                                        {isAction && pendingAction && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                                <button
                                                    onClick={handleExecute}
                                                    disabled={loading}
                                                    style={{
                                                        flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                                                        backgroundColor: '#059669', color: 'white', fontWeight: 700,
                                                        fontSize: '13px', cursor: 'pointer', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                    }}
                                                >
                                                    {loading ? <Loader2 size={14} className="spin" /> : <CheckCircle2 size={14} />}
                                                    Yes, do it
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    style={{
                                                        flex: 1, padding: '10px', borderRadius: '10px',
                                                        border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2',
                                                        color: '#DC2626', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                                                    }}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing indicator */}
                        {loading && !pendingAction && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    padding: '14px 18px', borderRadius: '16px 16px 16px 4px',
                                    backgroundColor: 'white', border: '1px solid var(--border-color)',
                                    display: 'flex', gap: '4px', alignItems: 'center',
                                }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{
                                            width: '7px', height: '7px', borderRadius: '50%',
                                            backgroundColor: 'var(--text-secondary-dark)',
                                            animation: `typingDot 1.2s ease-in-out ${i * 0.15}s infinite`,
                                        }} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '16px 20px', borderTop: '1px solid var(--border-color)',
                        backgroundColor: 'white', display: 'flex', gap: '10px',
                    }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything financial..."
                            disabled={loading}
                            className="input-field"
                            style={{ flex: 1, padding: '12px 16px', fontSize: '14px', borderRadius: '12px' }}
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || loading}
                            style={{
                                width: '44px', height: '44px', borderRadius: '12px', border: 'none',
                                backgroundColor: input.trim() ? 'var(--bg-dark)' : 'var(--bg-light)',
                                color: input.trim() ? 'white' : 'var(--text-secondary-dark)',
                                cursor: input.trim() ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.15s',
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes chatPanelIn {
                    from { opacity: 0; transform: translateY(16px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes chatMsgIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-4px); opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default ChatWidget;
