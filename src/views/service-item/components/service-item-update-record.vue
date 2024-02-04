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
      <el-table-column label="时间" width="160" align="center">
        <template #default="scope">
          <span>{{
            dayjs(scope.row.operTime).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column property="operRemark" label="操作内容" align="center" />
      <el-table-column
        property="createUserName"
        label="操作人"
        align="center"
        width="140"
      />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { QueryHistoryOperlog } from '@/webapi/serviceItem'
import dayjs from 'dayjs'

interface Table {
  operTime: number
  operRemark: string
  createUserName: string
}

const pageData = reactive<{
  tableData: Table[]
  loading: boolean
}>({
  tableData: [],
  loading: false
})
const getList = (comnanyItemExcitationRuleId: number, companyId: number) => {
  pageData.loading = true
  QueryHistoryOperlog({ comnanyItemExcitationRuleId, companyId }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      pageData.tableData = res.data
    }
  })
}

const dialogShow = ref(false)
const toggleDialogStatus = (
  comnanyItemExcitationRuleId: number,
  companyId: number
) => {
  if (!dialogShow.value) {
    getList(comnanyItemExcitationRuleId, companyId)
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss"></style>
