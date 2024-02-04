<template>
  <div class="compute-init">
    <el-form
      label-width="100px"
      :model="formData"
      :rules="rules"
      ref="ruleFormRef"
    >
      <el-form-item label="城市" prop="cityId">
        <el-select
          v-model="formData.cityId"
          filterable
          @change="cityChange"
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
      <el-form-item label="服务公司" prop="companyId">
        <el-select
          v-model="formData.companyId"
          filterable
          @change="companyChange"
          placeholder="公司"
        >
          <el-option
            v-for="item in companyList"
            :label="`${item.companyName}(公司代码: ${item.companyCodeNo})`"
            :value="item.companyId"
            :key="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="企业店铺:" prop="marketShopId">
        <el-select
          v-model="formData.marketShopId"
          filterable
          placeholder="店铺"
        >
          <el-option
            v-for="item in shopList"
            :label="`${item.shopName}(店铺编码: ${item.thirdShopNo})`"
            :value="item.marketShopId"
            :key="item.marketShopId"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { GetRerunStatus, PullValidRule } from './api'
import { FetchDraftStatus } from '@/types'
import { GetCompanyList, MarketShopList } from '@/webapi/common'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import { useFormRules } from '@/hooks/useFormRule'

const props = defineProps<{
  status: {
    cityId?: number
    companyId?: number
    marketShopId?: number
  }
}>()

const { ruleFormRef, rules } = useFormRules({
  marketShopId: [
    {
      required: true,
      message: '请选择店铺',
      trigger: 'change'
    }
  ]
})
const { cityList } = storeToRefs(useCommon())
const formData = reactive<{
  cityId?: number
  companyId?: number
  marketShopId?: number
}>({})
onMounted(() => {
  formData.cityId = props.status?.cityId
  formData.cityId && cityChange(formData.cityId)
  formData.companyId = props.status?.companyId
  formData.companyId && companyChange(formData.companyId)
  formData.marketShopId = props.status?.marketShopId
})
const cityChange = (cityId?: number) => {
  if (!cityId) return
  formData.companyId = undefined
  formData.marketShopId = undefined
  companyList.value = []
  shopList.value = []
  getCompanyList(cityId)
}

const companyList = ref<API.ReturnFetchDataType<typeof GetCompanyList>>([])
const getCompanyList = (cityId: number) => {
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}
const companyChange = (companyId?: number) => {
  formData.marketShopId = undefined
  shopList.value = []
  getMarketShopList(formData.cityId, companyId)
}

const shopList = ref<API.ReturnFetchDataType<typeof MarketShopList>>([])
const getMarketShopList = (cityId: number, companyId?: number) => {
  if (!companyId) return
  MarketShopList({
    cityId,
    companyId
  }).then(res => {
    if (res.code === 200) {
      shopList.value = res.data
    }
  })
}

const getStatus = async () => {
  const res = await ruleFormRef.value.validate()
  if (res) {
    const { cityId, companyId, marketShopId } = formData
    const status = await GetRerunStatus({
      cityId,
      companyId,
      marketShopId
    })

    // 先获取重跑状态，如果是新建，那么要先更新草稿规则
    if (
      status.code === 200 &&
      status.data?.pullStatus === FetchDraftStatus.EMPTY
    ) {
      const res = await PullValidRule({
        cityId,
        companyId,
        marketShopId
      })
      if (res.code !== 200) {
        return Promise.reject(res.message)
      }
    }

    if (status.code === 200) {
      return {
        ...status.data,
        cityId,
        companyId,
        marketShopId
      }
    } else {
      return Promise.reject(status.message)
    }
  }
}
defineExpose({ getStatus })
</script>
<style scoped lang="scss">
.compute-init {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>
