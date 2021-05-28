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
    theme: 'light',
    autoSort: 5,
    organizeType: 'year'
  },
  files: {
    search: [
      'C:\\Users\\Tyler\\Desktop',
      'C:\\Users\\Tyler\\Downloads'
    ],
    move: {
      png: {
        to: 'C:\\Users\\Tyler\\Pictures',
        sizeMax: 0,
        sizeMin: 0,
        created: 0,
        modified: 0,
        organize: 'date'
      }
    }
  }
}

const c_themepath = path.normalize(__dirname + '\\..\\themes');
const c_defthemes = {
  light: {
    text: [0, 0, 0],
    background: [220, 220, 220],
    minimizeColor: [220, 220, 50],
    maximizeColor: [50, 220, 50],
    closeColor: [220, 50, 50],
    controlText: [0, 0, 0],
    tabBackground: [210, 210, 210],
    tabSelected: [190, 190, 190],
    tabHover: [200, 200, 200]
  },
  dark: {

  }
}

module.exports = { c_configpath, c_defconfig, c_themepath, c_defthemes };
