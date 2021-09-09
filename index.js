const {app, BrowserWindow, ipcMain, globalShortcut, Menu, Notification, Tray } = require('electron');
const path = require('path');
const fs = require('fs');
require('@electron/remote/main').initialize();
const CONFIG_PATH = path.normalize(__dirname + '/config.json');

let win;

/* Reads the config */
function readConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH).toString());
}

function saveConfig() {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  if(!win.isDestroyed()) {
    win.webContents.send('config', config);
  }
}

var config = readConfig();

let contextJson = [
  {
    label: 'Notify',
    type: 'checkbox',
    checked: config.settings.notify,
    click: (item, browser, evnt) => {
      config.settings.notify = !config.settings.notify;
      contextJson[0].checked = config.settings.notify;
      saveConfig();
    },
    id: 'notify'
  },
  {
    type: 'separator'
  },
  {
    label: 'Auto Sort',
    type: 'checkbox',
    checked: config.settings.doAutoSort,
    click: (item, browser, evnt) => {
      config.settings.doAutoSort = !config.settings.doAutoSort;
      contextJson[2].checked = config.settings.doAutoSort;
      saveConfig();
    },
    id: 'doAutoSort'
  },
  {
    label: 'Auto sort is off',
    type: 'normal',
    sublabel: 'Time left',
    enabled: false,
    id: 'autoSortTime'
  },
  {
    type: 'separator'
  },
  {
    label: 'Sort Now',
    type: 'normal',
    click: sort,
    id: 'sort'
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
    },
    id: 'open'
  },
  {
    label: 'Quit',
    type: 'normal',
    click: (item, browser, evnt) => {
      quit = true;
      app.quit()
    },
    id: 'quit'
  }
]

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
    title: 'File Cabinet',
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
}

let quit = false;
let tray;
let trayContext;
app.whenReady().then(function()
{
  app.setAppUserModelId('File Cabinet');
  app.setName('File Cabinet');
  tray = new Tray(__dirname + '/tray.png');

  trayContext = Menu.buildFromTemplate(contextJson);
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

app.on('before-quit', function(evnt)
{
  if(!quit) evnt.preventDefault();
});

/* Listens for config updates */
ipcMain.on('config', function (evnt, arg)
{
  // Update tray menu
  trayContext.getMenuItemById('notify').checked = arg.settings.notify;
  trayContext.getMenuItemById('doAutoSort').checked = arg.settings.doAutoSort;
  contextJson[0].checked = arg.settings.notify;
  contextJson[2].checked = arg.settings.doAutoSort;

  if(config.settings.doAutoSort && config.settings.autoSort != arg.settings.autoSort)
  {
    createAutoSort(arg.settings.autoSort);
  }

  // Update sort loop
  config = arg;
});

/* Returns a list of files to move */
function searchDir(search)
{
  let result = [];
  let files = fs.readdirSync(search);
  for(let fileIndex in files)
  {
    let fileLoc = path.normalize(search + '/' + files[fileIndex]);
    let file = files[fileIndex];
    let stat = fs.statSync(fileLoc);
    if(stat.isDirectory())
    {
      //result.concat(searchDir(file));
    }
    else
    {
      for(let filterId in config.files.move)
      {
        for(let fileType in config.files.move[filterId].types)
        {
          if(file.toLowerCase().endsWith(config.files.move[filterId].types[fileType].toLowerCase()))
          {
            let fileTypeName = config.files.move[filterId].types[fileType].toLowerCase()
            result.push([
              filterId,
              file.substring(0, file.length - fileTypeName.length - 1),
              fileTypeName,
              fileLoc
            ]);
            //console.log(result);
          }
        }
      }
    }
  }
  return result;
}

/* Does the main purpose of this program, moves files automatically */
function sort()
{
  let filesToDo = 0;
  let filesDone = 0;
  nextActivateTime = new Date().getTime() + (config.settings.autoSort * 60000);
  let move = [];
  for(let dirIndex in config.files.search)
  {
    move = move.concat(searchDir(config.files.search[dirIndex]));
  }
  filesToDo = move.length;
  for(let index in move) {
    let moveFrom = move[index][3];
    let fileType = move[index][2];
    let fileName = move[index][1];
    let moveDir = config.files.move[move[index][0]].to;
    let moveTo = path.normalize(moveDir + '/' + fileName + '.' + fileType);

    if(fs.existsSync(moveDir)) {
      let nameIndex = -1;
      while(fs.existsSync(moveTo)) {
        nameIndex++;
        moveTo = path.normalize(config.files.move[move[index][0]].to + `/` + fileName + `[${nameIndex}].` + fileType);
      }
      fs.rename(moveFrom, moveTo, function(err)
      {
        if(err)
        {
          console.error(err);
          return;
        }
        filesDone++;

        if(config.settings.notify && (filesToDo == filesDone))
        {
          var notif = new Notification({
            icon: __dirname + '/icon.png',
            title: 'Sorting completed',
            body: `Successfully moved ${filesDone} file${filesDone != 1?'s':''}`,
            silent: true,
            hasReply: false,
            timeoutType: 'default'
          });
          notif.show();
        }
      });
    } else continue;
  }
}

/* Creates the auto sorting loop */
let autoSortLoop;
let nextActivateTime = 0;
function createAutoSort(minutes = config.settings.autoSort)
{
  nextActivateTime = new Date().getTime() + (minutes * 60000);
  if(autoSortLoop != undefined) clearInterval(autoSortLoop);
  autoSortLoop = setInterval(function()
  {
    sort();
    nextActivateTime = new Date().getTime() + (config.settings.autoSort * 60000);
  }, minutes * 60000);
}

function round(number)
{
  let result = 0.0;
  if(typeof number == 'number')
  {
    if(number - parseInt(number) >= 0.5)
    {
      result = parseInt(number) + 1;
    }
    else
    {
      result = parseInt(number);
    }
  }
  return result;
}

/* Creates a loop to make sure that the AutoSort time is updated properly */
let checkLoop = setInterval(function()
{
  if(config != undefined)
    {
    if(config.settings.doAutoSort)
    {
      if(autoSortLoop == undefined)
      {
        createAutoSort();
      }
      let timeLeft = nextActivateTime - new Date().getTime();
      let unit = 'minute'
      if(timeLeft >= 60000) {
        timeLeft /= 60000;
        timeLeft = round(timeLeft);
        if(timeLeft != 1) unit += 's';
      } else {
        timeLeft /= 1000
        timeLeft = round(timeLeft);
        unit = 'second' + (timeLeft != 1?'s':'');
      }
      contextJson[3].label = timeLeft + ' ' + unit;
    }
    else
    {
      if(autoSortLoop != undefined)
      {
        clearInterval(autoSortLoop);
      }
      contextJson[3].label = 'Auto sort is off';
    }
    tray.setContextMenu(Menu.buildFromTemplate(contextJson));
  }
}, 1000);
