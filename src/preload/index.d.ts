import { ElectronAPI, IpcRendererListener } from '@electron-toolkit/preload'
declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    mpwd: IpcRendererListener
    versions: IpcRendererListener,
    categories: IpcRendererListener
  }
}
