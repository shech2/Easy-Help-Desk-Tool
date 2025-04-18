import { useEffect } from 'react';
import { useSystemStore } from '../store/systemStore';
import { useAppStore } from '../store/appStore';

export const useSystemMonitor = () => {
  const { startMonitoring, stopMonitoring, stats, alerts } = useSystemStore();
  const { addNotification } = useAppStore();

  useEffect(() => {
    const unsubscribe = startMonitoring();

    // Forward system alerts to app notifications
    alerts.forEach(alert => {
      if (!alert.read) {
        addNotification({
          ...alert,
          read: true // Mark as read in system alerts
        });
      }
    });

    return () => {
      unsubscribe();
      stopMonitoring();
    };
  }, []);

  return {
    stats,
    alerts
  };
};