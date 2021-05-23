const {app, BrowserWindow, ipcMain, globalShortcut, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const create = () => {
  const frame = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      javascript: true,
      webSecurity: false,
      contextIsolation: false
    }
  });
  frame.loadFile('./data/app.html');
}

app.whenReady().then(() => {
  globalShortcut.unregisterAll();
  //Menu.setApplicationMenu(null);
  create();
  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length == 0) {
      create();
    }
  });
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});
