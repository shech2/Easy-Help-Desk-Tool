import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiLock, FiRefreshCw } from 'react-icons/fi';

interface SecurityStatus {
  category: string;
  status: 'secure' | 'warning' | 'critical';
  message: string;
  lastCheck: string;
}

const mockSecurityStatus: SecurityStatus[] = [
  {
    category: 'Firewall',
    status: 'secure',
    message: 'Firewall is active and properly configured',
    lastCheck: '2 minutes ago'
  },
  {
    category: 'System Updates',
    status: 'warning',
    message: '3 security updates available',
    lastCheck: '15 minutes ago'
  },
  {
    category: 'Malware Protection',
    status: 'secure',
    message: 'No threats detected',
    lastCheck: '5 minutes ago'
  },
  {
    category: 'Network Security',
    status: 'critical',
    message: 'Unusual network activity detected',
    lastCheck: '1 minute ago'
  }
];

const SecurityCenter = () => {
  const [securityStatus] = useState<SecurityStatus[]>(mockSecurityStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <FiCheckCircle className={getStatusColor(status)} />;
      case 'warning': return <FiAlertTriangle className={getStatusColor(status)} />;
      case 'critical': return <FiAlertTriangle className={getStatusColor(status)} />;
      default: return <FiShield className={getStatusColor(status)} />;
    }
  };

  return (
    <div className="content-panel">
      <div className="content-panel-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Security Center</h1>
          <button className="btn-ghost">
            <FiRefreshCw className="mr-2" />
            Refresh Status
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiShield className="text-2xl text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-green-500">Protected</p>
                <p className="text-2xl font-bold text-white">12 Systems</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiAlertTriangle className="text-2xl text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm text-yellow-500">Warnings</p>
                <p className="text-2xl font-bold text-white">3 Issues</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiLock className="text-2xl text-blue-500" />
              <div className="ml-3">
                <p className="text-sm text-blue-500">Last Scan</p>
                <p className="text-2xl font-bold text-white">2h ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-panel-body">
        <div className="space-y-4">
          {securityStatus.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(item.status)}
                  <span className="ml-3 font-medium text-white">{item.category}</span>
                </div>
                <span className="text-sm text-slate-400">{item.lastCheck}</span>
              </div>
              <p className={`mt-2 ${getStatusColor(item.status)}`}>{item.message}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;