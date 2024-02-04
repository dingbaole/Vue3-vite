<template>
  <div class="incentive-collate-company">
    <div class="row">
      <el-card shadow="never">
        <div class="company-info">
          <div class="item">公司名称：{{ initData?.companyName ?? '--' }}</div>
          <div class="item">激励类型：{{ initData?.excitationType ?? '--' }}</div>
          <div class="item">账期月份：{{ initData?.statementMonthName ?? '--' }}</div>
        </div>
      </el-card>
    </div>
    <div class="row">
      <el-tabs v-model="auditResult" type="border-card">
        <el-tab-pane
          v-for="[name, label] in AuditResultMap.entries()"
          :key="name"
          :label="label"
          :name="name"
        >
          <div v-if="!initData" v-loading style="min-height: 300px;"></div>
          <div v-else>
            <table-form
              :init-data="initData"
              :audit-result="name"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import {
  LoadPageInitDataCompany,
  AuditResult,
  AuditResultMap
} from '@/webapi/incentive-collate'
import TableForm from './component/incentive-collate-company-table.vue'

const props = defineProps<{
  companyMonthStatementExcitationCheckId: number,
  companyMonthStatementExcitationCheckRoleId: number,
  companyMonthStatementExcitationCheckRoleUserRelationId: number
}>()
const auditResult = ref(AuditResult.WAIT_CHECK)

/**
 * @description 初始化数据
 */
const initData = ref<API.ReturnFetchDataType<typeof LoadPageInitDataCompany>>()
LoadPageInitDataCompany({...props}).then(res => {
  if (res.code === 200) {
    initData.value = res.data
  }
})
</script>
<style scoped lang="scss">
.incentive-collate-company {
  .row + .row {
    margin-top: 10px;
  }
  .company-info {
    display: flex;
    .item {
      margin-right: 35px;
    }
  }
}
</style>
