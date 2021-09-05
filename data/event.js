/********************************************************
* File Cabinet                                          *
* Tyler Ray                                             *
* 9/4/21                                                *
* USE: Handle and register event listeners and emitters *
*********************************************************/

function emit(eventName) {
  for(let x in arguments) {
    console.log(arguments[x]);
  }
}

function on(eventName, func) {

}
