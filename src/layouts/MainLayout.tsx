import { Outlet, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import ChatWindow from '../components/chat/ChatWindow';
import { useAppStore } from '../store/appStore';

const MainLayout = () => {
  const { sidebarCollapsed } = useAppStore();
  const location = useLocation();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      
      <div className='flex flex-1 flex-col transition-all duration-300'>
        <Header onToggleChat={() => setShowChat(!showChat)} />
        
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
        
        <footer className="text-center py-4 text-slate-400 text-sm border-t border-slate-700">
          © 2025 רפי בן חמו. כל הזכויות שמורות.
        </footer>
      </div>
      
      <AnimatePresence>
        {showChat && <ChatWindow onClose={() => setShowChat(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;