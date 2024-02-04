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
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="formData.saleOrderNo"
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
      <el-form-item label="其他人员查询" prop="promoterName">
        <el-input
          v-model="formData.promoterName"
          clearable
          placeholder="其他人员查询"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:rule:stat-goods-order-relation:order-list'"
          type="primary"
          @click="search"
          :loading="pageData.loading"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:rule:stat-goods-order-relation:order-list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="
        'excitation:rule:stat-goods-order-relation:base-order-export'
      "
      type="primary"
      @click="exportData"
      :loading="exportLoading"
      >导出</el-button
    >
    <el-button
      v-permission="
        'excitation:rule:stat-goods-order-relation:relevance-promoter'
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
      :table-page-current-page="pageConfig.currentPage"
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
      <el-table-column label="店铺名称" width="200">
        <template #default="scope">
          <div>{{ scope.row.shopName }}</div>
          <div>(店铺编码: {{ scope.row.thirdShopNo }})</div>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" property="saleOrderNo" width="180" />
      <el-table-column
        label="订单实收金额"
        property="paidAmount"
        width="160"
        align="center"
      />
      <el-table-column label="订单完成时间" width="160" align="center">
        <template #default="scope">
          <span>{{
            scope.row.finishTime
              ? dayjs(scope.row.finishTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="销售员"
        property="promoterName"
        width="90"
        align="center"
      />
      <el-table-column
        label="销售员手机号"
        property="promoterPhone"
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
              'excitation:rule:stat-goods-order-relation:outer-promoter-lis'
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
        :orderNo="currentItem.saleOrderNo"
        :orderType="orderType.goods"
        :emp="currentItem.promoterName"
        :phone="currentItem.promoterPhone"
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
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import { GetCompanyList } from '@/webapi/common'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import {
  OrderGoodsRelaEmpList,
  OrderGoodsRelaEmpExport,
  MarketShopList,
  OrderGoodsRelevancePromoter
} from '@/webapi/statistics'
import type { OrderGoodsRelaEmp } from '@/webapi/statistics'
import { useFormRules } from '@/hooks/useFormRule'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import RelatedEmpCom from './related-emp.vue'
import RelatedEmpDetailCom from './related-emp-detail.vue'
import { orderType } from './types'
import { useMessageAlert } from './useMessageAlert'
const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList } = storeToRefs(commonStore)

const dateRange = ref([])
const formData = reactive<OrderGoodsRelaEmp>({
  cityId: undefined,
  companyId: undefined,
  orderComplateDateStart: undefined,
  orderComplateDateEnd: undefined,
  saleOrderNo: undefined,
  marketShopId: undefined,
  promoterName: undefined
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
  const orderNoList = currentSelectedList.value.map(item => item.saleOrderNo)
  relatedEmpLoading.value = true
  OrderGoodsRelevancePromoter({
    orderNoList,
    orderType: orderType.goods,
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
  const orderComplateDateStart: string = `${dayjs(dateRange.value[0]).format(
    'YYYY-MM-DD'
  )} 00:00:00`
  const orderComplateDateEnd: string = `${dayjs(dateRange.value[1]).format(
    'YYYY-MM-DD'
  )} 23:59:59`
  // const orderComplateDateStart: Dayjs = dayjs(dateRange.value[0])
  // const orderComplateDateEnd: Date = dayjs(dateRange.value[1])
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
  OrderGoodsRelaEmpExport({ ...params }).then(res => {
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
  pageConfig.currentPage = 1
  getList()
}

const reset = () => {
  companyList.value = []
  dateRange.value = []
  marketShopList.value = []
  formData.saleOrderNo = undefined
  resetForm()
}

const pageConfig = reactive({
  currentPage: 1,
  pageSize: 10
})
// const currentPageChange = (currentPage: number) => {
//   pageConfig.currentPage = currentPage
//   getList()
// }
const tablePageChange = ({
  currentPage,
  pageSize
}: {
  currentPage: number
  pageSize: number
}) => {
  pageConfig.currentPage = currentPage
  pageConfig.pageSize = pageSize
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
      OrderGoodsRelaEmpList({
        ...params,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          pageData.tableData = res.data.dataList
          pageData.total = res.data.totalCount
        }
      })
    }
  })
}

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  formData.marketShopId = undefined
  marketShopList.value = []
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
      if (companyList.value?.length > 0) {
        formData.companyId = companyList.value[0].companyId
        companyChange(formData.companyId)
      }
    }
  })
}
const marketShopList = ref([])
const companyChange = (companyId: number) => {
  formData.marketShopId = undefined
  marketShopList.value = []
  MarketShopList({ cityId: formData.cityId, companyId }).then(res => {
    if (res.code === 200) {
      marketShopList.value = res.data
      if (marketShopList.value?.length > 0) {
        formData.marketShopId = marketShopList.value[0].marketShopId
      }
    }
  })
}
</script>

<style scoped lang="scss"></style>
