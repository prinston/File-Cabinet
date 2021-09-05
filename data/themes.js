/*********************************************
* File Cabinet                               *
* Tyler Ray                                  *
* 9/4/21                                     *
* USE: Handles theme changes and other stuff *
*********************************************/

const INTERPOLATION_AMOUNT = 10;

on('document:ready', function() {
  if(themes[config.settings.theme] == undefined)
  {
    config.settings.theme = Object.keys(themes)[0];
    saveConfig();
  }

  for(let x in themes[config.settings.theme]) {
    setVariable(x, getArrayAsRGB(themes[config.settings.theme][x]));
  }
});

/* Converts an RGB array to a CSS rgb string */
function getArrayAsRGB(inputArray)
{
  let result = 'rgb(0, 0, 0)';
  if(inputArray.length >= 3)
  {
    result = `rgb(${inputArray[0]}, ${inputArray[1]}, ${inputArray[2]})`;
  }
  return result;
}

/* Convert a RGB variable to an INT array */
function convertRGBToArray(variable)
{
  variable = variable.toLowerCase().replace('rgb(', '').replace(')', '');
  while(variable.includes(' '))
  {
    variable = variable.replace(' ', '');
  }
  variable = variable.split(',');
  for(let y in variable)
  {
    variable[y] = parseInt(variable[y]);
  }
  return variable;
}

/* Interpolate between two variables to bring variable A to variable B's value */
function interpolate(a, b)
{
  if(a < b)
  {
    a += INTERPOLATION_AMOUNT;
    if(a > b) a = b;
  }
  else if(a > b)
  {
    a -= INTERPOLATION_AMOUNT;
    if(a < b) a = b;
  }
  return a;
}

/* An interval to ensure colors are updated smoothly */
on('document:ready', function()
{
  setInterval(function()
  {
    if(themes[config.settings.theme] != undefined)
    {
      for(let x in themes[config.settings.theme])
      {
        let v = getVariable(x);
        v = convertRGBToArray(v);
        let rgb = themes[config.settings.theme][x];
        let update = false;
        let interpolation = [interpolate(v[0], rgb[0]), interpolate(v[1], rgb[1]), interpolate(v[2], rgb[2])];
        if(interpolation != v);
        {
          setVariable(x, getArrayAsRGB(interpolation));
        }
      }
    }
    else
    {
      config.settings.theme = Object.keys(themes)[0];
      saveConfig();
    }
  }, 100);
});
