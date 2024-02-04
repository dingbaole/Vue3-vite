<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData" :rules="rules" ref="ruleFormRef">
      <el-form-item label="城市" prop="cityId">
        <el-select
          v-model="formData.cityId"
          @change="cityIdChange"
          filterable
          clearable
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
          clearable
          placeholder="公司"
        >
          <el-option
            v-for="item in optionList.companyList"
            :key="item.companyId"
            :label="item.companyName"
            :value="item.companyId"
          />
        </el-select>
      </el-form-item>
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
          <!-- <div v-if="optionList.serviceItemList.length === 0" v-loading="optionList.serviceItemList.length === 0"></div> -->
        </el-select>
      </el-form-item>
      <el-form-item label="日期时间" prop="dateTime">
        <el-date-picker
          v-model="formData.dateTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="
            'excitation:company-service-item-rule:operate-record-list'
          "
          type="primary"
          @click="search"
          :loading="pageData.loading"
          >查询</el-button
        >
        <el-button
          v-permission="
            'excitation:company-service-item-rule:operate-record-list'
          "
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <TableWithPagination
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.currentPage"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        label="时间"
        property="operTime"
        width="160"
        align="center"
      >
        <template #default="scope">
          <span>{{
            dayjs(scope.row.operTime).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务品类" property="serviceClassName" />
      <el-table-column label="服务项目" property="serviceItemName">
        <template #default="scope">
          <span>{{ scope.row.serviceItemName }}</span>
          <el-tag
            style="margin-left: 10px"
            type="info"
            size="small"
            v-if="scope.row.serviceItemStatus === 1"
            >已取消承接</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="激励规则变更内容" property="operRemark" />
      <el-table-column
        label="操作人"
        property="operator"
        width="120"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row.operator ? scope.row.operator : '--' }}</span>
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import {
  GetCompanyList,
  GetPlatformBigClassList,
  GetPlatformDeviceList,
  GetPlatformServiceClassList,
  GetPlatformServiceItemList
} from '@/webapi/common'
import type { CompanyItem } from '@/store/modules/common'
import { ServiceItemOperateRecord } from '@/webapi/serviceItem'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import dayjs from 'dayjs'
import { useFormRules } from '@/hooks/useFormRule'

const commonStore = useCommon()
const { getCityList } = commonStore
const { cityList } = storeToRefs(commonStore)

const rule = {
  bigClassId: [
    {
      required: true,
      message: '请选择服务大类',
      trigger: 'change'
    }
  ],
  deviceId: [
    {
      required: true,
      message: '请选择设备',
      trigger: 'change'
    }
  ],
  serviceClassId: [
    {
      required: true,
      message: '请选择服务品类',
      trigger: 'change'
    }
  ],
  serviceItemId: [
    {
      required: true,
      message: '请选择服务项目',
      trigger: 'change'
    }
  ]
}
const { ruleFormRef, rules, resetForm } = useFormRules(rule)
const formData = reactive<{
  cityId?: number
  companyId?: number
  bigClassId?: number
  deviceId?: number
  serviceClassId?: number
  serviceItemId?: number
  dateTime?: any[]
}>({
  cityId: undefined,
  companyId: undefined,
  bigClassId: undefined,
  deviceId: undefined,
  serviceClassId: undefined,
  serviceItemId: undefined,
  dateTime: []
})

onMounted(() => {
  getCityList()
})

const search = () => {
  pageConfig.currentPage = 1
  getList()
}

const reset = () => {
  resetForm()
  resetOptions()
  formData.dateTime = []
}

const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  optionList.companyList = []
  if (!cityId) return
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      optionList.companyList = res.data
    }
  })
}

const companyChange = () => {
  // resetOptions()
  // GetPlatformBigClassList({companyId}).then(res => {
  //   if (res.code === 200) {
  //     optionList.bigClass = res.data
  //   }
  // })
}
GetPlatformBigClassList().then(res => {
  if (res.code === 200) {
    optionList.bigClass = res.data
  }
})
interface IdName {
  id: number
  name: string
}
const optionList = reactive<{
  companyList: CompanyItem[]
  bigClass: IdName[]
  deviceList: IdName[]
  serviceClassList: IdName[]
  serviceItemList: IdName[]
}>({
  companyList: [],
  bigClass: [],
  deviceList: [],
  serviceClassList: [],
  serviceItemList: []
})

const resetOptions = () => {
  formData.bigClassId = undefined
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
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
  GetPlatformDeviceList({
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
  GetPlatformServiceClassList({
    deviceId
  }).then(res => {
    if (res.code === 200) {
      optionList.serviceClassList = res.data
    }
  })
}

const serviceClassChange = (serviceClassId: number) => {
  formData.serviceItemId = undefined
  optionList.serviceItemList = []
  if (!serviceClassId) return
  GetPlatformServiceItemList({
    serviceClassId
  }).then(res => {
    if (res.code === 200) {
      optionList.serviceItemList = res.data
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
const pageData = reactive<{
  tableData: any[]
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
      const { cityId, companyId, serviceItemId, dateTime } = formData
      const startTime =
        dateTime?.length > 0
          ? dayjs(dateTime[0]).startOf('day').valueOf()
          : undefined
      const endTime =
        dateTime?.length > 0
          ? dayjs(dateTime[1]).endOf('day').valueOf()
          : undefined
      ServiceItemOperateRecord({
        cityId,
        companyId,
        serviceItemId,
        startTime,
        endTime,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          pageData.tableData = res.data.list
          pageData.total = res.data.total
        }
      })
    }
  })
}
</script>

<style scoped lang="scss"></style>
