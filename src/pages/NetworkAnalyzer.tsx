import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiDownload, FiUpload, FiCpu, FiHardDrive } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface NetworkStats {
  timestamp: number;
  bytesIn: number;
  bytesOut: number;
  latency: number;
  packetLoss: number;
}

const NetworkAnalyzer = () => {
  const [stats, setStats] = useState<NetworkStats[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState('eth0');

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // סימולציה של נתוני רשת
      const newStat: NetworkStats = {
        timestamp: Date.now(),
        bytesIn: Math.random() * 1000000,
        bytesOut: Math.random() * 1000000,
        latency: Math.random() * 100,
        packetLoss: Math.random() * 5
      };

      setStats(prev => [...prev.slice(-30), newStat]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes.toFixed(2)} B/s`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB/s`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB/s`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">מנתח רשת</h1>
        <p className="text-slate-400 mb-6">ניטור וניתוח תעבורת רשת בזמן אמת</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">תעבורה נכנסת</h3>
            <FiDownload className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatBytes(stats[stats.length - 1]?.bytesIn || 0)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">תעבורה יוצאת</h3>
            <FiUpload className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatBytes(stats[stats.length - 1]?.bytesOut || 0)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">זמן תגובה</h3>
            <FiActivity className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {(stats[stats.length - 1]?.latency || 0).toFixed(1)} ms
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">אובדן חבילות</h3>
            <FiHardDrive className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {(stats[stats.length - 1]?.packetLoss || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedInterface}
              onChange={(e) => setSelectedInterface(e.target.value)}
              className="input text-right"
            >
              <option value="eth0">כרטיס רשת ראשי (eth0)</option>
              <option value="wlan0">רשת אלחוטית (wlan0)</option>
            </select>
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`btn-${isMonitoring ? 'danger' : 'primary'}`}
            >
              {isMonitoring ? 'הפסק ניטור' : 'התחל ניטור'}
            </button>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#64748b"
                tickFormatter={(value) => new Date(value).toLocaleTimeString('he-IL')}
              />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#f8fafc',
                }}
                formatter={(value: number, name: string) => {
                  switch (name) {
                    case 'bytesIn':
                    case 'bytesOut':
                      return formatBytes(value);
                    case 'latency':
                      return `${value.toFixed(1)} ms`;
                    case 'packetLoss':
                      return `${value.toFixed(1)}%`;
                    default:
                      return value;
                  }
                }}
                labelFormatter={(value) => new Date(value).toLocaleTimeString('he-IL')}
              />
              <Line 
                type="monotone" 
                dataKey="bytesIn" 
                name="תעבורה נכנסת"
                stroke="#22c55e" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="bytesOut" 
                name="תעבורה יוצאת"
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="latency" 
                name="זמן תגובה"
                stroke="#eab308" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="packetLoss" 
                name="אובדן חבילות"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default NetworkAnalyzer;