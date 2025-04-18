import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { SystemState, SystemStats, Notification } from './types';
import { systemMonitor } from '../services/systemMonitor';

const initialState: SystemState = {
  stats: null,
  alerts: [],
  status: 'idle',
  error: null
};

export const useSystemStore = create(
  immer<SystemState>((set, get) => ({
    ...initialState,

    startMonitoring: () => {
      set(state => {
        state.status = 'monitoring';
        state.error = null;
      });

      const unsubscribe = systemMonitor.subscribe((stats: SystemStats) => {
        set(state => {
          state.stats = stats;
          
          // CPU Alert
          if (stats.cpu.usage > 90) {
            state.alerts.push({
              id: Date.now().toString(),
              title: 'High CPU Usage',
              message: `CPU usage is at ${stats.cpu.usage.toFixed(1)}%`,
              type: 'warning',
              read: false,
              timestamp: new Date()
            });
          }

          // Memory Alert
          const memoryUsage = (stats.memory.used / stats.memory.total) * 100;
          if (memoryUsage > 85) {
            state.alerts.push({
              id: Date.now().toString(),
              title: 'High Memory Usage',
              message: `Memory usage is at ${memoryUsage.toFixed(1)}%`,
              type: 'warning',
              read: false,
              timestamp: new Date()
            });
          }

          // Disk Alert
          const diskUsage = (stats.disk.used / stats.disk.total) * 100;
          if (diskUsage > 90) {
            state.alerts.push({
              id: Date.now().toString(),
              title: 'Low Disk Space',
              message: `Disk usage is at ${diskUsage.toFixed(1)}%`,
              type: 'error',
              read: false,
              timestamp: new Date()
            });
          }
        });
      });

      return unsubscribe;
    },

    stopMonitoring: () => {
      set(state => {
        state.status = 'idle';
        state.stats = null;
      });
    },

    clearAlerts: () => {
      set(state => {
        state.alerts = [];
      });
    },

    markAlertAsRead: (alertId: string) => {
      set(state => {
        const alert = state.alerts.find(a => a.id === alertId);
        if (alert) {
          alert.read = true;
        }
      });
    },

    removeAlert: (alertId: string) => {
      set(state => {
        state.alerts = state.alerts.filter(a => a.id !== alertId);
      });
    }
  }))
);