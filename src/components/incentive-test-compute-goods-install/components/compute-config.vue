<template>
  <div class="compute-config" v-loading="resetLoading">
    <div class="config-item">
      <h3>1.选择重新计算的账期范围</h3>
      <!-- <el-alert type="warning">
        账期对应的开始结束时间：2022.10.26 00:00:00 ~2022.11.25 23:59:59
      </el-alert> -->
      <el-form-item
        style="margin-top: 20px"
        label="账期"
        prop="companyExcitationStatementId"
      >
        <el-select
          v-model="companyExcitationStatementId"
          filterable
          placeholder="账期"
          clearable
          class="custom-select"
        >
          <el-option
            v-for="item in statementList"
            :label="`${item.statementMonthName} (${dayjs(item.startTime).format(
              'YYYY-MM-DD HH:mm:ss'
            )} ~ ${dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss')})`"
            :value="item.companyExcitationStatementId"
            :key="item.companyExcitationStatementId"
          />
        </el-select>
      </el-form-item>
    </div>
    <div class="config-item">
      <h3>2.重跑的激励规则</h3>
      <el-alert type="warning">
        根据线上生效中的规则带出后单独生成下列的草稿规则，此草稿规则不应用于正常业务的激励计算，仅用于激励重跑计算。
      </el-alert>
      <div class="button-group">
        <el-button
          v-permission="'excitation:rerun-company-install-rule:add-goods-rule'"
          type="primary"
          @click="add('basic')"
        >
          新建激励草稿基础规则
        </el-button>
        <!-- <el-button
          v-permission="'excitation:rerun-company-install-rule:add-overlay-rule'"
          type="primary"
          plain
          @click="add('overlay')"
        >
          新建激励草稿叠加规则
        </el-button> -->
        <el-button
          v-permission="'excitation:rerun-company-install-rule:reset-goods-rule'"
          type="danger"
          plain
          @click="reset"
        >
          重置草稿规则
        </el-button>
      </div>

      <el-table :data="tableData" border max-height="300">
        <el-table-column label="草稿规则名称">
          <template #default="{ row }: { row: TableItem }">
            {{ row.ruleName }}
          </template>
        </el-table-column>
        <el-table-column label="激励类型" width="100" align="center">
          <template #default="{ row }: { row: TableItem }">
            {{ getCommissionTypeLabel(row.commissionType) }}
          </template>
        </el-table-column>
        <el-table-column label="激励标准" width="120" align="center">
          <template #default="{ row }: { row: TableItem }">
            {{
              row.ladderType === LadderType.Y
                ? '阶梯激励'
                : richRuleName(row.commissionType, row.commissionValue)
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }: { row: TableItem }">
            <el-button
              v-if="row.ruleGroup === RuleGroup.basic"
              v-permission="
                'excitation:rerun-company-install-rule:edit-goods-rule'
              "
              type="text"
              @click="edit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.ruleGroup === RuleGroup.overlay"
              v-permission="
                'excitation:rerun-company-install-rule:edit-overlay-rule'
              "
              type="text"
              @click="edit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="
                'excitation:rerun-company-install-rule:delete-goods-rule'
              "
              type="text"
              @click="remove(row.draftCompanyInstallExcitationRuleId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <GoodsOverlayRule
      :status="props.status"
      ref="GoodsOverlayRuleRef"
      @is-confirm="getDraftList"
    /> -->
    <GoodsRule
      :status="props.status"
      ref="GoodsRuleRef"
      @is-confirm="getDraftList"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'
import type { Ref } from 'vue'
import GoodsRule from '../goods/goods-rule-add.vue'
// import GoodsOverlayRule from '../goods/goods-rule-overlay-add.vue'
import { GetStatementList } from '@/webapi/common'
import {
  DraftRuleList,
  DeleteGoodsRule,
  ResetGoodsRule,
  StartRerunCalc
} from './api'
import { RuleGroup } from '@/types'
import { richRuleName } from '@/utils'
import { useCommon } from '@/store'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { LadderType } from '@/types'
import type { RerunStatus, FetchDraftStatus } from '@/types'

type TableItem = API.ReturnFetchArrayDataType<typeof DraftRuleList>
const { getCommissionTypeLabel } = useCommon()

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

const GoodsRuleRef = ref<InstanceType<typeof GoodsRule>>()
// const GoodsOverlayRuleRef = ref<InstanceType<typeof GoodsOverlayRule>>()
const edit = (item: TableItem) => {
  if (item.ruleGroup === RuleGroup.basic) {
    GoodsRuleRef?.value.toggleDialogStatus(
      item.draftCompanyInstallExcitationRuleId,
      props.status.companyId,
      props.status.marketShopId
    )
  } else if (item.ruleGroup === RuleGroup.overlay) {
    // GoodsOverlayRuleRef?.value.toggleDialogStatus(
    //   item.draftCompanyInstallExcitationRuleId,
    //   props.status.companyId,
    //   props.status.marketShopId
    // )
  }
}
const remove = (draftCompanyInstallExcitationRuleId: number) => {
  DeleteGoodsRule({
    draftCompanyInstallExcitationRuleId
  }).then(res => {
    if (res.code === 200) {
      tableData.value = tableData.value.filter(
        item =>
          item.draftCompanyInstallExcitationRuleId !==
          draftCompanyInstallExcitationRuleId
      )
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}
const add = (type: 'basic' | 'overlay') => {
  if (type === 'basic') {
    GoodsRuleRef?.value.toggleDialogStatus()
  } else if (type === 'overlay') {
    // GoodsOverlayRuleRef?.value.toggleDialogStatus()
  }
}

const resetLoading = inject<Ref<boolean>>('resetLoading')
const reset = () => {
  resetLoading.value = true
  ResetGoodsRule({
    marketShopId: props.status.marketShopId
  }).then(res => {
    resetLoading.value = false
    if (res.code === 200) {
      getDraftList()
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

const start = () => {
  if (!companyExcitationStatementId.value || tableData.value.length === 0) {
    return Promise.reject('账期月份或草稿规则不能为空')
  }
  return StartRerunCalc({
    cityId: props.status.cityId,
    companyId: props.status.companyId,
    marketShopId: props.status.marketShopId,
    orderExcitationCalculateWorkId: props.status.orderExcitationCalculateWorkId,
    companyExcitationStatementId: companyExcitationStatementId.value
  })
}
defineExpose({ start })
const tableData = ref<TableItem[]>([])
const getDraftList = () => {
  DraftRuleList({
    cityId: props.status.cityId,
    companyId: props.status.companyId,
    marketShopId: props.status.marketShopId
  }).then(res => {
    if (res.code === 200) {
      tableData.value = res.data
    }
  })
}
const companyExcitationStatementId = ref()
const statementList = ref<API.ReturnFetchDataType<typeof GetStatementList>>([])
onMounted(() => {
  getDraftList()
  companyExcitationStatementId.value = props.status.companyExcitationStatementId
  GetStatementList({ companyId: props.status.companyId }).then(res => {
    if (res.code === 200) {
      statementList.value = res.data
    }
  })
})
</script>
<style scoped lang="scss">
.compute-config {
  .button-group {
    margin: 15px 0;
  }
  .config-item {
    padding-bottom: 20px;
  }
  .custom-select {
    width: 400px;
    :deep(.el-input) {
      max-width: 100% !important;
    }
  }
}
</style>
