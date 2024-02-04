<template>
  <div class="incentive-collate-station-table">
    <refresh-alert :showFlag="refreshFlag" @is-refresh="search" />
    <div class="form-wrap">
      <el-form :inline="true" :model="formData" ref="ruleFormRef">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="formData.orderNo" placeholder="请搜索订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="关联sap销售单号" prop="relateOrderNo">
          <el-input v-model="formData.relateOrderNo" placeholder="请搜索关联sap销售单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="人员信息" prop="promoterId">
          <el-select v-model="formData.promoterId" filterable clearable remote reserve-keyword placeholder="姓名/员工编号"
            :remote-method="remoteMethod" :loading="selectRemote.loading" style="width: 200px">
            <el-option v-for="item in selectRemote.options" :key="item?.promoterId"
              :label="`${item?.promoterName}-${item?.empNo}`" :value="item?.promoterId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-permission="'excitation:order:settle-station-check:list'" type="primary" @click="search">查询</el-button>
          <el-button v-permission="'excitation:order:settle-station-check:list'" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button
        v-permission="'excitation:order:settle-station-check:asyn-export'"
        v-if="checkStatus === MainCheckStatus.SVC_STA_CHECK"
        type="primary"
        plain
        :loading="exportDataLoading"
        @click="exportData"
      >
        导出
      </el-button>
      <el-button
        v-permission="'excitation:order:settle-station-check:problem-markers'"
        type="warning"
        :disabled="currentSelectedList.length === 0"
        plain
        @click="openMarker"
      >
        激励问题标记
      </el-button>
      <el-button
        v-permission="'excitation:order:settle-station-check:confirm-check'"
        v-if="checkStatus === MainCheckStatus.SVC_STA_CHECK"
        type="primary"
        :disabled="currentSelectedList.length === 0"
        :loading="confirmCheckLoading"
        @click="confirmCheck"
      >
        确认核对
      </el-button>
      <el-button
        v-permission="'excitation:order:settle-station-check:import'"
        v-if="checkStatus === MainCheckStatus.SVC_STA_CHECK"
        @click="sbImport" type="primary">导入激励自动确认核对</el-button>
      <el-upload
        v-show="false"
        :before-upload="beforeUpload"
        :show-file-list="false"
        accept="file"
        action="#"
      >
        <el-button type="primary" ref="sb"></el-button>
      </el-upload>
      <!-- <el-upload
        v-permission="'excitation:order:settle-station-check:import'"
        v-if="checkStatus === MainCheckStatus.SVC_STA_CHECK"
        :before-upload="beforeUpload"
        :show-file-list="false"
        accept="file"
        action="#"
      >
        <el-button type="primary">导入激励自动确认核对</el-button>
      </el-upload> -->
    </div>
    <table-with-pagination
      :table-config="tableConfig"
      :page-config="pageConfig"
      @page-change="tablePageChange"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="selection" width="40" fixed />
      <el-table-column prop="orderNo" label="订单编号" align="center" width="180" />
      <el-table-column prop="extOrderNo" label="关联SAP销售单号*" align="center" width="180"  />
      <el-table-column prop="detailAddr" label="订单地址" align="center" width="180" />
      <el-table-column prop="orderFinishTime" label="订单完成时间" align="center" width="180" date="YYYY-MM-DD HH:mm:ss" />
      <el-table-column prop="orderInvoiceTime" label="开票时间*" align="center" width="110" date="YYYY-MM-DD" />
      <el-table-column prop="goodsName" label="商品名称*" align="center" width="150" />
      <el-table-column prop="materialNo" label="关联物料号*" align="center" width="120" />
      <el-table-column prop="quantity" label="数量*" align="center" />
      <el-table-column prop="paidAmount" label="实收金额" align="center" width="100" />
      <el-table-column prop="commissionAmount" label="激励金额*" align="center" width="100" />
      <el-table-column prop="firstCommissionAmount" label="月度发放金额*" align="center" width="140" />
      <el-table-column prop="remainCommissionAmount" label="月度结余金额" align="center" width="140" />
      <el-table-column prop="promoterName" label="员工姓名*" align="center" width="100" />
      <el-table-column prop="empNo" label="员工编号*" align="center" width="100" />
      <el-table-column prop="deptName" label="员工组织部门*" align="center" width="140" />
      <el-table-column prop="commissionRemark" label="激励说明*" align="center" width="150" />
      <el-table-column prop="statementMonthName" label="账期月份" align="center" width="100" />
      <el-table-column prop="address" label="激励变动说明" align="center" width="120" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="checkIncentiveChange(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="核查问题标记" align="center" width="140" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="checkIncentiveError(scope.row)">查看激励错误</el-button>
        </template>

      </el-table-column>
    </table-with-pagination>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, watchEffect, computed, onMounted } from 'vue'
