/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

interface ImportMetaEnv {
  readonly ECEJ_HOST: string
  readonly ECEJ_MODE: string
  readonly ECEJ_BASE: string
  readonly ECEJ_IMG_SRC: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
