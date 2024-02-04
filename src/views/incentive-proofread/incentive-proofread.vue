<template>
  <div id="Box">
    <div id="search">
      <el-form :inline="true" :model="formData" class="demo-form-inline" ref="ruleFormRef" :rules="rules">
        <el-form-item label="城市" prop="cityId">
          <el-select v-model="formData.cityId" @change="cityIdChange" filterable placeholder="城市" clearable>
            <el-option v-for="item in cityList" :label="item.cityName" :value="item.cityId" :key="item.cityId" />
          </el-select>
        </el-form-item>
        <el-form-item label="公司" prop="companyId">
          <el-select v-model="formData.companyId" placeholder="公司" clearable>
            <el-option v-for="item in companyList" :label="item.companyName" :value="item.companyId"
              :key="item.companyId" />
          </el-select>
        </el-form-item>
        <el-form-item label="激励类型" prop="excitationType">
          <el-select v-model="formData.excitationType" placeholder="激励类型" clearable>
            <el-option v-for="item in excitationTypeMapList" :label="item.name" :value="item.id" :key="item.companyId" />
          </el-select>
        </el-form-item>
        <el-form-item label="核算核对进度" prop="checkStatus">
          <el-select v-model="formData.checkStatus" placeholder="核算核对进度" clearable>
            <el-option v-for="item in checkStatusMapList" :label="item.name" :value="item.id" :key="item.companyId" />
          </el-select>
        </el-form-item>
        <el-form-item v-permission="'excitation:rule:settlement-check-list'">
          <el-button type="primary" @click="onSubmit()">查询</el-button>
          <el-button @click="() => {
            resetForm()
            companyList = []
          }
            ">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div id="table">
      <el-table :data="tableData.list" border style="width: 100%" :cell-style="cellStyle">
        <el-table-column prop="statementMonthName" label="账期月份" width="180" align="center" />
        <el-table-column prop="checkStatuText" label="核算核对进度" width="180" align="center" />
        <el-table-column prop="excitationTypeText" label="激励类型" width="180" align="center" />
        <el-table-column prop="totalExcitationAmount" label="激励金额" align="center"></el-table-column>
        <el-table-column prop="totalFirstCommissionAmount" label="发放金额" align="center" />
        <el-table-column prop="totalRemainCommissionAmount" label="结余金额" align="center" />
        <el-table-column prop="companyName" label="公司名称" align="center" />
        <el-table-column prop="operation" label="操作" align="center">
          <template #default="scope">
            <div class="operation">
              <el-link type="primary"
                v-if="scope.row.checkStatus == 13 || scope.row.checkStatus == 21 || scope.row.checkStatus == 31"
                @click="accounting(scope.row)" v-permission="'excitation:rule:settlement-check-init-data.action'">
                核算
              </el-link>
              <el-link type="primary" @click="collate(scope.row, 1)" v-if="scope.row.checkStatus == 21"
                v-permission="'excitation:order:settle-station-check'">
                核对
              </el-link>
              <el-link type="primary" @click="collate(scope.row, 0)" v-if="scope.row.checkStatus == 31"
                v-permission="'excitation:order:settle-company-check'">
                核对
              </el-link>
              <el-link type="primary" @click.prevent="collateEndConfirm(scope.row)" v-if="scope.row.checkStatus == 31"
                v-permission="'excitation:rule:settlement-check-update-check-completed'">
                确认核对结束
              </el-link>
              <el-link type="primary" @click.prevent="approvalEndConfirm(scope.row)" v-if="scope.row.checkStatus == 49"
                v-permission="'excitation:rule:settlement-check-update-approval-completed'">
                确认审批结束
              </el-link>
              <el-link type="primary" @click="details(scope.row)"
                v-permission="'excitation:rule:settlement-emp-month-exst-list'">
                查看员工激励
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin-top: 10px">
        <el-pagination background layout="total,sizes,prev, pager, next" :total="tableData.total"
          v-model:current-page="formData.ecejCurrentPage" v-model:page-size="formData.ecejPageSize" />
      </div>
    </div>

    <!-- <el-dialog v-model="collateStationVisible" destroy-on-close :fullscreen="true" title="核算激励">
      <IncentiveAccounting :id="childrenData.companyMonthStatementExcitationCheckId" :companyId="childrenData.companyId">
      </IncentiveAccounting>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="collateStationVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog> -->
    <!-- <el-dialog v-model="detailsVisible" destroy-on-close :fullscreen="true" title="查看员工激励">
      <IncentiveStaffIncentive :id="childrenData.companyMonthStatementExcitationCheckId"
        :companyId="childrenData.companyId"></IncentiveStaffIncentive>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailsVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useFormRules } from '@/hooks/useFormRule'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCommon } from '@/store'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import {
  initData,
  getTableList,
  checkRoleVerification,
  checkEnd,
  approvalEnd
} from '@/webapi/incentive-proofread'
import { GetCompanyList } from '@/webapi/common'
import IncentiveAccounting from '@/views/incentive-proofread/incentive-accounting.vue'
import IncentiveStaffIncentive from '@/views/incentive-proofread/incentive-staffIncentive.vue'
import IncentiveCollateStation from './incentive-collate-station.vue'
import IncentiveCollateCompany from './incentive-collate-company.vue'
import { useDialog } from '@/components/dialog'

