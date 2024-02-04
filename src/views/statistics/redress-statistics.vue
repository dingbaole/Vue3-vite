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
            :label="item.cityName"
            :value="item.cityId"
            :key="item.cityId"
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          clearable
        />
      </el-form-item>
      <el-form-item label="员工姓名/手机号" prop="empId">
        <el-select
          v-model="formData.empId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入姓名或手机号"
          :remote-method="remoteMethod"
          :loading="selectRemote.loading"
          style="width: 200px"
        >
          <el-option
            v-for="item in selectRemote.options"
            :key="item.empId"
            :label="`${item.mobileNo}(${item.empName})`"
            :value="item.empId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:rule:stat-redress-list'"
          type="primary"
          @click="search"
          :loading="pageData.loading"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:rule:stat-redress-list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:rule:stat-redress-add'"
      type="primary"
      @click="add"
      >新增调整</el-button
    >
    <el-button
      v-permission="'excitation:rule:stat-redress-asyn-export'"
      type="primary"
      @click="exportData"
      :loading="exportLoading"
      >导出</el-button
    >
    <TableWithPagination
      ref="TableRef"
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.ecejCurrentPage"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="城市" property="cityName" />
      <el-table-column label="公司名称" property="companyName" />
      <!-- <el-table-column
        label="账期月份"
        property="statementMonthName"
        width="120"
        align="center"
      /> -->
      <el-table-column label="员工姓名" property="empName" />
      <el-table-column label="员工手机号" property="mobileNo" />
      <el-table-column label="调整金额" property="redressAmount" />
      <el-table-column label="调整原因" property="remark" />
      <el-table-column label="创建时间" property="screateTime">
        <template #default="scope">
          <span>{{
            dayjs(scope.row.screateTime).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整人" property="createUserName" />
    </TableWithPagination>
  </el-card>
  <RedressModal @isConfirm="isConfirmCallback" ref="RedressModalRef" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import { GetCompanyList } from '@/webapi/common'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { RedressItemList, RedressItemExport } from '@/webapi/statistics'
import RedressModal from './redress-modal.vue'
import { useFormRules } from '@/hooks/useFormRule'
import { useRemoteSearchEmp } from '@/hooks/useRemoteSearch'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList } = storeToRefs(commonStore)

const RedressModalRef = ref(null)
const add = () => {
  RedressModalRef.value.toggleDialogStatus()
}

const dateRange = ref([])
const formData = reactive({
  cityId: undefined,
  companyId: undefined,
  createTimeStart: undefined,
  createTimeEnd: undefined,
  empId: undefined
})
const { selectRemote, remoteMethod } = useRemoteSearchEmp()

const search = () => {
  pageConfig.ecejCurrentPage = 1
  getList()
}

const reset = () => {
  resetForm()
  dateRange.value = []
  companyList.value = []
}

const genParams = () => {
  if (!dateRange.value) {
    return {
      ...formData
    }
  }
  if (dateRange.value.length === 0) {
    return {
      ...formData
    }
  }
  const createTimeStart: string = `${dateRange.value[0]} 00:00:00`
  const createTimeEnd: string = `${dateRange.value[1]} 23:59:59`
  return {
    ...formData,
    createTimeStart,
    createTimeEnd
  }
}

const exportLoading = ref(false)
const exportData = () => {
  const params = genParams()
  exportLoading.value = true
  RedressItemExport({ ...params }).then(res => {
    exportLoading.value = false
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '导出成功'
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

onMounted(() => {
  init()
})

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
  ecejCurrentPage: 1,
  ecejPageSize: 10
})

const tablePageChange = ({
  currentPage,
  pageSize
}: {
  currentPage: number
  pageSize: number
}) => {
  pageConfig.ecejCurrentPage = currentPage
  pageConfig.ecejPageSize = pageSize
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
      const params = genParams()
      RedressItemList({
        ...params,
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
const isConfirmCallback = () => {
  if (formData.cityId && formData.companyId) {
    getList()
  }
}
</script>

<style scoped lang="scss"></style>
