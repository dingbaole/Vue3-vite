import type { Ref, VNodeProps, AllowedComponentProps, Component } from 'vue'
import type { DialogProps } from 'element-plus'

export type Noop = (...args: any[]) => void
export type Cb = (...args: any[]) => Promise<unknown>
export type Executor = (cb: Cb) => void
export interface Action {
  loading: Ref<boolean>
  setLoading: (arg: boolean) => void
  disabled: Ref<boolean>
  setDisabled: (arg: boolean) => void
  executor: Executor
  cb: Ref<Cb>
}

export type UseDialogOptions = Pick<DialogProps, 'title'> &
  Partial<Omit<DialogProps, 'title'>> & {
    confrimText?: string
    cancelText?: string
    confirmShow?: boolean
    cancelShow?: boolean
  }

export interface UseAction {
  confirm: Omit<Action, 'cb' | 'loading' | 'disabled'>
  cancel: Omit<Action, 'cb' | 'loading' | 'disabled'>
  close: () => void
}

export type ComponentProps<C extends Component> = C extends new (
  ...args: any
) => any
  ? Omit<
      InstanceType<C>['$props'],
      'useAction' | keyof VNodeProps | keyof AllowedComponentProps
    >
  : never

export interface ExtendsAction extends UseAction {}
