<template>
  <div>
    <div id="table">
      <el-table :data="tableData" border style="width: 100%" table-layout="fixed"
        @selection-change="handleSelectionChange" :cell-style="cellStyle">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNo" label="订单编号" align="center" />
        <el-table-column prop="extOrderNo" label="关联SAP销售单号*" align="center" />
        <el-table-column prop="detailAddr" label="订单地址" align="center" />
        <el-table-column prop="orderFinishTime" label="订单完成时间" align="center" width="180">
          <!-- <template #default="scope">
            <div class="operation">
              {{ dayjs(scope.row.orderFinishTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template> -->
        </el-table-column>
        <el-table-column prop="orderInvoiceTime" label="开票时间*" align="center" width="180">
          <!-- <template #default="scope">
            <div class="operation">
              {{ dayjs(scope.row.orderInvoiceTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template> -->
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称*" align="center" />
        <el-table-column prop="materialNo" label="关联物料号*" align="center" />
        <el-table-column prop="quantity" label="数量*" align="center" />
        <el-table-column prop="paidAmount" label="实收金额" align="center" />
        <el-table-column prop="commissionAmount" label="激励金额*" align="center" />
        <el-table-column prop="firstCommissionAmount" label="月度发放金额*" align="center" />
        <el-table-column prop="remainCommissionAmount" label="月度结余金额" align="center" />
        <el-table-column prop="promoterName" label="员工姓名*" align="center" />
        <el-table-column prop="empNo" label="员工编号*" align="center" />
        <el-table-column prop="deptName" label="员工组织部门*" align="center" />
        <el-table-column prop="commissionRemark" label="激励说明*" align="center" />
        <el-table-column prop="statementMonthName" label="账期月份" align="center" />
        <el-table-column prop="address" label="激励变动说明" align="center" width="130" v-permission="'excitation:rule:settlement-check-change-record-list'" fixed="right"> 
          <template #default="scope">
            <el-button size="small" type="primary"
              @click="() => { clickRow = scope.row; incentiveChange.open({ initData: initData, clickRow: clickRow }) }">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="核查问题标记" align="center" width="130" v-permission="'excitation:rule:settlement-check-problem-record-list'" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary"
              @click="() => { clickRow = scope.row; incentiveError.open({ initData: initData, clickRow: clickRow }) }">查看激励错误</el-button>
          </template>

        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, toRefs } from 'vue'
import IncentiveChange from "@/views/incentive-proofread/component/incentiveChange.vue";
import IncentiveError from "@/views/incentive-proofread/component/incentiveError.vue";
import dayjs from 'dayjs'
import { useDialog } from '@/components/dialog'
const props = defineProps<{
  tableData?: any
  initData?: any
}>()
const { tableData, initData } = toRefs(props)
const clickRow = ref({})

let incentiveChange = useDialog<typeof IncentiveChange>(IncentiveChange, { title: '激励变动记录' })
let incentiveError = useDialog<typeof IncentiveError>(IncentiveError, { title: '查看激励错误' })

const emit = defineEmits(['getSelectRow'])
const handleSelectionChange = (val: any) => {
  emit('getSelectRow', val)
}


// 表格字段为空操作
const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
  let value = row[column.property]
  if (row[column.property] === null || row[column.property] === undefined || row[column.property] === '') {
    // console.log(row[column.property] == '')
    value = '--'
  }
  if (column.property == 'orderFinishTime' || column.property == 'orderInvoiceTime') {
    value = row[column.property] && row[column.property] != '--' ? dayjs(row[column.property]).format('YYYY-MM-DD HH:mm:ss') : '--'
  }
  if (column.property == 'orderInvoiceTime') {
    value = row[column.property] && row[column.property] != '--' ? dayjs(row[column.property]).format('YYYY-MM-DD') : '--'
  }
  row[column.property] = value
}
</script>
<style lang='scss' scoped></style>