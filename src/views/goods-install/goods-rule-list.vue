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
            v-for="item in [...excitationTypeList]"
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
          v-permission="'excitation:company-goods-install-rule:base-rule-list'"
          type="primary"
          :loading="tableConfig.loading"
          @click="search"
        >
          查询
        </el-button>
        <el-button
          v-permission="'excitation:company-goods-install-rule:base-rule-list'"
          @click="reset"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card shadow="never" style="margin-top: 10px">
    <el-button
      v-permission="'excitation:company-goods-install-rule:add-rule'"
      type="primary"
      plain
      @click="addRule('basic')"
    >
      新建安装激励规则
    </el-button>
    <!-- <el-button
      v-permission="'excitation:company-goods-install-rule:add-superposition-rule'"
      type="primary"
      @click="addRule('overlay')"
      >新建激励叠加规则</el-button
    > -->
    <el-button
      v-permission="'excitation:company-goods-install-rule:close-base-rule'"
      type="warning"
      :disabled="currentSelectedList.length === 0"
      @click="closeBaseRule"
    >
      关闭规则
    </el-button>
    <el-button
      v-permission="'excitation:company-goods-install-rule:view-excitation'"
      type="success"
      @click="openMaterialList"
    >
      查看激励安装商品
    </el-button>
    <!-- <el-button
      v-permission="'excitation:company-goods-install-rule:base-rule-export'"
      type="success"
      plain
      @click="exportList"
      >导出规则</el-button
    > -->
    <IncentiveTestCompute />
    <TableWithPagination
      :table-config="tableConfig"
      :page-config="pageConfig"
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
              v-permission="'excitation:company-goods-install-rule:query-one'"
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
              v-permission="'excitation:company-goods-install-rule:edit-rule'"
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
                'excitation:company-goods-install-rule:query-superposition-one'
              "
              type="text"
              @click="openDetail(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-permission="
                'excitation:company-goods-install-rule:edit-superposition-rule'
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
                scope.row.companyInstallExcitationRuleId,
                scope.row.companyId,
                scope.row.marketShopId
              )
            "
          >
            <template #reference>
              <el-button
                v-permission="
                  'excitation:company-goods-install-rule:open-base-rule'
                "
                type="text"
              >
                开启
              </el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-permission="'excitation:company-goods-install-rule:query-hislog'"
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
import IncentiveTestCompute from '@/components/incentive-test-compute-goods-install/incentive-test-compute-modal.vue'
import TableWithPagination from '@/components/tableWithPagination2/tableWithPagination.vue'
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
} from '@/webapi/goods-install'
import type { IRuleList } from '@/webapi/goods-install'

import { findNameByIdFromList, richRuleName } from '@/utils'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFormRules } from '@/hooks/useFormRule'
import { useTableFetch } from '@/hooks/useTableFetch'
const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { initGoodsInstallRule } = commonStore
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
  initGoodsInstallRule()
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
  companyInstallExcitationRuleId,
  companyId,
  marketShopId
}: Table) => {
  if (commissionType === 11 || commissionType === 12) {
    GoodsRuleAddRef.value?.toggleDialogStatus(
      companyInstallExcitationRuleId,
      companyId,
      marketShopId
    )
  } else if (commissionType === 21 || commissionType === 22) {
    GoodsRuleOverlayAddRef.value?.toggleDialogStatus(
      companyInstallExcitationRuleId,
      companyId,
      marketShopId
    )
  }
}

const openDetail = ({
  commissionType,
  companyInstallExcitationRuleId,
  companyId,
  marketShopId
}: Table) => {
  if (commissionType === 11 || commissionType === 12) {
    GoodsDetailRef.value?.toggleDialogStatus(
      companyInstallExcitationRuleId,
      companyId,
      marketShopId
    )
  } else if (commissionType === 21 || commissionType === 22) {
    GoodsOverlayDetailRef.value?.toggleDialogStatus(
      companyInstallExcitationRuleId,
      companyId,
      marketShopId
    )
  }
}

const openUpdateRecord = ({
  companyInstallExcitationRuleId,
  companyId
}: Table) => {
  GoodsUpdateRecordRef.value?.toggleDialogStatus(
    companyInstallExcitationRuleId,
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
          companyInstallExcitationRuleId,
          commissionType,
          commissionValue,
          companyId,
          marketShopId
        }) => {
          return {
            companyInstallExcitationRuleId,
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
  companyInstallExcitationRuleId: number,
  companyId: number,
  marketShopId: number
) => {
  OpenBaseRule({
    companyInstallExcitationRuleId,
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
        targetName: 'goods-install-list',
        menuName: '查看激励安装商品',
        url: window.location.origin + '/fe-web/goods-install-list',
        code: 'goods-install-list'
      },
      '*'
    )
  } else {
    router.push('/goods-install-list')
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
  companyInstallExcitationRuleId: number
}

const { getData, tablePageChange, pageConfig, tableConfig } = useTableFetch<
  IRuleList,
  {
    dataList: Table[]
    totalCount: number
  },
  Table
>(formData, RuleList, res => {
  if (res.code === 200) {
    tableConfig.value.data = res.data.dataList
    tableConfig.value.total = res.data.totalCount
  }
})
const getList = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      getData()
    }
  })
}
// const exportList = async () => {
//   await ruleFormRef.value.validate(valid => {
//     if (valid) {
//       // pageData.loading = true
//       // RuleExport({
//       //   ...formData,
//       //   ...pageConfig
//       // }).then(res => {
//       //   pageData.loading = false
//       //   if (res.code === 200) {
//       //     ElMessage({
//       //       message: '导出成功',
//       //       type: 'success'
//       //     })
//       //   } else {
//       //     ElMessage({
//       //       type: 'error',
//       //       message: res.message
//       //     })
//       //   }
//       // })
//     }
//   })
// }
const isConfirmCallback = () => {
  if (formData.cityId && formData.companyId) {
    getList()
  }
}
</script>

<style scoped lang="scss"></style>
