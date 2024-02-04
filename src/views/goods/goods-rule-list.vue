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
      <el-form-item label="店铺" prop="marketShopId">
        <el-select
          v-model="formData.marketShopId"
          filterable
          clearable
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
      <el-form-item label="激励类型" prop="commissionType">
        <el-select
          v-model="formData.commissionType"
          placeholder="激励类型"
          clearable
        >
          <el-option
            v-for="item in [
              ...excitationTypeList,
              ...excitationTypeOverlayList
            ]"
            :label="item.commissionName"
            :value="item.commissionType"
            :key="item.commissionType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="ruleStatus">
        <el-select v-model="formData.ruleStatus" placeholder="状态" clearable>
          <el-option
            v-for="item in excitationStatusList"
            :label="item.statusName"
            :value="item.statusId"
            :key="item.statusId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'excitation:company-goods-rule:list'"
          type="primary"
          @click="search"
        >
          查询
        </el-button>
        <el-button
          v-permission="'excitation:company-goods-rule:list'"
          @click="reset"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:company-goods-rule:add-rule'"
      type="primary"
      plain
      @click="addRule('basic')"
    >
      新建激励规则
    </el-button>
    <el-button
      v-permission="'excitation:company-goods-rule:add-superposition-rule'"
      type="primary"
      @click="addRule('overlay')"
    >
      新建激励叠加规则
    </el-button>
    <el-button
      v-permission="'excitation:company-goods-rule:close-base-rule'"
      type="warning"
      :disabled="currentSelectedList.length === 0"
      @click="closeBaseRule"
    >
      关闭规则
    </el-button>
    <el-button
      v-permission="'excitation:company-goods-rule:set-list'"
      type="success"
      @click="openMaterialList"
    >
      查看激励商品
    </el-button>
    <el-button
      v-permission="'excitation:company-goods-rule:base-rule-export'"
      type="success"
      plain
      @click="exportList"
    >
      导出规则
    </el-button>
    <IncentiveTestCompute />
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
      <el-table-column fixed type="selection" width="55" />
      <el-table-column property="cityName" label="城市" width="80" />
      <el-table-column property="companyName" label="公司名称">
        <template #default="scope">
          <div>{{ scope.row.companyName }}</div>
          <div style="font-size: 12px">
            ( 公司代码: {{ scope.row.companyCode }} )
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
      <el-table-column property="ruleName" label="规则名称" />
      <el-table-column
        property="ruleStatus"
        label="状态"
        width="80"
        align="center"
      >
        <template #default="scope">
          <span>
            {{
              findNameByIdFromList(
                excitationStatusList,
                scope.row.ruleStatus,
                'statusId',
                'statusName'
              )
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        property="commissionType"
        label="激励类型"
        width="90"
        align="center"
      >
        <template #default="scope">
          <span>
            {{
              findNameByIdFromList(
                [...excitationTypeList, ...excitationTypeOverlayList],
                scope.row.commissionType,
                'commissionType',
                'commissionName'
              )
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        property="commissionValue"
        label="激励标准"
        width="120"
        align="center"
      >
        <template #default="scope">
          {{
            scope.row.ladderType === 11
              ? '阶梯激励'
              : richRuleName(
                  scope.row.commissionType,
                  scope.row.commissionValue
                )
          }}
        </template>
      </el-table-column>
      <el-table-column
        property="updateTime"
        label="更新时间"
        width="200"
        align="center"
      >
        <template #default="scope">
          <span>
            {{ dayjs(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
        <template #default="scope: { row: Table }">
          <div
            style="display: inline-block; margin-right: 12px"
            v-if="
              scope.row.commissionType === 11 || scope.row.commissionType === 12
            "
          >
            <el-button
              v-permission="'excitation:company-goods-rule:query-one'"
              type="text"
              @click="openDetail(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="
                scope.row.commissionType === 11 ||
                scope.row.commissionType === 12
              "
              v-permission="'excitation:company-goods-rule:edit-rule'"
              type="text"
              @click="editRule(scope.row)"
            >
              编辑
            </el-button>
          </div>
          <div
            style="display: inline-block; margin-right: 12px"
            v-if="
              scope.row.commissionType === 21 || scope.row.commissionType === 22
            "
          >
            <el-button
              v-permission="
                'excitation:company-goods-rule:query-superposition-one'
              "
              type="text"
              @click="openDetail(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-permission="
                'excitation:company-goods-rule:edit-superposition-rule'
              "
              type="text"
              @click="editRule(scope.row)"
            >
              编辑
            </el-button>
          </div>
          <el-popconfirm
            v-if="scope.row.ruleStatus === 14"
            width="300"
            confirm-button-text="确认"
            cancel-button-text="取消"
            title="规则开启后，将立即生效，确认开启吗？"
            @confirm="
              openBaseRule(
                scope.row.comnanyGoodsExcitationRuleId,
                scope.row.companyId,
                scope.row.marketShopId
              )
            "
          >
            <template #reference>
              <el-button
                v-permission="'excitation:company-goods-rule:open-base-rule'"
                type="text"
              >
                开启
              </el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-permission="'excitation:company-goods-rule:query-hislog'"
            type="text"
            @click="openUpdateRecord(scope.row)"
          >
            更新记录
          </el-button>
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-card>
  <GoodsRuleAdd @isConfirm="isConfirmCallback" ref="GoodsRuleAddRef" />
  <GoodsRuleOverlayAdd
    @isConfirm="isConfirmCallback"
    ref="GoodsRuleOverlayAddRef"
  />
  <GoodsDetail ref="GoodsDetailRef" />
  <GoodsOverlayDetail ref="GoodsOverlayDetailRef" />
  <GoodsUpdateRecord ref="GoodsUpdateRecordRef" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import router from '@/router'
import IncentiveTestCompute from '@/components/incentive-test-compute/incentive-test-compute-modal.vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import GoodsRuleAdd from './goods-rule-add.vue'
import GoodsRuleOverlayAdd from './goods-rule-overlay-add.vue'
import GoodsDetail from './components/goods-detail.vue'
import GoodsOverlayDetail from './components/goods-overlay-detail.vue'
import GoodsUpdateRecord from './components/goods-update-record.vue'
import { GetCompanyList } from '@/webapi/common'
import {
  RuleList,
  RuleExport,
  OpenBaseRule,
  CloseBaseRule,
  MarketShopList
} from '@/webapi/goods'
import type { IRuleList } from '@/webapi/goods'

import { findNameByIdFromList, richRuleName } from '@/utils'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFormRules } from '@/hooks/useFormRule'

const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { initGoodsRule } = commonStore
const {
  cityList,
  excitationTypeList,
  excitationTypeOverlayList,
  excitationStatusList
} = storeToRefs(commonStore)

const GoodsRuleAddRef = ref<InstanceType<typeof GoodsRuleAdd> | null>(null)
const GoodsRuleOverlayAddRef = ref<InstanceType<
  typeof GoodsRuleOverlayAdd
> | null>(null)
const GoodsDetailRef = ref<InstanceType<typeof GoodsDetail> | null>(null)
const GoodsOverlayDetailRef = ref<InstanceType<
  typeof GoodsOverlayDetail
> | null>(null)
const GoodsUpdateRecordRef = ref<InstanceType<typeof GoodsUpdateRecord> | null>(
  null
)

const formData = reactive<IRuleList>({
  cityId: null,
  companyId: null,
  commissionType: null,
  ruleStatus: null,
  marketShopId: undefined
})

onMounted(() => {
  initGoodsRule()
})

const addRule = (type: 'basic' | 'overlay') => {
  if (type === 'basic') {
    GoodsRuleAddRef.value?.toggleDialogStatus()
  } else if (type === 'overlay') {
    GoodsRuleOverlayAddRef.value?.toggleDialogStatus()
  }
}

const editRule = ({
  commissionType,
  comnanyGoodsExcitationRuleId,
  companyId,
  marketShopId
}: Table) => {
  if (commissionType === 11 || commissionType === 12) {
    GoodsRuleAddRef.value?.toggleDialogStatus(
      comnanyGoodsExcitationRuleId,
      companyId,
      marketShopId
    )
  } else if (commissionType === 21 || commissionType === 22) {
    GoodsRuleOverlayAddRef.value?.toggleDialogStatus(
      comnanyGoodsExcitationRuleId,
      companyId,
      marketShopId
    )
  }
}

const openDetail = ({
  commissionType,
  comnanyGoodsExcitationRuleId,
  companyId,
  marketShopId
}: Table) => {
  if (commissionType === 11 || commissionType === 12) {
    GoodsDetailRef.value?.toggleDialogStatus(
      comnanyGoodsExcitationRuleId,
      companyId,
      marketShopId
    )
  } else if (commissionType === 21 || commissionType === 22) {
    GoodsOverlayDetailRef.value?.toggleDialogStatus(
      comnanyGoodsExcitationRuleId,
      companyId,
      marketShopId
    )
  }
}

const openUpdateRecord = ({
  comnanyGoodsExcitationRuleId,
  companyId
}: Table) => {
  GoodsUpdateRecordRef.value?.toggleDialogStatus(
    comnanyGoodsExcitationRuleId,
    companyId
  )
}

const currentSelectedList = ref<Table[]>([])
const handleSelectionChange = (val: Table[]) => {
  currentSelectedList.value = val
}
const closeBaseRule = () => {
  ElMessageBox.confirm('规则关闭后，将立即失效，确认关闭吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params = currentSelectedList.value.map(
        ({
          comnanyGoodsExcitationRuleId,
          commissionType,
          commissionValue,
          companyId,
          marketShopId
        }) => {
          return {
            comnanyGoodsExcitationRuleId,
            commissionType,
            commissionValue,
            companyId,
            marketShopId
          }
        }
      )
      CloseBaseRule(params).then(res => {
        if (res.code === 200) {
          ElMessage({
            message: '操作成功',
            type: 'success'
          })
          currentSelectedList.value = []
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

const openBaseRule = (
  comnanyGoodsExcitationRuleId: number,
  companyId: number,
  marketShopId: number
) => {
  OpenBaseRule({
    comnanyGoodsExcitationRuleId,
    companyId,
    marketShopId
  }).then(res => {
    if (res.code === 200) {
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
      getList()
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

const search = () => {
  pageConfig.currentPage = 1
  getList()
}

const reset = () => {
  resetForm()
  companyList.value = []
  shopList.value = []

  // formData.cityId = undefined
  // formData.companyId = undefined
  // formData.commissionType = undefined
  // formData.ruleStatus = undefined
}

const openMaterialList = () => {
  if (window.parent[0]) {
    // 在iframe中
    window.parent.postMessage(
      {
        targetName: 'goods-list',
        menuName: '查看激励商品',
        url: window.location.origin + '/fe-web/goods-list',
        code: 'goods-list'
      },
      '*'
    )
  } else {
    router.push('/goods-list')
  }
}

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = null
  formData.marketShopId = undefined
  shopList.value = []
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
  // if (!companyId) {
  //   formData.marketShopId = undefined
  //   return
  // }
  formData.marketShopId = undefined
  MarketShopList({
    cityId: formData.cityId,
    companyId
  }).then(res => {
    if (res.code === 200) {
      shopList.value = res.data
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

interface Table {
  cityName: string
  companyName: string
  companyId: number
  marketShopId: number
  ruleName: string
  ruleStatus: number
  commissionType: number
  commissionValue: number
  updateTime: number
  comnanyGoodsExcitationRuleId: number
}
const pageData = reactive<{
  tableData: Table[]
  total: number
  loading: boolean
}>({
  tableData: [],
  total: 0,
  loading: false
})
const exportList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      pageData.loading = true
      RuleExport({
        ...formData,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          ElMessage({
            message: '导出成功',
            type: 'success'
          })
        } else {
          ElMessage({
            type: 'error',
            message: res.message
          })
        }
      })
    }
  })
}
const getList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      pageData.loading = true
      RuleList({
        ...formData,
        ...pageConfig
      }).then(res => {
        pageData.loading = false
        if (res.code === 200) {
          pageData.tableData = res.data.dataList
          pageData.total = res.data.totalCount
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