import { useTableFetch } from '@/hooks/useTableFetch'
import {
  GetListStation,
  ConfirmCheckStation,
  AsyncExportStation,
  ImportDataStation,
  MainCheckStatus,
  type InitDataStation
} from '@/webapi/incentive-collate'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile, FormInstance } from 'element-plus'
import type { ServiceStationCheck } from '@/webapi/incentive-collate'
import TableWithPagination from '@/components/tableWithPagination2/tableWithPagination.vue'
import RefreshAlert from './refreshAlert.vue'
import { useRemoteSearchPromoter } from '@/hooks/useRemoteSearch'
import ProblemMarkersStationC from './problemMarkersStation.vue'
import IncentiveChange from './incentiveChange.vue'
import IncentiveError from './incentiveError.vue'
import { useDialog } from '@/components/dialog'

const props = defineProps<{
  initData: InitDataStation,
  promoterDeptId: number,
  checkStatus: MainCheckStatus,
  currentActiveTab: MainCheckStatus
}>()
const emit = defineEmits(['isReInit'])
const ruleFormRef = ref<FormInstance>()
const formData = reactive({}) as Partial<Pick<ServiceStationCheck, 'orderNo' | 'relateOrderNo' | 'promoterId'>>
const refreshFlag = ref(0)
const { selectRemote, remoteMethod } = useRemoteSearchPromoter()

/**
 * @description 列表
 */
type Table = API.ReturnFetchDataType<typeof GetListStation>['list'][0]
const params = reactive({
  cityId: props.initData.cityId,
  companyId: props.initData.companyId,
  mainCheckStatus: props.initData.mainCheckStatus,
  companyMonthStatementExcitationCheckId: props.initData.companyMonthStatementExcitationCheckId,
  promoterDeptId: props.promoterDeptId,
  checkStatus: props.checkStatus
}) as ServiceStationCheck
const { getData, tablePageChange, pageConfig, tableConfig } = useTableFetch<
  ServiceStationCheck,
  {
    list: Table[]
    total: number
  },
  Table
>(params, GetListStation, res => {
  if (res.code === 200) {
    refreshFlag.value = (new Date()).getTime()
    tableConfig.value.data = res.data.list
    tableConfig.value.total = res.data.total
  }
})

getData()

const isCurrentActiveTab = computed(() => props.currentActiveTab === props.checkStatus)
const checkOrderExcitationItemInputList = computed(() => {
  return currentSelectedList.value.map(item => {
    return {
      checkOrderExcitationItemId: item.checkOrderExcitationItemId,
      orderRelationExcitationItemId: item.orderRelationExcitationItemId,
      orderExcitationItemId: item.orderExcitationId,
      commissionAmount: item.commissionAmount
    }
  })
})
/**
 * @description 监听服务站切换
 */
watch(() => props.promoterDeptId, (val) => {
  params.promoterDeptId = val
  // if (isCurrentActiveTab.value) {
  //   getData()
  // }
  getData()
})

