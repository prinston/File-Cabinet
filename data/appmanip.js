/****************************************************
* File Cabinet                                      *
* Tyler Ray                                         *
* 5/23/21                                           *
* USE: Script to help with managing the application *
*****************************************************/

const remote = require('@electron/remote');
const $ = require('jquery');

function getCurrentWindow()
{
  return remote.getCurrentWindow();
}

function minimize(win = getCurrentWindow())
{
  if(win != undefined && win.minimizable) win.minimize();
}

function maximize(win = getCurrentWindow())
{
  if(win != undefined && win.maximizable) win.maximize();
}

function unmaximize(win = getCurrentWindow())
{
  if(win != undefined && win.maximizable) win.unmaximize();
}

function toggleMaximize(win = getCurrentWindow())
{
  if(win != undefined)
  {
    if(win.isMaximized()) unmaximize(win);
    else maximize(win);
  }
}

function close(win = getCurrentWindow())
{
  if(win != undefined) win.close();
}

function isMaximized(win = getCurrentWindow())
{
  return win != undefined ? win.isMaximized() : false;
}

module.exports = {getCurrentWindow, minimize, maximize, unmaximize, toggleMaximize, close, isMaximized};
