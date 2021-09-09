/***********************************
* File Cabinet                     *
* Tyler Ray                        *
* 9/5/21                           *
* USE: Handles creation of filters *
***********************************/

/* Generates a UUID for a filter */
function generateId()
{
  let res = '';
  for(let x = 0; x < 30; x++) {
    res += parseInt((Math.random() * 11) - 1);
  }
  return res;
}

/* Creates a new empty filter */
function createFilter()
{
  let id = generateId();
  while(config.files.move[id] != undefined) id = generateId();

  config.files.move[id] = {
    name: 'New Filter',
    types: [],
    to: os.homedir()
  }
  saveConfig();

  createFilterDiv(id);
}

/* Creates a new filter display (not new) */
function createFilterDiv(id)
{
  if(config.files.move[id] != undefined) {
    let div = $('<div>').attr('class', 'filter').attr('id', id);
    div.append($('<input>').attr('id', id + 'name').attr('type', 'text').attr('value', config.files.move[id].name).attr('style', 'float: left; width: 50%; margin-left: 10px;').attr('onchange', 'updateFilterName(\'' + id + '\')'));
    div.append($('<input>').attr('type', 'button').attr('value', 'Remove Filter').attr('class', 'remove').attr('onclick', 'removeFilter(\'' + id + '\')'));

    let divUl = $('<div>');
    divUl.append($('<text>').text('File Types'))
    divUl.append($('<input>').attr('type', 'text').attr('placeholder', 'File Type').attr('id', id + 'filetype'));
    $('#' + id + 'filetype').on('keyup', eval(`(e) => { if(e.key === 'Enter' || e.keyCode === 13) addFileType(${id})}`));
    divUl.append($('<input>').attr('type', 'button').attr('value', 'Add File Type Filter').attr('onclick', 'addFileType(\'' + id + '\')'));

    let ul = $('<ul>').append($('<br>')).append($('<br>')).attr('id', id + 'list')
    for(let x in config.files.move[id].types) {
      ul.append($('<li>').text(config.files.move[id].types[x]).append($('<input>').attr('type', 'button').attr('value', 'Remove File Type').attr('class', 'remove').attr('onclick', 'removeFileType(\'' + id + '\', \'' + config.files.move[id].types[x] + '\')')));
    }

    divUl.append(ul);
    div.append(divUl);

    div.append($('<input>').attr('type', 'button').attr('value', config.files.move[id].to).attr('id', id + 'to').attr('class', 'filterTo').attr('onclick', `requestFileMoveDialog('${id}')`));

    $('#filters').append(div);
  }
}

function removeFilter(id)
{
  if(config.files.move[id] != undefined) {
    delete config.files.move[id];
    saveConfig();
    $('#' + id).remove();
  }
}

function updateFilterName(id)
{
  if(config.files.move[id] != undefined) {
    config.files.move[id].name = $('#' + id + 'name').val();
    saveConfig()
  }
}

function removeFileType(id, type)
{
  let list = $('#' + id + 'list');
  if(list.children().length > 0) {
    let remove = [];
    list.children().each((index) => {
      let n = $(list.children().get(index));
      if(n.text().toLowerCase() == type.toLowerCase()) {
        remove.push(n);
        if(config.files.move[id].types.length > 1)
        {
          config.files.move[id].types.splice(config.files.move[id].types.indexOf(type.toLowerCase()), 1);
        } else {
          config.files.move[id].types = [];
        }
        saveConfig();
      }
    });
    for(let x in remove)
    {
      remove[x].remove();
    }
  }
}

function addFileType(id)
{
  let val = $('#' + id + 'filetype').val();
  if(val != undefined && val.length > 0 && !config.files.move[id].types.includes(val.toLowerCase())) {
    config.files.move[id].types.push(val.toLowerCase());
    saveConfig();
    $('#' + id + 'list').append($('<li>').text(val.toLowerCase()).append($('<input>').attr('type', 'button').attr('value', 'Remove File Type').attr('class', 'remove').attr('onclick', 'removeFileType(\'' + id + '\', \'' + val + '\')')));
    $('#' + id + 'filetype').val('');
  }
}
