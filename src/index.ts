import { electronAPI } from './preload'

declare global {
  interface Window { // eslint-disable-line no-unused-vars
    electron: electronAPI
  }
}

export { proxy, bridge } from './preload'
export { syncRenderer } from './renderer'
export { syncMain } from './main'