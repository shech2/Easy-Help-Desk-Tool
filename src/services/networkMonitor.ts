import { z } from 'zod';

// סכמות ולידציה
const NetworkStatsSchema = z.object({
  bytesIn: z.number(),
  bytesOut: z.number(),
  latency: z.number(),
  packetLoss: z.number(),
  connections: z.number(),
  interfaceSpeed: z.number(),
  errors: z.number()
});

const InterfaceSchema = z.object({
  name: z.string(),
  mac: z.string(),
  ip: z.string(),
  status: z.enum(['up', 'down']),
  type: z.enum(['ethernet', 'wifi', 'virtual'])
});

type NetworkStats = z.infer<typeof NetworkStatsSchema>;
type Interface = z.infer<typeof InterfaceSchema>;

class NetworkMonitor {
  private socket: WebSocket | null = null;
  private listeners = new Map<string, (data: NetworkStats) => void>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(`${import.meta.env.VITE_WS_URL}/network-monitor`);

    this.socket.onopen = () => {
      console.log('Connected to network monitor');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = NetworkStatsSchema.parse(JSON.parse(event.data));
        this.listeners.forEach(callback => callback(data));
      } catch (error) {
        console.error('Invalid network stats data:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('Disconnected from network monitor');
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error('Network monitor error:', error);
    };
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1));
  }

  subscribe(callback: (data: NetworkStats) => void): () => void {
    const id = Math.random().toString(36);
    this.listeners.set(id, callback);
    return () => {
      this.listeners.delete(id);
    };
  }

  async getInterfaces(): Promise<Interface[]> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/network/interfaces`);
      if (!response.ok) throw new Error('Failed to fetch interfaces');
      
      const data = await response.json();
      return z.array(InterfaceSchema).parse(data);
    } catch (error) {
      console.error('Error fetching interfaces:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }
}

export const networkMonitor = new NetworkMonitor();