import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Toggle = ({ active, onChange }) => (
    <div onClick={onChange} style={{
        width: '44px', height: '24px',
        backgroundColor: active ? 'var(--cta-bg)' : 'var(--border-color)',
        borderRadius: '999px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
    }}>
        <div style={{
            width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%',
            position: 'absolute', top: '2px', left: active ? '22px' : '2px',
            transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }} />
    </div>
);

const Section = ({ title, children }) => (
    <div className="card" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '32px' }}>{title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {children}
        </div>
    </div>
);

const Row = ({ label, desc, control }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ paddingRight: '24px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary-dark)', marginBottom: '4px' }}>{label}</div>
            {desc && <div style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>{desc}</div>}
        </div>
        <div>{control}</div>
    </div>
);

const Settings = () => {
    const { authFetch, user, updateUser } = useAuth();
    const [profile, setProfile] = useState({ full_name: '', email: '', country: 'CA', tax_bracket: 0.30, monthly_income: 0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await authFetch('/auth/me');
            if (res.ok) {
                const data = await res.json();
                setProfile({
                    full_name: data.full_name || '',
                    email: data.email || '',
                    country: data.country || 'CA',
                    tax_bracket: data.tax_bracket || 0.30,
                    monthly_income: data.monthly_income || 0,
                });
            }
        } catch (err) {
            console.error('Load profile error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await authFetch('/auth/me', {
                method: 'PATCH',
                body: JSON.stringify({
                    full_name: profile.full_name,
                    country: profile.country,
                    tax_bracket: profile.tax_bracket,
                    monthly_income: profile.monthly_income,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                updateUser(data);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error('Save profile error:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--text-secondary-dark)' }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px' }}>

            <Section title="Profile Settings">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>Full Name</label>
                        <input type="text" className="input-field" value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>Email Address</label>
                        <input type="email" className="input-field" value={profile.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>Country</label>
                        <select className="input-field" value={profile.country} onChange={e => setProfile(p => ({ ...p, country: e.target.value }))}>
                            <option value="CA">Canada</option>
                            <option value="US">United States</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>Tax Bracket</label>
                        <select className="input-field" value={profile.tax_bracket} onChange={e => setProfile(p => ({ ...p, tax_bracket: parseFloat(e.target.value) }))}>
                            <option value={0.20}>20%</option>
                            <option value={0.25}>25%</option>
                            <option value={0.30}>30%</option>
                            <option value={0.33}>33%</option>
                            <option value={0.40}>40%</option>
                            <option value={0.45}>45%</option>
                            <option value={0.50}>50%</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>Monthly Income ($)</label>
                        <input type="number" className="input-field" value={profile.monthly_income || ''} placeholder="6500" onChange={e => setProfile(p => ({ ...p, monthly_income: parseFloat(e.target.value) || 0 }))} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {saved && (
                        <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '14px' }}>✓ Saved successfully</span>
                    )}
                </div>
            </Section>

            <Section title="AI Engine Preferences">
                <Row label="Daily Opportunity Alerts" desc="Receive a brief daily summary of new optimization opportunities." control={<Toggle active={true} />} />
                <Row label="TFSA/RRSP Reminders" desc="Get notified when your contribution limits reset or approach maximum." control={<Toggle active={true} />} />
                <Row label="Portfolio Drift Alerts" desc="Get alerts when connected brokerage accounts stray >5% from target allocations." control={<Toggle active={false} />} />
            </Section>

            <Section title="Danger Zone">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--danger)', marginBottom: '4px' }}>Delete Account</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary-dark)' }}>Permanently erase all your data and disconnect banks.</div>
                    </div>
                    <button className="btn btn-primary" style={{ backgroundColor: 'var(--danger)', color: 'white' }}>Delete Account</button>
                </div>
            </Section>
        </div>
    );
};

export default Settings;