/**
 * @description 监听formData
 */
 watch(formData, () => {
  params.orderNo = formData.orderNo ? formData.orderNo : undefined
  params.relateOrderNo = formData.relateOrderNo ? formData.relateOrderNo : undefined
  params.promoterId = formData.promoterId ? formData.promoterId : undefined
})

/**
 * @description 查询
 */
const search = () => {
  getData()
}

/**
 * @description 重置
 */
const reset = () => {
  ruleFormRef.value?.resetFields()
}

/**
 * @description 异步导出
 */
const exportDataLoading = ref(false)
const exportData = () => {
  exportDataLoading.value = true
  AsyncExportStation({
    ...params,
    ...pageConfig
  }).then(res => {
    exportDataLoading.value = false
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

/**
 * @description 激励问题标记
 */
const dialogMarker = useDialog<typeof ProblemMarkersStationC>(ProblemMarkersStationC, { title: '激励问题标记' })
const openMarker = () => {
  dialogMarker.open({
    checkOrderExcitationItemInputList: checkOrderExcitationItemInputList.value,
    companyId: props.initData.companyId,
    companyMonthStatementExcitationCheckId: props.initData.companyMonthStatementExcitationCheckId
  }).then(res => {
    if (res.action === 'confirm') {
      emit('isReInit')
      getData()
    }
  })
}

/**
 * @description 确认核对
 */
const confirmCheckLoading = ref(false)
const confirmCheck = () => {
  confirmCheckLoading.value = true
  ConfirmCheckStation({
    checkOrderExcitationItemInputList: checkOrderExcitationItemInputList.value,
    companyId: props.initData.companyId,
    companyMonthStatementExcitationCheckId: props.initData.companyMonthStatementExcitationCheckId
  }).then(({ code, message }) => {
    confirmCheckLoading.value = false
    if (code === 200) {
      ElMessage({
        type: 'success',
        message: '核对成功'
      })
      emit('isReInit')
      getData()
    } else {
      ElMessage({
        type: 'error',
        message
      })
    }
  })
}

/**
 * @description 导入自动核对
 */
 const beforeUpload = (file: UploadFile) => {
  const {
    companyId,
    companyMonthStatementExcitationCheckId
  } = props.initData
  ImportDataStation({
    file,
    checkStatus: props.checkStatus,
    companyId,
    promoterDeptId: props.promoterDeptId,
    companyMonthStatementExcitationCheckId
  }).then(res => {
    ElMessage({
      type: res.code === 200 ? 'success' : 'error',
      message: res.message
    })
    emit('isReInit')
    getData()
  })
  return false
}
const sb = ref()
const sbImport = () => {
  ElMessageBox.confirm(
    '说明：从系统导出的激励表格，线下核对后，支持按原导出的表格把核对无误的激励数据导入系统，系统可自动确认核对。',
    '导入激励自动确认核对',
    {
      confirmButtonText: '导入',
      cancelButtonText: '取消'
    }
  )
  .then(() => {
    sb.value?.ref.click()
  }).catch()
}

/**
 * @description 激励变动记录
 */
const dialogCheckIncentiveChange = useDialog<typeof IncentiveChange>(IncentiveChange, { title: '激励变动记录' })
const checkIncentiveChange = (row: Table) => {
  dialogCheckIncentiveChange.open({ clickRow: row, initData: props.initData })
}

/**
 * @description 查看激励错误
 */
const dialogCheckIncentiveError = useDialog<typeof IncentiveError>(IncentiveError, { title: '查看激励错误' })
const checkIncentiveError = (row: Table) => {
  dialogCheckIncentiveError.open({ clickRow: row, initData: props.initData })
}

/**
 * @description 表格复选回调
 */
const currentSelectedList = ref<Table[]>([])
const handleSelectionChange = (val: Table[]) => {
  currentSelectedList.value = val
}

</script>
<style scoped lang="scss">
.incentive-collate-station-table {
  .form-wrap {
    .el-input {
      width: 180px;
    }
  }

  .button-group {
    display: flex;
    :deep(.el-upload){
      margin-left: 15px;
    }
  }
}
</style>

