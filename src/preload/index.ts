import { contextBridge,ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {say:()=> ipcRenderer.invoke('ping',"hello")}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('versions', {
      ping: (data) => ipcRenderer.invoke('ping',data),
      say: ()=>ipcRenderer.invoke("setWallpaper","Hello Election..."),
      open:()=>ipcRenderer.send('open-new-window')
    })
    contextBridge.exposeInMainWorld('mpwd', {
      list: (data)=>ipcRenderer.invoke("list",data),
      create: (data)=>ipcRenderer.invoke("create",data),
      findOne: (data)=>ipcRenderer.invoke("one",data),
      update: (data)=>ipcRenderer.invoke("update",data),
      delete: (data)=>ipcRenderer.invoke("delete",data),
      completelydelete: (data)=>ipcRenderer.invoke("completelydelete",data),
      collect: (data)=>ipcRenderer.invoke("collect",data),
      auth: (data)=>ipcRenderer.invoke("auth",data),
      jiami: (data)=>ipcRenderer.invoke("jiami",data),
      encryptPassword:(data)=>ipcRenderer.invoke('copyPassword',data),
      setMasterPassword:(data)=>ipcRenderer.invoke('setMasterPassword',data),
      permanentlyDelete:(data)=>ipcRenderer.invoke('permanentlyDelete',data),
      restore:(data)=>ipcRenderer.invoke('restore',data),
      updateMasterPassword:(data)=>ipcRenderer.invoke('updateMasterPassword',data)
    }),
    contextBridge.exposeInMainWorld('categories',{
      list:()=>ipcRenderer.invoke('categoriesList'),
      crate:(data)=>ipcRenderer.invoke('categoriesCreate',data),
      update:(data)=>ipcRenderer.invoke('categoriesUpdate',data),
      delete:(data)=>ipcRenderer.invoke('categoriesDelete',data),
    })

    
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
