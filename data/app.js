/**********************************************
* File Cabinet                                *
* Tyler Ray                                   *
* 5/21/21                                     *
* USE: Base script to setup and start program *
***********************************************/

/* Define dependencies */
const fs = require('fs');
const $ = require('jquery');
const path = require('path');
const vm = require('vm');
const { remote, ipcRenderer } = require('electron');
const { getCurrentWindow, minimize, maximize, unmaximize, toggleMaximize, close, isMaximized } = require('./appmanip');
const { c_configpath, c_defconfig } = require('./constants');

/* Loads the config */
var config;
if(fs.existsSync(c_configpath)) {
  fs.readFile(c_configpath, (err, data) => {
    if(err) throw err;
    config = JSON.parse(data.toString());
    for(var x in c_defconfig) {
      if(config[x] == undefined) {
        config[x] = c_defconfig;
      }
    }
    fs.writeFileSync(c_configpath, JSON.stringify(config, null, 2));
  });
} else {
  config = c_defconfig;
  fs.writeFileSync(c_configpath, JSON.stringify(config, null, 2));
}

/* Set a CSS variable */
const setVariable = (variable, value) => {
  $('body').css('--' + variable, value);
}

/* Gets the page properly setup for runtime */
const setupDocument = () => {
  window.getCurrentWindow = getCurrentWindow;
  window.minimize = minimize;
  window.maximize = maximize;
  window.unmaximize = unmaximize;
  window.toggleMaximize = toggleMaximize;
  window.close = close;
  window.isMaximized = isMaximized;
  setVariable('tabWidth', (100/$('#tabbar').children().length) + 'vw');
}

/* Waits for the page to load to begin modification */
document.addEventListener('readystatechange', (e) => {
  if(document.readyState === 'complete') {
    setupDocument();
  }
});
