import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
  ElementPlusResolver,
  AntDesignVueResolver
} from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.NODE_ENV === 'development' ? '' : env.ECEJ_BASE,
    envPrefix: 'ECEJ',
    plugins: [
      vue({
        // reactivityTransform: true // 提案阶段
      }),
      vueJsx(),
      AutoImport({
        imports: ['vue'],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            // importStyle: 'sass'
          }),
          AntDesignVueResolver()
        ]
      })
    ],
    build: {
      sourcemap: env.ECEJ_MODE !== 'PROD'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host:true,
      proxy: {
        '/api': {
          target: env.ECEJ_HOST,
          changeOrigin: true,
          ws: true,
          rewrite: path => {
            return path.replace(/^\/api/, '/')
          }
        }
      }
    }
  }
})
