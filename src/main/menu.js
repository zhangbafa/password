const { app, Menu } = require('electron')
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
//   ...(isMac
//     ? [{
//         label: app.name,
//         submenu: [
//           { role: 'about' },
//           { type: 'separator' },
//           { role: 'services' },
//           { type: 'separator' },
//           { role: 'hide' },
//           { role: 'hideOthers' },
//           { role: 'unhide' },
//           { type: 'separator' },
//           { role: 'quit' }
//         ]
//       }]
//     : []),
  // { role: 'fileMenu' }
  {
    label: '文件',
    submenu: [
      { role: 'cut',label:'剪切' },
      { role: 'copy',label:'复制' },
      { role: 'paste',label:'粘贴' },
      isMac ? { role: 'close',label:'关闭' } : { role: 'quit',label:"退出" },
      
    ]
  },
  
  {
    label: '帮助',
    submenu: [
      {
        label: '意见反馈',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://passwordbox.ttbaojia.com')
        }
      }
    ]
  }
]

if(is.dev){
  template.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [
                  { role: 'startSpeaking' },
                  { role: 'stopSpeaking' }
                ]
              }
            ]
          : [
              { role: 'delete' },
              { type: 'separator' },
              { role: 'selectAll' }
            ])
      ]
    },
    { role: 'windowMenu' }
  )
}

export const setMenu = ()=> {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}