<template>
  <div id="body">
    <div id="box">
      <el-card shadow="never">
        <div id="tableBox">
          <div style="width: 40vw;">
            <p>月度结余</p>
            <el-table :data="leftData.list" border style="width: 100%" ref="singleTableRef" highlight-current-row
              @current-change="handleCurrentChange" :formatter="formatterCellval">
              <el-table-column prop="statementMonthName" label="结余月份" width="180" />
              <el-table-column prop="excitationTypeStr" label="激励类型" width="180" />
              <el-table-column prop="totalExcitationAmount" label="当月激励金额" width="180" />
              <el-table-column prop="totalFirstCommissionAmount" label="当月发放金额" width="180" />
              <el-table-column prop="totalRemainCommissionAmount" label="结余金额" width="180" />
            </el-table>
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
            <p>结余明细</p>
            <el-table :data="rightData.list" :formatter="formatterCellval" border>

              <el-table-column prop="startTime" label="账期时间" width="180">
                <template #default="scope">
                  <span>{{ scope.row.startTime + '~' + scope.row.endTime }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="deptName" label="组织部门" width="180" />
              <el-table-column prop="orderNo" label="单据号" width="180" />
              <el-table-column prop="goodsName" label="激励物名称" width="180" />
              <el-table-column prop="materialNo" label="激励物ID" width="180" />
              <el-table-column prop="commissionAmount" label="激励金额" width="180" />
              <el-table-column prop="firstCommissionAmount" label="当月发放金额" width="180" />
              <el-table-column prop="remainCommissionAmount" label="当月结余金额" width="180" />
            </el-table>
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
import { ElMessage } from 'element-plus'
import { CaretRight } from '@element-plus/icons-vue'
import { ref, onMounted, watch, reactive } from 'vue'
import { selectListEmpMonthList, selectListEmpMonthDetailList } from "@/webapi/incentive-proofread";
const props: any = defineProps({
  empId: String,
  companyId: String,
})
console.log(props.empId, props.companyId)
const leftData = ref({ list: [{ id: 1 }, { id: 2 }, { id: 3 }], total: 0 })
const leftFrom = reactive({ ecejCurrentPage: 1, ecejPageSize: 10, empId: props.empId, companyId: props.companyId })
const rightData = ref({ list: [{ id: 1 }, { id: 2 }, { id: 3 }], total: 0 })
const rightFrom = reactive({ ecejCurrentPage: 1, ecejPageSize: 10, empId: props.empId, companyId: props.companyId, excitationType: undefined, companyExcitationStatementId: undefined })
const singleTableRef = ref(null)
onMounted(() => {
  getListTabel()
})
const handleCurrentChange = (val: any) => {
  console.log(val)
  getDetailListTabel(val.excitationType, val.companyExcitationStatementId)
}

// 分页器触发
watch([() => { leftFrom.ecejCurrentPage }, () => { leftFrom.ecejPageSize }], () => { getListTabel() })
// 分页器触发
watch([() => { rightFrom.ecejCurrentPage }, () => { rightFrom.ecejPageSize }], () => { getDetailListTabel() })


// 月度余额查询
const getListTabel = async () => {
  let res = await selectListEmpMonthList({ ...leftFrom })
  if (res.code == 200) {
    leftData.value = res.data
    // 触发查询右侧数据
    if (leftData.value.list && leftData.value.list.length) {
      singleTableRef.value!.setCurrentRow(leftData.value.list[0])
    } else {
      rightData.value = { list: [], total: 0 }
    }
  } else {
    ElMessage.error(res.message)
  }
}

// 余额明细查询
const getDetailListTabel = (excitationType?: any, companyExcitationStatementId?: any) => {
  rightFrom.excitationType = excitationType
  rightFrom.companyExcitationStatementId = companyExcitationStatementId
  selectListEmpMonthDetailList({ ...rightFrom }).then(res => {
    rightData.value = res.data
  })
}

const formatterCellval = (row: any, column: any, cellValue: any, index: any) => {
  if (!Boolean(cellValue)) {
    return '--'
  } else {
    return cellValue
  }
}
</script>
<style lang='scss' scoped>
#box {
  padding: 0 20px;

  #infor {
    display: flex;
    margin-bottom: 10px;

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