<script lang="tsx">
import { ElTag } from 'element-plus'
import { defineComponent, watch, ref } from 'vue'
import type { PropType } from 'vue'
import { AfterSalesStatus } from '../types'

export default defineComponent({
  props: {
    status: {
      type: Number as PropType<AfterSalesStatus>
    }
  },
  setup(props) {
    const config = ref()
    config.value = getStatusMap(props.status)
    watch(props, () => {
      config.value = getStatusMap(props.status)
    })
    return () => (
      <ElTag round type={config.value?.type} effect={config.value?.effect}>
        {config.value?.label}
      </ElTag>
    )
  }
})
const getStatusMap = (status: AfterSalesStatus) => {
  let type: '' | 'info' | 'danger' | 'warning' | 'success' = ''
  let label: string = ''
  let effect: 'plain' | 'dark' | 'light' = 'light'
  switch (status) {
    default:
      type = 'info'
      label = '未知'
      break
    case AfterSalesStatus.WAIT_AUDIT:
      type = 'danger'
      label = '待审核'
      break
    case AfterSalesStatus.WAIT_HANDLE:
      type = ''
      label = '待处理'
      break
    case AfterSalesStatus.WAIT_REFUND:
      type = 'warning'
      label = '待退款'
      break
    case AfterSalesStatus.REFUND_FAIL:
      type = 'danger'
      label = '退款失败'
      effect = 'dark'
      break
    case AfterSalesStatus.COMPLETED:
      type = 'success'
      label = '已完成'
      break
    case AfterSalesStatus.CANCELED:
      type = 'info'
      label = '已取消'
      break
    case AfterSalesStatus.REJECTED:
      type = 'info'
      label = '已驳回'
      effect = 'dark'
      break
  }
  return {
    type,
    label,
    effect
  }
}
</script>

<style lang="scss" scoped>
.checkbox-column {
  display: flex;
  justify-content: center;
}
</style>
