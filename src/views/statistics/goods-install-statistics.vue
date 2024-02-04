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
      <el-form-item label="店铺" prop="marketShopId">
        <el-select
          v-model="formData.marketShopId"
          filterable
          placeholder="店铺"
          clearable
        >
          <el-option
            v-for="item in marketShopList"
            :label="`${item.shopName}(店铺编码: ${item.thirdShopNo})`"
            :value="item.marketShopId"
            :key="item.marketShopId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="集市单号" prop="orderNo">
        <el-input v-model="formData.orderNo" placeholder="集市单号" clearable />
      </el-form-item>
      <el-form-item label="物料号" prop="materialNo">
        <el-input
          v-model="formData.materialNo"
          placeholder="物料号"
          clearable
        />
      </el-form-item>
      <el-form-item label="订单完成时间">
        <el-date-picker
          v-model="dateRange2"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          clearable
        />
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
      <el-form-item label="员工信息" prop="empId">
        <el-select
          v-model="formData.empId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入姓名或手机号"
          :remote-method="remoteMethod"
          :loading="selectRemote2.loading"
          style="width: 200px"
        >
          <el-option
            v-for="item in selectRemote2.options"
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
          v-permission="'excitation:rule:stat-install-list'"
          type="primary"
          @click="search"
          :loading="pageData.loading"
        >
          查询
        </el-button>
        <el-button
          v-permission="'excitation:rule:stat-install-list'"
          @click="reset"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:rule:stat-install-asyn-export'"
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
      <el-table-column label="公司名称" property="companyName" width="260">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <div style="font-size: 12px">
            ( 公司代码: {{ scope.row.companyCode }} )
          </div>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" property="shopName" width="200">
        <template #default="scope">
          <div>{{ scope.row.shopName }}</div>
          <div style="font-size: 12px">
            ( 店铺编码: {{ scope.row.thirdShopNo }} )
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="关联服务订单号"
        property="extOrderNo"
        width="180"
        align="center"
      >
        <template #default="scope">
          <div>{{ scope.row.extOrderNo ? scope.row.extOrderNo : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单地址" property="detailAddres" width="180">
        <template #default="scope">
          <div>
            {{ scope.row.detailAddres || '--' }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="完成时间"
        property="orderFinishTime"
        width="160"
        align="center"
      >
        <template #default="{ row }">
          <span>{{
            row.orderFinishTime
              ? dayjs(row.orderFinishTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开票时间"
        property="orderInvoiceTime"
        width="160"
        align="center"
      >
        <template #default="{ row }">
          <span>{{
            row.orderInvoiceTime
              ? dayjs(row.orderInvoiceTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="物料号"
        property="materialNo"
        width="120"
        align="center"
      />
      <el-table-column label="SKU编号" property="skuNo" width="120" />
      <el-table-column label="商品名称" property="goodsName" width="220" />
      <el-table-column
        label="集市单号"
        property="orderNo"
        width="180"
        align="center"
      >
        <template #default="scope">
          <div>{{ scope.row.orderNo ?? '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="商品安装数量"
        property="quantity"
        width="120"
        align="center"
      />
      <el-table-column
        label="完成时间"
        property="orderFinishTime"
        width="160"
        align="center"
      >
        <template #default="{ row }">
          <span>{{ formatStr(row.orderFinishTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="开票时间"
        property="orderInvoiceTime"
        width="160"
        align="center"
      >
        <template #default="{ row }">
          <span>{{
            row.orderInvoiceTime
              ? dayjs(row.orderInvoiceTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="销售金额"
        property="receivableAmount"
        width="90"
        align="center"
      />
      <el-table-column
        label="实收金额"
        property="paidAmount"
        width="90"
        align="center"
      /> -->
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
      <!-- <el-table-column label="员工ID" property="empId" align="center">
        <template #default="scope">
          {{ scope.row.empId ? scope.row.empId : '--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="SAP帐号名"
        property="marketPromoterNo"
        width="120"
        align="center"
      /> -->
      <el-table-column
        label="激励时间"
        property="calculateTimeStamp"
        width="160"
        align="center"
      >
        <template #default="scope">
          <span>{{ formatStr(scope.row.calculateTimeStamp) }}</span>
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
import { GetCompanyList, GetStatementList } from '@/webapi/common'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import StatementSelect from '@/components/statement/statementSelect.vue'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import {
  MarketShopList,
  GoodsInstallList,
  GoodsInstallListExport,
  QueryEmployeeList,
  Promoter
} from '@/webapi/statistics'
import type { Goods } from '@/webapi/statistics'
import { useFormRules } from '@/hooks/useFormRule'
// import { useRemoteSearchEmp } from '@/hooks/useRemoteSearch'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { formatStr } from '@/utils'

// const { selectRemote, remoteMethod } = useRemoteSearchEmp()
const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { initGoodsRuleStatistics } = commonStore
const { cityList, promoterTypeList } = storeToRefs(commonStore)

const dateRange = ref([])
const dateRange2 = ref([])
const formData = reactive<Goods>({
  cityId: undefined,
  companyId: undefined,
  marketShopId: undefined,
  orderNo: '',
  skuNo: '',
  materialNo: '',
  calculateTimeStart: undefined,
  calculateTimeEnd: undefined,
  empId: undefined,
  companyExcitationStatementId: undefined
})

const genParams = () => {
  const calculateTimeStart: string =
    dateRange?.value?.length > 0 ? `${dateRange.value[0]} 00:00:00` : undefined
  const calculateTimeEnd: string =
    dateRange?.value?.length > 0 ? `${dateRange.value[1]} 23:59:59` : undefined
  const orderFinalTimeStart: string =
    dateRange2?.value?.length > 0
      ? `${dateRange2.value[0]} 00:00:00`
      : undefined
  const orderFinalTimeEnd: string =
    dateRange2?.value?.length > 0
      ? `${dateRange2.value[1]} 23:59:59`
      : undefined
  return {
    ...formData,
    calculateTimeStart,
    calculateTimeEnd,
    orderFinalTimeStart,
    orderFinalTimeEnd
  }
}

const exportLoading = ref(false)
const exportData = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      const params = genParams()
      exportLoading.value = true
      GoodsInstallListExport({ ...params }).then(res => {
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
  initGoodsRuleStatistics()
})

const search = () => {
  pageConfig.ecejCurrentPage = 1
  getList()
}

const reset = () => {
  dateRange.value = []
  dateRange2.value = []
  companyList.value = []
  marketShopList.value = []
  resetForm()
}

const selectRemote2 = reactive({
  loading: false,
  options: []
})
const remoteMethod = (val: string) => {
  if (val) {
    const isPhoneNo = !isNaN(Number(val))
    const params: {
      empName?: string
      mobileNo?: string
      serviceCompanyId?: number
    } = {
      // serviceCompanyId: companyId.value
    }
    if (isPhoneNo) {
      params['mobileNo'] = val
    } else {
      params['empName'] = val
    }
    selectRemote2.loading = true
    QueryEmployeeList({ ...params }).then(res => {
      selectRemote2.loading = false
      if (res.code === 1) {
        selectRemote2.options = res?.data ? res.data : []
      }
    })
  } else {
    selectRemote2.options = []
  }
}

const selectRemote3 = reactive({
  loading: false,
  options: []
})
// const remoteMethod3 = (val: string) => {
//   if (val) {
//     const params: {
//       marketPromoterNo?: string
//     } = {}
//     params['marketPromoterNo'] = val
//     selectRemote3.loading = true
//     PromoterList({ ...params }).then(res => {
//       selectRemote3.loading = false
//       if (res.code === 200) {
//         selectRemote3.options = res?.data ? res.data : []
//       }
//     })
//   } else {
//     selectRemote3.options = []
//   }
// }

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  formData.marketShopId = undefined
  marketShopList.value = []
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

const marketShopList = ref([])
const companyChange = (companyId: number) => {
  formData.marketShopId = undefined
  formData.companyExcitationStatementId = undefined
  marketShopList.value = []
  MarketShopList({ cityId: formData.cityId, companyId }).then(res => {
    if (res.code === 200) {
      marketShopList.value = res.data
    }
  })
}

const pageConfig = reactive({
  ecejCurrentPage: 1,
  ecejPageSize: 10
})

const pageData = reactive<{
  tableData: any[]
  total: number
  loading: boolean
}>({
  tableData: [],
  total: 0,
  loading: false
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
const getList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      pageData.loading = true
      const params = genParams()
      if (!params) {
        pageData.loading = false
        pageData.tableData = []
        pageData.total = 0
        return
      }
      GoodsInstallList({
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
</script>

<style scoped lang="scss">
.custom-select {
  width: 400px;
  :deep(.el-input) {
    max-width: 100% !important;
  }
}
</style>
