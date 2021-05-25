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
const { c_configpath, c_defconfig, c_themepath, c_defthemes } = require('./constants');

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

/* Loads the themes folder */
var themes;
if(fs.existsSync(c_themepath)) {
  fs.readdir(c_themepath, (err, files) => {
    for(var x in files) {
      console.log(files[x]);
    }
  });
} else {
  fs.mkdir(c_themepath, (err) => {
    if(err) throw err;
    fs.writeFile(path.normalize(c_themepath + '\\light.json'), JSON.stringify(c_defthemes['light'], null, 2), (err) => { if(err) throw err; });
    fs.writeFile(path.normalize(c_themepath + '\\dark.json'), JSON.stringify(c_defthemes['dark'], null, 2), (err) => { if(err) throw err; });
  });
}

/* Set a CSS variable */
const setVariable = (variable, value) => {
  $('body').css('--' + variable, value);
}

/*  */
const openTab = (tab) => {
  $('[type=group]').each((index) => {
    $($('[type=group]').get(index)).attr('class', 'hide');
  });
  $('#' + tab + '_tab').attr('class', 'show');
}

/*  */
const setActive = (tab) => {
  $('[type=tab]').each((index) => {
    $($('[type=tab]').get(index)).attr('class', '');
  });
  $('[tab=' + tab + ']').attr('class', 'selected');
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

  setInterval(async () => {
    if(window.isMaximized()) {
      $('#maximize span').empty().append('&#9632;');
      $('#maximize').attr('onclick', 'unmaximize()');
    } else {
      $('#maximize span').empty().append('&#9633;');
      $('#maximize').attr('onclick', 'maximize()');
    }
  }, 1);

  $('[type=tab]').each((index) => {
    var tab = $($('[type=tab]').get(index));
    tab.attr('onclick', 'openTab(\'' + tab.attr('tab') + '\'); setActive(\'' + tab.attr('tab') + '\');');
  });
}

/* Waits for the page to load to begin modification */
document.addEventListener('readystatechange', (e) => {
  if(document.readyState === 'complete') {
    setupDocument();
  }
});
