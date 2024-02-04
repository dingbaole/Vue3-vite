<template>
  <div class="statement-select">
    <el-select v-bind="$attrs" class="custom-select">
      <el-option
        v-for="item in statementList"
        :label="`${item.statementMonthName}${
          item.startTime
            ? `(${dayjs(item.startTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )} ~ ${dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss')})`
            : ''
        }`"
        :value="item.companyExcitationStatementId"
        :key="item.companyExcitationStatementId"
      />
    </el-select>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { GetStatementList } from '@/webapi/common'
import dayjs from 'dayjs'

const props = defineProps<{
  companyId?: number
}>()
// const attrs = useAttrs()
const statementList = ref<API.ReturnFetchDataType<typeof GetStatementList>>([])
const getList = (companyId: number) => {
  GetStatementList({ companyId }).then(res => {
    if (res.code === 200) {
      statementList.value = [
        ...res.data,
        {
          companyExcitationStatementId: 0,
          statementMonthName: '未归属账期'
        }
      ]
    }
  })
}
watch(
  () => props.companyId,
  () => {
    if (props.companyId) {
      getList(props.companyId)
    } else {
      statementList.value = []
    }
  }
)
</script>
<style scoped lang="scss">
.statement-select {
  .custom-select {
    width: 400px;
    :deep(.el-input) {
      max-width: 100% !important;
    }
  }
}
</style>
