import { Service } from 'node-windows';
import { join } from 'path';
import log from 'electron-log';

// הגדרת שירות Windows
const svc = new Service({
  name: 'EasyHelpDeskService',
  description: 'Easy HelpDesk Tool System Service',
  script: join(__dirname, 'background.js'),
  wait: 2,
  grow: .5
});

svc.on('install', () => {
  log.info('Service installed');
  svc.start();
});

svc.on('uninstall', () => {
  log.info('Service uninstalled');
});

svc.on('error', (err) => {
  log.error('Service error:', err);
});

export default svc;