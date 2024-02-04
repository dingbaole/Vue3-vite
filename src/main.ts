import { createApp, h } from 'vue'
import { setupStore } from './store'
import { permissionControl } from './directive'
import { useDialogContext } from '@/components/dialog'
import router from './router'
import App from './App.vue'
import 'element-plus/dist/index.css'
import { getMenuCodeMap } from './webapi/common'
const setupApp = async () => {
  if (!window['MenuCodeList']) {
    const res = await getMenuCodeMap()
    if (res.code === 200) {
      window['MenuCodeList'] = JSON.parse(res.data)
    }
  }
  const app = createApp({
    setup() {
      return () => h(App)
    }
  })
  setupStore(app)
  app.use(permissionControl)
  app.use(useDialogContext)
  app.use(router)
  app.mount('#app')
}
setupApp()
