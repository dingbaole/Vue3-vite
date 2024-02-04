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
        <el-select
          v-model="formData.companyId"
          @change="companyChange"
          filterable
          placeholder="公司"
        >
          <el-option
            v-for="item in companyList"
            :label="item.companyName"
            :value="item.companyId"
            :key="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务站" prop="stationId">
        <el-select
          v-model="formData.stationId"
          filterable
          clearable
          placeholder="服务站"
        >
          <el-option
            v-for="item in stationList"
            :label="`${item.stationName}`"
            :value="item.stationId"
            :key="item.stationId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="售后状态" prop="orderStatus">
        <el-select
          v-model="formData.orderStatus"
          placeholder="售后状态"
          clearable
        >
          <el-option
            v-for="item in orderStatusList"
            :label="item.name"
            :value="item.type"
            :key="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上门售后单号" prop="afterSaleOrderNo">
        <el-input
          style="width: 180px"
          v-model="formData.afterSaleOrderNo"
          placeholder="上门售后单号"
          clearable
          :parser="parser"
        ></el-input>
      </el-form-item>
      <el-form-item label="关联服务订单号" prop="workOrderNo">
        <el-input
          style="width: 180px"
          v-model="formData.workOrderNo"
          placeholder="关联服务订单号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="售后创建时间">
        <el-date-picker
          v-model="dateRangeCreate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="售后完成时间">
        <el-date-picker
          v-model="dateRangeComplete"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" :loading="props.loading">
          查询
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { useFormRules } from '@/hooks/useFormRule'
import { GetCompanyList } from '@/webapi/common'
import { GetStationList } from '@/webapi/common'
import type { Station } from '@/webapi/common'
import { AfterSalesStatus } from '../types'
import dayjs from 'dayjs'

const props = defineProps<{ loading: boolean }>()
const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList } = storeToRefs(commonStore)
const dateRangeCreate = ref([])
const dateRangeComplete = ref([])
const formData = reactive({
  cityId: undefined,
  companyId: undefined,
  stationId: undefined,
  orderStatus: undefined,
  afterSaleOrderNo: undefined,
  workOrderNo: undefined,
  startScreateTime: undefined
})
onMounted(() => {
  init()
})

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  formData.stationId = undefined
  stationList.value = []
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}
const stationList = ref<Station[]>([])
const companyChange = (companyId: number) => {
  formData.stationId = undefined
  stationList.value = []
  GetStationList({ companyId }).then(res => {
    if (res.code === 200) {
      stationList.value = res.data
    }
  })
}
const orderStatusList = [
  { name: '待审核', type: AfterSalesStatus.WAIT_AUDIT },
  { name: '待处理', type: AfterSalesStatus.WAIT_HANDLE },
  { name: '待退款', type: AfterSalesStatus.WAIT_REFUND },
  { name: '退款失败', type: AfterSalesStatus.REFUND_FAIL },
  { name: '已完成', type: AfterSalesStatus.COMPLETED },
  { name: '已取消', type: AfterSalesStatus.CANCELED },
  { name: '已驳回', type: AfterSalesStatus.REJECTED }
]
const parser = (val: string) => {
  if (!val) {
    return undefined
  }
  return val
}
const genTime = () => {
  let startScreateTime: string
  let endScreateTime: string
  let startEndTime: string
  let endEndTime: string
  if (dateRangeCreate.value?.length > 0) {
    startScreateTime = `${dayjs(dateRangeCreate.value[0]).format(
      'YYYY-MM-DD'
    )} 00:00:00`
    endScreateTime = `${dayjs(dateRangeCreate.value[1]).format(
      'YYYY-MM-DD'
    )} 23:59:59`
  }
  if (dateRangeComplete.value?.length > 0) {
    startEndTime = `${dayjs(dateRangeComplete.value[0]).format(
      'YYYY-MM-DD'
    )} 00:00:00`
    endEndTime = `${dayjs(dateRangeComplete.value[1]).format(
      'YYYY-MM-DD'
    )} 23:59:59`
  }

  return {
    startScreateTime,
    endScreateTime,
    startEndTime,
    endEndTime
  }
}
const emit = defineEmits(['change'])
const search = async () => {
  await ruleFormRef.value.validate(valid => {
    formData.workOrderNo = formData.workOrderNo
      ? formData.workOrderNo
      : undefined
    formData.afterSaleOrderNo = formData.afterSaleOrderNo
      ? formData.afterSaleOrderNo
      : undefined
    if (valid) {
      emit('change', { ...formData, ...genTime() })
    }
  })
}
const reset = () => {
  resetForm()
  companyList.value = []
  stationList.value = []
  dateRangeCreate.value = []
  dateRangeComplete.value = []
}
</script>
<style scoped lang="scss">
.demo {
}
</style>
