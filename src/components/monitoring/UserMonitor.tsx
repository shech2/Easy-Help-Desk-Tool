import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiGlobe, FiMonitor, FiActivity } from 'react-icons/fi';

interface ConnectedUser {
  id: string;
  username: string;
  ip: string;
  connectedAt: Date;
  lastActivity: Date;
  status: 'active' | 'idle' | 'offline';
  browser: string;
  os: string;
}

const UserMonitor = () => {
  const [users, setUsers] = useState<ConnectedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ConnectedUser | null>(null);

  useEffect(() => {
    // סימולציה של משתמשים מחוברים
    const mockUsers: ConnectedUser[] = [
      {
        id: '1',
        username: 'ישראל ישראלי',
        ip: '192.168.1.100',
        connectedAt: new Date(Date.now() - 3600000),
        lastActivity: new Date(),
        status: 'active',
        browser: 'Chrome 120',
        os: 'Windows 11'
      },
      {
        id: '2',
        username: 'משה כהן',
        ip: '192.168.1.101',
        connectedAt: new Date(Date.now() - 7200000),
        lastActivity: new Date(Date.now() - 900000),
        status: 'idle',
        browser: 'Firefox 121',
        os: 'macOS 14'
      }
    ];

    setUsers(mockUsers);

    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        lastActivity: user.status === 'active' ? new Date() : user.lastActivity
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'idle': return 'text-yellow-500';
      case 'offline': return 'text-slate-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'idle': return 'לא פעיל';
      case 'offline': return 'מנותק';
      default: return 'לא ידוע';
    }
  };

  const formatDuration = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'פחות מדקה';
    if (minutes < 60) return `${minutes} דקות`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} שעות`;
    return `${Math.floor(hours / 24)} ימים`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">משתמשים מחוברים</h3>
            <FiUsers className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">לא פעילים</h3>
            <FiClock className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {users.filter(u => u.status === 'idle').length}
          </p>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">סה"כ חיבורים</h3>
            <FiActivity className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{users.length}</p>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">זמן ממוצע</h3>
            <FiMonitor className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {formatDuration(new Date(users.reduce((acc, user) => 
              acc + user.connectedAt.getTime(), 0) / users.length))}
          </p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 bg-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">משתמשים פעילים</h2>
          <span className="text-sm text-slate-400">
            עודכן לאחרונה: {new Date().toLocaleTimeString('he-IL')}
          </span>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {users.map(user => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-700/50 p-4 rounded-lg"
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{user.username}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-slate-400 flex items-center">
                        <FiGlobe className="ml-1" />
                        {user.ip}
                      </span>
                      <span className="text-sm text-slate-400 flex items-center">
                        <FiMonitor className="ml-1" />
                        {user.browser}
                      </span>
                      <span className="text-sm text-slate-400">
                        {user.os}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`flex items-center ${getStatusColor(user.status)}`}>
                      <span className="w-2 h-2 rounded-full bg-current ml-2" />
                      {getStatusText(user.status)}
                    </span>
                    <p className="text-sm text-slate-400 mt-1">
                      מחובר {formatDuration(user.connectedAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">פעילות אחרונה:</span>
                    <span className="text-slate-300">
                      {formatDuration(user.lastActivity)} ({user.lastActivity.toLocaleTimeString('he-IL')})
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <FiUsers className="mx-auto text-4xl mb-2" />
                <p>אין משתמשים מחוברים כרגע</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMonitor;