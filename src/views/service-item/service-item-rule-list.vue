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
            :key="item.companyId"
            :label="item.companyName"
            :value="item.companyId"
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
            :key="item.commissionType"
            :label="item.commissionName"
            :value="item.commissionType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="ruleStatus">
        <el-select v-model="formData.ruleStatus" placeholder="状态" clearable>
          <el-option
            v-for="item in excitationStatusList"
            :key="item.statusId"
            :label="item.statusName"
            :value="item.statusId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:company-serviceItem-item-rule:list'"
          type="primary"
          @click="search"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company-serviceItem-item-rule:list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:company-serviceItem-item-rule:add-rule'"
      type="primary"
      plain
      @click="addRule('basic')"
      >新建激励基础规则</el-button
    >
    <el-button
      v-permission="'excitation:company-serviceItem-item-rule:add-overlay-rule'"
      type="primary"
      @click="addRule('overlay')"
      >新建激励叠加规则</el-button
    >
    <el-button
      v-permission="'excitation:company-serviceItem-item-rule:close-rule'"
      type="warning"
      :disabled="currentSelectedList.length === 0"
      @click="closeBaseRule"
      >关闭规则</el-button
    >
    <el-button
      v-permission="'excitation:company-serviceItem-item-rule:set-list'"
      type="success"
      @click="openServiceItemList"
      >查看激励服务项目</el-button
    >
    <el-button
      v-permission="'excitation:company-serviceItem-item-rule:export'"
      type="success"
      plain
      @click="exportList"
      >导出规则</el-button
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
      <el-table-column fixed type="selection" width="43" />
      <el-table-column property="cityName" label="城市" width="80" />
      <el-table-column property="companyName" label="公司名称" width="180">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <div style="font-size: 12px">
            ( 公司代码: {{ scope.row.companyCode }} )
          </div>
        </template>
      </el-table-column>
      <el-table-column property="ruleName" label="规则名称" width="320" />
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
        width="90"
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
        <template #default="scope: { row: Table }">
          <div
            style="display: inline-block; margin-right: 12px"
            v-if="
              scope.row.commissionType === 11 || scope.row.commissionType === 12
            "
          >
            <el-button
              v-if="scope.row.ruleStatus !== 14"
              v-permission="'excitation:company-serviceItem-item-rule:copy'"
              type="text"
              @click="copyItem(scope.row)"
              >复制</el-button
            >
            <el-button
              v-permission="
                'excitation:company-serviceItem-item-rule:query-one'
              "
              type="text"
              @click="openDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              v-permission="
                'excitation:company-serviceItem-item-rule:edit-rule'
              "
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
                'excitation:company-serviceItem-item-rule:query-overlay-one'
              "
              type="text"
              @click="openDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              v-permission="
                'excitation:company-serviceItem-item-rule:edit-overlay-rule'
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
                scope.row.comnanyItemExcitationRuleId,
                scope.row.companyId
              )
            "
          >
            <template #reference>
              <el-button
                v-permission="
                  'excitation:company-serviceItem-item-rule:open-rule'
                "
                type="text"
                >开启</el-button
              >
            </template>
          </el-popconfirm>
          <el-button
            v-permission="
              'excitation:company-serviceItem-item-rule:query-hislog'
            "
            type="text"
            @click="openUpdateRecord(scope.row)"
            >更新记录</el-button
          >
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
  <ServiceItemRuleAdd
    @isConfirm="isConfirmCallback"
    ref="ServiceItemRuleAddRef"
  />
  <ServiceItemOverlayRuleAdd
    @isConfirm="isConfirmCallback"
    ref="ServiceItemOverlayRuleAddRef"
  />
  <ServiceItemDetail ref="ServiceItemDetailRef" />
  <ServiceItemOverlayDetail ref="ServiceItemOverlayDetailRef" />
  <ServiceItemUpdateRecord ref="ServiceItemUpdateRecordRef" />
  <CopyRule
    :city-id="copyRuleFromId.cityId"
    :company-id="copyRuleFromId.companyId"
    :comnanyItemExcitationRuleId="copyRuleFromId.comnanyItemExcitationRuleId"
    ref="CopyRuleRef"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import router from '@/router'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import ServiceItemRuleAdd from './service-item-rule-add.vue'
import ServiceItemOverlayRuleAdd from './service-item-overlay-rule-add.vue'
import ServiceItemDetail from './components/service-item-detail.vue'
import ServiceItemOverlayDetail from './components/service-item-overlay-detail.vue'
import ServiceItemUpdateRecord from './components/service-item-update-record.vue'
import CopyRule from './components/copy-rule/copy-rule.vue'
import {
  ServiceItemRuleList,
  ServiceItemRuleExport,
  OpenBaseRule,
  CloseBaseRule
} from '@/webapi/serviceItem'
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

