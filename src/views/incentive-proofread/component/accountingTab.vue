<template>
  <div id="box">
    <div>
      <div>
        <el-form :model="fromData" class="demo-form-inline" ref="searchFrom" :inline="true">
          <el-form-item label="订单编号" prop="orderNo">
            <el-input v-model="fromData.orderNo" placeholder="请搜索订单编号" />
          </el-form-item>
          <el-form-item label="关联sap销售单号" prop="relateOrderNo">
            <el-input v-model="fromData.relateOrderNo" placeholder="请搜索关联SAP销售单号" />
          </el-form-item>
          <el-form-item label="人员信息" prop="promoterId">
            <el-select v-model="fromData.promoterId" filterable clearable remote reserve-keyword placeholder="请输入姓名/员工编号"
              :remote-method="remoteMethod" :loading="empList.loading" style="width: 200px">
              <el-option v-for="item in empList.options" :key="item.promoterId" :label="`${item.text}`"
                :value="item.promoterId" />
            </el-select>
          </el-form-item>
          <el-form-item v-permission="'excitation:rule:settlement-check-calculate-list.action'">
            <el-button type="primary" @click="onSubmit()">查询</el-button>
            <el-button @click="() => { searchFrom.resetFields() }">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="buttonGroup" v-if="active == '13'">
        <el-button plain @click="exportIncentive" v-permission="'excitation:rule:settlement-check-asyn-export'"
          type="primary">导出</el-button>
        <el-button @click="importIncentivePopStatus = true" plain v-permission="'excitation:rule:settlement-check-import'"
          type="primary">导入激励</el-button>
        <el-button @click="adjustmentDialogOpen" :disabled="selectRow.length != 1" plain
          v-permission="'excitation:rule:settlement-check-update-adjust'" type="warning">激励调整</el-button>
        <el-button @click="cancellationDialogOpen" :disabled="!selectRow.length" plain
          v-permission="'excitation:rule:settlement-check-update-cancel'" type="warning">激励作废</el-button>
        <el-button @click="confirmAccounting" type="primary" :disabled="!selectRow.length"
          v-permission="'excitation:rule:settlement-check-confirm-calculate'">确认核算</el-button>
        <el-button @click="importConfirmPopStatus = true"
          v-permission="'excitation:rule:settlement-check-import-calculate'" type="primary">导入激励自动确认核算</el-button>
      </div>
      <div class="buttonGroup" v-else>
        <el-button @click="anewAccounting" :disabled="!selectRow.length" type="primary">重新核算</el-button>
      </div>
      <div>
        <TableList :tableData="tableData.list" :initData="initData" @getSelectRow="getSelectRow"></TableList>
        <div style="float: right;margin-top: 10px;">
          <el-pagination background layout="total,sizes,prev, pager, next" :total="tableData.total"
            v-model:current-page="fromData.ecejCurrentPage" v-model:page-size="fromData.ecejPageSize" />
        </div>
      </div>

      <!-- 导入激励 -->
      <el-dialog v-model="importIncentivePopStatus" title="导入激励数据" width="30%" append-to-body="true">
        <div style="display: flex;align-items: center;">
          <span style="width: 85px;">选择公司：</span>
          <el-input disabled placeholder="Please input" style="width: 100%;" :value="initData.companyName" />
        </div>
        <div>
          <p>选择账期：(说明：月度核算完成的账期不支持导入激励数据，即不可选择此账期)</p>
          <el-input disabled placeholder="Please input" style="width: 100%;"
            :value="`${initData.statementMonthName}(${dayjs(initData.startTime).format('YYYY-MM-DD HH:mm:ss')}~${dayjs(initData.endTime).format('YYYY-MM-DD HH:mm:ss')})`" />
        </div>

        <template #footer>
          <span style="display: flex;align-items: center;justify-content: space-between;">
            <el-link type="primary" @click="downloadTemplate"
              v-permission="'excitation:rule:settlement-check-downloadTpl'">
              下载模版
              <el-icon :size="20" color="#72B7FF">
                <Bottom />
              </el-icon>
            </el-link>
            <div style="display: flex;justify-content: flex-end;">
              <el-button :loading="importIncentiveLoading" @click="importIncentivePopStatus = false"
                style="margin-right:20px;">取消</el-button>
              <el-upload ref="upload" class="upload-demo" action="#" :show-file-list="false"
                :http-request="importConfirm">
                <template #trigger>
                  <el-button type="primary">导入上传</el-button>
                </template>
              </el-upload>
            </div>
          </span>
        </template>
      </el-dialog>
      <!-- 激励导入自动确定 -->
      <el-dialog v-model="importConfirmPopStatus" title="导入激励自动确认核算" width="50%" id="autoImport"
        style="background: white;height: auto;" append-to-body="true">
        <div>
          说明：从系统导出的激励表格，线下核算后，支持按原导出的表格把核算无误的激励数据导入系统，系统可自动确认核算。
        </div>
        <template #footer>
          <div style="display: flex;justify-content: flex-end;">
            <el-button @click="importConfirmPopStatus = false" style="margin-right: 20px;">取消</el-button>
            <el-upload ref="upload" class="upload-demo" action="#" :show-file-list="false"
              :http-request="importAutoConfirm">
              <template #trigger>
                <el-button type="primary">导入</el-button>
              </template>
            </el-upload>
          </div>

        </template>
      </el-dialog>


    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, toRefs } from 'vue'
