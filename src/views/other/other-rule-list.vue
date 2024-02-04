<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData" :rules="rules" ref="ruleFormRef">
      <el-form-item label="城市" prop="cityId">
        <el-select
          v-model="formData.cityId"
          @change="cityIdChange"
          filterable
          placeholder="城市"
        >
          <el-option
            v-for="item in pageInit.cityList"
            :key="item.cityId"
            :label="item.cityName"
            :value="item.cityId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公司" prop="companyId">
        <el-select v-model="formData.companyId" filterable placeholder="公司">
          <el-option
            v-for="item in companyList"
            :key="item.companyId"
            :label="item.companyName"
            :value="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="ruleStatus">
        <el-select v-model="formData.ruleStatus" placeholder="状态" clearable>
          <el-option
            v-for="item in pageInit.excitationStatusList"
            :key="item.statusId"
            :label="item.statusName"
            :value="item.statusId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:company-order-level-rule:list'"
          type="primary"
          @click="search"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company-order-level-rule:list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:company-order-level-rule:add-rule'"
      type="primary"
      plain
      @click="addRule"
      >新建订单标签激励规则</el-button
    >
    <el-button
      v-permission="'excitation:company-order-level-rule:close-base-rule'"
      type="warning"
      :disabled="currentSelectedList.length === 0"
      @click="closeBaseRule"
      >关闭规则</el-button
    >
    <TableWithPagination
      :table-data="pageData.dataList"
      :table-total="pageData.totalCount"
      :table-page-current-page="pageConfig.currentPage"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column fixed type="selection" width="43" />
      <el-table-column property="cityName" label="城市" width="80" />
      <el-table-column property="companyName" label="公司名称">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <div style="font-size: 12px">
            ( 公司代码: {{ scope.row.companyCode }} )
          </div>
        </template>
      </el-table-column>
      <el-table-column property="ruleName" label="规则名称" />
      <el-table-column
        property="ruleStatus"
        label="状态"
        width="80"
        align="center"
      >
        <template #default="scope">
          <span>{{
            findNameByIdFromList(
              pageInit.excitationStatusList,
              scope.row.ruleStatus,
              'statusId',
              'statusName'
            )
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="updateTime"
        label="更新时间"
        width="160"
        align="center"
      >
        <template #default="scope">
          <span>{{
            dayjs(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
        <template #default="scope: { row: BaseRuleListResult }">
          <el-button
            v-permission="'excitation:company-order-level-rule:query-one'"
            type="text"
            @click="openDetail(scope.row)"
            >查看</el-button
          >
          <el-button
            v-permission="'excitation:company-order-level-rule:edit-rule'"
            type="text"
            @click="editRule(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            v-if="scope.row.ruleStatus === 14"
            width="300"
            confirm-button-text="确认"
            cancel-button-text="取消"
            title="规则开启后，将立即生效，确认开启吗？"
            @confirm="openBaseRule(scope.row.companyOrderLevelExcitationRuleId)"
          >
            <template #reference>
              <el-button
                v-permission="
                  'excitation:company-order-level-rule:open-base-rule'
                "
                type="text"
                >开启</el-button
              >
            </template>
          </el-popconfirm>
          <el-button
            v-permission="'excitation:company-order-level-rule:query-hislog'"
            type="text"
            @click="openUpdateRecord(scope.row)"
            >更新记录</el-button
          >
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
  <RuleAdd @isConfirm="isConfirmCallback" ref="RuleAddRef" />
  <RuleDetail ref="RuleDetailRef" />
  <UpdateRecord ref="UpdateRecordRef" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import RuleAdd from './order-rule-add.vue'
import RuleDetail from './components/order-rule-detail.vue'
import UpdateRecord from './components/order-rule-update-record.vue'
import { BaseRuleList, PageInitData, ToggleRuleStatus } from '@/webapi/other'
import type {
  PageInitResult,
  BaseRuleListResult,
  PageList
} from '@/webapi/other'
import { GetCompanyList } from '@/webapi/common'
import { findNameByIdFromList } from '@/utils'
import dayjs from 'dayjs'
import type { CompanyItem } from '@/store/modules/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFormRules } from '@/hooks/useFormRule'
import { useCommon } from '@/store'

const { init } = useCommon()
const { ruleFormRef, rules, resetForm } = useFormRules()

const RuleAddRef = ref<InstanceType<typeof RuleAdd>>()
const RuleDetailRef = ref<InstanceType<typeof RuleDetail>>()
const UpdateRecordRef = ref<InstanceType<typeof UpdateRecord>>()

const formData = reactive({
  cityId: undefined,
  companyId: undefined,
  ruleStatus: undefined
})
const pageInit = reactive<PageInitResult>({
  cityList: [],
  excitationStatusList: []
})
onMounted(() => {
  init()
  PageInitData().then(res => {
    if (res.code === 200) {
      pageInit.cityList = res.data.cityList
      pageInit.excitationStatusList = res.data.excitationStatusList
    }
  })
})

const search = () => {
  pageConfig.currentPage = 1
  getList()
}

const reset = () => {
  resetForm()
  companyList.value = []
}

const addRule = () => {
  RuleAddRef.value?.toggleDialogStatus()
}

const editRule = ({
  companyOrderLevelExcitationRuleId,
  companyId
}: BaseRuleListResult) => {
  RuleAddRef.value?.toggleDialogStatus(
    companyOrderLevelExcitationRuleId,
    companyId
  )
}

const openDetail = ({
  companyOrderLevelExcitationRuleId,
  companyId
}: BaseRuleListResult) => {
  RuleDetailRef.value?.toggleDialogStatus(
    companyOrderLevelExcitationRuleId,
    companyId
  )
}

const openUpdateRecord = ({
  companyOrderLevelExcitationRuleId,
  companyId
}: BaseRuleListResult) => {
  UpdateRecordRef.value?.toggleDialogStatus(
    companyOrderLevelExcitationRuleId,
    companyId
  )
}

const closeBaseRule = () => {
  ElMessageBox.confirm('规则关闭后，将立即失效，确认关闭吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const list = currentSelectedList.value.map(
        ({ companyOrderLevelExcitationRuleId }) => {
          return {
            companyOrderLevelExcitationRuleId,
            ruleStatus: 14 as 14 | 19
          }
        }
      )
      ToggleRuleStatus(list).then(res => {
        if (res.code === 200) {
          ElMessage({
            message: '操作成功',
            type: 'success'
          })
          currentSelectedList.value = []
          getList()
        } else {
          ElMessage({
            type: 'error',
            message: res.message
          })
        }
      })
    })
    .catch(() => {})
}

const openBaseRule = (companyOrderLevelExcitationRuleId: number) => {
  ToggleRuleStatus([
    { companyOrderLevelExcitationRuleId, ruleStatus: 19 }
  ]).then(res => {
    if (res.code === 200) {
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
      getList()
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

const currentSelectedList = ref<BaseRuleListResult[]>([])
const handleSelectionChange = (val: BaseRuleListResult[]) => {
  currentSelectedList.value = val
}

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

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

type PageData = PageList<BaseRuleListResult> & { loading: boolean }
const pageData = reactive<PageData>({
  dataList: [],
  totalCount: 0,
  loading: false
})
const getList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      pageData.loading = true
      BaseRuleList({
        ...formData,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          pageData.dataList = res.data.dataList
          pageData.totalCount = res.data.totalCount
        }
      })
    }
  })
}
const isConfirmCallback = () => {
  if (formData.cityId && formData.companyId) {
    getList()
  }
}
</script>

<style scoped lang="scss"></style>
