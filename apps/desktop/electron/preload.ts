import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Auth
  getUserId: () => ipcRenderer.invoke('get-user-id'),
  setUserId: (userId: string) => ipcRenderer.invoke('set-user-id', userId),
  clearUserId: () => ipcRenderer.invoke('clear-user-id'),

  // Activity tracking
  getActivityStats: () => ipcRenderer.invoke('get-activity-stats'),
  pauseTracking: () => ipcRenderer.invoke('pause-tracking'),
  resumeTracking: () => ipcRenderer.invoke('resume-tracking'),
  isTrackingPaused: () => ipcRenderer.invoke('is-tracking-paused'),

  // Check-ins
  submitCheckIn: (data: any) => ipcRenderer.invoke('submit-checkin', data),
  snoozeCheckIn: (duration: number) => ipcRenderer.invoke('snooze-checkin', duration),
  skipCheckIn: () => ipcRenderer.invoke('skip-checkin'),

  // Navigation
  onNavigateToSettings: (callback: () => void) => {
    ipcRenderer.on('navigate-to-settings', callback);
  },

  // Check-in prompts
  onCheckInPrompt: (callback: (data: any) => void) => {
    ipcRenderer.on('show-checkin-prompt', (_event, data) => callback(data));
  }
});

// Type definitions for window.electron
export interface ElectronAPI {
  getUserId: () => Promise<string | undefined>;
  setUserId: (userId: string) => Promise<void>;
  clearUserId: () => Promise<void>;
  getActivityStats: () => Promise<any>;
  pauseTracking: () => Promise<void>;
  resumeTracking: () => Promise<void>;
  isTrackingPaused: () => Promise<boolean>;
  submitCheckIn: (data: any) => Promise<void>;
  snoozeCheckIn: (duration: number) => Promise<void>;
  skipCheckIn: () => Promise<void>;
  onNavigateToSettings: (callback: () => void) => void;
  onCheckInPrompt: (callback: (data: any) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