const accountingDialog = useDialog<typeof IncentiveAccounting>(
  IncentiveAccounting,
  {
    title: '核算激励',
    fullscreen: true,
    confirmShow: false,
    cancelText: '关闭'
  }
)

const staffIncentiveDialog = useDialog<typeof IncentiveStaffIncentive>(
  IncentiveStaffIncentive,
  {
    title: '查看员工激励',
    fullscreen: true,
    confirmShow: false,
    cancelText: '关闭'
  }
)

const collateStationDialog = useDialog<typeof IncentiveCollateStation>(
  IncentiveCollateStation,
  {
    title: '核对激励',
    fullscreen: true,
    confirmShow: false,
    cancelText: '关闭'
  }
)

const collateCompanyDialog = useDialog<typeof IncentiveCollateCompany>(
  IncentiveCollateCompany,
  {
    title: '核对激励',
    fullscreen: true,
    confirmShow: false,
    cancelText: '关闭'
  }
)
const { ruleFormRef, rules, resetForm } = useFormRules()
const childrenData = ref({
  companyMonthStatementExcitationCheckId: undefined,
  companyId: undefined
})
const checkStatusMapList = ref([])
const excitationTypeMapList = ref([])
// const collateStationVisible = ref(false)
// const detailsVisible = ref(false)
const formData = reactive({
  cityId: undefined,
  companyId: undefined,
  checkStatus: undefined,
  excitationType: undefined,
  ecejCurrentPage: undefined,
  ecejPageSize: undefined
})
const tableData = ref({
  list: [],
  total: 0
})
const commonStore = useCommon()
const { getCityList } = commonStore
const { cityList } = storeToRefs(commonStore)
// console.log(router.getRoutes())
const companyList = ref([])
onMounted(async () => {
  let res = await initData()
  checkStatusMapList.value = res.data.checkStatusMapList
  excitationTypeMapList.value = res.data.excitationTypeMapList
  getCityList()
})
// 分页器触发
watch([() => formData.ecejCurrentPage, () => formData.ecejPageSize], () => { queryTable() })
// 提交
const onSubmit = () => {
  formData.ecejCurrentPage = 1
  formData.ecejPageSize = 10
  queryTable()
}
// 查询
const queryTable = async () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      let res = await getTableList({ ...formData })
      let list = res.data.list
      list.forEach((item: any) => {
        let findExcitationType = excitationTypeMapList.value.find(
          el => el.id == item.excitationType
        )
        let findCheckStatus = checkStatusMapList.value.find(
          el => el.id == item.checkStatus
        )
        item.checkStatuText = findCheckStatus.name
        item.excitationTypeText = findExcitationType.name
      })
      tableData.value.list = list
      tableData.value.total = res.data.total
    }
  })
}

