/********************************************************
* File Cabinet                                          *
* Tyler Ray                                             *
* 9/4/21                                                *
* USE: Handle and register event listeners and emitters *
*********************************************************/

let eventHandlers = {};

/* Emits an event to all listeners */
function emit(eventName)
{
  if(eventHandlers[eventName] != undefined)
  {
    let vars = '';
    for(let x = 1; x < arguments.length; x++)
    {
      if(vars != '') vars += ', ';
      vars += arguments[x];
    }
    for(let x in eventHandlers[eventName])
    {
      eval(`eventHandlers[eventName][x](${vars});`);
    }
  }
}

/* Creates an event listener */
function on(eventName, func)
{
  if(eventHandlers[eventName] == undefined) eventHandlers[eventName] = [];
  eventHandlers[eventName].push(func);
}
