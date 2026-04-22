/**
 * Electron preload script — runs in the renderer context before the page loads.
 * contextIsolation is ON, so we use contextBridge to expose only what's needed.
 *
 * The app currently needs nothing from Node/Electron APIs — all processing is
 * in-browser. This file is kept as a safe extension point.
 */

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron,
});
