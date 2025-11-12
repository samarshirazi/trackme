import { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } from 'electron';
import path from 'path';
import { ActivityMonitor } from './services/ActivityMonitor';
import { CheckInService } from './services/CheckInService';
import Store from 'electron-store';

const store = new Store();

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let activityMonitor: ActivityMonitor | null = null;
let checkInService: CheckInService | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    show: false,
    backgroundColor: '#ffffff'
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('close', (event) => {
    // Don't close, just hide
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // Create a simple icon (in production, use a proper icon file)
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Dashboard',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Today: 0h 0m',
      enabled: false
    },
    {
      label: 'Tracking: Active',
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Pause Tracking',
      type: 'checkbox',
      checked: false,
      click: (menuItem) => {
        if (menuItem.checked) {
          activityMonitor?.pause();
        } else {
          activityMonitor?.resume();
        }
      }
    },
    {
      label: 'Settings',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.send('navigate-to-settings');
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('TrackMe - Time Tracking');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    } else {
      createWindow();
    }
  });
}

function initializeServices() {
  const userId = store.get('userId') as string | undefined;

  if (userId) {
    activityMonitor = new ActivityMonitor(userId);
    checkInService = new CheckInService(userId);

    // Start monitoring
    activityMonitor.start();
    checkInService.start();

    // Update tray with stats periodically
    setInterval(() => {
      updateTrayStats();
    }, 60000); // Update every minute
  }
}

function updateTrayStats() {
  if (!tray || !activityMonitor) return;

  const stats = activityMonitor.getTodayStats();
  const contextMenu = tray.getContextMenu();

  if (contextMenu) {
    const items = contextMenu.items;
    // Update "Today" menu item
    items[2].label = `Today: ${formatDuration(stats.totalSeconds)}`;

    // Update tracking status
    const isPaused = activityMonitor.isPaused();
    items[3].label = isPaused ? 'Tracking: Paused' : 'Tracking: Active';

    tray.setContextMenu(contextMenu);
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// IPC Handlers

ipcMain.handle('get-user-id', () => {
  return store.get('userId');
});

ipcMain.handle('set-user-id', (_event, userId: string) => {
  store.set('userId', userId);

  // Initialize services after login
  if (!activityMonitor && !checkInService) {
    initializeServices();
  }
});

ipcMain.handle('clear-user-id', () => {
  store.delete('userId');

  // Stop services on logout
  activityMonitor?.stop();
  checkInService?.stop();
  activityMonitor = null;
  checkInService = null;
});

ipcMain.handle('get-activity-stats', () => {
  return activityMonitor?.getTodayStats() || { totalSeconds: 0, sessions: [] };
});

ipcMain.handle('pause-tracking', () => {
  activityMonitor?.pause();
});

ipcMain.handle('resume-tracking', () => {
  activityMonitor?.resume();
});

ipcMain.handle('is-tracking-paused', () => {
  return activityMonitor?.isPaused() || false;
});

// Check-in handlers
ipcMain.handle('submit-checkin', async (_event, data) => {
  return checkInService?.submitCheckIn(data);
});

ipcMain.handle('snooze-checkin', (_event, duration: number) => {
  checkInService?.snooze(duration);
});

ipcMain.handle('skip-checkin', () => {
  checkInService?.skip();
});

// App lifecycle

app.whenReady().then(() => {
  createWindow();
  createTray();
  initializeServices();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Don't quit on macOS when all windows are closed
  if (process.platform !== 'darwin') {
    // Still don't quit, keep running in tray
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;

  // Clean up services
  activityMonitor?.stop();
  checkInService?.stop();
});

// Handle macOS dock icon hide
if (process.platform === 'darwin') {
  app.dock?.hide();
}
