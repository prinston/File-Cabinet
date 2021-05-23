/****************************************************
* File Cabinet                                      *
* Tyler Ray                                         *
* 5/23/21                                           *
* USE: Script to help with managing the application *
*****************************************************/

const remote = require('@electron/remote');

const getCurrentWindow = () => { return remote.getCurrentWindow(); }

const minimize = (win = getCurrentWindow()) => {
  if(win != undefined && win.minimizable) win.minimize();
}

const maximize = (win = getCurrentWindow()) => {
  if(win != undefined && win.maximizable) win.maximize();
}

const unmaximize = (win = getCurrentWindow()) => {
  if(win != undefined && win.maximizable) win.unmaximize();
}

const toggleMaximize = (win = getCurrentWindow()) => {
  if(win != undefined) {
    if(win.isMaximized()) unmaximize(win);
    else maximize(win);
  }
}

const close = (win = getCurrentWindow()) => {
  if(win != undefined) win.close();
}

const isMaximized = (win = getCurrentWindow()) => {
  return win != undefined ? win.isMaximized() : false;
}

module.exports = {getCurrentWindow, minimize, maximize, unmaximize, toggleMaximize, close, isMaximized};
