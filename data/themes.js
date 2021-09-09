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
    if(inputArray.length > 3) result = `rgba(${inputArray[0]}, ${inputArray[1]}, ${inputArray[2]}, ${inputArray[3]})`;
    else result = `rgb(${inputArray[0]}, ${inputArray[1]}, ${inputArray[2]})`;
  }
  return result;
}

/* Convert a RGB variable to an INT array */
function convertRGBToArray(variable)
{
  if(variable.toLowerCase().startsWith('rgb(')) variable = variable.toLowerCase().replace('rgb(', '').replace(')', '');
  else if(variable.toLowerCase().startsWith('rgba(')) variable = variable.toLowerCase().replace('rgba(', '').replace(')', '');
  while(variable.includes(' '))
  {
    variable = variable.replace(' ', '');
  }
  variable = variable.split(',');
  for(let y in variable)
  {
    if(y >= 3) variable[y] = parseFloat(variable[y]);
    else variable[y] = parseInt(variable[y]);
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

/* Interpolate between two variables to bring variable A to variable B's value */
function interpolateFloat(a, b)
{
  if(a < b)
  {
    a += (INTERPOLATION_AMOUNT*0.01);
    if(a > b) a = b;
  }
  else if(a > b)
  {
    a -= (INTERPOLATION_AMOUNT*0.01);
    if(a < b) a = b;
  }
  return a;
}

/* An interval to ensure colors are updated smoothly */
on('document:ready', function()
{
  //if(themes[config.settings.theme] == undefined) config.settings.theme = Object.keys(themes)[0];
  for(let theme in themes)
  {
    $('#themeSelect').append($('<option>').attr('value', theme).text(theme));
  }
  $('#themeSelect').val(config.settings.theme);
  setInterval(function()
  {
    let temp = config.settings.theme;
    if(temp.toLowerCase() != $('#themeSelect').val().toLowerCase())
    {
      config.settings.theme = $('#themeSelect').val().toLowerCase();
      saveConfig();
    }
    if(themes[config.settings.theme] != undefined)
    {
      for(let x in themes[config.settings.theme])
      {
        let v = getVariable(x);
        v = convertRGBToArray(v);
        let rgb = themes[config.settings.theme][x];
        let update = false;
        let interpolation = [interpolate(v[0], rgb[0]), interpolate(v[1], rgb[1]), interpolate(v[2], rgb[2])];
        if(v.length > 3 && rgb.length > 3) interpolation.push(interpolateFloat(v[3], rgb[3]));
        else if(rgb.length > 3) interpolation.push(rgb[3]);

        for(var y in v)
        {
          if(interpolation.length > y)
          {
            if(interpolation[y] != v[y])
            { 
              setVariable(x, getArrayAsRGB(interpolation));
              break;
            }
          }
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