const ServiceItemRuleAddRef = ref<InstanceType<typeof ServiceItemRuleAdd>>()
const ServiceItemOverlayRuleAddRef =
  ref<InstanceType<typeof ServiceItemOverlayRuleAdd>>()
const ServiceItemDetailRef = ref<InstanceType<typeof ServiceItemDetail>>()
const ServiceItemOverlayDetailRef =
  ref<InstanceType<typeof ServiceItemOverlayDetail>>()
const ServiceItemUpdateRecordRef =
  ref<InstanceType<typeof ServiceItemUpdateRecord>>()

const formData = reactive({
  cityId: undefined,
  companyId: undefined,
  commissionType: undefined,
  ruleStatus: undefined
})

const copyRuleFromId = reactive({
  comnanyItemExcitationRuleId: undefined,
  cityId: undefined,
  companyId: undefined
})
const CopyRuleRef = ref<InstanceType<typeof CopyRule>>()
const copyItem = (row: Table) => {
  copyRuleFromId.comnanyItemExcitationRuleId = row.comnanyItemExcitationRuleId
  copyRuleFromId.cityId = formData.cityId
  copyRuleFromId.companyId = row.companyId
  CopyRuleRef.value?.toggleDialogStatus()
}

onMounted(() => {
  init()
})

const search = () => {
  pageConfig.currentPage = 1
  getList()
}

const exportList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      pageData.loading = true
      ServiceItemRuleExport(formData).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          ElMessage({
            message: '导出成功',
            type: 'success'
          })
        } else {
          ElMessage({
            type: 'error',
            message: res.message
          })
        }
      })
    }
  })
}

const reset = () => {
  resetForm()
  companyList.value = []
}

const addRule = (type: 'basic' | 'overlay') => {
  if (type === 'basic') {
    ServiceItemRuleAddRef.value?.toggleDialogStatus()
  } else if (type === 'overlay') {
    ServiceItemOverlayRuleAddRef.value?.toggleDialogStatus()
  }
}

const editRule = ({
  commissionType,
  comnanyItemExcitationRuleId,
  companyId
}: Table) => {
  if (commissionType === 11 || commissionType === 12) {
    ServiceItemRuleAddRef.value?.toggleDialogStatus(
      comnanyItemExcitationRuleId,
      companyId
    )
  } else if (commissionType === 21 || commissionType === 22) {
    ServiceItemOverlayRuleAddRef.value?.toggleDialogStatus(
      comnanyItemExcitationRuleId,
      companyId
    )
  }
}

const openDetail = ({
  commissionType,
  comnanyItemExcitationRuleId,
  companyId
}: Table) => {
  if (commissionType === 11 || commissionType === 12) {
    ServiceItemDetailRef.value?.toggleDialogStatus(
      comnanyItemExcitationRuleId,
      companyId
    )
  } else if (commissionType === 21 || commissionType === 22) {
    ServiceItemOverlayDetailRef.value?.toggleDialogStatus(
      comnanyItemExcitationRuleId,
      companyId
    )
  }
}

const openUpdateRecord = ({
  comnanyItemExcitationRuleId,
  companyId
}: Table) => {
  ServiceItemUpdateRecordRef.value?.toggleDialogStatus(
    comnanyItemExcitationRuleId,
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
      const params = currentSelectedList.value.map(
        ({
          comnanyItemExcitationRuleId,
          commissionType,
          commissionValue,
          companyId
        }) => {
          return {
            comnanyItemExcitationRuleId,
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
  comnanyItemExcitationRuleId: number,
  companyId: number
) => {
  OpenBaseRule({
    comnanyItemExcitationRuleId,
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

const currentSelectedList = ref<Table[]>([])
const handleSelectionChange = (val: Table[]) => {
  currentSelectedList.value = val
}

const openServiceItemList = () => {
  if (window.parent[0]) {
    // 在iframe中
    window.parent.postMessage(
      {
        targetName: 'service-item-list',
        menuName: '查看激励服务项目',
        url: window.location.origin + '/fe-web/service-item-list',
        code: 'service-item-list'
      },
      '*'
    )
  } else {
    router.push('/service-item-list')
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
  commissionType: 11 | 12 | 21 | 22
  commissionValue: number
  updateTime: number
  comnanyItemExcitationRuleId: number
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
      ServiceItemRuleList({
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
