import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, CheckCircle2, Loader2, ArrowRight, Lock, Banknote } from 'lucide-react';

/**
 * ExecutionModal — Multi-step approval flow
 * Step 1: Confirmation with details
 * Step 2: OTP verification (simulated)
 * Step 3: Processing animation
 * Step 4: Success receipt
 */
const ExecutionModal = ({ opportunity, onComplete, onClose }) => {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [processingPhase, setProcessingPhase] = useState(0);
    const inputRefs = useRef([]);

    const formatMoney = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const processingSteps = [
        'Verifying identity...',
        'Connecting to institution...',
        'Initiating transfer...',
        'Confirming allocation...',
        'Transaction recorded ✓',
    ];

    // OTP auto-focus and handling
    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Auto-fill OTP after 2 seconds (simulating SMS)
    useEffect(() => {
        if (step === 2) {
            const timer = setTimeout(() => {
                setOtp(['4', '8', '2', '9', '1', '5']);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Processing animation
    useEffect(() => {
        if (step === 3) {
            const interval = setInterval(() => {
                setProcessingPhase(prev => {
                    if (prev >= processingSteps.length - 1) {
                        clearInterval(interval);
                        setTimeout(() => setStep(4), 600);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 800);
            return () => clearInterval(interval);
        }
    }, [step]);

    const handleVerifyOtp = () => {
        const code = otp.join('');
        if (code.length < 6) {
            setOtpError('Enter all 6 digits');
            return;
        }
        // Any 6-digit code works in sandbox
        setStep(3);
    };

    const handleConfirm = () => {
        setStep(2);
    };

    const handleDone = () => {
        onComplete(opportunity.id);
    };

    const opp = opportunity;
    const typeLabel = (opp.type || '').replace(/_/g, ' ');

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            animation: 'modalFadeIn 0.3s ease-out',
        }}>
            <div style={{
                width: '520px', maxHeight: '90vh', overflowY: 'auto',
                backgroundColor: 'white', borderRadius: '24px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
                animation: 'modalSlideUp 0.3s ease-out',
            }}>

                {/* Step 1: Confirmation */}
                {step === 1 && (
                    <div style={{ padding: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'var(--accent-light-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Banknote size={24} color="#065F46" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '18px' }}>Confirm Action</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)' }}>{typeLabel}</div>
                                </div>
                            </div>
                            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px' }}>
                                <X size={20} color="var(--text-secondary-dark)" />
                            </button>
                        </div>

                        <div style={{ backgroundColor: 'var(--bg-light)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>{opp.title}</h3>
                            <p style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', lineHeight: '1.6' }}>
                                {opp.brief_text || opp.impact_text}
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>Amount</span>
                                <span style={{ fontSize: '20px', fontWeight: 800 }}>{formatMoney(opp.amount)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>Estimated Impact</span>
                                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>{formatMoney(opp.impact_value)}/yr</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                                <span style={{ fontSize: '15px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>Priority</span>
                                <span style={{ fontSize: '15px', fontWeight: 700, textTransform: 'capitalize' }}>{opp.priority || 'medium'}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '12px 16px', backgroundColor: 'var(--accent-lavender)', borderRadius: '12px' }}>
                            <Shield size={16} color="#3730A3" />
                            <span style={{ fontSize: '13px', color: '#3730A3', fontWeight: 600 }}>Bank-level encryption • Read-only access via Plaid</span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1, padding: '14px' }}>Cancel</button>
                            <button onClick={handleConfirm} className="btn btn-primary" style={{ flex: 2, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                Proceed <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Lock size={28} color="#3730A3" />
                        </div>

                        <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>Verify Your Identity</h3>
                        <p style={{ color: 'var(--text-secondary-dark)', fontSize: '15px', marginBottom: '8px' }}>
                            We sent a 6-digit code to your registered email.
                        </p>
                        <p style={{ color: 'var(--text-secondary-light)', fontSize: '13px', marginBottom: '32px' }}>
                            🔔 Sandbox mode — code auto-fills in a moment
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => inputRefs.current[i] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    style={{
                                        width: '52px', height: '60px', textAlign: 'center',
                                        fontSize: '24px', fontWeight: 800,
                                        borderRadius: '16px', border: `2px solid ${digit ? 'var(--cta-bg)' : 'var(--border-color)'}`,
                                        outline: 'none', transition: 'border-color 0.2s',
                                        fontFamily: 'Manrope, sans-serif',
                                        backgroundColor: digit ? 'var(--bg-light)' : 'white',
                                    }}
                                />
                            ))}
                        </div>

                        {otpError && (
                            <p style={{ color: '#DC2626', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>{otpError}</p>
                        )}

                        <button onClick={handleVerifyOtp} className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '16px' }}>
                            Verify & Execute
                        </button>

                        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', marginTop: '16px', color: 'var(--text-secondary-dark)', fontSize: '14px', fontWeight: 600 }}>
                            Cancel
                        </button>
                    </div>
                )}

                {/* Step 3: Processing */}
                {step === 3 && (
                    <div style={{ padding: '48px 40px', textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 32px' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                border: '3px solid var(--border-color)',
                                borderTopColor: 'var(--cta-bg)',
                                animation: 'spin 1s linear infinite',
                            }} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Banknote size={28} color="var(--text-primary-dark)" />
                            </div>
                        </div>

                        <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px', letterSpacing: '-0.5px' }}>Executing Transaction</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
                            {processingSteps.map((label, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '12px 0',
                                    opacity: i <= processingPhase ? 1 : 0.3,
                                    transition: 'opacity 0.4s ease',
                                }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: i < processingPhase ? 'var(--highlight-mint)' : i === processingPhase ? 'var(--accent-yellow)' : 'var(--bg-light)',
                                        transition: 'background-color 0.3s',
                                    }}>
                                        {i < processingPhase ? (
                                            <CheckCircle2 size={16} color="#065F46" />
                                        ) : i === processingPhase ? (
                                            <Loader2 size={14} color="#92400E" className="spin" />
                                        ) : (
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--border-color)' }} />
                                        )}
                                    </div>
                                    <span style={{
                                        fontSize: '15px', fontWeight: i <= processingPhase ? 700 : 500,
                                        color: i <= processingPhase ? 'var(--text-primary-dark)' : 'var(--text-secondary-light)',
                                    }}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Success Receipt */}
                {step === 4 && (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            backgroundColor: 'var(--highlight-mint)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                            animation: 'successPop 0.4s ease-out',
                        }}>
                            <CheckCircle2 size={40} color="#065F46" />
                        </div>

                        <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px' }}>Action Executed!</h3>
                        <p style={{ color: 'var(--text-secondary-dark)', fontSize: '15px', marginBottom: '32px' }}>
                            Your transaction has been processed successfully.
                        </p>

                        {/* Receipt Card */}
                        <div style={{
                            backgroundColor: 'var(--bg-light)', borderRadius: '20px', padding: '28px',
                            textAlign: 'left', marginBottom: '32px', border: '1px dashed var(--border-color)',
                        }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary-dark)', letterSpacing: '1px', marginBottom: '20px' }}>
                                TRANSACTION RECEIPT
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>Action</span>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{opp.title}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>Type</span>
                                    <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'capitalize' }}>{typeLabel}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>Amount</span>
                                    <span style={{ fontSize: '14px', fontWeight: 800 }}>{formatMoney(opp.amount)}</span>
                                </div>
                                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>Est. Annual Impact</span>
                                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--success)' }}>+{formatMoney(opp.impact_value)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>Status</span>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#065F46' }}>✓ Approved & Executed</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>Transaction ID</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-secondary-dark)' }}>
                                        {opp.id?.slice(0, 8).toUpperCase() || 'FL-00000'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>Date</span>
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                                        {new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleDone} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                            Done
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes successPop {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ExecutionModal;
