import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SOCKET_URL = import.meta.env.VITE_SUPABASE_URL?.replace('http', 'ws') || 'ws://localhost:3001';

class SystemMonitor {
  private socket;
  private listeners = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;
  private lastStats = null;
  private memoryUsageInterval: NodeJS.Timeout | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
    this.startMemoryMonitoring();
  }

  private connect() {
    if (this.socket?.connected) return;

    // ניקוי טיימר קודם
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
      // אופטימיזציה
      forceNew: false,
      multiplex: true,
      perMessageDeflate: true,
      timeout: 20000,
      // הגדרות ביצועים
      autoConnect: true,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to system monitor');
      this.reconnectAttempts = 0;
      toast.success('התחברות למערכת הניטור הצליחה');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from system monitor');
      this.startReconnectTimer();
    });

    this.socket.on('systemStats', (data) => {
      this.lastStats = {
        ...data,
        timestamp: Date.now()
      };
      
      this.listeners.forEach(callback => callback(this.lastStats));
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error('שגיאה בחיבור למערכת הניטור');
    });

    // טיימר לניתוק אוטומטי אם אין תגובה
    this.connectionTimeout = setTimeout(() => {
      if (!this.socket.connected) {
        this.socket.disconnect();
        this.connect();
      }
    }, 30000);
  }

  private startReconnectTimer() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => this.connect(), delay);
    } else {
      toast.error('לא ניתן להתחבר למערכת הניטור');
    }
  }

  private startMemoryMonitoring() {
    this.memoryUsageInterval = setInterval(() => {
      if (window.performance && window.performance.memory) {
        const memoryInfo = window.performance.memory;
        if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) {
          this.cleanupMemory();
        }
      }
    }, 30000);
  }

  private cleanupMemory() {
    this.lastStats = null;
    this.listeners.clear();
    
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    if (window.gc) {
      window.gc();
    }

    setTimeout(() => this.connect(), 1000);
  }

  subscribe(callback: (data: any) => void): () => void {
    const id = Math.random().toString(36);
    
    // שליחת נתונים אחרונים אם קיימים
    if (this.lastStats) {
      callback(this.lastStats);
    }
    
    this.listeners.set(id, callback);
    
    return () => {
      this.listeners.delete(id);
    };
  }

  disconnect() {
    if (this.memoryUsageInterval) {
      clearInterval(this.memoryUsageInterval);
    }

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.listeners.clear();
    this.lastStats = null;
  }
}

export const systemMonitor = new SystemMonitor();