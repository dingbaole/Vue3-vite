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
        <el-select
          v-model="formData.companyId"
          @change="companyChange"
          filterable
          placeholder="公司"
        >
          <el-option
            v-for="item in companyList"
            :key="item.companyId"
            :label="item.companyName"
            :value="item.companyId"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="激励类型" prop="commissionType">
        <el-select
          v-model="formData.commissionType"
          placeholder="激励类型"
          clearable
        >
          <el-option
            v-for="item in [...excitationTypeList]"
            :key="item.commissionType"
            :label="item.commissionName"
            :value="item.commissionType"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="物料号/物料名称" prop="materialId">
        <el-select
          v-model="formData.materialId"
          filterable
          clearable
          placeholder="物料号/物料名称"
        >
          <el-option
            v-for="item in materialOptions"
            :key="item.materialId"
            :label="`${item.materialName}(${item.materialNo})`"
            :value="item.materialId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:company-material-rule:set-list'"
          type="primary"
          @click="search"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company-material-rule:set-list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:company-material-rule:close-material-rule'"
      type="warning"
      @click="closeRule"
      :disabled="selectedList.length === 0"
      >关闭物料配件激励规则</el-button
    >
    <div
      style="margin-top: 10px; font-size: 16px"
      v-if="pageData.tableData.length > 0"
    >
      <span>
        查询结果: 该公司已设置激励物料数: {{ pageData.setCount }}, 未设置数:
        {{ pageData.noSetCount }}
      </span>
      <el-button
        v-permission="'excitation:company-material-rule:unused-list'"
        style="font-size: 16px; margin-left: 8px"
        type="text"
        @click="openNoset"
        >查看未配置物料配件</el-button
      >
    </div>
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
      <el-table-column label="物料信息">
        <template #default="scope">
          <div>
            物料号: {{ scope.row.materialNo }}
            <el-tag
              type="info"
              size="small"
              v-if="scope.row.materialStatus === 1"
              >已删除不存在</el-tag
            >
          </div>
          <div>
            物料单价:
            {{
              scope.row.price || scope.row.price === 0 ? scope.row.price : '--'
            }}元
          </div>
          <div>物料名称: {{ scope.row.materialName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="物料激励规则" width="430">
        <template #default="scope: { row: MaterialTable }">
          <div>
            <div>基础规则:</div>
            <div>
              {{
                richRuleName(
                  scope.row.commissionType,
                  scope.row.commissionValue,
                  true
                )
              }}
            </div>
          </div>
          <div
            style="margin-top: 15px"
            v-if="scope.row.materialOverlayRuleList?.length > 0"
          >
            <div>叠加规则:</div>
            <div
              style="margin-bottom: 15px"
              v-for="(item, index) in scope.row.materialOverlayRuleList"
              :key="index"
            >
              <div style="font-weight: bold; color: #333">
                <span>{{ index + 1 }}.</span>
                <span>{{
                  richRuleName(item.commissionType, item.commissionValue, true)
                }}</span>
              </div>
              <div>
                <span style="font-weight: bold; color: #666">有效日期: </span>
                {{ dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss') }} ~
                {{ dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <div>
                <div v-if="item.empRelateType === 11">
                  <span style="font-weight: bold; color: #666"
                    >限定条件适用指定组织员工:
                  </span>
                  {{ item.overlayRuleEmpSpliceName }}
                </div>
                <div v-if="item.serviceAreaRelateType === 11">
                  <span style="font-weight: bold; color: #666"
                    >限定条件适用指定服务区域:
                  </span>
                  {{ item.overlayRuleAreaSpliceName }}
                </div>
                <div v-if="item.orderLabelRelateType === 11">
                  <span style="font-weight: bold; color: #666"
                    >限定条件适用订单标签: </span
                  >{{ item.overlayRuleOrderLabelSpliceName }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="230">
        <template #default="scope">
          <div>公司: {{ scope.row.companyName }}</div>
          <!-- <el-button type="text" @click="openUpdateRecord(scope.row.comnanyMaterialExcitationRuleId)">激励规则变更记录</el-button> -->
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
  <MaterialDisabled
    :selectedList="selectedList"
    @isConfirm="isConfirmCallback"
    ref="MaterialDisabledRef"
  />
  <MaterialNoset ref="MaterialNosetRef" />
  <MaterialUpdateRecord ref="MaterialUpdateRecordRef" />
</template>

<script setup lang="ts">
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import MaterialDisabled from './components/material-disabled.vue'
import MaterialNoset from './components/material-noset.vue'
import MaterialUpdateRecord from './components/material-update-record.vue'
import { ref, reactive, onMounted } from 'vue'
import { SetList, MaterialList, CountList } from '@/webapi/material'
import { GetCompanyList } from '@/webapi/common'
import { richRuleName } from '@/utils'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { ISetList, MaterialTable } from '@/webapi/material'
import type { CompanyItem } from '@/store/modules/common'
import { useFormRules } from '@/hooks/useFormRule'
import dayjs from 'dayjs'

const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList, excitationTypeList } = storeToRefs(commonStore)

const MaterialDisabledRef = ref(null)
const MaterialNosetRef = ref(null)
const MaterialUpdateRecordRef = ref(null)
const formData = reactive<ISetList>({
  cityId: undefined,
  companyId: undefined,
  commissionType: undefined,
  materialId: undefined
})

onMounted(() => {
  init()
})
interface SelectedList extends MaterialTable {
  checked: boolean
}
const selectedList = ref<SelectedList[]>([])
const handleSelectionChange = (val: SelectedList[]) => {
  selectedList.value = val.map(item => {
    item['checked'] = false
    if (item?.materialOverlayRuleList?.length > 0) {
      item.materialOverlayRuleList = item?.materialOverlayRuleList.map(ele => {
        ele['checked'] = false
        return ele
      })
    }
    return item
  })
}

// const openUpdateRecord = (comnanyMaterialExcitationRuleId: number) => {
//   MaterialUpdateRecordRef.value.toggleDialogStatus(comnanyMaterialExcitationRuleId)
// }

const openNoset = () => {
  MaterialNosetRef.value.toggleDialogStatus(formData.cityId, formData.companyId)
}

const closeRule = () => {
  MaterialDisabledRef.value.toggleDialogStatus()
}

const search = () => {
  pageConfig.currentPage = 1
  getList()
}

const reset = () => {
  resetForm()
  companyList.value = []
  materialOptions.value = []
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

const pageData = reactive<{
  tableData: MaterialTable[]
  total: number
  loading: boolean
  setCount: number
  invalidCount: number
  noSetCount: number
}>({
  tableData: [],
  total: 0,
  loading: false,
  setCount: 0,
  invalidCount: 0,
  noSetCount: 0
})
const getList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      pageData.loading = true
      SetList({
        ...formData,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          pageData.tableData = res.data.list ? res.data.list : []
          pageData.total = res.data.total
        }
      })
      CountList({ companyId: formData.companyId }).then(res => {
        if (res.code === 200) {
          pageData.setCount = res.data.setCount
          pageData.noSetCount = res.data.noSetCount
          pageData.invalidCount = res.data.invalidCount
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

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

const companyChange = () => {
  getMaterialList()
}
const materialOptions = ref([])
const getMaterialList = () => {
  MaterialList({
    cityId: formData.cityId,
    companyId: formData.companyId
  }).then(res => {
    if (res.code === 200) {
      materialOptions.value = res.data
    }
  })
}
</script>

<style scoped lang="scss"></style>
