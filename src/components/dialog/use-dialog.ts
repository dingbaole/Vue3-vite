import { h, onMounted, onUnmounted } from 'vue'
import type { Component } from 'vue'
import { ElDialog, ElButton } from 'element-plus'
import { mountComponet } from './mount'
import { useDialogState, CloseFlag } from './use-dialog-state'
import type { UseDialogOptions, ComponentProps, Noop } from './types'
import './css.scss'
// type a<T> = T extends {} ? () => any : never
// let d:a<T> = useDialog
export const useDialog = <T extends Component>(
  childComponent: Component,
  options: UseDialogOptions,
  childProps?: ComponentProps<T> // 如果能断言T的类型有无属性签名，来自动推断childProps是否必选，就完美了。
) => {
  const _options = {
    ...{
      confrimText: '确定',
      cancelText: '取消',
      confirmShow: true,
      cancelShow: true
    },
    ...options
  }
  const {
    show,
    open,
    childProps: _childProps,
    closeFlag,
    result,
    close,
    actionCancel,
    actionConfirm
  } = useDialogState<ComponentProps<T>>()
  _childProps.value = childProps
  const confirm = () => {
    actionConfirm.loading.value = true
    actionConfirm.cb
      .value()
      .then(res => {
        actionConfirm.loading.value = false
        closeFlag.value = CloseFlag.CONFIRM
        result.value = res
        show.value = false
      })
      .catch(err => {
        if (import.meta.env.DEV) console.log('🚀 ~ confirm ~ err:', err)
        actionConfirm.loading.value = false
      })
  }

  const cancel = () => {
    actionCancel.loading.value = true
    actionCancel.cb
      .value()
      .then(res => {
        actionCancel.loading.value = false
        closeFlag.value = CloseFlag.CANCEL
        result.value = res
        show.value = false
      })
      .catch(err => {
        if (import.meta.env.DEV) console.log('🚀 ~ confirm ~ err:', err)
        actionCancel.loading.value = false
      })
  }
  const dialog = {
    setup() {
      return () => {
        return h(
          ElDialog,
          {
            modalClass: options.fullscreen ? 'use-dialog-fullscreen-class' : '',
            modelValue: show.value,
            destroyOnClose: true,
            onClose: close,
            ...options
          },
          {
            default: () =>
              h(childComponent, {
                useAction: {
                  confirm: actionConfirm,
                  cancel: actionCancel,
                  close
                },
                ..._childProps.value
              }),
            footer: () => h(Footer)
          }
        )
      }
    }
  }
  function Footer() {
    return h(
      'span',
      {
        class: 'dialog-footer'
      },
      [
        _options.cancelShow ? 
        h(
          ElButton,
          {
            disabled: actionCancel.disabled.value,
            loading: actionCancel.loading.value,
            
            onClick: cancel
          },
          () => _options.cancelText
        ) : 
        null
        ,
        _options.confirmShow ?
        h(
          ElButton,
          {
            type: 'primary',
            disabled: actionConfirm.disabled.value,
            loading: actionConfirm.loading.value,
            onClick: confirm
          },
          () => _options.confrimText
        ): 
        null
      ]
    )
  }
  let unmount: Noop
  onMounted(() => {
    const { unMount } = mountComponet(dialog)
    unmount = unMount
  })
  onUnmounted(() => {
    unmount()
  })
  return {
    open,
    close,
    confirm,
    cancel
  }
}
