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

/* Load scripts in the current VM */
function loadScript(relativePath)
{
  vm.runInThisContext(fs.readFileSync(path.normalize(__dirname + relativePath)).toString());
}

loadScript('event.js');
loadScript('themes.js');

/* Saves the config */
function saveConfig()
{
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

/* Loads the config */
var config;
if(fs.existsSync(CONFIG_PATH))
{
  fs.readFile(CONFIG_PATH, function(err, data)
  {
    if(err) throw err;
    config = JSON.parse(data.toString());
    for(var x in DEFAULT_CONFIG)
    {
      if(config[x] == undefined)
      {
        config[x] = DEFAULT_CONFIG;
      }
    }
    saveConfig();
  });
}
else
{
  config = DEFAULT_CONFIG;
  saveConfig();
}

/* Loads the themes folder */
var themes;
if(fs.existsSync(THEME_PATH))
{
  fs.readdir(THEME_PATH, function(err, files)
  {
    for(var x in files)
    {
      console.log(files[x]);
    }
  });
}
else
{
  fs.mkdir(THEME_PATH, function(err)
  {
    if(err) throw err;
    for(let t in DEFAULT_THEMES)
    {
      fs.writeFile(path.normalize(THEME_PATH + '\\' + t + '.json'), JSON.stringify(DEFAULT_THEMES[t], null, 2), function(err)
      {
        if(err) throw err;
      });
    }
  });
}

/* Set a CSS variable */
function setVariable(variable, value)
{
  $('body').css('--' + variable, value);
}

/* Gets a CSS variable */
function getVariable(variable)
{
  return $('body').css('--' + variable);
}

/* Set this tab as active and other tabs as inactive */
function setActive(tab)
{
  $('[type=tab]').each(function (index)
  {
    $($('[type=tab]').get(index)).attr('class', '');
  });
  $('[tab=' + tab + ']').attr('class', 'selected');

  $('[type=group]').each(function(index)
  {
    $($('[type=group]').get(index)).attr('class', 'hide');
  });
  $('#' + tab + '_tab').attr('class', 'show');

  emit('update:tab');
}

/* Gets the page properly setup for runtime (for custom title bar) */
function setupDocument()
{
  window.getCurrentWindow = getCurrentWindow;
  window.minimize = minimize;
  window.maximize = maximize;
  window.unmaximize = unmaximize;
  window.toggleMaximize = toggleMaximize;
  window.close = close;
  window.isMaximized = isMaximized;
  setVariable('tabWidth', (100/$('#tabbar').children().length) + 'vw');

  $('#maximize').on('click', function()
  {
    if(window.isMaximized())
    {
      $('#maximize img').attr('src', 'maximize.png');
      $('#maximize span').empty().append('&#9633;');
      $('#maximize b').text('Maximize');
      window.unmaximize();
      return;
    }
    else
    {
      $('#maximize img').attr('src', 'unmaximize.png');
      $('#maximize span').empty().append('&#9632;');
      $('#maximize b').text('Unmaximize');
      window.maximize();
      return;
    }
  })

  $('[type=tab]').each(function(index)
  {
    var tab = $($('[type=tab]').get(index));
    tab.attr('onclick', 'setActive(\'' + tab.attr('tab') + '\');');
  });
}

/* Waits for the page to load to begin modification */
document.addEventListener('readystatechange', function(e)
{
  if(document.readyState === 'complete')
  {
    setupDocument();
  }
});
