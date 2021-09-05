/******************************************
* File Cabinet                            *
* Tyler Ray                               *
* 9/5/21                                  *
* USE: Handles file selection for filters *
******************************************/

/* Open the file selection from dialog for creating search directories */
function requestFileSearchDialog()
{
  let res = dialog.showOpenDialogSync({
    title: 'Select a directory',
    defaultPath: os.homedir(),
    button: 'Select Directory',
    properties: ['openDirectory', 'multiSelections', 'showHiddenFiles', 'createDirectory', 'promptToCreate', 'treatPackageAsDirectory', 'dontAddToRecent']
  });

  for(let x in res) {
    if(!config.files.search.includes(res[x])) {
      config.files.search.push(res[x]);
      saveConfig();
      createSearchDiv(config.files.search.length-1);
    }
  }
}

/* Open the file selection from dialog */
function requestFileMoveDialog(id)
{
  let res = dialog.showOpenDialogSync({
    title: 'Select a directory',
    defaultPath: os.homedir(),
    button: 'Select Directory',
    properties: ['openDirectory', 'showHiddenFiles', 'createDirectory', 'promptToCreate', 'treatPackageAsDirectory', 'dontAddToRecent']
  });

  if(res != undefined) {
    if(config.files.move[i] != undefined) {
      config.files.move[i].to = res[0];
    }
  }
}
