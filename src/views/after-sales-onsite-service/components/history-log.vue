<template>
  <div class="history-log">
    <el-table :data="props.data" border style="width: 600px">
      <el-table-column label="时间" width="160" align="center">
        <template #default="{ row }: { row: SaleAfterOrderOperHis }">
          <div>
            {{
              row.operatorTime
                ? dayjs(row.operatorTime).format('YYYY-MM-DD HH:mm:ss')
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作内容" align="center">
        <template #default="{ row }: { row: SaleAfterOrderOperHis }">
          <div style="text-align: left" v-html="historyLogContent(row)"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="120" align="center">
        <template #default="{ row }: { row: SaleAfterOrderOperHis }">
          <div>{{ row.operatorUser ?? '--' }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { OperateType, AfterSalesStatus } from '../types'
import type { SaleAfterOrderOperHis } from '../types'
import dayjs from 'dayjs'
const props = defineProps<{
  data: SaleAfterOrderOperHis[]
}>()
const historyLogContent = (row: SaleAfterOrderOperHis) => {
  let content = ''
  const reason = row.operatorReason ?? '--'
  switch (row.operatorType) {
    case OperateType.APPLY:
      content = '售后单申请'
      break
    case OperateType.PASS:
      content = '售后单审核【同意】'
      break
    case OperateType.REJECT:
      content = `售后单审核【驳回】<br>驳回原因【${reason}】`
      break
    case OperateType.CHANGE:
      content = '售后单变更'
      break
    case OperateType.SUBMIT:
      content = '售后单处理提交'
      if (row.newOrderStatus === AfterSalesStatus.REFUND_FAIL) {
        content = `售后单退款失败<br>失败原因【${reason}】`
      } else if (row.newOrderStatus === AfterSalesStatus.COMPLETED) {
        content = '售后单完成'
      }
      break
    case OperateType.CANCEL:
      content = `售后单取消<br>取消原因【${reason}】`
      break
    case OperateType.REFUND:
      content = '售后单手工确认退款'
      break
    default:
      content = '--'
      break
  }
  return content
}
</script>
<style scoped lang="scss">
.history-log {
}
</style>
