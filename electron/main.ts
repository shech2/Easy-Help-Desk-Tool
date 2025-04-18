import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import { Service } from 'node-windows';

const store = new Store();

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: join(__dirname, '../src/assets/icon.ico')
  });

  if (app.isPackaged) {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }
};

app.whenReady().then(() => {
  createWindow();
  
  // בדיקת עדכונים
  autoUpdater.checkForUpdatesAndNotify();
  
  // התקנת שירות Windows
  const svc = new Service({
    name: 'EasyHelpDeskService',
    description: 'Easy HelpDesk Tool System Service',
    script: join(__dirname, 'service.js')
  });
  
  svc.on('install', () => {
    svc.start();
  });
  
  svc.install();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// טיפול בעדכונים
autoUpdater.on('update-available', () => {
  log.info('Update available');
  if (mainWindow) {
    mainWindow.webContents.send('update_available');
  }
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded');
  if (mainWindow) {
    mainWindow.webContents.send('update_downloaded');
  }
});

// טיפול בהודעות מהממשק
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});