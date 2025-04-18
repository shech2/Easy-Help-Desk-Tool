import { useState, useEffect } from 'react';
import { FiBell, FiSearch, FiUser, FiLogOut, FiSettings, FiMessageSquare, FiCalendar, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

interface HeaderProps {
  onToggleChat: () => void;
}

const Header = ({ onToggleChat }: HeaderProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { logout, user } = useAuthStore();
  const { notifications } = useAppStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  return (
    <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center px-6 shadow-md">
      <div className="flex items-center w-1/3">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400" />
          </div>
          <input
            type="text"
            className="input pr-10 w-full text-right"
            placeholder="חיפוש..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mr-auto">
        <div className="flex items-center gap-2 text-slate-300 border-r border-slate-700 pl-4">
          <FiCalendar className="text-slate-400" />
          <span className="text-sm">{formatDate(currentTime)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-slate-300">
          <FiClock className="text-slate-400" />
          <span className="text-sm font-mono">{formatTime(currentTime)}</span>
        </div>

        <button
          className="p-2 rounded-full hover:bg-slate-700 text-slate-300 relative"
          onClick={onToggleChat}
        >
          <FiMessageSquare className="text-xl" />
        </button>

        <button
          className="p-2 rounded-full hover:bg-slate-700 text-slate-300 relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FiBell className="text-xl" />
          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-bold">
              {unreadNotifications}
            </span>
          )}
        </button>
        
        <div className="relative">
          <button
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-700"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user?.username?.charAt(0).toUpperCase() || 'מ'}
            </div>
            <span className="text-sm font-medium text-white hidden md:inline-block mr-2">
              {user?.username || 'משתמש'}
            </span>
          </button>
          
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50"
              >
                <div className="py-1">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700 justify-end"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                  >
                    <span>הגדרות</span>
                    <FiSettings className="ml-3" />
                  </button>
                  
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700 justify-end"
                    onClick={handleLogout}
                  >
                    <span>התנתק</span>
                    <FiLogOut className="ml-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;