import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NetworkTools from './pages/NetworkTools';
import SystemTools from './pages/SystemTools';
import UserManager from './pages/UserManager';
import LogsViewer from './pages/LogsViewer';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import FileControl from './pages/FileControl';
import SecurityCenter from './pages/SecurityCenter';
import UptimeMonitor from './pages/UptimeMonitor';
import Scheduler from './pages/Scheduler';
import Shortcuts from './pages/Shortcuts';

// Store & Hooks
import { useAuthStore } from './store/authStore';
import { useAppStore } from './store/appStore';

// Components
import SplashScreen from './components/SplashScreen';

function App() {
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const { theme, fontSize, reducedMotion, highContrast, updateDisplaySettings } = useAppStore();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const initApp = async () => {
      await checkAuth();
      updateDisplaySettings();
      setTimeout(() => setLoading(false), 1500);
    };
    initApp();
  }, [checkAuth, updateDisplaySettings]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
    document.documentElement.style.setProperty('--reduce-motion', reducedMotion ? 'reduce' : 'no-preference');
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [theme, fontSize, reducedMotion, highContrast]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* נתיבי אימות */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        </Route>
        
        {/* נתיבים מוגנים */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/network-tools" element={isAuthenticated ? <NetworkTools /> : <Navigate to="/login" />} />
          <Route path="/system-tools" element={isAuthenticated ? <SystemTools /> : <Navigate to="/login" />} />
          <Route path="/user-manager" element={isAuthenticated ? <UserManager /> : <Navigate to="/login" />} />
          <Route path="/logs" element={isAuthenticated ? <LogsViewer /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/file-control" element={isAuthenticated ? <FileControl /> : <Navigate to="/login" />} />
          <Route path="/security" element={isAuthenticated ? <SecurityCenter /> : <Navigate to="/login" />} />
          <Route path="/uptime-monitor" element={isAuthenticated ? <UptimeMonitor /> : <Navigate to="/login" />} />
          <Route path="/scheduler" element={isAuthenticated ? <Scheduler /> : <Navigate to="/login" />} />
          <Route path="/shortcuts" element={isAuthenticated ? <Shortcuts /> : <Navigate to="/login" />} />
        </Route>
        
        {/* דף 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;