import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiDownload, FiRefreshCw } from 'react-icons/fi';

interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

const mockLogs: Log[] = [
  {
    id: '1',
    timestamp: '2024-01-20 10:15:23',
    level: 'info',
    message: 'System startup completed successfully',
    source: 'system'
  },
  {
    id: '2',
    timestamp: '2024-01-20 10:15:24',
    level: 'warning',
    message: 'High CPU usage detected',
    source: 'monitoring'
  },
  {
    id: '3',
    timestamp: '2024-01-20 10:15:25',
    level: 'error',
    message: 'Failed to connect to database',
    source: 'database'
  }
];

const LogsViewer = () => {
  const [logs] = useState<Log[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-500/10 text-blue-500';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500';
      case 'error': return 'bg-red-500/10 text-red-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="content-panel">
      <div className="content-panel-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">System Logs</h1>
          <div className="flex gap-2">
            <button className="btn-ghost">
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
            <button className="btn-ghost">
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              className="input pl-10"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      <div className="content-panel-body">
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="text-slate-400 text-sm">{log.timestamp}</span>
                </div>
                <span className="text-slate-500 text-sm">{log.source}</span>
              </div>
              <p className="mt-2 text-white">{log.message}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsViewer;