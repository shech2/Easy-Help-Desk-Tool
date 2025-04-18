import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiLock, FiShield, FiMail, FiGlobe, FiClock, FiUser, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import AdminPermissions from './AdminPermissions';
import UserManager from './UserManager';
import ChangePasswordModal from '../components/settings/ChangePasswordModal';

interface SettingsForm {
  displayName: string;
  email: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsForm>({
    displayName: 'Admin User',
    email: 'admin@example.com',
    language: 'English',
    timezone: 'UTC',
    emailNotifications: true,
    desktopNotifications: true,
    theme: 'dark'
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      displayName: 'Admin User',
      email: 'admin@example.com',
      language: 'English',
      timezone: 'UTC',
      emailNotifications: true,
      desktopNotifications: true,
      theme: 'dark'
    });
    toast.info('Settings reset to default');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    ...(user?.role === 'admin' ? [
      { id: 'users', label: 'Users', icon: <FiUsers /> },
      { id: 'permissions', label: 'Permissions', icon: <FiShield /> }
    ] : []),
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate-400 mt-1">Manage your account preferences and settings</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'permissions' ? (
          <AdminPermissions />
        ) : activeTab === 'users' ? (
          <UserManager />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {activeTab === 'general' && (
                <>
                  {/* Profile Settings */}
                  <div className="card">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <FiUser className="mr-2" />
                      Profile Settings
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={settings.displayName}
                          onChange={e => setSettings({...settings, displayName: e.target.value})}
                          className="input w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settings.email}
                          onChange={e => setSettings({...settings, email: e.target.value})}
                          className="input w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Localization */}
                  <div className="card">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <FiGlobe className="mr-2" />
                      Localization
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={e => setSettings({...settings, language: e.target.value})}
                          className="input w-full"
                        >
                          <option>English</option>
                          <option>Hebrew</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={e => setSettings({...settings, timezone: e.target.value})}
                          className="input w-full"
                        >
                          <option>UTC</option>
                          <option>UTC+2 (Israel)</option>
                          <option>UTC-5 (EST)</option>
                          <option>UTC-8 (PST)</option>
                          <option>UTC+1 (CET)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="card">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <FiMail className="mr-2" />
                      Notifications
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={settings.emailNotifications}
                          onChange={e => setSettings({...settings, emailNotifications: e.target.checked})}
                          className="h-4 w-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                        />
                        <label htmlFor="emailNotifications" className="ml-2 text-slate-300">
                          Enable email notifications
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="desktopNotifications"
                          checked={settings.desktopNotifications}
                          onChange={e => setSettings({...settings, desktopNotifications: e.target.checked})}
                          className="h-4 w-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                        />
                        <label htmlFor="desktopNotifications" className="ml-2 text-slate-300">
                          Enable desktop notifications
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'security' && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <FiShield className="mr-2" />
                    Security
                  </h2>
                  
                  <div className="space-y-4">
                    <button 
                      type="button" 
                      className="btn-primary flex items-center"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <FiLock className="mr-2" />
                      Change Password
                    </button>
                    
                    <button type="button" className="btn-ghost flex items-center">
                      <FiShield className="mr-2" />
                      Configure Two-Factor Authentication
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {activeTab !== 'permissions' && activeTab !== 'users' && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-ghost"
                  >
                    Reset to Default
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    <FiSave className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
      </motion.div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      <footer className="text-center mt-8 py-4 text-slate-400 text-sm border-t border-slate-700">
        © 2025 Rafi Ben Hamo. All rights reserved.
      </footer>
    </div>
  );
};

export default Settings;