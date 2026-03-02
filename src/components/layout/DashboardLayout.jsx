import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ChatWidget from '../ChatWidget';

const DashboardLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Topbar />
                <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                    {/* Dashboard nested routes render here */}
                    <Outlet />
                </main>
            </div>
            <ChatWidget />
        </div>
    );
};

export default DashboardLayout;
