import { createApp, h } from 'vue'
import type { Component, AppContext, App } from 'vue'

const appContextMap = new Map<string, AppContext>()
function mountComponent(component: Component) {
  const app = createApp(component)

  Object.assign(app._context, appContextMap.get('DEFAULT'))
  console.log('🚀 ~ mountComponent ~ app._context:', app)
  // console.log(
  //   "🚀 ~ mountComponent ~ appContextMap.get('DEFAULT'):",
  //   appContextMap.get('DEFAULT')
  // )

  const container = document.createElement('div')
  container.className = 'use-dialog'
  document.body.appendChild(container)

  app.mount(container)
}
export const useDialog = (component: Component) => {
  mountComponent(component)
}
export const useDialogContext = {
  install(app: App, options: { appKey: string } = { appKey: 'DEFAULT' }) {
    console.log('🚀 ~ install ~ app:', app)

    appContextMap.set(options.appKey, app._context)
  }
}
