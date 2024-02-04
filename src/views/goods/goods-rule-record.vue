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
      <el-form-item label="商品查询" prop="goodsId">
        <el-select
          v-model="formData.goodsId"
          filterable
          clearable
          placeholder="商品查询"
        >
          <el-option
            v-for="item in optionList.goodsList"
            :label="`${item.goodsName}-${item.skuNo}`"
            :value="item.goodsId"
            :key="item.goodsId"
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
          v-permission="'excitation:company-goods-rule-record:list'"
          type="primary"
          @click="search"
          :loading="pageData.loading"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company-goods-rule-record:list'"
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
        property="operateTime"
        width="160"
        align="center"
      >
        <template #default="scope">
          <span>{{
            dayjs(scope.row.operateTime).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SKU编号" property="skuNo" width="150" />
      <el-table-column label="商品名称" property="goodsName">
        <template #default="scope">
          <span>{{ scope.row.goodsName }}</span>
          <el-tag
            style="margin-left: 10px"
            type="info"
            size="small"
            v-if="scope.row.marketDelFlag === '1'"
            >已删除</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="激励规则变更内容" property="remark" />
      <el-table-column
        label="操作人"
        property="operateUserName"
        width="120"
        align="center"
      >
        <template #default="scope">
          <span>{{
            scope.row.operateUserName ? scope.row.operateUserName : '--'
          }}</span>
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import { GetCompanyList } from '@/webapi/common'
import {
  MarketGoodsList,
  MarketShopList,
  GoodsOperateRecord
} from '@/webapi/goods'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import dayjs from 'dayjs'
import { useFormRules } from '@/hooks/useFormRule'

const commonStore = useCommon()
const { getCityList } = commonStore
const { cityList } = storeToRefs(commonStore)

const rule = {
  goodsId: [
    {
      required: true,
      message: '请选择商品',
      trigger: 'change'
    }
  ]
}
const { ruleFormRef, rules, resetForm } = useFormRules(rule)
const formData = reactive<{
  cityId?: number
  companyId?: number
  goodsId?: number
  dateTime: any[]
}>({
  cityId: undefined,
  companyId: undefined,
  goodsId: undefined,
  dateTime: []
})

const optionList = reactive({
  companyList: [],
  goodsList: []
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
  optionList.goodsList = []
}

const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  formData.goodsId = undefined
  optionList.companyList = []
  optionList.goodsList = []
  if (!cityId) return
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      optionList.companyList = res.data
    }
  })
}

const companyChange = (companyId: number) => {
  formData.goodsId = undefined
  optionList.goodsList = []
  if (!companyId) return
  MarketShopList({
    cityId: formData.cityId,
    companyId
  })
    .then(res => {
      if (res.code === 200) {
        return MarketGoodsList({ marketShopId: res.data[0].marketShopId })
      }
    })
    .then(res => {
      if (res.code === 200) {
        optionList.goodsList = res.data
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
      const { cityId, companyId, goodsId, dateTime } = formData
      const operateTimeStart =
        dateTime?.length > 0
          ? dayjs(dateTime[0]).startOf('day').valueOf()
          : undefined
      const operateTimeEnd =
        dateTime?.length > 0
          ? dayjs(dateTime[1]).endOf('day').valueOf()
          : undefined
      GoodsOperateRecord({
        cityId,
        companyId,
        goodsId,
        operateTimeStart,
        operateTimeEnd,
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
