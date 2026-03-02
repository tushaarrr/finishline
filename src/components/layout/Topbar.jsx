import React from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';

const Topbar = () => {
    const location = useLocation();

    const getHeaderInfo = () => {
        switch (location.pathname) {
            case '/dashboard':
                return { title: 'Overview', sub: 'Real-time data from Plaid', showCtas: false };
            case '/dashboard/opportunities':
                return { title: 'Opportunities', sub: 'AI-detected actions from your accounts', showCtas: false };
            case '/dashboard/accounts':
                return { title: 'Linked Accounts', sub: 'Connected via Plaid Sandbox', showCtas: true };
            case '/dashboard/goals':
                return { title: 'Financial Goals', sub: 'Track your path to the finish line', showCtas: false };
            case '/dashboard/history':
                return { title: 'Action History', sub: 'Record of your decisions', showCtas: false };
            case '/dashboard/insights':
                return { title: 'Insights', sub: 'Performance from real account data', showCtas: false };
            case '/dashboard/settings':
                return { title: 'Settings', sub: 'Manage your account and AI preferences', showCtas: false };
            default:
                return { title: 'Dashboard', sub: '', showCtas: false };
        }
    };

    const info = getHeaderInfo();

    return (
        <header style={{
            height: '100px',
            padding: '0 48px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'white'
        }}>
            <div>
                <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: 'var(--text-primary-dark)', letterSpacing: '-1px' }}>
                    {info.title}
                </h1>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary-dark)', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {location.pathname === '/dashboard' && (
                        <div className="pill-badge" style={{ padding: '2px 8px', fontSize: '11px', boxShadow: 'none' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)', marginRight: '6px' }} />
                            LIVE
                        </div>
                    )}
                    {info.sub}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                    <Download size={16} /> Export
                </button>
                {info.showCtas && (
                    <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                        <Plus size={16} /> Add Account
                    </button>
                )}
            </div>
        </header>
    );
};

export default Topbar;
