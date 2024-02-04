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
            :label="item.cityName"
            :value="item.cityId"
            :key="item.cityId"
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
            :label="item.companyName"
            :value="item.companyId"
            :key="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料查询" prop="materialId">
        <el-select
          class="custom-select"
          v-model="formData.materialId"
          filterable
          clearable
          remote
          placeholder="支持物料名称(模糊)、物料号(精确)查找"
          :remote-method="remoteMethod"
          :loading="optionList.materialLoading"
        >
          <el-option
            v-for="item in optionList.materialList"
            :label="`${item.materialName}(${item.materialNo})`"
            :value="item.materialId"
            :key="item.materialId"
          />
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
          v-permission="'excitation:company-material-rule:operate-record-list'"
          type="primary"
          @click="search"
          :loading="pageData.loading"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company-material-rule:operate-record-list'"
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
      <el-table-column label="物料号" property="materialNo">
        <template #default="scope">
          <span>{{ scope.row.materialNo }}</span>
          <el-tag
            style="margin-left: 10px"
            type="info"
            size="small"
            v-if="scope.row.materialStatus === 1"
            >已删除</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="物料名称" property="materialName" />
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
import { GetCompanyList } from '@/webapi/common'
import { RecordMaterialList, MaterialOperateRecord } from '@/webapi/material'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import dayjs from 'dayjs'
import { useFormRules } from '@/hooks/useFormRule'

const commonStore = useCommon()
const { getCityList } = commonStore
const { cityList } = storeToRefs(commonStore)

const rule = {
  materialId: [
    {
      required: true,
      message: '请选择物料',
      trigger: 'change'
    }
  ]
}
const { ruleFormRef, rules, resetForm } = useFormRules(rule)
const formData = reactive<{
  cityId?: number
  companyId?: number
  materialId?: number
  dateTime: any[]
}>({
  cityId: undefined,
  companyId: undefined,
  materialId: undefined,
  dateTime: []
})

const optionList = reactive({
  companyList: [],
  materialList: [],
  materialLoading: false
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
  formData.dateTime = []
  optionList.companyList = []
  optionList.materialList = []
}

const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  formData.materialId = undefined
  optionList.companyList = []
  optionList.materialList = []
  if (!cityId) return
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      optionList.companyList = res.data
    }
  })
}

const companyChange = (companyId: number) => {
  formData.materialId = undefined
  optionList.materialList = []
  if (!companyId) return
  // RecordMaterialList({cityId: formData.cityId, companyId}).then(res => {
  //   if (res.code === 200) {
  //     optionList.materialList = res.data
  //   }
  // })
}
const remoteMethod = (val: string) => {
  if (val) {
    const isNumber = !isNaN(Number(val))
    const params: any = {}
    if (isNumber) {
      params['materialNo'] = val
    } else {
      params['materialName'] = val
    }
    optionList.materialLoading = true
    RecordMaterialList({ limit: 200000, offset: 1, ...params }).then(res => {
      optionList.materialLoading = false
      if (res.rows?.length > 0) {
        optionList.materialList = res.rows
      } else {
        optionList.materialList = []
      }
    })
  } else {
    optionList.materialList = []
  }
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
      const { cityId, companyId, materialId, dateTime } = formData
      const startTime =
        dateTime?.length > 0
          ? dayjs(dateTime[0]).startOf('day').valueOf()
          : undefined
      const endTime =
        dateTime?.length > 0
          ? dayjs(dateTime[1]).endOf('day').valueOf()
          : undefined
      MaterialOperateRecord({
        cityId,
        companyId,
        materialId,
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

<style scoped lang="scss">
.custom-select {
  width: 300px;
  :deep(.el-input) {
    max-width: 300px !important;
  }
}
</style>
