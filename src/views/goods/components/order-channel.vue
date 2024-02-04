<script lang="tsx">
import {
  ElDialog,
  ElButton,
  ElCheckboxGroup,
  ElCheckbox,
  ElAlert
} from 'element-plus'
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { MarketOrderChannel } from '@/types/goods'

export default defineComponent({
  props: {
    ids: {
      type: Array as PropType<MarketOrderChannel[]>
    }
  },
  emits: ['confirm'],
  setup(props, { emit, expose }) {
    const { marketOrderChannels } = storeToRefs(useCommon())
    const dialogShow = ref(false)
    const selected = ref<Array<MarketOrderChannel['marketOrderChannelId']>>([])
    const openModal = () => {
      selected.value = props.ids.map(item => item.marketOrderChannelId)
      dialogShow.value = true
    }
    const toggleDialogStatus = () => {
      dialogShow.value = false
    }
    const confirm = () => {
      // if (!selected.value) {
      //   ElMessage({
      //     type: 'error',
      //     message: '请选择限定条件类型！'
      //   })
      //   return
      // }
      const selectedValue = marketOrderChannels.value.filter(item =>
        selected.value.includes(item.marketOrderChannelId)
      )
      emit('confirm', selectedValue)
      toggleDialogStatus()
    }

    expose({ openModal })
    return () => (
      <ElDialog
        modelValue={dialogShow.value}
        title="添加集市下单渠道"
        width="500"
        before-close={toggleDialogStatus}
      >
        {{
          default: () => {
            return (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <ElAlert
                    title="提示：集市各渠道下单后，若订单未关联分销员信息，则不计算激励。"
                    type="warning"
                    closable={false}
                  />
                </div>
                <div style={{ fontSize: '16px' }}>请选择:</div>
                <ElCheckboxGroup
                  style={{ display: 'grid' }}
                  v-model={selected.value}
                >
                  {marketOrderChannels.value.map(item => (
                    <ElCheckbox
                      disabled={!item.display}
                      label={item.marketOrderChannelId}
                    >
                      {item.marketOrderChannelName}
                      {item.remark ?? item.remark}
                    </ElCheckbox>
                  ))}
                </ElCheckboxGroup>
              </>
            )
          },
          footer: () => {
            return (
              <div class="dialog-footer">
                <ElButton onClick={() => toggleDialogStatus()}>取消</ElButton>
                <ElButton type="primary" onClick={() => confirm()}>
                  确定
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
