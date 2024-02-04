import { ref, watch } from 'vue'
import { cb as callback } from './utils'
import type { Action, Cb } from './types'

export const action = (): Action => {
  const cb = ref<Cb>(callback)
  const loading = ref(false)
  const disabled = ref(false)
  const setLoading = (val: boolean) => (loading.value = val)
  const setDisabled = (val: boolean) => (disabled.value = val)
  return {
    loading,
    setLoading,
    disabled,
    setDisabled,
    executor(_cb) {
      cb.value = _cb
    },
    cb
  }
}
export enum CloseFlag {
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
  CLOSE = 'close'
}
type CloseFlagKey = `${CloseFlag}`
type PromiseResult = {action: CloseFlagKey, result: unknown}
export const useDialogState = <T>() => {
  const show = ref(false)
  const closeFlag = ref<CloseFlagKey>(CloseFlag.CLOSE)
  const result = ref()
  const actionConfirm = action()
  const actionCancel = action()
  const childProps = ref<T>()
  const open = (_childProps?: T): Promise<PromiseResult> => {
    if (show.value) return
    show.value = true
    childProps.value = _childProps
    return new Promise(resolve => {
      watch(show, () => {
        if (!show.value) {
          const res: PromiseResult = {
            action: closeFlag.value,
            result: result.value
          }
          if (closeFlag.value === CloseFlag.CONFIRM) {
            resolve(res)
          } else if (closeFlag.value === CloseFlag.CANCEL) {
            resolve(res)
          } else if (closeFlag.value === CloseFlag.CLOSE) {
            resolve(res)
          }
        }
      })
    })
  }
  const close = (res?: unknown) => {
    if (!show.value) return
    show.value = false
    closeFlag.value = CloseFlag.CLOSE
    result.value = res
  }
  const toggle = (visible?: boolean) => {
    if (visible === undefined) {
      show.value = !show.value
    } else {
      show.value = visible
    }
    return new Promise((resolve, reject) => {
      watch(show, () => {
        if (!show.value) {
          const res = {
            action: closeFlag.value,
            result: result.value
          }
          if (closeFlag.value === 'confirm') {
            resolve(res)
          } else if (closeFlag.value === 'cancel') {
            reject(res)
          }
        }
        resolve({
          type: 'fn'
        })
      })
    })
  }
  return {
    show,
    open,
    childProps,
    closeFlag,
    result,
    close,
    toggle,
    actionConfirm,
    actionCancel
  }
}
