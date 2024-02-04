import type { App } from 'vue'
import { appContextMap } from './mount'

export const useDialogContext = {
  install(app: App, options: { appKey: string } = { appKey: 'DEFAULT' }) {
    appContextMap.set(options.appKey, app._context)
  }
}
