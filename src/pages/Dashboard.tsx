import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCpu, 
  FiHardDrive, 
  FiWifi, 
  FiClock,
  FiActivity,
  FiAlertCircle,
  FiUsers,
  FiServer
} from 'react-icons/fi';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { systemMonitor } from '../services/systemMonitor';
import DashboardCard from '../components/dashboard/DashboardCard';
import DashboardChart from '../components/dashboard/DashboardChart';
import ServerStatus from '../components/dashboard/ServerStatus';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import UserMonitor from '../components/monitoring/UserMonitor';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [systemStats, setSystemStats] = useState({
    cpu: {
      usage: 0,
      history: []
    },
    memory: {
      usage: 0,
      total: 0,
      history: []
    },
    network: {
      bytesIn: 0,
      bytesOut: 0,
      history: []
    },
    disk: {
      used: 0,
      total: 0,
      partitions: []
    }
  });

  const [servers, setServers] = useState([
    { id: 1, name: 'Web Server', status: 'online', uptime: '99.9%', load: '42%' },
    { id: 2, name: 'Database Server', status: 'online', uptime: '99.7%', load: '38%' },
    { id: 3, name: 'API Server', status: 'online', uptime: '99.8%', load: '27%' },
    { id: 4, name: 'Cache Server', status: 'maintenance', uptime: '89.5%', load: '12%' },
    { id: 5, name: 'Backup Server', status: 'online', uptime: '99.9%', load: '18%' },
  ]);

  const [activityFeed, setActivityFeed] = useState([
    { id: 1, user: 'System', action: 'Backup completed', time: '2 minutes ago', type: 'success' },
    { id: 2, user: 'Admin', action: 'Updated firewall rules', time: '15 minutes ago', type: 'info' },
    { id: 3, user: 'John', action: 'Logged in from new location', time: '42 minutes ago', type: 'warning' },
    { id: 4, user: 'API', action: 'High latency detected', time: '1 hour ago', type: 'error' },
    { id: 5, user: 'System', action: 'Scheduled maintenance started', time: '3 hours ago', type: 'info' },
  ]);

  useEffect(() => {
    const unsubscribe = systemMonitor.subscribe((data) => {
      setSystemStats(prevStats => ({
        ...prevStats,
        cpu: {
          usage: data.cpu.usage,
          history: [...prevStats.cpu.history.slice(-23), data.cpu.usage]
        },
        memory: {
          usage: data.memory.usage,
          total: data.memory.total,
          history: [...prevStats.memory.history.slice(-23), data.memory.usage]
        },
        network: {
          bytesIn: data.network.bytesIn,
          bytesOut: data.network.bytesOut,
          history: [...prevStats.network.history.slice(-23), {
            bytesIn: data.network.bytesIn,
            bytesOut: data.network.bytesOut
          }]
        },
        disk: data.disk
      }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className='mr-48 bg-slate-800 rounded-lg shadow-lg'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-400 mb-6">System overview and real-time metrics</p>
      </motion.div>
      
      {/* Top Row - Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="CPU Usage"
          value={`${systemStats.cpu.usage.toFixed(1)}%`}
          icon={<FiCpu />}
          color="blue"
          change={+3.2}
          delay={0.1}
        />
        
        <DashboardCard
          title="Memory Usage"
          value={`${systemStats.memory.usage.toFixed(1)}%`}
          icon={<FiHardDrive />}
          color="green"
          change={-1.8}
          delay={0.2}
        />
        
        <DashboardCard
          title="Network Traffic"
          value={`${(systemStats.network.bytesIn / 1024 / 1024).toFixed(1)} MB/s`}
          icon={<FiWifi />}
          color="purple"
          change={+5.1}
          delay={0.3}
        />
        
        <DashboardCard
          title="Disk Space"
          value={`${((systemStats.disk.used / systemStats.disk.total) * 100).toFixed(1)}%`}
          icon={<FiHardDrive />}
          color="orange"
          change={+0.5}
          delay={0.4}
        />
      </div>
      
      {/* Middle Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart title="CPU Usage (Real-time)" height={300} delay={0.5}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={systemStats.cpu.history.map((value, index) => ({
                time: index,
                usage: value
              }))}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
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
              <Area
                type="monotone"
                dataKey="usage"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardChart>
        
        <DashboardChart title="Memory Usage (Real-time)" height={300} delay={0.6}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={systemStats.memory.history.map((value, index) => ({
                time: index,
                usage: value
              }))}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
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
              <Area
                type="monotone"
                dataKey="usage"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardChart>
        
        <DashboardChart title="Network Traffic (Real-time)" height={300} delay={0.7}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={systemStats.network.history.map((value, index) => ({
                time: index,
                bytesIn: value.bytesIn / 1024 / 1024,
                bytesOut: value.bytesOut / 1024 / 1024
              }))}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
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
                dataKey="bytesIn"
                name="In (MB/s)"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="bytesOut"
                name="Out (MB/s)"
                stroke="#d946ef"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardChart>
        
        <DashboardChart title="Disk Usage" height={300} delay={0.8}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={systemStats.disk.partitions}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="size"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {systemStats.disk.partitions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  color: '#f8fafc',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </DashboardChart>
      </div>
      
      {/* Bottom Row - Servers and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart title="סטטוס שרתים" height={400} delay={0.9}>
            <div className="space-y-4">
              {servers.map((server) => (
                <ServerStatus
                  key={server.id}
                  name={server.name}
                  status={server.status}
                  uptime={server.uptime}
                  load={server.load}
                />
              ))}
            </div>
          </DashboardChart>
        </div>
        
        <DashboardChart title="פעילות אחרונה" height={400} delay={1.0}>
          <ActivityFeed activities={activityFeed} />
        </DashboardChart>
      </div>

      <DashboardChart title="ניטור משתמשים" height="auto" delay={1.1}>
        <UserMonitor />
      </DashboardChart>
    </div>
  );
};

export default Dashboard;