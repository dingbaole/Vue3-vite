<script lang="tsx">
import {
  ElDialog,
  ElButton,
  ElRadioGroup,
  ElRadio,
  ElMessage,
  ElInput
} from 'element-plus'
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { CancelAfterSaleOrder } from '@/webapi/after-sales-onsite-service'

interface ListItem {
  value: number
  name: string
}
export default defineComponent({
  props: {
    list: {
      type: Array as PropType<ListItem[]>,
      default: () => {
        return [
          { value: 1, name: '用户取消售后' },
          { value: 2, name: '物料或配件损坏无法退回' },
          { value: 3, name: '其他' }
        ]
      }
    }
  },
  emits: ['confirm'],
  setup(props, { emit, expose }) {
    const dialogShow = ref(false)
    const saleOrderId = ref('')
    const selected = ref()
    const cancelReason = ref('')
    const openModal = (_saleOrderId: string) => {
      saleOrderId.value = _saleOrderId
      selected.value = undefined
      cancelReason.value = ''
      dialogShow.value = true
    }
    const toggleDialogStatus = () => {
      dialogShow.value = false
    }
    const confirm = () => {
      if (!selected.value) {
        ElMessage({
          type: 'error',
          message: '请选择选择取消原因！'
        })
        return
      }
      let _cancelReason = ''
      if (selected.value === 1) {
        _cancelReason = '用户取消售后'
      } else if (selected.value === 2) {
        _cancelReason = '物料或配件损坏无法退回'
      } else if (selected.value === 3) {
        _cancelReason = cancelReason.value.trim()
      }
      if (!_cancelReason) {
        ElMessage({
          type: 'error',
          message: '取消原因不能为空！'
        })
        return
      }
      CancelAfterSaleOrder({
        saleOrderId: saleOrderId.value,
        operateSource: 4,
        cancelReason: _cancelReason
      }).then(res => {
        if (res.code === 200) {
          emit('confirm')
          toggleDialogStatus()
        } else {
          ElMessage({
            type: 'error',
            message: res.message
          })
        }
      })
    }

    expose({ openModal })
    return () => (
      <ElDialog
        modelValue={dialogShow.value}
        title="确认售后取消"
        width="390"
        before-close={toggleDialogStatus}
      >
        {{
          default: () => {
            return (
              <>
                <div style={{ fontSize: '16px' }}>选择取消原因:</div>
                <ElRadioGroup
                  style={{ display: 'grid' }}
                  v-model={selected.value}
                >
                  {props?.list.map(item => (
                    <ElRadio label={item.value}>{item.name}</ElRadio>
                  ))}
                </ElRadioGroup>
                <ElInput
                  type="textarea"
                  v-model={cancelReason.value}
                  disabled={selected.value !== 3}
                  placeholder="请输入, 最长可输入100个文字。"
                  maxlength={100 as any}
                  show-word-limit
                ></ElInput>
              </>
            )
          },
          footer: () => {
            return (
              <div class="dialog-footer">
                <ElButton onClick={() => toggleDialogStatus()}>取消</ElButton>
                <ElButton type="primary" onClick={() => confirm()}>
                  确认
                </ElButton>
              </div>
            )
          }
        }}
      </ElDialog>
    )
  }
})
</script>

<style lang="scss" scoped>
.checkbox-column {
  display: flex;
  justify-content: center;
}
</style>
