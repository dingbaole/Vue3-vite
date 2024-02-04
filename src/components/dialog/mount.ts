import type { Component, AppContext } from 'vue'
import { createApp } from 'vue'

export const appContextMap = new Map<string, AppContext>()
export const mountComponet = (component: Component) => {
  const app = createApp(component)

  if (appContextMap.has('DEFAULT')) {
    Object.assign(app._context, appContextMap.get('DEFAULT'))
  }

  const container = document.createElement('div')
  container.className = 'use-dialog'
  document.body.appendChild(container)

  return {
    instance: app.mount(container),
    unMount() {
      app.unmount()
      document.body.removeChild(container)
    }
  }
}
