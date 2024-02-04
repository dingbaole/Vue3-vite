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
      <el-form-item label="店铺" prop="marketShopId">
        <el-select
          v-model="formData.marketShopId"
          filterable
          @change="marketShopIdChange"
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
      <el-form-item label="SKU编号/商品名称" prop="goodsId">
        <el-select
          v-model="formData.goodsId"
          filterable
          clearable
          placeholder="SKU编号/商品名称"
        >
          <el-option
            v-for="item in goodsOptions"
            :key="item.goodsId"
            :label="`${item.goodsName}(${item.skuNo})`"
            :value="item.goodsId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料号" prop="materialNo">
        <el-input v-model="formData.materialNo" placeholder="物料号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:company-goods-rule:set-list'"
          type="primary"
          @click="search"
          >查询</el-button
        >
        <el-button
          v-permission="'excitation:company-goods-rule:set-list'"
          @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:company-goods-rule:close-goods-rule'"
      type="warning"
      @click="closeRule"
      :disabled="selectedList.length === 0"
      >关闭商品激励规则</el-button
    >
    <div
      style="margin-top: 10px; font-size: 16px"
      v-if="pageData.tableData.length > 0"
    >
      <span>
        查询结果: 该店铺已设置激励商品数: {{ pageData.configuredGoodsNum }},
        未设置商品数:
        {{ pageData.notConfiguredGoodsNum }}
      </span>
      <el-button
        v-permission="'excitation:company-goods-rule:set-list'"
        style="font-size: 16px; margin-left: 8px"
        type="text"
        @click="openNoset"
        >查看未配置商品</el-button
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
      <el-table-column label="商品信息">
        <template #default="scope">
          <div>SKU编号: {{ scope.row.skuNo }}</div>
          <div>物料号: {{ scope.row.materialNo }}</div>
          <div>商品名称: {{ scope.row.goodsName }}</div>
          <div>
            商品单价:
            {{
              scope.row.goodsPrice || scope.row.goodsPrice === 0
                ? scope.row.goodsPrice
                : '--'
            }}元
          </div>
          <div>集市店铺: {{ scope.row.shopName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品激励规则" width="420">
        <template #default="scope">
          <div>
            <div>基础规则:</div>
            <div
              v-for="(item, index) in scope.row.excitationRuleOutputs.filter((ele: any) => ele.ruleGroup === 11)"
              :key="index"
            >
              <div v-if="item.ladderType === 11">
                <span
                  style="display: block; font-size: 12px"
                  v-for="tiered in item.ladderRuleOutputs"
                  :key="tiered.comnanyGoodsExcitationRuleId"
                >
                  {{ tiered.ruleDesc }}
                </span>
              </div>
              <div v-else>
                {{
                  richRuleName(item.commissionType, item.commissionValue, true)
                }}
              </div>
              <el-tag
                type="info"
                size="small"
                v-if="scope.row.ruleStatus === 14"
                >已失效</el-tag
              >
            </div>
          </div>
          <div
            style="margin-top: 15px"
            v-if="scope.row.excitationRuleOutputs.filter((ele: any) => ele.ruleGroup === 21).length > 0"
          >
            <div>叠加规则:</div>
            <div
              style="margin-bottom: 15px"
              v-for="(item, index) in scope.row.excitationRuleOutputs.filter((ele: any) => ele.ruleGroup === 21)"
              :key="index"
            >
              <div style="font-weight: bold; color: #333">
                <span>{{ index + 1 }}.</span>
                <span>{{
                  richRuleName(item.commissionType, item.commissionValue, true)
                }}</span>
              </div>
              <div>
                <span style="font-weight: bold; color: #666">有效日期: </span>
                {{ dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss') }} ~
                {{ dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <div v-if="item.promoterRelateType === 11">
                <span style="font-weight: bold; color: #666"
                  >限定条件 -> 适用指定组织员工:
                </span>
                {{ item.promoterNames }}
              </div>
              <div v-if="item.orderChannelRelateType === 11">
                <span style="font-weight: bold; color: #666"
                  >限定条件 -> 适用下单渠道:
                </span>
                {{ item.marketOrderChannelNames }}
              </div>
              <div v-if="item.orderLabelRelateType === 11">
                <span style="font-weight: bold; color: #666"
                  >限定条件 -> 适用订单标签:
                </span>
                {{ item.orderLabelNames }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="shopName" label="店铺名称">
        <template #default="scope">
          <div>{{ scope.row.shopName }}</div>
          <div style="font-size: 12px">
            ( 店铺编码: {{ scope.row.thirdShopNo }} )
          </div>
        </template>
      </el-table-column>
      <el-table-column label="公司名称">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <!-- <el-button type="text" @click="openUpdateRecord(scope.row.comnanyMaterialExcitationRuleId)">激励规则变更记录</el-button> -->
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
  <Disabled
    :selectedList="selectedList"
    @isConfirm="isConfirmCallback"
    ref="DisabledRef"
  />
  <Noset ref="NosetRef" />
  <UpdateRecord ref="UpdateRecordRef" />
</template>

<script setup lang="ts">
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import Disabled from './components/goods-disabled.vue'
import Noset from './components/goods-noset.vue'
import UpdateRecord from './components/goods-update-record.vue'
import { ref, reactive, onMounted } from 'vue'
import {
  ViewExcitationGoods,
  MarketGoodsList,
  MarketShopList
} from '@/webapi/goods'
import type {
  ISetList,
  IViewExcitationGoods,
  IMarketGoodsList
} from '@/webapi/goods'
import { GetCompanyList } from '@/webapi/common'
import { richRuleName } from '@/utils'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { useFormRules } from '@/hooks/useFormRule'
import dayjs from 'dayjs'

const { ruleFormRef, rules, resetForm } = useFormRules({
  marketShopId: [
    {
      required: true,
      message: '请选择店铺',
      trigger: 'change'
    }
  ]
})
const commonStore = useCommon()
const { initGoodsRule } = commonStore
const { cityList, excitationTypeList } = storeToRefs(commonStore)

const DisabledRef = ref<InstanceType<typeof Disabled>>()
const NosetRef = ref<InstanceType<typeof Noset>>()
const UpdateRecordRef = ref<InstanceType<typeof UpdateRecord>>()
const formData = reactive<ISetList>({
  cityId: undefined,
  companyId: undefined,
  marketShopId: undefined,
  commissionType: undefined,
  goodsId: '',
  materialNo: undefined
})

onMounted(() => {
  initGoodsRule()
})
interface SelectedList extends IViewExcitationGoods {
  checked: boolean
}
const selectedList = ref<SelectedList[]>([])
const handleSelectionChange = (val: SelectedList[]) => {
  selectedList.value = val.map(item => {
    if (item?.excitationRuleOutputs?.length > 0) {
      item.excitationRuleOutputs = item?.excitationRuleOutputs.map(ele => {
        ele['checked'] = false
        return ele
      })
    }
    return item
  })
}

const search = () => {
  pageConfig.currentPage = 1
  getList()
}

const reset = () => {
  resetForm()
  companyList.value = []
  goodsOptions.value = []
  shopList.value = []
}

const pageConfig = reactive({
  currentPage: 1,
  currentPage2: 1,
  pageSize: 10,
  pageSize2: 10
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
  tableData: IViewExcitationGoods[]
  total: number
  loading: boolean
  configuredGoodsNum: number
  notConfiguredGoodsNum: number
}>({
  tableData: [],
  total: 0,
  loading: false,
  configuredGoodsNum: 0,
  notConfiguredGoodsNum: 0
})
const getList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      pageData.loading = true
      ViewExcitationGoods({
        ...formData,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          pageData.tableData = res.data.validGoodsExcitationRuleOutputs.list
          pageData.total = res.data.validGoodsExcitationRuleOutputs.total
          pageData.configuredGoodsNum = res.data.configuredGoodsNum
          pageData.notConfiguredGoodsNum = res.data.notConfiguredGoodsNum
        }
      })
    }
  })
}

// const openUpdateRecord = (comnanyMaterialExcitationRuleId: number) => {
//   UpdateRecordRef.value?.toggleDialogStatus(comnanyMaterialExcitationRuleId, formData.companyId!)
// }

const openNoset = () => {
  NosetRef.value?.toggleDialogStatus(
    formData.cityId!,
    formData.companyId!,
    formData.marketShopId,
    formData.goodsId,
    formData.commissionType
  )
}

const closeRule = () => {
  DisabledRef.value?.toggleDialogStatus()
}

const isConfirmCallback = () => {
  if (formData.cityId && formData.companyId) {
    getList()
  }
}

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = null
  formData.marketShopId = undefined
  formData.goodsId = ''
  shopList.value = []
  goodsOptions.value = []
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

interface Shop {
  marketShopId: number
  thirdShopId: number
  shopName: string
  thirdShopNo: string
}
const shopList = ref<Shop[]>([])
const companyChange = (companyId: number | undefined) => {
  formData.marketShopId = undefined
  shopList.value = []
  formData.goodsId = ''
  goodsOptions.value = []
  MarketShopList({
    cityId: formData.cityId,
    companyId
  }).then(res => {
    if (res.code === 200) {
      shopList.value = res.data
    }
  })
}
const marketShopIdChange = (marketShopId: number | undefined) => {
  formData.goodsId = ''
  goodsOptions.value = []
  getGoodsList(marketShopId)
}
const goodsOptions = ref<Array<IMarketGoodsList>>([])
const getGoodsList = (marketShopId: number | null) => {
  MarketGoodsList({
    marketShopId
  }).then(res => {
    if (res.code === 200) {
      goodsOptions.value = res.data
    }
  })
}
</script>

<style scoped lang="scss"></style>
