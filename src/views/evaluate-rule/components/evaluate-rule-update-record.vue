<template>
  <el-dialog
    v-model="dialogShow"
    title="更新记录"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-table
      :data="pageData.tableData"
      v-loading="pageData.loading"
      border
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column property="screateTime" label="操作时间" width="180">
        <template #default="scope">
          <span>{{
            dayjs(scope.row.supdateTime).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column property="createUserName" label="操作人" width="150" />
      <el-table-column property="serviceClassName" label="评价星级" width="100">
        <template #default>
          {{ evaluateStar }}
        </template>
      </el-table-column>
      <el-table-column property="remark" label="评价系数" />
    </el-table>
    <el-pagination
      small
      background
      hide-on-single-page
      :page-size="pageConfig.ecejPageSize"
      layout="prev, pager, next"
      :total="pageData.total"
      @current-change="currentPageChange"
      style="margin-top: 20px; display: flex; justify-content: end"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { EvaluateRuleRecord } from '@/webapi/serviceItem'
import dayjs from 'dayjs'

const excitationRuleId = ref(null)
const evaluateStar = ref(null)
const pageConfig = reactive({
  ecejCurrentPage: 1,
  ecejPageSize: 10
})
const currentPageChange = (currentPage: number) => {
  pageConfig.ecejCurrentPage = currentPage
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
  EvaluateRuleRecord({
    excitationRuleId: excitationRuleId.value,
    ...pageConfig
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      pageData.tableData = res.data.list
      pageData.total = res.data.total
    }
  })
}

const dialogShow = ref(false)
const toggleDialogStatus = (
  _excitationRuleId: number,
  _evaluateStar: number
) => {
  if (!dialogShow.value) {
    excitationRuleId.value = _excitationRuleId
    evaluateStar.value = _evaluateStar
    getList()
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss"></style>
