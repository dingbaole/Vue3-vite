<template>
  <el-dialog
    v-model="dialogShow"
    title="查看未配置物料"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <div>以下企业使用的物料未配置激励基础规则：</div>
    <TableWithPagination
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.currentPage"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      border
      max-height="300"
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column property="materialNo" label="物料号" width="120" />
      <el-table-column property="materialName" label="物料名称" />
      <el-table-column
        property="price"
        label="物料单价(元)"
        width="105"
        align="center"
      >
        <template #default="scope">
          {{
            scope.row.price || scope.row.price === 0 ? scope.row.price : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column label="历史激励规则配置记录" width="180" align="center">
        <template #default="scope">
          {{ !scope.row.ruleStatus ? '否' : '是' }}
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import { UnusedList } from '@/webapi/material'

const cityId = ref(null)
const companyId = ref(null)
const pageConfig = reactive({
  currentPage: 1,
  pageSize: 10
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
  tableData: any[]
  loading: boolean
  total: number
}>({
  tableData: [],
  loading: false,
  total: 0
})
const getList = () => {
  pageData.loading = true
  UnusedList({
    cityId: cityId.value,
    companyId: companyId.value,
    ...pageConfig
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      pageData.tableData = res.data.dataList
      pageData.total = res.data.totalCount
    }
  })
}

const dialogShow = ref(false)
const toggleDialogStatus = (_cityId: number, _companyId: number) => {
  if (!dialogShow.value) {
    cityId.value = _cityId
    companyId.value = _companyId
    getList()
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss"></style>
