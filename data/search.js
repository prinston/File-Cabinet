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
    div.append($('<text>').text(config.files.search[index]));
    $('#search').append(div);
  }
}
