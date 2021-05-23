const {app, BrowserWindow, ipcMain, globalShortcut, Menu, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
require('@electron/remote/main').initialize();

const create = () => {
  const frame = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      javascript: true,
      webSecurity: false,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });
  frame.loadFile('./data/app.html');
  var notif = new Notification({
    title: 'Testing Notification',
    body: 'Testing the body of this big tittied notification',
    silent: true,
    hasReply: false,
    timeoutType: 'default'
  });
  notif.show();
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
