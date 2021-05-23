/**************************************************
* File Cabinet                                    *
* Tyler Ray                                       *
* 5/22/21                                         *
* USE: Register constants here to prevent clutter *
***************************************************/

/* Constant declarations */
const c_configpath = path.normalize(__dirname + '\\..\\config.json');
const c_defconfig = {
  settings: {
    theme: 'light'
  }
}

module.exports = { c_configpath, c_defconfig }
