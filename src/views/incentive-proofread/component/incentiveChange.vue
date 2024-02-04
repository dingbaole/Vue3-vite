<template>
  <div>
    <div>
      <el-table :data="incentiveChangeTable.list" border style="width: 100%" :cell-style="cellStyle">
        <el-table-column prop="operateTime" label="时间" width="180" align="center">
          <!-- <template #default="scope">
            {{ dayjs(scope.row.operateTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template> -->
        </el-table-column>
        <el-table-column prop="operateUserName" label="操作人" width="180" align="center" />
        <el-table-column prop="operateTypeName" label="变动类型" align="center" />
        <el-table-column prop="amountRemark" label="变动金额" align="center" />
        <el-table-column prop="remark" label="变动说明" align="center" />
      </el-table>
      <div style="display: flex;justify-content: flex-end;margin-top: 20px;">
        <el-pagination background layout="total,sizes,prev, pager, next" :total="incentiveChangeTable.total"
          v-model:current-page="incentiveChangeForm.ecejCurrentPage"
          v-model:page-size="incentiveChangeForm.ecejPageSize" />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, reactive, watch, toRefs } from 'vue'
import dayjs from 'dayjs'
import { changeRecordList } from "@/webapi/incentive-proofread";

const props = defineProps<{
  initData: any
  clickRow: any
}>()
const { clickRow, initData } = toRefs(props)
const incentiveChangeTable = ref({ list: [], total: 0 })
const incentiveChangeForm = reactive({ ecejCurrentPage: 1, ecejPageSize: 10 })
console.log(initData)


onMounted(() => {
  lookIncentiveChange()
})
// 分页器触发
watch([() => { incentiveChangeForm.ecejCurrentPage }, () => { incentiveChangeForm.ecejPageSize }], () => { lookIncentiveChange(true) }, { deep: true })
// 查看激励变化
const lookIncentiveChange = (type?: boolean) => {
  if (!type) {
    incentiveChangeForm.ecejCurrentPage = 1
    incentiveChangeForm.ecejPageSize = 10
  }
  changeRecordList({
    companyId: initData.value.companyId,
    ...clickRow.value,
    ...incentiveChangeForm
  }).then(res => {
    incentiveChangeTable.value = res.data
  })
}


// 表格字段为空操作
const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
  let value = row[column.property]
  if (row[column.property] == null || row[column.property] == undefined || row[column.property] == '') {
    value = '--'
  }
  if (column.property == 'operateTime') {
    value = row[column.property] && row[column.property] != '--' ? dayjs(row[column.property]).format('YYYY-MM-DD HH:mm:ss') : '--'
  }
  row[column.property] = value
}
</script>
<style lang='scss' scoped></style>