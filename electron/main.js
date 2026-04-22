/**
 * Cars24 Certificate Portal — Electron main process
 *
 * Loads the pre-built React app from the bundled dist/ folder via file://.
 * All background-removal falls back to the in-browser @imgly library
 * automatically when no server API is available (which is always the case
 * in the desktop app — no server is started).
 */

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Keep a global reference so the window isn't garbage-collected
let mainWindow;

function getDistPath() {
  // In packaged app, dist is in extraResources
  const resourcesPath = process.resourcesPath;
  const packedDist = path.join(resourcesPath, 'dist', 'index.html');
  if (fs.existsSync(packedDist)) {
    return packedDist;
  }
  // In development (running `electron .` from the electron/ folder)
  const devDist = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(devDist)) {
    return devDist;
  }
  throw new Error('Could not locate dist/index.html. Run `npm run build` in the project root first.');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Cars24 Certificate Portal',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Allow loading local files and WASM (needed for @imgly background removal)
      webSecurity: false,
    },
    show: false, // Show only after content loads to avoid white flash
  });

  const indexPath = getDistPath();
  mainWindow.loadURL(`file://${indexPath}`);

  // Show window once content is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in the system browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // macOS: re-create window when dock icon is clicked and no windows open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit on all windows closed (Windows/Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
