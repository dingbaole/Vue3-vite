<template>
  <div id="body">
    <div id="box">
      <el-card shadow="never" style="margin-bottom: 10px;">
        <div style="display: flex;justify-content: space-between;align-items: center;">
          <div id="infor">
            <div>
              <label>公司名称：</label>
              <span>{{ initData.companyName }}</span>
            </div>
            <div>
              <label>激励类型：</label>
              <span>{{ initData.excitationTypeName }}</span>
            </div>
            <div>
              <label>账期月份：</label>
              <span>{{ initData.statementMonthName }}</span>
            </div>
          </div>
          <div style="float: right;">
            <el-button plain @click="exportIncentive">导出报表</el-button>
          </div>
        </div>
      </el-card>
      <el-card shadow="never">
        <div id="tableBox">
          <div style="width: 40vw;">
            <p>员工激励</p>
            <el-table :data="leftData.list" border style="width: 100%" ref="singleTableRef" highlight-current-row
              @row-click="handleCurrentChange" :cell-style="cellStyle">
              <el-table-column prop="deptName" label="组织部门" width="180" />
              <el-table-column prop="promoterName" label="员工姓名" width="180" />
              <el-table-column prop="empNo" label="员工编号" width="180" />
              <el-table-column prop="totalExcitationAmount" label="当月激励金额" width="180" />
              <el-table-column prop="totalFirstCommissionAmount" label="当月发放金额" width="180" />
              <el-table-column prop="totalRemainCommissionAmount" label="当月结余金额" width="180" />
              <el-table-column prop="totalRemainCommissionAmountYear" label="年度累计结余金额" width="180" />

            </el-table>
            <div class="additionalInformation">
              <div>
                <label>当月累计激励金额：</label>
                <span>{{ leftData.content.totalExcitationAmount }}</span>
              </div>
              <div>
                <label>当月累计发放金额：</label>
                <span>{{ leftData.content.totalFirstCommissionAmount }}</span>
              </div>
              <div>
                <label>当月累计结余金额：</label>
                <span>{{ leftData.content.totalRemainCommissionAmount }}</span>
              </div>
              <div>
                <label>累计年度结余金额：</label>
                <span>{{ leftData.content.totalRemainCommissionAmountYear }}</span>
              </div>
            </div>
            <div style="float: right;margin-top: 10px;">
              <el-pagination background layout="total,sizes,prev, pager, next" :total="leftData.total"
                v-model:current-page="leftFrom.ecejCurrentPage" v-model:page-size="leftFrom.ecejPageSize" />
            </div>
          </div>
          <div style="width: 5vw;">
            <el-icon :size="50" color="#72B7FF">
              <CaretRight />
            </el-icon>
          </div>
          <div style="width: 53vw;min-width: 40vw;">
            <p>激励明细</p>
            <el-table :data="rightData.list" border style="width: 100%;" :cell-style="cellStyle">
              <el-table-column prop="checkStatusStr" label="核算核对结果" width="180" />
              <el-table-column prop="orderNo" label="订单编号" width="180" />
              <el-table-column prop="relateOrderNo" label="关联sap销售单号" width="180" />
              <el-table-column prop="detailAddr" label="订单地址" width="180"/>
              <el-table-column prop="orderFinishTime" label="订单完成时间" width="180"/>
              <el-table-column prop="orderInvoiceTime" label="开票时间" width="180"/>
              <el-table-column prop="goodsName" label="商品名称" width="180" />
              <el-table-column prop="materialNo" label="关联物料号" width="180" />
              <el-table-column prop="quantity" label="数量" width="180" />
              <el-table-column prop="paidAmount" label="实收金额" width="180" />
              <el-table-column prop="commissionAmount" label="激励金额" width="180" />
              <el-table-column prop="firstCommissionAmount" label="月度发放金额" width="180" />
              <el-table-column prop="remainCommissionAmount" label="月度结余金额" width="180" />
              <el-table-column prop="promoterName" label="员工姓名" width="180" />
              <el-table-column prop="empNo" label="员工编号" width="180" />
              <el-table-column prop="deptName" label="员工归属组织部门" width="180" />
              <el-table-column prop="processRemark" label="激励说明" width="180" />
            </el-table>
            <div class="additionalInformation">
              <div>
                <label>核对结束数据：</label>
                <span>{{ rightData.content.checkCompleted }}条</span>
              </div>
              <div>
                <label>未核算数据：</label>
                <span>{{ rightData.content.unChecked }}条</span>
              </div>
              <div>
                <label>服务站未核对数据：</label>
                <span>{{ rightData.content.stationUnChecked }}条</span>
              </div>
              <div>
                <label>公司未核对数据：</label>
                <span>{{ rightData.content.companyUnChecked }}条</span>
              </div>
              <div>
                <label>公司已核对数据：</label>
                <span>{{ rightData.content.companyChecked }}条</span>
              </div>
            </div>
            <div style="float: right;margin-top: 10px;">
              <el-pagination background layout="total,sizes,prev, pager, next" :total="rightData.total"
                v-model:current-page="rightFrom.ecejCurrentPage" v-model:page-size="rightFrom.ecejPageSize" />
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { CaretRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref, onMounted, watch, reactive } from 'vue'
import { accountingInitData, selectListEmpMonthExStList, empAccountCompanyAmount, selectListEmpMonthExStDetailList, selectListEmpMonthExStDetailAmount, asynExport } from "@/webapi/incentive-proofread";
import dayjs from 'dayjs'
const props: any = defineProps({
  id: String,
  companyId: String,
})
var initData: any = ref({ excitationTypeName: '', companyName: '', statementMonthName: '', startTime: '', endTime: '' })
const leftData: any = ref({ list: [], total: 0, content: { totalExcitationAmount: 0, totalFirstCommissionAmount: 0, totalRemainCommissionAmount: 0, totalRemainCommissionAmountYear: 0 } })
const leftFrom = reactive({ ecejCurrentPage: 1, ecejPageSize: 10, companyId: props.companyId })
const rightData: any = ref({ list: [], total: 0, content: { checkCompleted: 0, unChecked: 0, stationUnChecked: 0, companyUnChecked: 0 } })
const rightFrom = reactive({ ecejCurrentPage: 1, ecejPageSize: 10, companyId: props.companyId, promoterId: undefined })
const singleTableRef = ref(null)
var selectRow: any = {}
onMounted(() => {
  // 获取初始化数据
  accountingInitData({ companyMonthStatementExcitationCheckId: props.id, companyId: props.companyId }).then(res => {
    initData.value = res.data.list[0]
    getLeftTable(true)
    getRightTable(true)
  })
})
const handleCurrentChange = (val: any) => {
  console.log(val)
  if (selectRow.promoterId == val.promoterId) {
    singleTableRef.value!.setCurrentRow()
    selectRow = {}
    rightFrom.promoterId = undefined
    rightFrom.ecejCurrentPage = 1
    rightFrom.ecejPageSize = 10
    getRightTable(true)
  } else {
    selectRow = val
    rightFrom.promoterId = val.promoterId
    rightFrom.ecejCurrentPage = 1
    rightFrom.ecejPageSize = 10
    getRightTable(true)
  }
}

