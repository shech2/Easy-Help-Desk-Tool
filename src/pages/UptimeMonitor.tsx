import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiServer, FiClock, FiAlertCircle } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Service {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: number;
  lastCheck: string;
}

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Web Server',
    status: 'online',
    uptime: '99.9%',
    responseTime: 250,
    lastCheck: '1 minute ago'
  },
  {
    id: '2',
    name: 'Database',
    status: 'degraded',
    uptime: '98.5%',
    responseTime: 500,
    lastCheck: '2 minutes ago'
  },
  {
    id: '3',
    name: 'API Gateway',
    status: 'online',
    uptime: '99.7%',
    responseTime: 150,
    lastCheck: '1 minute ago'
  },
  {
    id: '4',
    name: 'Cache Server',
    status: 'offline',
    uptime: '95.0%',
    responseTime: 0,
    lastCheck: '5 minutes ago'
  }
];

const mockPerformanceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  responseTime: Math.floor(Math.random() * 300) + 100
}));

const UptimeMonitor = () => {
  const [services] = useState<Service[]>(mockServices);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'degraded': return 'text-yellow-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500/10';
      case 'offline': return 'bg-red-500/10';
      case 'degraded': return 'bg-yellow-500/10';
      default: return 'bg-slate-500/10';
    }
  };

  return (
    <div className="content-panel">
      <div className="content-panel-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Uptime Monitor</h1>
          <button className="btn-ghost">
            <FiActivity className="mr-2" />
            Refresh Status
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiServer className="text-2xl text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-green-500">Online Services</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiActivity className="text-2xl text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm text-yellow-500">Degraded</p>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiAlertCircle className="text-2xl text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-500">Offline</p>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 p-4 rounded-lg">
            <div className="flex items-center">
              <FiClock className="text-2xl text-blue-500" />
              <div className="ml-3">
                <p className="text-sm text-blue-500">Avg Response</p>
                <p className="text-2xl font-bold text-white">300ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-panel-body">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Service Status</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${getStatusBg(service.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{service.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm ${getStatusColor(service.status)}`}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                        <span className="text-sm text-slate-400 ml-4">
                          Last checked: {service.lastCheck}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Uptime</p>
                      <p className="text-lg font-semibold text-white">{service.uptime}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Response Time (24h)</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      color: '#f8fafc',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UptimeMonitor;