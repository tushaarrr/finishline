import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';

// Public/Auth
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import Opportunities from './pages/dashboard/Opportunities';
import Accounts from './pages/dashboard/Accounts';
import Goals from './pages/dashboard/Goals';
import History from './pages/dashboard/History';
import Insights from './pages/dashboard/Insights';
import Settings from './pages/dashboard/Settings';

// Advisor
import AdvisorDashboard from './pages/advisor/AdvisorDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Auth Flows */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

          {/* Authenticated Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="goals" element={<Goals />} />
            <Route path="history" element={<History />} />
            <Route path="insights" element={<Insights />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Advisor Copilot — standalone layout */}
          <Route path="/advisor" element={<ProtectedRoute><AdvisorDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