// 城市下拉触发
const cityIdChange = (cityId: any) => {
  formData.companyId = undefined
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}
// 核算
const accounting = (row: any) => {
  // childrenData.value = {
  //   companyMonthStatementExcitationCheckId:
  //     row.companyMonthStatementExcitationCheckId,
  //   companyId: row.companyId
  // }
  // collateStationVisible.value = true
  accountingDialog.open({ id: row.companyMonthStatementExcitationCheckId, companyId: row.companyId })
}
// collateCompanyDialog.open()
// 核对
const collate = (row: any, type: any) => {
  childrenData.value = {
    companyMonthStatementExcitationCheckId:
      row.companyMonthStatementExcitationCheckId,
    companyId: row.companyId
  }
  if (type) {
    // 服务站核对
    collateStationDialog.open({
      companyMonthStatementExcitationCheckId:
        row.companyMonthStatementExcitationCheckId
    })
  } else {
    // 校验当前角色有无公司核对权限
    checkRoleVerification({ ...childrenData.value }).then(res => {
      if (res.code != 200) {
        ElMessage.error(res.message)
        return false
      }
      if (res.data.verification) {
        // 公司核对
        collateCompanyDialog.open({
          companyMonthStatementExcitationCheckId:
            row.companyMonthStatementExcitationCheckId,
          companyMonthStatementExcitationCheckRoleId: res.data.companyMonthStatementExcitationCheckRoleId,
          companyMonthStatementExcitationCheckRoleUserRelationId: res.data.companyMonthStatementExcitationCheckRoleUserRelationId
        }).then(res => {

        })
      } else {
        ElMessageBox.alert(
          '公司待核对激励是指定的角色人员进行核对，您暂无此权限！',
          '提示',
          { confirmButtonText: '关闭' }
        )
      }
    })
  }
}
// 查看员工激励
const details = (row: any) => {
  // childrenData.value = {
  //   companyMonthStatementExcitationCheckId:
  //     row.companyMonthStatementExcitationCheckId,
  //   companyId: row.companyId
  // }
  // detailsVisible.value = true
  staffIncentiveDialog.open({ id: row.companyMonthStatementExcitationCheckId, companyId: row.companyId })
}
// 确认核对结束
const collateEndConfirm = (row: any) => {
  ElMessageBox({
    title: '提示',
    message: `<p>确认激励核对结束吗？</p>
                  <p>确认后，即此项月度激励不可再更改，后续将进行激励审批。</p>`,
    dangerouslyUseHTMLString: true,
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    beforeClose: async (action: string, instance: any, done: any) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Loading...'
        let res = await checkEnd({ ...row, checkStatus: 36 })
        if (res.code == 200) {
          queryTable()
        }
        done()
        instance.confirmButtonLoading = false
        if (res.code == -31200 || res.code == -31201 || res.code == -31202) {
          // -31200 公司核对中 -31201 核对结束 -31202 核对完成
          ElMessageBox({
            title: '提示',
            message: res.message,
            dangerouslyUseHTMLString: true,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            beforeClose: (a: any, b: any, close: any) => {
              close()
            }
          })
        } else {
          ElMessage({
            type: res.code == 200 ? 'success' : 'error',
            message: res.message
          })
        }
      } else {
        done()
      }
    }
  })
}

// 确认审批结束
const approvalEndConfirm = (row: any) => {
  ElMessageBox({
    title: '提示',
    message: `<p>确认激励审批结束吗？</p>
              <p>确认后，即此项月度激励按审批结果发放激励。</p>`,
    dangerouslyUseHTMLString: true,
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    beforeClose: async (action: string, instance: any, done: any) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Loading...'
        let res = await approvalEnd({ ...row })
        if (res.code == 200) {
          queryTable()
        }
        instance.confirmButtonLoading = false
        done()
        ElMessage({
          type: res.code == 200 ? 'success' : 'error',
          message: res.message
        })
      } else {
        done()
      }
    }
  })
}

// 表格字段为空操作
const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
  let value = row[column.property]
  if (row[column.property] === null || row[column.property] === undefined || row[column.property] === '') {
    // console.log(row[column.property] == '')
    value = '--'
  }
  row[column.property] = value
}
</script>
<style lang="scss" scoped>
#Box {
  padding: 20px;
}

.el-link {
  margin-right: 8px;
}
</style>
