<template>
  <div class="inventory-list">
    <SearchForm
      ref="SearchFormRef"
      :loading="pageData.loading"
      @change="search"
    />
    <el-card shadow="never" style="margin-top: 10px">
      <el-button
        type="primary"
        plain
        @click="asyncExport"
        :loading="asyncExportLoading"
        >异步导出</el-button
      >
      <TableWithPagination
        :table-data="pageData.tableData"
        :table-total="pageData.total"
        :table-page-current-page="pageConfig.pageNow"
        v-loading="pageData.loading"
        @page-change="tablePageChange"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column label="变动时间" width="160" align="center">
          <template #default="scope">
            {{
              scope.row.createTime
                ? dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="物料号"
          property="materialNo"
          width="100"
          align="center"
        />
        <el-table-column
          label="物料名称"
          property="materialName"
          align="center"
          width="200"
        />
        <el-table-column
          label="变动类型"
          property="changeTypeStr"
          align="center"
          width="130"
        />
        <el-table-column label="单据号" property="orderNo" width="130" />
        <el-table-column
          label="单据内物料用量"
          property="usedCount"
          align="center"
          width="130"
        />
        <el-table-column
          label="可用库存变动前"
          property="stockCountBefore"
          align="center"
          width="130"
        />
        <el-table-column
          label="可用库存变动后"
          property="stockCountAfter"
          align="center"
          width="130"
        />
        <el-table-column
          label="可用库存变动数"
          property="stockCountChangeStr"
          align="center"
          width="130"
        />
        <el-table-column
          label="在途数量变动前"
          property="onwayCountBefore"
          align="center"
          width="130"
        />
        <el-table-column
          label="在途数量变动后"
          property="onwayCountAfter"
          align="center"
          width="130"
        />
        <el-table-column
          label="在途数量变动数"
          property="onwayCountChangeStr"
          align="center"
          width="130"
        />
        <el-table-column
          label="占用库存变动前"
          property="blockedCountBefore"
          align="center"
          width="130"
        />
        <el-table-column
          label="占用库存变动后"
          property="blockedCountAfter"
          align="center"
          width="130"
        />
        <el-table-column
          label="占用库存变动数"
          property="blockedCountChangeStr"
          align="center"
          width="130"
        />
        <el-table-column
          label="触发人"
          property="changeEmpName"
          align="center"
          width="100"
        />
        <el-table-column
          label="触发端"
          property="changePlatName"
          align="center"
          width="100"
        />
      </TableWithPagination>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import SearchForm from './search-form.vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import { ref, reactive } from 'vue'
import { QueryStockInventoryList, AsyncExport } from '@/webapi/inventory'
import type { Inventory } from './types'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const formData = ref<Inventory>({})
const pageConfig = reactive({
  pageNow: 1,
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

const search = (val: any) => {
  pageConfig.pageNow = 1
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
  pageConfig.pageNow = pageNum
  pageConfig.pageSize = pageSize
  getList()
}

const getList = () => {
  pageData.loading = true
  QueryStockInventoryList({
    ...formData.value,
    ...pageConfig
  }).then(res => {
    pageData.loading = false
    pageData.tableData = res.rows ?? []
    pageData.total = res.total
  })
}

const SearchFormRef = ref<InstanceType<typeof SearchForm>>()
const asyncExportLoading = ref(false)
const asyncExport = async () => {
  const res = await SearchFormRef.value?.changeResult()
  if (!res) return
  formData.value = res
  asyncExportLoading.value = true
  AsyncExport({
    ...formData.value
  }).then(res => {
    asyncExportLoading.value = false
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.message ?? res.msg
      })
    }
  })
}
</script>
<style scoped lang="scss">
.inventory-list {
}
</style>
