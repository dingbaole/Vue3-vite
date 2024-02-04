<template>
  <SearchForm @change="searchFormChange" :loading="pageData.loading" />
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:after-sales-onsite-service:create'"
      type="primary"
      plain
      @click="createHandler"
      >创建上门售后单</el-button
    >
    <TableWithPagination
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.pageNum"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="上门售后单号" width="190">
        <template #default="scope">
          <el-button
            type="text"
            @click="detailHandler(scope.row.saleOrderId)"
            >{{ scope.row.saleOrderId }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="售后状态" align="center" width="100">
        <template #default="scope">
          <StatusTag :status="scope.row.orderStatus" />
        </template>
      </el-table-column>
      <el-table-column label="售后服务品类" width="140">
        <template #default="scope">
          <div v-if="scope.row.afterSaleOrderItems?.length > 0">
            <div
              v-for="item in scope.row.afterSaleOrderItems"
              :key="item.serviceClassName"
            >
              {{ item.serviceClassName }}(售后)
            </div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column
        property="workOrderNo"
        label="关联上门订单号"
        width="190"
      />
      <el-table-column label="上门订单完成时间" width="160" align="center">
        <template #default="scope">
          {{
            scope.row.payEndTime
              ? dayjs(scope.row.payEndTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        property="contactsName"
        label="客户姓名"
        width="90"
        align="center"
      />
      <el-table-column
        property="contactsMobile"
        label="客户电话"
        width="120"
        align="center"
      />
      <el-table-column property="companyName" label="售后地址" width="150">
        <template #default="{ row }">
          <div v-if="row.detailAddress">
            {{ row.community }}{{ row.detailAddress }}
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="售后创建时间" width="160" align="center">
        <template #default="scope">
          {{
            scope.row.screateTime
              ? dayjs(scope.row.screateTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column label="售后完成时间" width="160" align="center">
        <template #default="scope">
          {{
            scope.row.endTime
              ? dayjs(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column property="stationName" label="服务站" width="120" />
      <el-table-column label="公司名称" width="120">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <div style="font-size: 12px">
            ( 公司代码: {{ scope.row.companyCode }} )
          </div>
        </template>
      </el-table-column>
      <el-table-column property="city" label="城市" width="90" />
      <el-table-column label="操作" fixed="right" width="120" align="center">
        <template #default="{ row }">
          <div v-if="row.orderStatus === AfterSalesStatus.WAIT_AUDIT">
            <el-button
              v-permission="'excitation:after-sales-onsite-service:audit'"
              type="text"
              @click="auditHandler(row.saleOrderId)"
              >售后审核</el-button
            >
          </div>
          <div v-if="row.orderStatus === AfterSalesStatus.WAIT_HANDLE">
            <el-button
              v-permission="'excitation:after-sales-onsite-service:change'"
              type="text"
              @click="editHandler(row.saleOrderId)"
              >变更</el-button
            >
            <el-button
              v-permission="'excitation:after-sales-onsite-service:cancel'"
              type="text"
              @click="cancelHandler(row.saleOrderId)"
              >取消</el-button
            >
          </div>
          <div v-if="row.orderStatus === AfterSalesStatus.REFUND_FAIL">
            <el-button
              v-permission="'excitation:after-sales-onsite-service:refund'"
              type="text"
              @click="refundHandler(row.saleOrderId)"
              >退款</el-button
            >
          </div>
          <div
            v-if="
              row.orderStatus !== AfterSalesStatus.WAIT_AUDIT &&
              row.orderStatus !== AfterSalesStatus.WAIT_HANDLE &&
              row.orderStatus !== AfterSalesStatus.REFUND_FAIL
            "
          >
            --
          </div>
        </template>
      </el-table-column>
    </TableWithPagination>
    <OrderViewModal ref="OrderViewModalRef" @is-confirm="shouldRefresh" />
    <ConfirmToCancel ref="ConfirmToCancelRef" @confirm="() => getList()" />
  </el-card>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import SearchForm from './components/serarch-form.vue'
import StatusTag from './components/status-tag.vue'
import OrderViewModal from './order-view-modal.vue'
import ConfirmToCancel from '@/components/confirm/confirmToCancel.vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import {
  SaleAfterOrderManageQueryList,
  RefundData
} from '@/webapi/after-sales-onsite-service'
import type { SaleAfterManage } from '@/webapi/after-sales-onsite-service'
import { AfterSalesStatus, PageViewType } from './types'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'

const formData = ref<SaleAfterManage>({})
const pageConfig = reactive({
  pageNum: 1,
  pageSize: 10
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

const searchFormChange = (val: SaleAfterManage) => {
  pageConfig.pageNum = 1
  formData.value = val
  getList()
}
const tablePageChange = ({
  currentPage: pageNum,
  pageSize
}: {
  currentPage: number
  pageSize: number
}) => {
  pageConfig.pageNum = pageNum
  pageConfig.pageSize = pageSize
  getList()
}

const getList = () => {
  pageData.loading = true
  SaleAfterOrderManageQueryList({
    ...formData.value,
    pageManager: pageConfig
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      pageData.tableData = res.rows ?? []
      pageData.total = res.total
    }
  })
}

const shouldRefresh = () => {
  if (formData.value.cityId && formData.value.companyId) {
    getList()
  }
}

const OrderViewModalRef = ref<InstanceType<typeof OrderViewModal>>()
const createHandler = () => {
  OrderViewModalRef.value.toggleDialogStatus(PageViewType.CREATE)
}
const detailHandler = (saleOrderId: string) => {
  OrderViewModalRef.value.toggleDialogStatus(PageViewType.DETAIL, saleOrderId)
}
const auditHandler = (saleOrderId: string) => {
  OrderViewModalRef.value.toggleDialogStatus(PageViewType.AUDIT, saleOrderId)
}
const editHandler = (saleOrderId: string) => {
  OrderViewModalRef.value.toggleDialogStatus(PageViewType.EDIT, saleOrderId)
}

const ConfirmToCancelRef: any = ref<InstanceType<typeof ConfirmToCancel>>()
const cancelHandler = (saleOrderId: string) => {
  ConfirmToCancelRef.value.openModal(saleOrderId)
}
const refundHandler = (saleOrderId: string) => {
  ElMessageBox.confirm(
    '确认退款后，系统将自动退款至客户的支付账号！确认退款吗？',
    '确认退款',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    RefundData({ saleOrderId }).then(res => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: '退款成功'
        })
        getList()
      } else {
        ElMessage({
          type: 'error',
          message: res.message
        })
      }
    })
  })
}
</script>
<style scoped lang="scss"></style>
