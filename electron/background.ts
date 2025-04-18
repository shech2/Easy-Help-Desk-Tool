import { networkInterfaces, cpuUsage, freemem, totalmem } from 'os';
import { WebSocketServer } from 'ws';
import log from 'electron-log';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  log.info('Client connected');
  
  const interval = setInterval(() => {
    try {
      const stats = {
        network: networkInterfaces(),
        cpu: cpuUsage(),
        memory: {
          free: freemem(),
          total: totalmem()
        }
      };
      
      ws.send(JSON.stringify(stats));
    } catch (error) {
      log.error('Error sending stats:', error);
    }
  }, 1000);
  
  ws.on('close', () => {
    clearInterval(interval);
    log.info('Client disconnected');
  });
});

process.on('uncaughtException', (err) => {
  log.error('Uncaught exception:', err);
});