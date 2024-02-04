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
      <el-form-item>
        <el-button
          v-permission="'excitation:company-evaluate-rule:list'"
          type="primary"
          @click="search"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company-evaluate-rule:list'"
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
      :table-page-current-page="pageConfig.ecejCurrentPage"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="城市" width="100">
        <template #default>
          {{ cityName }}
        </template>
      </el-table-column>
      <el-table-column label="公司名称">
        <template #default>
          <div>{{ companyName }}</div>
          <div style="font-size: 12px">( 公司代码: {{ companyCode }} )</div>
        </template>
      </el-table-column>
      <el-table-column
        label="评价星级"
        property="evaluateStar"
        width="90"
        align="center"
      />
      <el-table-column
        label="评价激励系数"
        property="commissionValue"
        width="120"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row.commissionValue }}%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        property="supdateTime"
        width="180"
        align="center"
      >
        <template #default="scope">
          <span>{{
            dayjs(scope.row.supdateTime).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="scope">
          <el-button
            v-permission="'excitation:company-evaluate-rule:edit'"
            type="text"
            @click="set(scope.row)"
            >设置评价激励系数</el-button
          >
          <el-button
            v-permission="
              'excitation:company-evaluate-rule:operate-record-list'
            "
            type="text"
            @click="
              openRecord(
                scope.row.comnanyEvaluateExcitationRuleRelationId,
                scope.row.evaluateStar
              )
            "
            >更新记录</el-button
          >
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
  <EvaluateRuleAdd
    :current-info="currentInfo"
    :city-name="cityName"
    :company-name="companyName"
    @isConfirm="isConfirmCallback"
    ref="EvaluateRuleAddRef"
  />
  <EvaluateRuleUpdateRecord ref="EvaluateRuleUpdateRecordRef" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { GetCompanyList } from '@/webapi/common'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { EvaluateRuleList } from '@/webapi/serviceItem'
import EvaluateRuleAdd from './components/evaluate-rule-add.vue'
import EvaluateRuleUpdateRecord from './components/evaluate-rule-update-record.vue'
import { useFormRules } from '@/hooks/useFormRule'
import dayjs from 'dayjs'

const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList } = storeToRefs(commonStore)

const EvaluateRuleAddRef = ref(null)
const EvaluateRuleUpdateRecordRef = ref(null)

const currentInfo = ref({})
const set = (row: any) => {
  currentInfo.value = row
  EvaluateRuleAddRef.value.toggleDialogStatus()
}
const openRecord = (
  comnanyEvaluateExcitationRuleRelationId: number,
  evaluateStar: number
) => {
  EvaluateRuleUpdateRecordRef.value.toggleDialogStatus(
    comnanyEvaluateExcitationRuleRelationId,
    evaluateStar
  )
}

const formData = reactive<{
  cityId: number
  companyId: number
}>({
  cityId: undefined,
  companyId: undefined
})

onMounted(() => {
  init()
})

const cityName = ref('')
const companyName = ref('')
const companyCode = ref('')

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

const search = () => {
  pageConfig.ecejCurrentPage = 1
  getList()
}

const reset = () => {
  resetForm()
  companyList.value = []
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
      EvaluateRuleList({
        companyId: formData.companyId,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          const city = cityList.value.filter(
            item => item.cityId === formData.cityId
          )
          cityName.value = city[0] ? city[0]['cityName'] : '--'
          const company = companyList.value.filter(
            item => item.companyId === formData.companyId
          )
          companyName.value = company[0] ? company[0]['companyName'] : '--'
          companyCode.value = company[0] ? company[0]['companyCodeNo'] : '--'
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
