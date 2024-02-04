<template>
  <div class="compute-result">
    <div
      v-if="
        [RerunStatusEnum.CALCULAING, RerunStatusEnum.CONFIRM].includes(
          props.status.workStatus
        )
      "
    >
      <el-result title="计算中..." sub-title="如获取最新计算结果，请刷新">
        <template #icon>
          <el-icon style="font-size: 40px" class="is-loading">
            <RefreshRight />
          </el-icon>
        </template>
      </el-result>
    </div>
    <div v-if="props.status.workStatus === RerunStatusEnum.FAIL">
      <el-result
        icon="error"
        title="计算失败"
        sub-title="可返回上一步，重新进行试算"
      ></el-result>
    </div>
    <tableWithPagination
      v-if="props.status.workStatus === RerunStatusEnum.SUCCESS"
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.currentPage"
      :table-page-size="pageConfig.pageSize"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      border
      style="width: 100%; margin-top: 20px"
      max-height="300"
    >
      <el-table-column property="cityName" label="城市" width="80" />
      <el-table-column property="companyName" label="公司名称" width="200">
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.companyName }}</div>
          <div style="font-size: 12px">
            ( 公司代码: {{ row.companyCodeNo }} )
          </div>
        </template>
      </el-table-column>
      <el-table-column property="marketShopName" label="店铺名称" width="200">
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.marketShopName }}</div>
          <div style="font-size: 12px">( 店铺编码: {{ row.thirdShopNo }} )</div>
        </template>
      </el-table-column>
      <el-table-column
        property="relateOrderNo"
        label="关联服务订单号"
        width="150"
      >
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.relateOrderNo ?? '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column property="goodsSkuNo" label="SKU编号" width="150">
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.goodsSkuNo ?? '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column property="goodsName" label="商品名称" width="150">
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.goodsName ?? '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column property="materialNo" label="关联物料号" width="150">
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.materialNo ?? '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column property="orderNo" label="集市单号" width="150">
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.orderNo ?? '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        property="quantity"
        label="安装数量"
        width="90"
        align="center"
      >
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.quantity ?? '--' }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        property="receivableAmount"
        label="销售金额"
        width="90"
        align="center"
      >
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.receivableAmount ?? '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        property="paidAmount"
        label="实收金额"
        width="90"
        align="center"
      >
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.paidAmount ?? '--' }}</div>
        </template>
      </el-table-column> -->
      <el-table-column
        property="originalCommissionAmount"
        label="原激励金额"
        width="100"
        align="center"
      >
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.originalCommissionAmount ?? '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        property="commissionAmount"
        label="重新计算激励金额"
        width="140"
        align="center"
      >
        <template #default="{ row }: { row: CalcResult }">
          <div>{{ row.commissionAmount ?? '--' }}</div>
        </template>
      </el-table-column>
    </tableWithPagination>
  </div>
</template>
<script setup lang="ts">
import tableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import { onMounted, reactive, inject, watch } from 'vue'
import type { Ref } from 'vue'
import { GetRerunCalcResult } from './api'
import type { CalcResult } from './api'
import { RerunStatus as RerunStatusEnum } from '@/types'
import type { RerunStatus, FetchDraftStatus } from '@/types'
import { RefreshRight } from '@element-plus/icons-vue'
const props = defineProps<{
  status: {
    companyExcitationStatementId?: number
    orderExcitationCalculateWorkId: number
    workStatus: RerunStatus
    pullStatus: FetchDraftStatus
    cityId: number
    companyId: number
    marketShopId: number
  }
}>()

const pageConfig = reactive({
  currentPage: 1,
  pageSize: 100
})

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
  tableData: API.ReturnFetchDataType<typeof GetRerunCalcResult>['list']
  total: number
  loading: boolean
}>({
  tableData: [],
  total: 0,
  loading: false
})
const getList = () => {
  GetRerunCalcResult({
    orderExcitationCalculateWorkId: props.status.orderExcitationCalculateWorkId,
    ...pageConfig
  }).then(res => {
    if (res.code === 200) {
      pageData.tableData = res.data.list
      pageData.total = res.data.total
    }
  })
}
watch(
  () => props.status.workStatus,
  () => {
    if (props.status.workStatus === RerunStatusEnum.SUCCESS) {
      getList()
    }
  }
)
onMounted(() => {
  if (props.status.workStatus === RerunStatusEnum.SUCCESS) {
    getList()
  }
})
const { getStatusLoading, getStatus } = inject<{
  getStatusLoading: Ref<boolean>
  getStatus: () => void
}>('GetStatus')
</script>
<style scoped lang="scss">
.compute-result {
}
</style>
