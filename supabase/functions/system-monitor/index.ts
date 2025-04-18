import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Server } from "npm:socket.io@4.7.2";
import * as si from "npm:systeminformation@5.21.22";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  // אופטימיזציה לחיבורים רבים
  perMessageDeflate: true,
  maxHttpBufferSize: 1e6,
  pingTimeout: 30000,
  pingInterval: 25000,
  // הגדרות לתמיכה בחיבורים רבים
  transports: ['websocket'],
  allowUpgrades: false,
  serveClient: false,
  // הגדרות ביצועים
  upgradeTimeout: 10000,
  maxPayload: 1e6
});

// מטמון נתונים מרכזי
const statsCache = new Map();
const CACHE_TTL = 1000;

// ניהול חיבורים
const connections = new Set();
let lastStatsUpdate = 0;

io.on("connection", (socket) => {
  connections.add(socket);
  console.log(`Client connected. Total connections: ${connections.size}`);

  // שליחת נתונים אחרונים מהמטמון
  if (statsCache.has('stats')) {
    socket.emit("systemStats", statsCache.get('stats'));
  }

  const interval = setInterval(async () => {
    try {
      const now = Date.now();

      // בדיקה אם צריך לעדכן את המטמון
      if (now - lastStatsUpdate >= CACHE_TTL) {
        const [cpu, mem, disk, net, temp] = await Promise.all([
          si.currentLoad(),
          si.mem(),
          si.fsSize(),
          si.networkStats(),
          si.cpuTemperature()
        ]);

        const stats = {
          cpu: {
            usage: cpu.currentLoad,
            temperature: temp.main,
            cores: cpu.cpus.map(core => core.load)
          },
          memory: {
            total: mem.total,
            used: mem.used,
            free: mem.free,
            cached: mem.cached,
            buffers: mem.buffers,
            usage: (mem.used / mem.total) * 100
          },
          disk: {
            total: disk[0].size,
            used: disk[0].used,
            free: disk[0].available,
            usage: (disk[0].used / disk[0].size) * 100,
            partitions: disk.map(partition => ({
              mount: partition.mount,
              total: partition.size,
              used: partition.used,
              free: partition.available
            }))
          },
          network: {
            bytesIn: net[0].rx_sec,
            bytesOut: net[0].tx_sec,
            packetsIn: net[0].rx_packets,
            packetsOut: net[0].tx_packets,
            errors: net[0].errors,
            dropped: net[0].dropped
          },
          timestamp: now
        };

        // עדכון המטמון
        statsCache.set('stats', stats);
        lastStatsUpdate = now;

        // שליחה לכל המחוברים
        for (const client of connections) {
          client.emit("systemStats", stats);
        }
      }
    } catch (error) {
      console.error("Error fetching system stats:", error);
      socket.emit("error", { message: "Failed to fetch system stats" });
    }
  }, 1000);

  socket.on("disconnect", () => {
    connections.delete(socket);
    console.log(`Client disconnected. Total connections: ${connections.size}`);
    clearInterval(interval);
  });
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  return io.handler()(req);
});