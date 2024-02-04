<script lang="tsx">
import { ElDialog, ElButton, ElRadioGroup, ElRadio } from 'element-plus'
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
interface ListItem {
  value: string
  name: string
}
export default defineComponent({
  props: {
    list: {
      type: Array as PropType<ListItem[]>
    }
  },
  emits: ['confirm'],
  setup(props, { emit, expose }) {
    const dialogShow = ref(false)
    const selected = ref('')
    const openModal = () => {
      selected.value = ''
      dialogShow.value = true
    }
    const toggleDialogStatus = () => {
      dialogShow.value = false
    }
    const confirm = () => {
      if (!selected.value) {
        ElMessage({
          type: 'error',
          message: '请选择限定条件类型！'
        })
        return
      }
      emit('confirm', selected.value)
      toggleDialogStatus()
    }

    expose({ openModal })
    return () => (
      <ElDialog
        modelValue={dialogShow.value}
        title="添加叠加规则限定条件"
        width="390"
        before-close={toggleDialogStatus}
      >
        {{
          default: () => {
            return (
              <>
                <div style={{ fontSize: '16px' }}>选择限定条件类型:</div>
                <ElRadioGroup
                  style={{ display: 'grid' }}
                  v-model={selected.value}
                >
                  {props.list?.map(item => (
                    <ElRadio label={item.value}>{item.name}</ElRadio>
                  ))}
                </ElRadioGroup>
              </>
            )
          },
          footer: () => {
            return (
              <div class="dialog-footer">
                <ElButton onClick={() => toggleDialogStatus()}>取消</ElButton>
                <ElButton type="primary" onClick={() => confirm()}>
                  下一步
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
