import { app, shell, BrowserWindow,Tray,Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import trayicon from '../../resources/tray/icon@2x.png?asset'
import createWorker from './worker?nodeWorker'
import { setMenu } from './menu'
const Database = require('better-sqlite3')
import {
  authHandler,
  setMasterPasswordHandler,
  copyPasswordHandler,
  listHandler,
  createHandler,
  oneHandler,
  updateHandler,
  deleteHandler,
  permanentlyDeleteHandler,
  restoreHandler,
  updateMasterPasswordHandler,
  collectHandler,
  categoriesListHandler,
} from './lib/ipcHandlers'




function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 690,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle:'default',
    resizable:false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: is.dev?true:false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  
  mainWindow.webContents.closeDevTools();
  setMenu()
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  createTray(mainWindow)
  // app.menu.setDefaultApplicationMenuLanguage('zh-CN');

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  
  // 初始数据库
  let dbPath;
  if(is.dev){
    dbPath = join(__dirname, '../passwordbox.db');
  }else{
    const appDataPath = app.getPath('appData');
    dbPath = join(appDataPath, 'PasswordBox/passwordbox.db');
  }
  new Database(dbPath, {}).close()
  const worker = createWorker({  workerData: { db: dbPath }})

  


  authHandler()
  setMasterPasswordHandler()
  copyPasswordHandler()
  listHandler(worker)
  createHandler(worker)
  oneHandler(worker)
  updateHandler(worker)
  deleteHandler(worker)
  permanentlyDeleteHandler(worker)
  restoreHandler(worker)
  updateMasterPasswordHandler(worker)
  collectHandler(worker)
  categoriesListHandler(worker)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
  

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // db.close()
  if (process.platform !== 'darwin') {
    
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
function createTray(mainWindow) {
  const tray = new Tray(trayicon);
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示应用', click: () => mainWindow.show() },
    { label: '退出', click: () => app.quit() }
  ]);

  tray.setToolTip('PasswordBox');
  tray.setContextMenu(contextMenu);

  // 添加双击事件处理程序
  tray.on('double-click', () => {
    mainWindow.show();
  });
}