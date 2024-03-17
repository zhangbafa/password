import { ipcMain } from 'electron'
import {
  generateRandomKeyAndIV,
  masterPassword,
  encrypt,
  decrypt,
  setMasterPassword
} from '../crypt'

function authHandler() {
  ipcMain.handle('auth', () => {
    return masterPassword
  })
}
function setMasterPasswordHandler() {
  ipcMain.handle('setMasterPassword', (_, data) => {
    try {
      setMasterPassword(data)
      return { code: 200, message: '设置成功' }
    } catch (error) {
      return { code: 0, message: '设置失败' }
    }
  })
}
// 复制密码处理程序
function copyPasswordHandler() {
  ipcMain.handle('copyPassword', (_, data) => {
    try {
      const { key, iv } = generateRandomKeyAndIV(masterPassword)
      const password = decrypt(data, key, iv)
      return { code: 200, message: '复制成功', data: password }
    } catch (error) {
      return { code: 0, message: '复制失败,请检查主密码是否设置' }
    }
  })
}

// 列表处理程序
function listHandler(worker) {
  ipcMain.handle('list', (_, data) => {
    return new Promise((resolve) => {
      const handleMessage = (msg) => {
        worker.off('message', handleMessage);
        resolve(msg);
      };
      worker.once('message',handleMessage).postMessage({ type: 'list', ...data })
    })
  })
}

// 账号分类列表
function categoriesListHandler(worker) {
  ipcMain.handle('categoriesList', () => {
   
    return new Promise((resolve) => {
      const handleMessage = (msg) => {
        worker.off('message', handleMessage);
        resolve(msg);
      };
      worker.once('message',handleMessage).postMessage({ type: 'categoriesList' })
    })
    
  })
}

// 创建密码处理程序
function createHandler(worker) {
  ipcMain.handle('create', (_, data) => {
    const { key, iv } = generateRandomKeyAndIV(masterPassword)
    const hashPassword = encrypt(data.password, key, iv)
    return new Promise((resolve) => {
      worker
        .once('message', (message) => {
          resolve(message)
        })
        .postMessage({
          type: 'create',
          platform: data.platform,
          account: data.account,
          password: hashPassword
        })
    })
  })
}

// 获取单个密码处理程序
function oneHandler(worker) {
  ipcMain.handle('one', (_, data) => {
    return new Promise((resolve) => {
      worker
        .once('message', (message) => {
          try {
            const { key, iv } = generateRandomKeyAndIV(masterPassword)
            const password = decrypt(message.hash_password, key, iv)
            const new_message = { ...message, ...{ hash_password: password } }
            resolve(new_message)
          } catch (error) {
            resolve({ code: 0, message: '密码解密失败，请重新设置主密码' })
          }
        })
        .postMessage({ type: 'one', id: data.id })
    })
  })
}

// 更新密码处理程序
function updateHandler(worker) {
  ipcMain.handle('update', (_, data) => {
    const { key, iv } = generateRandomKeyAndIV(masterPassword)
    const hashPassword = encrypt(data.password, key, iv)
    return new Promise((resolve) => {
      worker
        .once('message', (message) => {
          resolve(message)
        })
        .postMessage({ type: 'update', ...data, password: hashPassword })
    })
  })
}

// 删除密码处理程序
function deleteHandler(worker) {
  ipcMain.handle('delete', (_, data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'delete', data })
      worker.once('message', (msg) => {
        resolve(msg)
      })
    })
  })
}

// 永久删除密码处理程序
function permanentlyDeleteHandler(worker) {
  ipcMain.handle('permanentlyDelete', (_, data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'permanentlyDelete', data })
      worker.once('message', (msg) => {
        resolve(msg)
      })
    })
  })
}

// 恢复密码处理程序
function restoreHandler(worker) {
  ipcMain.handle('restore', (_, data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'restore', ...data })
      worker.once('message', (msg) => {
        resolve(msg)
      })
    })
  })
}

// 更新主密码处理程序
function updateMasterPasswordHandler(worker) {
  ipcMain.handle('updateMasterPassword', (_, data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'updateMasterPassword', ...data })
      worker.once('message', (msg) => {
        resolve(msg)
      })
    })
  })
}

// 收藏处理程序
function collectHandler(worker) {
  ipcMain.handle('collect', (_, data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'collect', data })
      worker.once('message', (msg) => {
        resolve(msg)
      })
    })
  })
}



// 账号分类-添加
function categoriesCreateHandler(worker) {
  ipcMain.handle('categoriesCreate', (_, data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'categoriesCreate', data })
      worker.once('message', (msg) => {
        resolve(msg)
      })
    })
  })
}

// 账号分类-修改
function categoriesUpdateHandler(worker) {
  ipcMain.handle('categoriesUpdate', (_, data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'categoriesUpdate', data })
      worker.once('message', (msg) => {
        resolve(msg)
      })
    })
  })
}

// 账号分类-删除
function categoriesDeleteHandler(worker) {
  ipcMain.handle('categoriesDelete', (_, data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'categoriesDelete', data })
      worker.once('message', (msg) => {
        resolve(msg)
      })
    })
  })
}


export {
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
  categoriesCreateHandler,
  categoriesUpdateHandler,
  categoriesDeleteHandler
}
