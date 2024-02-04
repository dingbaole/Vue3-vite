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
            v-for="item in cityList"
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
            :label="item.companyName"
            :value="item.companyId"
            :key="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="激励类型" prop="commissionType">
        <el-select
          v-model="formData.commissionType"
          placeholder="激励类型"
          clearable
        >
          <el-option
            v-for="item in [
              ...excitationTypeList,
              ...excitationTypeOverlayList
            ]"
            :label="item.commissionName"
            :value="item.commissionType"
            :key="item.commissionType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="ruleStatus">
        <el-select v-model="formData.ruleStatus" placeholder="状态" clearable>
          <el-option
            v-for="item in excitationStatusList"
            :label="item.statusName"
            :value="item.statusId"
            :key="item.statusId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:company-material-rule:list'"
          type="primary"
          @click="search"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company-material-rule:list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:company-material-rule:add-rule'"
      type="primary"
      plain
      @click="addRule('basic')"
      >新建激励规则</el-button
    >
    <el-button
      v-permission="'excitation:company-serviceItem-item-rule:add-overlay-rule'"
      type="primary"
      @click="addRule('overlay')"
      >新建激励叠加规则</el-button
    >
    <el-button
      v-permission="'excitation:company-material-rule:close-base-rule'"
      type="warning"
      :disabled="currentSelectedList.length === 0"
      @click="closeBaseRule"
      >关闭规则</el-button
    >
    <el-button
      v-permission="'excitation:company-material-rule:set-list'"
      type="success"
      @click="openMaterialList"
      >查看激励物料配件</el-button
    >
    <TableWithPagination
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.currentPage"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column fixed type="selection" width="55" />
      <el-table-column property="cityName" label="城市" width="80" />
      <el-table-column property="companyName" label="公司名称" width="180">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <div style="font-size: 12px">
            ( 公司代码: {{ scope.row.companyCode }} )
          </div>
        </template>
      </el-table-column>
      <el-table-column property="ruleName" label="规则名称" width="200" />
      <el-table-column
        property="ruleStatus"
        label="状态"
        width="80"
        align="center"
      >
        <template #default="scope">
          <span>{{
            findNameByIdFromList(
              excitationStatusList,
              scope.row.ruleStatus,
              'statusId',
              'statusName'
            )
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="commissionType"
        label="激励类型"
        width="90"
        align="center"
      >
        <template #default="scope">
          <span>{{
            findNameByIdFromList(
              [...excitationTypeList, ...excitationTypeOverlayList],
              scope.row.commissionType,
              'commissionType',
              'commissionName'
            )
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="commissionValue"
        label="激励标准"
        width="120"
        align="center"
      >
        <template #default="scope">
          {{
            richRuleName(scope.row.commissionType, scope.row.commissionValue)
          }}
        </template>
      </el-table-column>
      <el-table-column
        property="updateTime"
        label="更新时间"
        width="180"
        align="center"
      >
        <template #default="scope">
          <span>{{
            dayjs(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
        <template #default="scope: { row: Table }">
          <div
            style="display: inline-block; margin-right: 12px"
            v-if="
              scope.row.commissionType === 11 || scope.row.commissionType === 12
            "
          >
            <el-button
              v-permission="'excitation:company-material-rule:query-one'"
              type="text"
              @click="openDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              v-permission="'excitation:company-material-rule:edit-rule'"
              type="text"
              @click="editRule(scope.row)"
              >编辑</el-button
            >
          </div>
          <div
            style="display: inline-block; margin-right: 12px"
            v-if="
              scope.row.commissionType === 21 || scope.row.commissionType === 22
            "
          >
            <el-button
              v-permission="
                'excitation:company-material-rule:query-overlay-one'
              "
              type="text"
              @click="openDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              v-permission="
                'excitation:company-material-rule:edit-overlay-rule'
              "
              type="text"
              @click="editRule(scope.row)"
              >编辑</el-button
            >
          </div>
          <el-popconfirm
            v-if="scope.row.ruleStatus === 14"
            width="300"
            confirm-button-text="确认"
            cancel-button-text="取消"
            title="规则开启后，将立即生效，确认开启吗？"
            @confirm="
              openBaseRule(
                scope.row.comnanyMaterialExcitationRuleId,
                scope.row.companyId
              )
            "
          >
            <template #reference>
              <el-button
                v-permission="'excitation:company-material-rule:open-base-rule'"
                type="text"
                >开启</el-button
              >
            </template>
          </el-popconfirm>
          <el-button
            v-permission="'excitation:company-material-rule:query-hislog'"
            type="text"
            @click="openUpdateRecord(scope.row)"
            >更新记录</el-button
          >
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
  <MaterialRuleAdd @isConfirm="isConfirmCallback" ref="MaterialRuleAddRef" />
  <MaterialOverlayRuleAdd
    @isConfirm="isConfirmCallback"
    ref="MaterialOverlayRuleAddRef"
  />
  <MaterialDetail ref="MaterialDetailRef" />
  <MaterialOverlayDetail ref="MaterialOverlayDetailRef" />
  <MaterialUpdateRecord ref="MaterialUpdateRecordRef" />
  <RecommendConfig />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import router from '@/router'
import RecommendConfig from '@/components/recommendConfig/recommend-config-moal.vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import MaterialRuleAdd from './material-rule-add.vue'
import MaterialOverlayRuleAdd from './material-rule-overlay-add.vue'
import MaterialDetail from './components/material-detail.vue'
import MaterialOverlayDetail from './components/material-overlay-detail.vue'
import MaterialUpdateRecord from './components/material-update-record.vue'
import { RuleList, OpenBaseRule, CloseBaseRule } from '@/webapi/material'
import { GetCompanyList } from '@/webapi/common'
import { findNameByIdFromList, richRuleName } from '@/utils'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFormRules } from '@/hooks/useFormRule'

const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const {
  cityList,
  excitationTypeList,
  excitationTypeOverlayList,
  excitationStatusList
} = storeToRefs(commonStore)

const MaterialRuleAddRef = ref<InstanceType<typeof MaterialRuleAdd>>()
const MaterialOverlayRuleAddRef =
  ref<InstanceType<typeof MaterialOverlayRuleAdd>>()
const MaterialDetailRef = ref<InstanceType<typeof MaterialDetail>>()
const MaterialOverlayDetailRef =
  ref<InstanceType<typeof MaterialOverlayDetail>>()
const MaterialUpdateRecordRef = ref<InstanceType<typeof MaterialUpdateRecord>>()
const formData = reactive({
  cityId: undefined,
  companyId: undefined,
  commissionType: undefined,
  ruleStatus: undefined
})

onMounted(() => {
  init()
})

const addRule = (type: 'basic' | 'overlay') => {
  if (type === 'basic') {
    MaterialRuleAddRef.value?.toggleDialogStatus()
  } else if (type === 'overlay') {
    MaterialOverlayRuleAddRef.value?.toggleDialogStatus()
  }
}

const editRule = ({
  commissionType,
  comnanyMaterialExcitationRuleId,
  companyId
}: Table) => {
  if (commissionType === 11 || commissionType === 12) {
    MaterialRuleAddRef.value?.toggleDialogStatus(
      comnanyMaterialExcitationRuleId,
      companyId
    )
  } else if (commissionType === 21 || commissionType === 22) {
    MaterialOverlayRuleAddRef.value?.toggleDialogStatus(
      comnanyMaterialExcitationRuleId,
      companyId
    )
  }
}

const openDetail = ({
  commissionType,
  comnanyMaterialExcitationRuleId,
  companyId
}: Table) => {
  if (commissionType === 11 || commissionType === 12) {
    MaterialDetailRef.value?.toggleDialogStatus(
      comnanyMaterialExcitationRuleId,
      companyId
    )
  } else if (commissionType === 21 || commissionType === 22) {
    MaterialOverlayDetailRef.value?.toggleDialogStatus(
      comnanyMaterialExcitationRuleId,
      companyId
    )
  }
}

const currentSelectedList = ref<Table[]>([])
const handleSelectionChange = (val: Table[]) => {
  currentSelectedList.value = val
}
const closeBaseRule = () => {
  ElMessageBox.confirm('规则关闭后，将立即失效，确认关闭吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params = currentSelectedList.value.map(
        ({
          comnanyMaterialExcitationRuleId,
          commissionType,
          commissionValue,
          companyId
        }) => {
          return {
            comnanyMaterialExcitationRuleId,
            commissionType,
            commissionValue,
            companyId
          }
        }
      )
      CloseBaseRule(params).then(res => {
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

const openBaseRule = (
  comnanyMaterialExcitationRuleId: number,
  companyId: number
) => {
  OpenBaseRule({
    comnanyMaterialExcitationRuleId,
    companyId
  }).then(res => {
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

const openUpdateRecord = ({
  comnanyMaterialExcitationRuleId,
  companyId
}: Table) => {
  MaterialUpdateRecordRef.value.toggleDialogStatus(
    comnanyMaterialExcitationRuleId,
    companyId
  )
}

const search = () => {
  pageConfig.currentPage = 1
  getList()
}

const reset = () => {
  resetForm()
  companyList.value = []
  // formData.cityId = undefined
  // formData.companyId = undefined
  // formData.commissionType = undefined
  // formData.ruleStatus = undefined
}

const openMaterialList = () => {
  if (window.parent[0]) {
    // 在iframe中
    window.parent.postMessage(
      {
        targetName: 'material-list',
        menuName: '查看激励物料配件',
        url: window.location.origin + '/fe-web/material-list',
        code: 'material-list'
      },
      '*'
    )
  } else {
    router.push('/material-list')
  }
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

interface Table {
  cityName: string
  companyName: string
  companyId: number
  ruleName: string
  ruleStatus: number
  commissionType: number
  commissionValue: number
  updateTime: number
  comnanyMaterialExcitationRuleId: number
}
const pageData = reactive<{
  tableData: Table[]
  total: number
  loading: boolean
}>({
  tableData: [],
  total: 0,
  loading: false
})
const getList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      pageData.loading = true
      RuleList({
        ...formData,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          pageData.tableData = res.data.dataList
          pageData.total = res.data.totalCount
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
