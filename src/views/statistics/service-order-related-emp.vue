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
        <el-select v-model="formData.companyId" filterable placeholder="公司">
          <el-option
            v-for="item in companyList"
            :label="item.companyName"
            :value="item.companyId"
            :key="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="formData.workOrderNo"
          clearable
          placeholder="订单编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="订单完成时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          @calendar-change="calendarChange"
          @change="dateChagne"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:rule:stat-svc-order-relation-list'"
          type="primary"
          @click="search"
          :loading="pageData.loading"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:rule:stat-svc-order-relation-list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:rule:stat-svc-order-relation-export'"
      type="primary"
      @click="exportData"
      :loading="exportLoading"
      >导出</el-button
    >
    <el-button
      v-permission="
        'excitation:rule:stat-svc-order-relation-relevance-promoter'
      "
      type="primary"
      plain
      :disabled="currentSelectedList.length === 0"
      @click="dialogShow = true"
      >关联其他激励人员</el-button
    >
    <TableWithPagination
      ref="TableRef"
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.ecejCurrentPage"
      v-loading="pageData.loading"
      border
      @selection-change="handleSelectionChange"
      @page-change="tablePageChange"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column fixed type="selection" width="43" />
      <el-table-column label="城市" property="cityName" width="100" />
      <el-table-column label="公司名称" width="200">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <div>(公司代码: {{ scope.row.companyCode }})</div>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" property="workerorderNo" width="180" />
      <el-table-column
        label="服务品类"
        property="serviceClassName"
        width="160"
      />
      <el-table-column
        label="实收金额"
        property="paidMoney"
        width="160"
        align="center"
      />
      <el-table-column label="订单完成时间" width="160" align="center">
        <template #default="scope">
          <span>{{
            scope.row.payEndTime
              ? dayjs(scope.row.payEndTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="房产编号"
        property="houseNo"
        width="160"
        align="center"
      />
      <el-table-column
        label="上门师傅"
        property="empName"
        width="90"
        align="center"
      />
      <el-table-column
        label="师傅手机号"
        property="mobileNo"
        width="120"
        align="center"
      />

      <el-table-column
        label="订单激励人员"
        width="110"
        fixed="right"
        align="center"
      >
        <template #default="scope">
          <el-button
            v-permission="
              'excitation:rule:stat-svc-order-relation-outer-promoter-list'
            "
            type="text"
            @click="detail(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </TableWithPagination>
    <el-dialog
      v-model="dialogShow"
      title="关联其他激励人员"
      width="80%"
      destroy-on-close
    >
      <RelatedEmpCom ref="RelatedEmpRef" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogShow = false">取消</el-button>
          <el-button
            type="primary"
            :loading="relatedEmpLoading"
            @click="confirm"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogShow2"
      title="查看激励人员"
      width="60%"
      destroy-on-close
    >
      <RelatedEmpDetailCom
        :orderNo="currentItem.workerorderNo"
        :orderType="orderType.service"
        :emp="currentItem.empName"
        :phone="currentItem.mobileNo"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogShow2 = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { GetCompanyList } from '@/webapi/common'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import {
  OrderServiceRelaEmpList,
  OrderServiceRelaEmpExport,
  OrderServiceRelevancePromoter
} from '@/webapi/statistics'
import type { OrderServiceRelaEmp } from '@/webapi/statistics'
import { orderType } from './types'
import { useFormRules } from '@/hooks/useFormRule'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import RelatedEmpCom from './related-emp.vue'
import RelatedEmpDetailCom from './related-emp-detail.vue'
import { useMessageAlert } from './useMessageAlert'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'

const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList } = storeToRefs(commonStore)
const dateRange = ref([])
const formData = reactive<OrderServiceRelaEmp>({
  cityId: undefined,
  companyId: undefined,
  orderComplateDateStart: undefined,
  orderComplateDateEnd: undefined,
  workOrderNo: undefined
})

const currentSelectedList = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  currentSelectedList.value = val
}

const dialogShow = ref(false)
const RelatedEmpRef = ref<InstanceType<typeof RelatedEmpCom>>()
const relatedEmpLoading = ref(false)
const confirm = async () => {
  const outerPromoterAggList = await RelatedEmpRef.value?.confirm()
  const { cityId, companyId } = currentSelectedList.value[0]
  const orderNoList = currentSelectedList.value.map(item => item.workerorderNo)
  relatedEmpLoading.value = true
  OrderServiceRelevancePromoter({
    orderNoList,
    orderType: orderType.service,
    cityId,
    companyId,
    outerPromoterAggList
  }).then(res => {
    relatedEmpLoading.value = false
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message
      })
      dialogShow.value = false
    } else if (res.code === -10007) {
      useMessageAlert(res.data)
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

const currentItem = ref()
const dialogShow2 = ref(false)
const detail = (item: any) => {
  currentItem.value = item
  dialogShow2.value = true
}

const genParams = () => {
  if (!dateRange.value || dateRange.value.length === 0) {
    return {
      ...formData
    }
  }
  const orderComplateDateStart: string = `${dateRange.value[0]} 00:00:00`
  const orderComplateDateEnd: string = `${dateRange.value[1]} 23:59:59`
  return {
    ...formData,
    orderComplateDateStart,
    orderComplateDateEnd
  }
}

const exportLoading = ref(false)
const exportData = () => {
  const params = genParams()
  exportLoading.value = true
  OrderServiceRelaEmpExport({ ...params }).then(res => {
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

const choseDate = ref(null)
const dateChagne = (val: [Date, Date] | null) => {
  if (!val) {
    choseDate.value = undefined
  }
}
const calendarChange = (val: [Date, Date]) => {
  choseDate.value = val[0]
}
const disabledDate = (date: Date) => {
  const afterToday =
    dayjs().startOf('day').valueOf() < dayjs(date).startOf('day').valueOf()
  if (!choseDate.value) {
    return afterToday
  }
  // 超过30天后禁用
  const after30Days = dayjs(date).isAfter(dayjs(choseDate.value).add(30, 'day'))
  // 小于30天前禁用
  const before30Days = dayjs(date).isBefore(
    dayjs(choseDate.value).subtract(30, 'day')
  )

  return after30Days || before30Days || afterToday
}

onMounted(async () => {
  await init()
  dateRange.value = [dayjs().subtract(6, 'day'), dayjs()]
  if (cityList.value?.length > 0) {
    formData.cityId = cityList.value[0].cityId
    cityIdChange(formData.cityId)
  }
})

const search = () => {
  pageConfig.ecejCurrentPage = 1
  getList()
}

const reset = () => {
  companyList.value = []
  dateRange.value = []
  formData.workOrderNo = undefined
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
      OrderServiceRelaEmpList({
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
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
      if (companyList.value?.length > 0) {
        formData.companyId = companyList.value[0].companyId
      }
    }
  })
}
</script>

<style scoped lang="scss"></style>
