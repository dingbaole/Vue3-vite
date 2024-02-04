<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData" :rules="rules" ref="ruleFormRef">
      <el-form-item label="城市" prop="cityId">
        <el-select
          v-model="formData.cityId"
          @change="cityIdChange"
          filterable
          placeholder="城市"
        >
          <el-option
            v-for="item in cityList"
            :label="item.cityName"
            :value="item.cityId"
            :key="item.cityId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公司" prop="companyId">
        <el-select
          v-model="formData.companyId"
          @change="companyChange"
          filterable
          placeholder="公司"
        >
          <el-option
            v-for="item in companyList"
            :label="item.companyName"
            :value="item.companyId"
            :key="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务大类" prop="bigClassId">
        <el-select
          v-model="formData.bigClassId"
          @change="bigClassChange"
          filterable
          clearable
          placeholder="服务大类"
        >
          <el-option
            v-for="item in optionList.bigClass"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="deviceId">
        <el-select
          v-model="formData.deviceId"
          @change="deviceChange"
          filterable
          clearable
          placeholder="设备"
        >
          <el-option
            v-for="item in optionList.deviceList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务品类" prop="serviceClassId">
        <el-select
          v-model="formData.serviceClassId"
          @change="serviceClassChange"
          filterable
          clearable
          placeholder="服务品类"
        >
          <el-option
            v-for="item in optionList.serviceClassList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务项目" prop="serviceItemId">
        <el-select
          v-model="formData.serviceItemId"
          filterable
          clearable
          placeholder="服务项目"
        >
          <el-option
            v-for="item in optionList.serviceItemList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="formData.orderNo"
          clearable
          placeholder="订单编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="激励时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          clearable
        />
      </el-form-item>
      <el-form-item label="员工姓名/手机号" prop="empId">
        <el-select
          v-model="formData.empId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入姓名或手机号"
          :remote-method="remoteMethod"
          :loading="selectRemote.loading"
          style="width: 200px"
        >
          <el-option
            v-for="item in selectRemote.options"
            :key="item.empId"
            :label="`${item.mobileNo}(${item.empName})`"
            :value="item.empId"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="账期月份" prop="companyExcitationStatementId">
        <el-select
          v-model="formData.companyExcitationStatementId"
          filterable
          placeholder="账期月份"
          clearable
          class="custom-select"
        >
          <el-option
            v-for="item in statementList"
            :label="`${item.statementMonthName} (${dayjs(item.startTime).format(
              'YYYY-MM-DD HH:mm:ss'
            )} ~ ${dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss')})`"
            :value="item.companyExcitationStatementId"
            :key="item.companyExcitationStatementId"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="账期月份" prop="companyExcitationStatementId">
        <StatementSelect
          v-model="formData.companyExcitationStatementId"
          :company-id="formData.companyId"
          filterable
          placeholder="账期月份"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:rule:stat-serviceitem-list'"
          type="primary"
          @click="search"
          :loading="pageData.loading"
        >
          查询
        </el-button>
        <el-button
          v-permission="'excitation:rule:stat-serviceitem-list'"
          @click="reset"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:rule:stat-serviceitem-asyn-export'"
      type="primary"
      @click="exportData"
      :loading="exportLoading"
    >
      导出
    </el-button>
    <TableWithPagination
      ref="TableRef"
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.ecejCurrentPage"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="城市" property="cityName" width="100" />
      <el-table-column label="公司名称" property="companyName" width="200" />
      <el-table-column label="订单编号" property="orderNo" width="180" />
      />
      <el-table-column
        label="订单地址"
        property="detailAddres"
        width="180"
        align="center"
      >
        <template #default="scope">
          <div>
            {{ scope.row.detailAddres || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="完成时间"
        property="orderFinishTime"
        width="160"
        align="center"
      >
        <template #default="{ row }">
          <span>
            {{
              row.orderFinishTime
                ? dayjs(row.orderFinishTime).format('YYYY-MM-DD HH:mm:ss')
                : '--'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="服务大类" property="bigClassName" width="160" />
      <el-table-column label="设备" property="deviceName" width="160" />
      <el-table-column
        label="服务品类"
        property="serviceClassName"
        width="160"
      />
      <el-table-column
        label="服务项目"
        property="serviceItemName"
        width="160"
      />
      <el-table-column
        label="服务数量"
        property="quantity"
        width="90"
        align="center"
      />
      <el-table-column
        label="服务金额"
        property="receivableAmount"
        width="90"
        align="center"
      />
      <el-table-column
        label="实收金额"
        property="paidAmount"
        width="90"
        align="center"
      />
      <el-table-column
        label="激励金额"
        property="commissionAmount"
        width="90"
        align="center"
      />
      <el-table-column
        label="员工姓名"
        property="empName"
        width="100"
        align="center"
      />
      <el-table-column
        label="员工手机号"
        property="mobileNo"
        width="120"
        align="center"
      />
      <el-table-column
        label="激励时间"
        property="calculateTimeStamp"
        width="160"
      >
        <template #default="scope">
          <span>
            {{
              dayjs(scope.row.calculateTimeStamp).format('YYYY-MM-DD HH:mm:ss')
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="激励说明"
        property="commissionRemark"
        width="160"
      />
      <el-table-column
        label="激励状态"
        property="orderExcitateStatus"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          {{ row.orderExcitateStatus ?? '--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="账期月份"
        property="statementMonthName"
        width="320"
        align="center"
      >
        <template #default="{ row }">
          {{ row.statementMonthName ?? '--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="当期发放金额"
        property="currentDistributionAmount"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          {{
            row.statementMonthName
              ? row.currentDistributionAmount ?? '--'
              : '--'
          }}
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import StatementSelect from '@/components/statement/statementSelect.vue'
import {
  GetCompanyList,
  GetCompanyBigClassList,
  GetCompanyDeviceList,
  GetCompanyServiceClassList,
  GetCompanyServiceItemList,
  GetStatementList
} from '@/webapi/common'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import {
  ServiceItemStatisticsList,
  ServiceItemStatisticsExport
} from '@/webapi/statistics'
import type { ServiceItem } from '@/webapi/statistics'
import { useFormRules } from '@/hooks/useFormRule'
import { useRemoteSearchEmp } from '@/hooks/useRemoteSearch'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

const { selectRemote, remoteMethod } = useRemoteSearchEmp()
const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList } = storeToRefs(commonStore)

const dateRange = ref([])
const formData = reactive<ServiceItem>({
  cityId: undefined,
  companyId: undefined,
  bigClassId: undefined,
  deviceId: undefined,
  serviceClassId: undefined,
  serviceItemId: undefined,
  calculateTimeStart: undefined,
  calculateTimeEnd: undefined,
  empId: undefined,
  orderNo: ''
})

const genParams = () => {
  if (!dateRange.value) {
    return {
      ...formData
    }
  }
  if (dateRange.value.length === 0) {
    return {
      ...formData
    }
  }
  const calculateTimeStart: string = `${dateRange.value[0]} 00:00:00`
  const calculateTimeEnd: string = `${dateRange.value[1]} 23:59:59`
  return {
    ...formData,
    calculateTimeStart,
    calculateTimeEnd
  }
}

const exportLoading = ref(false)
const exportData = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      const params = genParams()
      exportLoading.value = true
      ServiceItemStatisticsExport({ ...params }).then(res => {
        exportLoading.value = false
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '导出成功'
          })
        } else {
          ElMessage({
            type: 'error',
            message: res.message
          })
        }
      })
    }
  })
}

onMounted(() => {
  init()
})

const search = () => {
  pageConfig.ecejCurrentPage = 1
  getList()
}

const reset = () => {
  companyList.value = []
  dateRange.value = []
  resetForm()
}

const pageConfig = reactive({
  ecejCurrentPage: 1,
  ecejPageSize: 10
})

const tablePageChange = ({
  currentPage,
  pageSize
}: {
  currentPage: number
  pageSize: number
}) => {
  pageConfig.ecejCurrentPage = currentPage
  pageConfig.ecejPageSize = pageSize
  getList()
}
const pageData = reactive<{
  tableData: any[]
  total: number
  loading: boolean
}>({
  tableData: [],
  total: 0,
  loading: false
})
const getList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      pageData.loading = true
      const params = genParams()
      ServiceItemStatisticsList({
        ...params,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          pageData.tableData = res.data.list
          pageData.total = res.data.total
        }
      })
    }
  })
}

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  resetOptions()
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

