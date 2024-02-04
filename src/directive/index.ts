const permissionControl: any = {}
permissionControl.install = (app: any) => {
  app.directive('permission', (el: any, binding: any) => {
    if (!inCodeMap(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  })
  function inCodeMap(key: string) {
    // if (import.meta.env.DEV) return true // dev模式下不校验权限
    return window['MenuCodeList']?.includes(key)
  }
}

export { permissionControl }
