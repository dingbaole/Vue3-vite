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
      <el-form-item label="员工姓名">
        <el-input v-model="formData.empName" placeholder="员工姓名" clearable />
      </el-form-item>
      <el-form-item label="员工手机号">
        <el-input
          v-model="formData.mobileNo"
          placeholder="员工手机号"
          clearable
        />
      </el-form-item>
      <el-form-item label="时间">
        <el-radio-group v-model="timeType">
          <el-radio-button label="year">年</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
          <el-radio-button label="date">日</el-radio-button>
        </el-radio-group>
        <div style="margin-left: 8px" v-if="timeType === 'date'">
          <el-date-picker
            v-model="formData.day"
            type="date"
            :clearable="false"
            :editable="false"
            format="YYYY[年]MM[月]DD[日]"
            placeholder="请选择日期"
          >
          </el-date-picker>
        </div>
        <div style="margin-left: 8px" v-if="timeType === 'month'">
          <el-date-picker
            v-model="formData.month"
            type="month"
            :clearable="false"
            :editable="false"
            format="YYYY[年]MM[月]"
            placeholder="请选择月份"
          >
          </el-date-picker>
        </div>
        <div style="margin-left: 8px" v-if="timeType === 'year'">
          <el-date-picker
            v-model="formData.year"
            type="year"
            :clearable="false"
            :editable="false"
            format="YYYY[年]"
            placeholder="请选择年份"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'sales:kanban-goods-sale-ranking-list'"
          type="primary"
          :loading="pageData.loading"
          @click="search"
          >查询</el-button
        >
        <el-button
          v-permission="'sales:kanban-goods-sale-ranking-list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'sales:kanban-goods-sale-ranking-export'"
      type="primary"
      :loading="exportLoading"
      @click="exportData"
      >导出</el-button
    >
    <TableWithPagination
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.pageNum"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="员工销售名次" property="index" />
      <el-table-column label="员工姓名" property="empName" />
      <el-table-column label="员工手机号" property="mobileNo" />
      <el-table-column label="商品销售额" property="saleAmount" />
      <el-table-column label="激励金额" property="commission" />
      <el-table-column label="公司名称" property="companyName" width="260">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <div style="font-size: 12px">
            ( 公司代码: {{ scope.row.companyCode }} )
          </div>
        </template>
      </el-table-column>
      <el-table-column label="城市" property="cityName" />
    </TableWithPagination>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import { GetCompanyList } from '@/webapi/common'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { SaleDataList, SaleDataExport } from '@/webapi/statistics'
import type { SaleData } from '@/webapi/statistics'
import { useFormRules } from '@/hooks/useFormRule'
import dayjs from 'dayjs'

const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList } = storeToRefs(commonStore)

const timeType = ref<'year' | 'month' | 'date'>('year')
const formData = reactive<SaleData>({
  cityId: undefined,
  companyId: undefined,
  empName: '',
  mobileNo: '',
  year: dayjs().format('YYYY'),
  month: dayjs().format('YYYY-MM'),
  day: dayjs().format('YYYY-MM-DD')
})

const search = () => {
  pageConfig.pageNum = 1
  getList()
}

const reset = () => {
  resetForm()
  timeType.value = 'year'
  formData.empName = ''
  formData.mobileNo = ''
  formData.year = dayjs().format('YYYY')
  formData.month = dayjs().format('YYYY-MM')
  formData.day = dayjs().format('YYYY-MM-DD')
  companyList.value = []
}

const exportLoading = ref(false)
const exportData = () => {
  const { year, month, day, ...rest } = formData
  const params: any = {}
  if (timeType.value === 'year') {
    params['year'] = dayjs(year).format('YYYY')
  } else if (timeType.value === 'month') {
    params['month'] = dayjs(month).format('YYYY-MM')
  } else if (timeType.value === 'date') {
    params['day'] = dayjs(day).format('YYYY-MM-DD')
  }
  exportLoading.value = true
  SaleDataExport({
    ...params,
    ...rest
  }).then(res => {
    exportLoading.value = false
    // if (res.code === 200) {
    const binary: any = [res]
    const url = window.URL.createObjectURL(
      new Blob(binary, { type: 'application/vnd.ms-excel' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = '商品销售员工排行'
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
    // }
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
  pageNum: 1,
  pageSize: 10
})
const tablePageChange = ({
  currentPage,
  pageSize
}: {
  currentPage: number
  pageSize: number
}) => {
  pageConfig.pageNum = currentPage
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
      const { year, month, day, ...rest } = formData
      const params: any = {}
      if (timeType.value === 'year') {
        params['year'] = dayjs(year).format('YYYY')
      } else if (timeType.value === 'month') {
        params['month'] = dayjs(month).format('YYYY-MM')
      } else if (timeType.value === 'date') {
        params['day'] = dayjs(day).format('YYYY-MM-DD')
      }
      SaleDataList({
        ...params,
        ...rest,
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
