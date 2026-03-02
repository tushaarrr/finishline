import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Zap, CreditCard, Target, Clock, PieChart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: Home },
        { label: 'Opportunities', path: '/dashboard/opportunities', icon: Zap },
        { label: 'Accounts', path: '/dashboard/accounts', icon: CreditCard },
        { label: 'Goals', path: '/dashboard/goals', icon: Target },
        { label: 'History', path: '/dashboard/history', icon: Clock },
        { label: 'Insights', path: '/dashboard/insights', icon: PieChart },
        { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get user initials from real name
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const userName = user?.full_name || user?.email || 'User';
    const userInitials = getInitials(user?.full_name);

    return (
        <aside style={{
            width: '280px',
            backgroundColor: 'var(--bg-light)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0
        }}>
            {/* Logo */}
            <div style={{ padding: '32px 32px 40px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary-dark)', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px' }}>
                <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px' }} />
                FINISHLINE
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                backgroundColor: isActive ? 'white' : 'transparent',
                                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                                color: isActive ? 'var(--text-primary-dark)' : 'var(--text-secondary-dark)',
                                fontWeight: 700,
                                fontSize: '15px',
                                transition: 'all 0.2s',
                                position: 'relative',
                                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.02)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }
                            }}
                        >
                            <item.icon size={20} color={isActive ? 'var(--text-primary-dark)' : 'var(--text-secondary-dark)'} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer — Real user data */}
            <div style={{ padding: '32px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--highlight-peach)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', border: '1px solid var(--border-color)' }}>
                        {userInitials}
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary-dark)' }}>{userName}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary-dark)', fontWeight: 600 }}>{user?.email || ''}</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', padding: '10px', fontSize: '14px' }}>
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