import { ElMessage, ElMessageBox, ElLoading, genFileId } from 'element-plus'
import { Bottom } from '@element-plus/icons-vue'
import type { UploadInstance, UploadProps, UploadRawFile, UploadRequestOptions } from 'element-plus'
import dayjs from 'dayjs'
import TableList from "@/views/incentive-proofread/component/TableList.vue";
import cancellation from "@/views/incentive-proofread/component/cancellation.vue";
import adjustment from "@/views/incentive-proofread/component/adjustment.vue";
import {
  getEmpList,
  calculatList,
  confirmCalculate,
  updateRecalculate,
  updateExport,
  importCalculate,
  accountingImport
} from "@/webapi/incentive-proofread";
import { useDialog } from '@/components/dialog'
const props = defineProps<{
  active: String
  initData: any
}>()
const { active, initData } = toRefs(props)
const searchFrom = ref(null)
const fromData = reactive({
  promoterId: undefined,
  orderNo: undefined,
  relateOrderNo: undefined,
  ecejCurrentPage: 1,
  ecejPageSize: 10
})
const empList: any = reactive({ options: [], loading: false })
const tableData = ref({ list: [], total: 0 })
const selectRow = ref([])
const importIncentivePopStatus = ref(false)
const importIncentiveLoading = ref(false)
const importConfirmPopStatus = ref(false)
const upload = ref<UploadInstance>()

const cancellationDialog = useDialog<typeof cancellation>(
  cancellation,
  {
    title: '激励作废',
  }
)

const cancellationDialogOpen = () => {
  cancellationDialog.open({ active: active, initData: initData, selectRow: selectRow }).then((res) => {
    // console.log(res)
    if (res.action == 'confirm') {
      queryTable()
    }
  })
}

const adjustmentDialog = useDialog<typeof adjustment>(
  adjustment,
  {
    title: '激励调整',
  }
)

const adjustmentDialogOpen = () => {
  adjustmentDialog.open({ active: active, initData: initData, selectRow: selectRow }).then((res) => {
    // console.log(res)
    if (res.action == 'confirm') {
      queryTable()
    }
  })
}
// 分页器触发
watch([() => fromData.ecejCurrentPage, () => fromData.ecejPageSize], (a, b) => { queryTable() })
watch(initData, () => { queryTable() })
// 人员信息输入联想
const remoteMethod = (val: string) => {
  if (val) {
    const isPhoneNo = !isNaN(Number(val))
    const params: {
      companyId?: String,
      promoterName?: string
      empNo?: string
    } = {}
    if (isPhoneNo) {
      params['empNo'] = val
    } else {
      params['promoterName'] = val
    }
    params.companyId = initData.value.companyId
    empList.loading = true
    getEmpList({ ...params }).then(res => {
      empList.loading = false
      if (res.code === 200) {
        empList.options = res?.data ? res.data : []
        empList.options.forEach((item: any) => {
          let text = ''
          if (item.promoterName && item.empNo) {
            text = item.promoterName + '-' + item.empNo
          } else if (item.promoterName) {
            text = item.promoterName
          } else if (item.empNo) {
            text = item.empNo
          }
          item.text = text
        })
      }
    })
  } else {
    empList.options = []
  }
}
// 获取选中数据
const getSelectRow = (row: any) => {
  selectRow.value = row
  console.log(row)
}
// 提交
const onSubmit = () => {
  fromData.ecejCurrentPage = 1
  fromData.ecejPageSize = 10
  queryTable()
}
// 查询
const queryTable = async () => {
  console.log(initData.value)
  let data = JSON.parse(JSON.stringify(fromData))
  for (let key in data) {
    if (!data[key]) {
      data[key] = undefined
    }
  }
  let res = await calculatList({
    ...data,
    cityId: initData.value.cityId,
    companyId: initData.value.companyId,
    companyMonthStatementExcitationCheckId: initData.value.companyMonthStatementExcitationCheckId,
    checkStatus: active.value,
    excitationType: initData.value.excitationType,
  })
  tableData.value = res.data
}