// 分页器触发
watch([() => leftFrom.ecejCurrentPage, () => leftFrom.ecejPageSize], () => { getLeftTable(false) })
// 分页器触发
watch([() => rightFrom.ecejCurrentPage, () => rightFrom.ecejPageSize], () => { getRightTable(false) })

// 左侧表格数据
const getLeftTable = async (type: boolean) => {
  let params = { ...leftFrom, companyMonthExcitationStatementId: initData.value.companyMonthExcitationStatementId }
  let resTab = await selectListEmpMonthExStList(params)
  if (resTab.code == 200 && resTab.data && resTab.data.list && resTab.data.list.length > 0) {
    leftData.value.list = resTab.data.list
    leftData.value.total = resTab.data.total
  }
  if (type == true) {
    let resContent = await empAccountCompanyAmount(params)
    if (resContent.code == 200 && resContent.data) {
      leftData.value.content = resContent.data
    }
  }
}

// 右侧表格数据
const getRightTable = async (type: boolean) => {
  let params = { ...rightFrom, companyMonthExcitationStatementId: initData.value.companyMonthExcitationStatementId }
  let resTab = await selectListEmpMonthExStDetailList(params)
  if (resTab.code == 200 && resTab.data && resTab.data.list && resTab.data.list.length > 0) {
    rightData.value.list = resTab.data.list
    rightData.value.total = resTab.data.total
  }
  if (type == true) {
    let resContent = await selectListEmpMonthExStDetailAmount(params)
    if (resContent.code == 200 && resContent.data) {
      rightData.value.content = resContent.data
    }
  }
}
// 导出
const exportIncentive = () => {
  asynExport({ companyMonthStatementExcitationCheckId: props.id, promoterId: rightFrom.promoterId, companyId: props.companyId, companyMonthExcitationStatementId: initData.value.companyMonthExcitationStatementId }).then(res => {
    ElMessage({
      type: res.code == 200 ? 'success' : 'error',
      message: res.message
    })
  })
}


// 表格字段为空操作
const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
  let value = row[column.property]
  if (row[column.property] === null || row[column.property] === undefined || row[column.property] === '') {
    value = '--'
  }
  if (column.property == 'orderFinishTime') {
    value = row[column.property] && row[column.property] != '--' ? dayjs(row[column.property]).format('YYYY-MM-DD HH:mm:ss') : '--'
  }
  if (column.property == 'orderInvoiceTime') {
    value = row[column.property] && row[column.property] != '--' ? dayjs(row[column.property]).format('YYYY-MM-DD') : '--'
  }
  row[column.property] = value
}
</script>
<style lang='scss' scoped>
#box {
  // padding: 0 20px;

  #infor {
    display: flex;
    // margin-bottom: 10px;

    >div {
      margin-right: 20px;
    }
  }
}

h1 {
  padding: 0;
  margin: 0;
  font-size: 18px;
  padding-top: 10px;
  padding-left: 20px;
}

#tableBox {
  display: flex;
  align-items: center;

  .additionalInformation {
    display: flex;
    flex-wrap: wrap;
    height: 42px;

    >div {
      margin-right: 20px;
    }
  }
}
</style>