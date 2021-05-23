/****************************************************
* File Cabinet                                      *
* Tyler Ray                                         *
* 5/23/21                                           *
* USE: Script to help with managing the application *
*****************************************************/

const getCurrentWindow = () => { return remote.getCurrentWindow(); }

const minimize = (win = getCurrentWindow()) => {
  if(win.minimizable) win.minimize();
}

const maximize = (win = getCurrentWindow()) => {
  if(win.maximizable) win.maximize();
}

const unmaximize = (win = getCurrentWindow()) => {
  if(win.maximizable) win.unmaximize();
}

const toggleMaximize = (win = getCurrentWindow()) => {
  if(win.isMaximized()) unmaximize(win);
  else maximize(win);
}

const close = (win = getCurrentWindow()) => { win.close(); }

const isMaximized = (win = getCurrentWindow()) => { return win.isMaximized() }

module.exports = {getCurrentWindow, minimize, maximize, unmaximize, toggleMaximize, close, isMaximized};
