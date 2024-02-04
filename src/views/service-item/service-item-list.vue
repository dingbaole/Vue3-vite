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
      <el-form-item label="服务大类" prop="bigClassId">
        <el-select
          v-model="formData.bigClassId"
          @change="bigClassChange"
          filterable
          clearable
          placeholder="服务大类"
        >
          <el-option
            v-for="item in optionList.bigClass"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="deviceId">
        <el-select
          v-model="formData.deviceId"
          @change="deviceChange"
          filterable
          clearable
          placeholder="设备"
        >
          <el-option
            v-for="item in optionList.deviceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务品类" prop="serviceClassId">
        <el-select
          v-model="formData.serviceClassId"
          @change="serviceClassChange"
          filterable
          clearable
          placeholder="服务品类"
        >
          <el-option
            v-for="item in optionList.serviceClassList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务项目" prop="serviceItemId">
        <el-select
          v-model="formData.serviceItemId"
          filterable
          clearable
          placeholder="服务项目"
        >
          <el-option
            v-for="item in optionList.serviceItemList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:company-serviceItem-item-rule:set-list'"
          type="primary"
          @click="search"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company-serviceItem-item-rule:set-list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:company-serviceItem-item-rule:close-item-rule'"
      type="warning"
      @click="closeRule"
      :disabled="selectedList.length === 0"
      >关闭服务激励规则</el-button
    >
    <div
      style="margin-top: 10px; font-size: 16px"
      v-if="pageData.tableData.length > 0"
    >
      <span>
        查询结果: 该公司已设置激励服务项目数: {{ pageData.setCount }}, 未设置数:
        {{ pageData.noSetCount }}
      </span>
      <el-button
        v-permission="'excitation:company-serviceItem-item-rule:unused-list'"
        style="font-size: 16px; margin-left: 8px"
        type="text"
        @click="openNoset"
        >查看未配置服务项目</el-button
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
      <el-table-column label="服务信息">
        <template #default="scope">
          <div>
            服务项目: {{ scope.row.serviceItemName }}
            <el-tag
              type="info"
              size="small"
              v-if="scope.row.serviceItemStatus === 1"
              >已取消承接</el-tag
            >
          </div>
          <div>
            项目单价:
            {{
              scope.row.serviceFee || scope.row.serviceFee === 0
                ? scope.row.serviceFee
                : '--'
            }}元
          </div>
          <div>所属品类: {{ scope.row.serviceClassName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="服务激励规则" width="430">
        <template #default="scope: { row: ServiceItemTable }">
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
              <!-- <el-tag type="info" size="small" v-if="scope.row.ruleStatus === 14">已失效</el-tag> -->
            </div>
          </div>
          <div
            style="margin-top: 15px"
            v-if="scope.row.serviceItemOverlayRuleList?.length > 0"
          >
            <div>叠加规则:</div>
            <div
              style="margin-bottom: 8px"
              v-for="(item, index) in scope.row.serviceItemOverlayRuleList"
              :key="index"
            >
              <div style="font-weight: bold; color: #333">
                <span>{{ index + 1 }}.</span>
                <span>{{
                  richRuleName(item.commissionType, item.commissionValue, true)
                }}</span>
              </div>
              <div>
                <span style="font-weight: bold; color: #666">有效日期: </span
                >{{ dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss') }} ~
                {{ dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <div>
                <div v-if="item.empRelateType === 11">
                  <span style="font-weight: bold; color: #666"
                    >限定条件适用指定组织员工: </span
                  >{{ item.overlayRuleEmpSpliceName }}
                </div>
                <div v-if="item.serviceAreaRelateType === 11">
                  <span style="font-weight: bold; color: #666"
                    >限定条件适用指定服务区域: </span
                  >{{ item.overlayRuleAreaSpliceName }}
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
        <template #default="scope: { row: ServiceItemTable }">
          <div>公司: {{ scope.row.companyName }}</div>
          <!-- <el-button type="text" @click="openUpdateRecord(scope.row.comnanyItemExcitationRuleId)">激励规则变更记录</el-button> -->
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
  <ServiceItemDisabled
    :selectedList="selectedList"
    @isConfirm="isConfirmCallback"
    ref="ServiceItemDisabledRef"
  />
  <ServiceItemNoset ref="ServiceItemNosetRef" />
  <ServiceItemUpdateRecord ref="ServiceItemUpdateRecordRef" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import ServiceItemDisabled from './components/service-item-disabled.vue'
import ServiceItemNoset from './components/service-item-noset.vue'
import ServiceItemUpdateRecord from './components/service-item-update-record.vue'
import { SetList, CountList } from '@/webapi/serviceItem'
import {
  GetCompanyList,
  GetCompanyBigClassList,
  GetCompanyDeviceList,
  GetCompanyServiceClassList,
  GetCompanyServiceItemList
} from '@/webapi/common'
import { richRuleName } from '@/utils'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { ISetList, ServiceItemTable } from '@/webapi/serviceItem'
import type { CompanyItem } from '@/store/modules/common'
import { useFormRules } from '@/hooks/useFormRule'
import dayjs from 'dayjs'

const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList, excitationTypeList } = storeToRefs(commonStore)

const ServiceItemDisabledRef = ref<InstanceType<typeof ServiceItemDisabled>>()
const ServiceItemNosetRef = ref<InstanceType<typeof ServiceItemNoset>>()
const ServiceItemUpdateRecordRef =
  ref<InstanceType<typeof ServiceItemUpdateRecord>>()
const formData = reactive<ISetList>({
  cityId: undefined,
  companyId: undefined,
  commissionType: undefined,
  bigClassId: undefined,
  deviceId: undefined,
  serviceClassId: undefined,
  serviceItemId: undefined
})

onMounted(() => {
  init()
})

interface SelectedList extends ServiceItemTable {
  checked: boolean
}
const selectedList = ref<SelectedList[]>([])
const handleSelectionChange = (val: SelectedList[]) => {
  selectedList.value = val.map(item => {
    item['checked'] = false
    if (item?.serviceItemOverlayRuleList?.length > 0) {
      item.serviceItemOverlayRuleList = item?.serviceItemOverlayRuleList.map(
        ele => {
          ele['checked'] = false
          return ele
        }
      )
    }
    return item
  })
}

// const openUpdateRecord = (comnanyItemExcitationRuleId: number) => {
//   ServiceItemUpdateRecordRef.value?.toggleDialogStatus(comnanyItemExcitationRuleId)
// }

const openNoset = () => {
  ServiceItemNosetRef.value?.toggleDialogStatus(
    formData.cityId,
    formData.companyId
  )
}

const closeRule = () => {
  ServiceItemDisabledRef.value?.toggleDialogStatus()
}

const search = () => {
  pageConfig.currentPage = 1
  getList()
  getCount()
}

const reset = () => {
  resetForm()
  companyList.value = []
  optionList.bigClass = []
  optionList.deviceList = []
  optionList.serviceClassList = []
  optionList.serviceItemList = []
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
  tableData: ServiceItemTable[]
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
    }
  })
}
const getCount = () => {
  CountList({
    companyId: formData.companyId
  }).then(res => {
    if (res.code === 200) {
      pageData.setCount = res.data.setCount
      pageData.noSetCount = res.data.noSetCount
      pageData.invalidCount = res.data.invalidCount
    }
  })
}

const isConfirmCallback = () => {
  if (formData.cityId && formData.companyId) {
    getList()
  }
}

interface IdName {
  id: number
  name: string
}
const optionList = reactive<{
  bigClass: IdName[]
  deviceList: IdName[]
  serviceClassList: IdName[]
  serviceItemList: IdName[]
}>({
  bigClass: [],
  deviceList: [],
  serviceClassList: [],
  serviceItemList: []
})

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  resetOptions()
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

const companyChange = (companyId: number) => {
  resetOptions()
  GetCompanyBigClassList({ companyId }).then(res => {
    if (res.code === 200) {
      optionList.bigClass = res.data
    }
  })
}

const resetOptions = () => {
  formData.bigClassId = undefined
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  optionList.bigClass = []
  optionList.deviceList = []
  optionList.serviceClassList = []
  optionList.serviceItemList = []
}

const bigClassChange = (bigClassId: number) => {
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  optionList.deviceList = []
  optionList.serviceClassList = []
  optionList.serviceItemList = []
  if (!bigClassId) return
  GetCompanyDeviceList({
    companyId: formData.companyId,
    bigClassId
  }).then(res => {
    if (res.code === 200) {
      optionList.deviceList = res.data
    }
  })
}

const deviceChange = (deviceId: number) => {
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  optionList.serviceClassList = []
  optionList.serviceItemList = []
  if (!deviceId) return
  GetCompanyServiceClassList({
    companyId: formData.companyId,
    deviceId
  }).then(res => {
    if (res.code === 200) {
      optionList.serviceClassList = res.data
    }
  })
}

const serviceClassChange = (serviceClassId: number) => {
  formData.serviceItemId = undefined
  optionList.serviceClassList = []
  if (!serviceClassId) return
  GetCompanyServiceItemList({
    companyId: formData.companyId,
    serviceClassId
  }).then(res => {
    if (res.code === 200) {
      optionList.serviceItemList = res.data
    }
  })
}
</script>

<style scoped lang="scss"></style>
