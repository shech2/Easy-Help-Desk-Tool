import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiGlobe, 
  FiServer, 
  FiSettings, 
  FiMessageSquare,
  FiTerminal,
  FiFolder,
  FiShield,
  FiActivity,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiLink
} from 'react-icons/fi';
import Logo from '../common/Logo';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import React from 'react';

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user } = useAuthStore();
  
  const menuItems = [
    { to: '/dashboard', icon: <FiHome />, text: 'לוח בקרה' },
    { to: '/network-tools', icon: <FiGlobe />, text: 'כלי רשת' },
    { to: '/system-tools', icon: <FiServer />, text: 'כלי מערכת' },
    { to: '/remote-command', icon: <FiTerminal />, text: 'פקודות מרחוק' },
    { to: '/file-control', icon: <FiFolder />, text: 'ניהול קבצים' },
    { to: '/security', icon: <FiShield />, text: 'אבטחה' },
    { to: '/uptime-monitor', icon: <FiActivity />, text: 'ניטור זמינות' },
    { to: '/scheduler', icon: <FiClock />, text: 'תזמון משימות' },
    { to: '/shortcuts', icon: <FiLink />, text: 'קיצורי דרך' },
    { to: '/chat', icon: <FiMessageSquare />, text: "צ'אט" },
    { to: '/settings', icon: <FiSettings />, text: 'הגדרות' },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.requiredRole || item.requiredRole === user?.role
  );
  
  const sidebarVariants = {
    expanded: { width: '13rem' },
    collapsed: { width: '9rem' }
  };

  return (
    <motion.aside
      className={`fixed top-0 right-0 z-30 h-screen bg-slate-800 border-r border-slate-700 shadow-xl overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64 md:w-72'
      }`}
      initial={sidebarCollapsed ? 'collapsed' : 'expanded'}
      animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <Logo size={sidebarCollapsed ? 'small' : 'medium'} />
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors hidden md:block"
            aria-label={sidebarCollapsed ? 'הרחב תפריט' : 'כווץ תפריט'}
          >
            {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
        
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => (
              <li key={item.to}>
                <NavLink 
                  to={item.to}
                  className={({ isActive }) => 
                    `sidebar-item ${isActive ? 'active' : ''} ${
                      sidebarCollapsed ? 'justify-center px-2' : ''
                    }`
                  }
                >
                  <span className={`text-xl ${sidebarCollapsed ? 'mr-0' : 'ml-2'}`}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="text-sm md:text-base">{item.text}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase() || 'מ'}
            </div>
            
            {!sidebarCollapsed && (
              <div className="mr-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {user?.username || 'משתמש'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.role === 'admin' ? 'מנהל מערכת' : 
                   user?.role === 'user' ? 'משתמש' : 'צופה'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;