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
const { CONFIG_PATH, DEFAULT_CONFIG, THEME_PATH, DEFAULT_THEMES } = require('./constants');

/* Loads the config */
var config;
if(fs.existsSync(CONFIG_PATH)) {
  fs.readFile(CONFIG_PATH, (err, data) => {
    if(err) throw err;
    config = JSON.parse(data.toString());
    for(var x in DEFAULT_CONFIG) {
      if(config[x] == undefined) {
        config[x] = DEFAULT_CONFIG;
      }
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  });
} else {
  config = DEFAULT_CONFIG;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

/* Loads the themes folder */
var themes;
if(fs.existsSync(THEME_PATH)) {
  fs.readdir(THEME_PATH, (err, files) => {
    for(var x in files) {
      console.log(files[x]);
    }
  });
} else {
  fs.mkdir(THEME_PATH, (err) => {
    if(err) throw err;
    for(let t in DEFAULT_THEMES) {
      fs.writeFile(path.normalize(THEME_PATH + '\\' + t + '.json'), JSON.stringify(DEFAULT_THEMES[t], null, 2), (err) => { if(err) throw err; });
    }
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

/* Gets the page properly setup for runtime (for custom title bar) */
const setupDocument = () => {
  window.getCurrentWindow = getCurrentWindow;
  window.minimize = minimize;
  window.maximize = maximize;
  window.unmaximize = unmaximize;
  window.toggleMaximize = toggleMaximize;
  window.close = close;
  window.isMaximized = isMaximized;
  setVariable('tabWidth', (100/$('#tabbar').children().length) + 'vw');

  $('#maximize').on('click', () => {
    if(window.isMaximized()) {
      $('#maximize img').attr('src', 'maximize.png');
      $('#maximize span').empty().append('&#9633;');
      $('#maximize b').text('Maximize');
      window.unmaximize();
      return;
    } else {
      $('#maximize img').attr('src', 'unmaximize.png');
      $('#maximize span').empty().append('&#9632;');
      $('#maximize b').text('Unmaximize');
      window.maximize();
      return;
    }
  })

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