// 确认核算
const confirmAccounting = async () => {
  let res = await confirmCalculate({
    checkOrderExcitationItemInputList: [...selectRow.value],
    companyId: initData.value.companyId,
    companyMonthStatementExcitationCheckId: initData.value.companyMonthStatementExcitationCheckId,
    checkStatus: 13,
  })
  if (res.code == 200) {
    ElMessage.success('确认核算成功')
    queryTable()
  } else {
    ElMessage.error(res.message)
  }
}

// 重新核算
const anewAccounting = () => {
  ElMessageBox({
    title: '提示',
    message: `<p>确认重新核算吗？</p><p>确认后，将进入待核算中，可重新核算。</p>`,
    dangerouslyUseHTMLString: true,
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    beforeClose: async (action: string, instance: any, done: any) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Loading...'
        let res = await updateRecalculate({
          checkOrderExcitationItemInputList: [...selectRow.value],
          companyId: initData.value.companyId,
          companyMonthStatementExcitationCheckId: initData.value.companyMonthStatementExcitationCheckId,
          checkStatus: active.value,
        })
        done()
        if (res.code == 200) {
          ElMessage.success('重新核算成功')
          queryTable()
        } else {
          ElMessage.error(res.message)
        }
      } else {
        done()
      }
    }
  })
}
let lockLoading: any
// 导出
const exportIncentive = async () => {
  lockLoading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  let res = await updateExport({
    checkOrderExcitationItemInputList: [...selectRow.value],
    companyId: initData.value.companyId,
    excitationType: initData.value.excitationType,
    companyMonthStatementExcitationCheckId: initData.value.companyMonthStatementExcitationCheckId,
    checkStatusList: [13],
    ...fromData,
  })
  ElMessage({
    type: res.code == 200 ? 'success' : 'error',
    message: res.message
  })
  lockLoading.close()
}

// 导入自动确认核对(上传文件)
const importAutoConfirm = (options: UploadRequestOptions) => {
  console.log(options)
  lockLoading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  importCalculate({
    file: options.file,
    excitationType: initData.value.excitationType,
    companyId: initData.value.companyId,
    companyMonthStatementExcitationCheckId: initData.value.companyMonthStatementExcitationCheckId,
    cityName: initData.value.cityName,
    cityId: initData.value.cityId,
    companyMonthExcitationStatementId: initData.value.companyMonthExcitationStatementId,

  }).then((res: any) => {
    if (res.code === 200) {
      queryTable()
      ElMessage.success('导入自动确认核对成功')
    } else {
      ElMessage.error(res.message)
    }
    lockLoading.close()
    importConfirmPopStatus.value = false
  }).catch((err) => {
    ElMessage.error(err)
  })
}
// 导入激励(上传文件)
const importConfirm = (options: UploadRequestOptions) => {
  console.log(options)
  lockLoading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  accountingImport({
    file: options.file,
    excitationType: initData.value.excitationType,
    companyId: initData.value.companyId,
    companyMonthStatementExcitationCheckId: initData.value.companyMonthStatementExcitationCheckId,
    cityName: initData.value.cityName,
    cityId: initData.value.cityId,
    companyMonthExcitationStatementId: initData.value.companyMonthExcitationStatementId,
  }).then((res: any) => {
    if (res.code === 200) {
      queryTable()
      ElMessage.success('导入成功')
    } else {
      ElMessage.error(res.message)
    }
    lockLoading.close()
    importIncentivePopStatus.value = false
  }).catch((err) => {
    ElMessage.error(err)
  })
}
// 下载模版
const downloadTemplate = () => {
  console.log(import.meta.env.ECEJ_HOST)
  window.location.href = import.meta.env.ECEJ_HOST + '/hradmin/excitation/service-station-calculate/downloadTpl'
}


</script>
<style lang="scss" scoped>
.buttonGroup {
  margin-bottom: 10px;
}

.el-input {
  max-width: 100% !important;
}

.pText {
  font-size: 18px;

  p {
    margin: 5px 0;
  }
}
</style>
