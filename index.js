const {app, BrowserWindow, ipcMain, globalShortcut, Menu, Notification, Tray } = require('electron');
const path = require('path');
const fs = require('fs');
require('@electron/remote/main').initialize();
const CONFIG_PATH = path.normalize(__dirname + '/config.json');

let win;

/* Creates the window */
function create()
{
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 200,
    minHeight: 150,
    frame: false,
    titleBarStyle: 'hidden',
    icon: __dirname + '/icon.png',
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
  win.loadFile('./data/app.html');
  // var notif = new Notification({
  //   title: 'Testing Notification',
  //   body: 'Testing the body of this notification',
  //   silent: true,
  //   hasReply: false,
  //   timeoutType: 'default'
  // });
  // notif.show();
}

let quit = false;
let tray;
app.whenReady().then(function()
{
  app.setName('File Cabinet');
  tray = new Tray(__dirname + '/tray.png');

  const trayContext = Menu.buildFromTemplate([
    {
      label: 'Sort Now',
      type: 'normal',
      click: sort
    },
    {
      type: 'separator'
    },
    {
      label: 'Open',
      type: 'normal',
      click: (item, browser, evnt) => {
        if(win.isDestroyed()) create();
        else win.focus();
      }
    },
    {
      label: 'Quit',
      type: 'normal',
      click: (item, browser, evnt) => {
        quit = true;
        app.quit()
      }
    }
  ]);
  tray.setTitle('File Cabinet');
  tray.setToolTip('Organizer for the unorginized');
  tray.setContextMenu(trayContext);

  globalShortcut.unregisterAll();
  //Menu.setApplicationMenu(null);
  create();
  app.on('activate', function()
  {
    if(BrowserWindow.getAllWindows().length == 0)
    {
      create();
    }
  });
});

/* Reads the config */
function readConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH).toString());
}
var config = readConfig();

app.on('before-quit', function(evnt)
{
  if(!quit) evnt.preventDefault();
});

/* Does the main purpose of this program, moves files automatically */
function sort() {

}

/* Creates the auto sorting loop */
let currentTime = config.settings.autoSort;
let autoSortLoop;
function createAutoSort()
{
  if(autoSortLoop != undefined) clearInterval(autoSortLoop);
  autoSortLoop = setInterval(sort, currentTime * 60000);
}

/* Creates a loop to make sure that the AutoSort time is updated properly */
let checkLoop = setInterval(function()
{
  config = readConfig();
  if((config.settings.doAutoSort && autoSortLoop == undefined) || currentTime != config.settings.autoSort)
  {
    createAutoSort();
  }
  else if(!config.settings.doAutoSort && autoSortLoop != undefined)
  {
    clearInterval(autoSortLoop);
  }
}, 5000);
