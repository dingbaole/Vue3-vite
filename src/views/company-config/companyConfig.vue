<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData" ref="ruleFormRef">
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
          filterable
          clearable
          placeholder="公司"
        >
          <el-option
            v-for="item in optionsList.companyList"
            :label="item.companyName"
            :value="item.companyId"
            :key="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开通状态" prop="companyId">
        <el-select
          v-model="formData.empExcitationVersion"
          filterable
          clearable
          placeholder="开通状态"
        >
          <el-option
            v-for="item in optionsList.empExcitationVersionList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:company:manage:list'"
          type="primary"
          @click="search"
          :loading="pageData.loading"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company:manage:list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
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
      <el-table-column label="公司名称" property="companyName">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <div style="font-size: 12px">
            ( 公司代码:
            {{
              scope.row.companyCodeNo
                ? scope.row.companyCodeNo
                : findCompanyNo(scope.row.companyId)
            }}
            )
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="开通状态"
        property="empExcitationVersion"
        width="90"
        align="center"
      >
        <template #default="scope">
          <span>{{
            scope.row.empExcitationVersion === 11
              ? '已开通'
              : scope.row.empExcitationVersion === 10
              ? '未开通'
              : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开通时间"
        property="empExcitationVersionOperateTime"
        width="160"
        align="center"
      >
        <template #default="scope">
          <span>{{
            scope.row.empExcitationVersion === 10
              ? '--'
              : dayjs(scope.row.empExcitationVersionOperateTime).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作人"
        property="empExcitationVersionOperateUserName"
        width="120"
        align="center"
      >
        <template #default="scope">
          <span>{{
            scope.row.empExcitationVersionOperateUserName
              ? scope.row.empExcitationVersionOperateUserName
              : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="scope">
          <el-button
            v-permission="'excitation:company:manage:edit'"
            v-if="scope.row.empExcitationVersion === 10"
            type="text"
            @click="updateItem(scope.row)"
          >
            开通
          </el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onMounted, h } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import {
  CompanyConfigPageInit,
  CompanyConfigList,
  UpdateEmpVersion,
  GetCompanyList
} from '@/webapi/common'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'

const commonStore = useCommon()
const { getCityList } = commonStore
const { cityList } = storeToRefs(commonStore)

const formData = reactive<{
  cityId?: number
  companyId?: number
  empExcitationVersion?: number
}>({
  cityId: undefined,
  companyId: undefined,
  empExcitationVersion: undefined
})

const optionsList = reactive({
  empExcitationVersionList: [],
  companyList: []
})
onMounted(() => {
  getCityList()
  CompanyConfigPageInit().then(res => {
    if (res.code === 200) {
      optionsList.empExcitationVersionList = res.data.empExcitationVersionList
    }
  })
})

const findCompanyNo = (companyId: number) => {
  const item = optionsList.companyList.filter(
    item => item.companyId === companyId
  )
  if (item?.length > 0) {
    return item[0]['companyCodeNo']
  }
  return ''
}
// '创值激励模式确认开通后，系统将开始按已配置的激励规则为员工计算创值激励，确认开通吗？
// Tips：仅针对开通时间后产生的相关业务 做创值激励的计算。',
const updateItem = ({ companyId, cityId }: any) => {
  ElMessageBox.confirm(
    h('div', null, [
      h(
        'div',
        null,
        '创值激励模式确认开通后，系统将开始按已配置的激励规则为员工计算创值激励，确认开通吗？'
      ),
      h(
        'div',
        {
          style: {
            color: '#8b8b8b',
            fontSize: '13px',
            marginTop: '5px'
          }
        },
        'Tips：仅针对开通时间后产生的相关业务 做创值激励的计算。'
      )
    ]),
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customStyle: {
        maxWidth: '500px'
      }
    }
  )
    .then(() => {
      UpdateEmpVersion({
        companyId,
        cityId,
        empExcitationVersion: 11
      }).then(res => {
        if (res.code === 200) {
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

const search = () => {
  pageConfig.ecejCurrentPage = 1
  getList()
}

const reset = () => {
  formData.cityId = undefined
  formData.companyId = undefined
  formData.empExcitationVersion = undefined
  optionsList.companyList = []
}

const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  optionsList.companyList = []
  if (!cityId) return
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      optionsList.companyList = res.data
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
  pageData.loading = true
  CompanyConfigList({
    ...formData,
    ...pageConfig
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      pageData.tableData = res.data.list
      pageData.total = res.data.total
    }
  })
}
</script>

<style scoped lang="scss"></style>