const resetOptions = () => {
  formData.bigClassId = undefined
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  formData.companyExcitationStatementId = undefined
  optionList.bigClass = []
  optionList.deviceList = []
  optionList.serviceClassList = []
  optionList.serviceItemList = []
}

interface IdName {
  id: number
  name: string
}
const optionList = reactive<{
  bigClass: IdName[]
  deviceList: IdName[]
  serviceClassList: IdName[]
  serviceItemList: IdName[]
}>({
  bigClass: [],
  deviceList: [],
  serviceClassList: [],
  serviceItemList: []
})

const companyChange = (companyId: number) => {
  resetOptions()
  GetCompanyBigClassList({ companyId }).then(res => {
    if (res.code === 200) {
      optionList.bigClass = res.data
    }
  })
}

const bigClassChange = (bigClassId: number) => {
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  optionList.deviceList = []
  optionList.serviceClassList = []
  optionList.serviceItemList = []
  if (!bigClassId) return
  GetCompanyDeviceList({
    companyId: formData.companyId,
    bigClassId
  }).then(res => {
    if (res.code === 200) {
      optionList.deviceList = res.data
    }
  })
}

const deviceChange = (deviceId: number) => {
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  optionList.serviceClassList = []
  optionList.serviceItemList = []
  if (!deviceId) return
  GetCompanyServiceClassList({
    companyId: formData.companyId,
    deviceId
  }).then(res => {
    if (res.code === 200) {
      optionList.serviceClassList = res.data
    }
  })
}

const serviceClassChange = (serviceClassId: number) => {
  formData.serviceItemId = undefined
  optionList.serviceItemList = []
  if (!serviceClassId) return
  GetCompanyServiceItemList({
    companyId: formData.companyId,
    serviceClassId
  }).then(res => {
    if (res.code === 200) {
      optionList.serviceItemList = res.data
    }
  })
}
</script>

<style scoped lang="scss">
.custom-select {
  width: 400px;
  :deep(.el-input) {
    max-width: 100% !important;
  }
}
</style>
