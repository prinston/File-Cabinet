/**************************************************
* File Cabinet                                    *
* Tyler Ray                                       *
* 5/22/21                                         *
* USE: Register constants here to prevent clutter *
***************************************************/

/* Constant declarations */
const CONFIG_PATH = path.normalize(__dirname + '\\..\\config.json');
const DEFAULT_CONFIG = {
  settings: {
    theme: "light",
    autoSort: 5
  },
  files: {
    search: [
      "C:\\Users\\Tyler\\Desktop",
      "C:\\Users\\Tyler\\Downloads"
    ],
    move: [
      {
        name: "Images",
        types: [
          "png",
          "jpg",
          "jpeg",
          "gif",
          "img"
        ],
        to: "C:\\Users\\Tyler\\Pictures",
        sizeMax: -1,
        sizeMin: -1,
        created: -1,
        modified: -1,
      }
    ]
  }
}

const THEME_PATH = path.normalize(__dirname + '\\..\\themes');
const DEFAULT_THEMES = {
  light: {
    text: [ 0, 0, 0 ],
    background: [ 220, 220, 220 ],
    minimizeColor: [ 220, 220, 50 ],
    maximizeColor: [ 50, 220, 50 ],
    closeColor: [ 220, 50, 50 ],
    controlText: [ 0, 0, 0 ],
    tabBackground: [ 210, 210, 210 ],
    tabSelected: [ 190, 190, 190 ],
    tabHover: [ 200, 200, 200 ]
  },
  dark: {
    text: [ 215, 215, 215 ],
    background: [ 25, 25, 25 ],
    minimizeColor: [ 220, 220, 50 ],
    maximizeColor: [ 50, 220, 50 ],
    closeColor: [ 220, 50, 50 ],
    controlText: [ 0, 0, 0 ],
    tabBackground: [ 45, 45, 45 ],
    tabSelected: [ 65, 65, 65 ],
    tabHover: [ 55, 55, 55 ]
  }
}

module.exports = { CONFIG_PATH, DEFAULT_CONFIG, THEME_PATH, DEFAULT_THEMES };
