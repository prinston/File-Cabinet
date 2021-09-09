/***********************************
* File Cabinet                     *
* Tyler Ray                        *
* 9/5/21                           *
* USE: Handles creation of filters *
***********************************/

/* Creates a new empty filter */
function createSearchDiv(index)
{
  if(config.files.search.length > index) {
    let div = $('<div>').attr('class', 'search').attr('id', index);
    let l = config.files.search[index];
    div.append($('<text>').text(l));
    l = l.replaceAll('\\', '\\\\');
    div.append($('<input>').attr('type', 'button').attr('value', 'Remove Search').attr('class', 'remove').attr('onclick', 'removeSearch(\'' + l + '\')'));
    $('#search').append(div);
  }
}

function removeSearch(loc)
{
  for(let x in config.files.search) {
    if(config.files.search[x].toLowerCase() == loc.toLowerCase()) {
      config.files.search.splice(x, 1);
      saveConfig();
      let search = $('#search');
      search.children().each(function(index)
      {
        let div = $(search.children().get(index));
        if($(div.children().get(0)).text().toLowerCase() == loc.toLowerCase()) {
          div.remove();
        }
      });
    }
  }
}
