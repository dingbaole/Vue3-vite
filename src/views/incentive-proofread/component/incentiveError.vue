<template>
  <div>
    <div>
      <el-table :data="incentiveErrorTable.list" border style="width: 100%">
        <el-table-column prop="operateTime" label="时间" width="180" align="center">
          <template #default="scope">
            {{ dayjs(scope.row.operateTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="operateUserName" label="操作人" width="180" align="center" />
        <el-table-column prop="roleName" label="角色" align="center" />
        <el-table-column prop="remark" label="激励错误说明" align="center" />
      </el-table>
      <div style="display: flex;justify-content: flex-end;margin-top: 20px;">
        <el-pagination background layout="total,sizes,prev, pager, next" :total="incentiveErrorTable.total"
          v-model:current-page="incentiveErrorForm.ecejCurrentPage" v-model:page-size="incentiveErrorForm.ecejPageSize" />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, reactive, watch, toRefs } from 'vue'
import dayjs from 'dayjs'
import { problemRecordList } from "@/webapi/incentive-proofread";

const props = defineProps<{
  initData: any
  clickRow: any
}>()
const { clickRow, initData } = toRefs(props)
const incentiveErrorTable = ref({ list: [], total: 0 })
const incentiveErrorForm = reactive({ ecejCurrentPage: 1, ecejPageSize: 10 })

onMounted(() => {
  lookIncentiveError()
})

watch([() => { incentiveErrorForm.ecejCurrentPage }, () => { incentiveErrorForm.ecejPageSize }], () => { lookIncentiveError(true) }, { deep: true })

// 查看激励错误
const lookIncentiveError = (type?: boolean) => {
  if (!type) {
    incentiveErrorForm.ecejCurrentPage = 1
    incentiveErrorForm.ecejPageSize = 10
  }
  problemRecordList({
    companyId: initData.value.companyId,
    ...clickRow.value,
    ...incentiveErrorForm
  }).then(res => {
    incentiveErrorTable.value = res.data
  })
}
</script>
<style lang='scss' scoped></style>