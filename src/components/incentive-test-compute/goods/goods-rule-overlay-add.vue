<template>
  <div class="root">
    <el-dialog
      class="custom-dialog"
      v-model="dialogShow"
      :title="`${
        formData.draftCompanyGoodsExcitationRuleId ? '编辑' : '新建'
      }激励草稿叠加规则`"
      fullscreen
      :show-close="false"
      :before-close="toggleDialogStatus"
    >
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div class="title" style="display: flex; align-items: center">
            <span style="font-size: 18px">
              {{
                `${
                  formData.draftCompanyGoodsExcitationRuleId ? '编辑' : '新建'
                }激励草稿叠加规则`
              }}
            </span>
            <el-alert
              style="width: 390px; margin-left: 20px"
              title="提示: 叠加激励均在基础规则激励的基础上做额外的激励。"
              type="error"
              :closable="false"
            />
          </div>
        </div>
      </template>
      <el-form
        :inline="true"
        :model="formData"
        :rules="rules"
        ref="ruleFormRef"
      >
        <div class="module-box">
          <el-alert
            style="width: 720px; margin-bottom: 20px; padding-left: 0"
            title="提示: 自动格式生成，可再编辑。自动生成名称格式: 公司商品+“激励类型”+激励标准+激励规则。最大长度30个文字。"
            type="warning"
            :closable="false"
          />
          <div class="module-box-desc">
            <div style="flex-shrink: 0">激励叠加规则名称</div>
            <el-form-item prop="ruleName" class="module-box-desc__form-item">
              <el-input
                class="module-box-desc__input"
                maxlength="30"
                show-word-limit
                v-model="formData.ruleName"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="module-box">
          <div class="module-box-desc">1.适用公司</div>
          <el-form-item label="城市" prop="cityId">
            <el-select
              :disabled="selectDisabled"
              v-model="cityIdCustomRef"
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
          <el-form-item label="服务公司" prop="companyId">
            <el-select
              :disabled="selectDisabled"
              v-model="companyIdCustomRef"
              filterable
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
          <!-- <el-form-item label="企业店铺:">
            <div>
              {{
                shopInfo.marketShopId
                  ? `${shopInfo.shopName}(商家编号: ${shopInfo.thirdShopNo})`
                  : '--'
              }}
            </div>
          </el-form-item> -->
          <el-form-item label="企业店铺:" prop="marketShopId">
            <el-select
              :disabled="selectDisabled"
              v-model="marketShopIdCustomRef"
              @change="marketShopIdChange"
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
        </div>
        <div class="module-box">
          <div class="module-box-desc">2.激励规则</div>
          <el-alert
            v-if="formData.commissionType === 21"
            style="width: 544px; margin-bottom: 20px"
            title="示例: 商品交易实收价100.00元，激励基础规则10.00%，叠加定额为2元/件，   
                  最终员工获得该商品的激励金额=100.00*10.00%+2=12.00元。"
            type="warning"
            :closable="false"
          />
          <el-alert
            v-if="formData.commissionType === 22"
            style="width: 544px; margin-bottom: 20px"
            title="示例: 商品交易实收价100.00元，激励基础规则10.00%，叠加系数为0.5，   
                  最终员工获得该商品的激励金额=100.00*10.00%*(1+0.5)=15.00元。"
            type="warning"
            :closable="false"
          />
          <el-form-item label="激励类型" prop="commissionType">
            <el-select
              v-model="formData.commissionType"
              @change="commissionTypeChange"
              placeholder="激励类型"
            >
              <el-option
                v-for="item in excitationTypeOverlayList"
                :label="item.commissionName"
                :value="item.commissionType"
                :key="item.commissionType"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formData.commissionType"
            :label="formData.commissionType === 21 ? '叠加定额' : '叠加系数'"
            prop="commissionValue"
          >
            <el-input
              v-if="formData.commissionType === 21"
              v-model="formData.commissionValue"
              placeholder="叠加定额"
            ></el-input>
            <el-input
              v-if="formData.commissionType === 22"
              v-model="formData.commissionValue"
              placeholder="叠加系数"
            ></el-input>
          </el-form-item>
        </div>
        <div class="module-box">
          <div class="module-box-desc">3.有效日期时间</div>
          <el-form-item
            class="custom-el-form-item"
            label="开始日期时间"
            prop="startDateTime"
          >
            <el-date-picker
              class="custom-datetime"
              v-model="formData.startDateTime"
              type="datetime"
              placeholder="开始时间"
            />
          </el-form-item>
          <el-form-item label="结束日期时间" prop="endDateTime">
            <el-date-picker
              class="custom-datetime"
              v-model="formData.endDateTime"
              type="datetime"
              :disabled-date="disabledDate"
              placeholder="结束时间"
              :default-time="defaultDateTime"
            />
          </el-form-item>
        </div>
        <div class="module-box">
          <div class="module-box-desc">
            4.规则限定条件（可选）
            <el-button
              class="module-box-desc__button"
              type="primary"
              plain
              :disabled="
                !formData.cityId ||
                !formData.companyId ||
                !formData.marketShopId
              "
              @click="addFactor"
            >
              添加限定条件
            </el-button>
          </div>
          <el-card
            style="margin-bottom: 20px"
            shadow="never"
            v-if="factoreMap.has('addlimitGoodsInputList')"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <span>限定条件: 适用指定激励商品</span>
                <el-button
                  style="margin-left: 18px"
                  size="small"
                  type="primary"
                  @click="addGoods"
                >
                  添加指定激励商品
                </el-button>
              </div>
              <el-button
                type="text"
                @click="deleteFactor('addlimitGoodsInputList')"
              >
                删除条件
              </el-button>
            </div>
            <TableWithFakePagination
              :data="factoreMap.get('addlimitGoodsInputList')"
              border
              style="width: 100%; margin-top: 15px"
            >
              <el-table-column property="skuNo" label="SKU编号" width="150" />
              <el-table-column property="goodsName" label="商品名称" />
              <el-table-column
                property="goodsType"
                label="商品类型"
                width="120"
                align="center"
              >
                <template #default="scope">
                  {{
                    scope.row.goodsType === 0
                      ? '自采商品'
                      : scope.row.goodsType === 1
                      ? '直发代销'
                      : '--'
                  }}
                </template>
              </el-table-column>
              <el-table-column property="materialNo" label="关联物料号" />
              <el-table-column
                property="price"
                label="商品单价(元)"
                width="120"
                align="center"
              >
                <template #default="scope">
                  {{
                    scope.row.price || scope.row.price === 0
                      ? scope.row.price
                      : '--'
                  }}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="80"
                align="center"
              >
                <template #default="scope">
                  <el-button type="text" @click="deleteGoods(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </TableWithFakePagination>
          </el-card>
          <el-card
            style="margin-bottom: 20px"
            shadow="never"
            v-if="factoreMap.has('addlimitPromoterInputList')"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <span>限定条件: 适用指定组织员工</span>
                <el-button
                  style="margin-left: 18px"
                  size="small"
                  type="primary"
                  @click="addEmp"
                >
                  添加指定组织员工
                </el-button>
              </div>
              <el-button
                type="text"
                @click="deleteFactor('addlimitPromoterInputList')"
              >
                删除条件
              </el-button>
            </div>
            <TableWithFakePagination
              :data="factoreMap.get('addlimitPromoterInputList')"
              border
              style="width: 100%; margin-top: 15px"
            >
              <el-table-column property="deptNames" label="组织部门" />
              <el-table-column property="employeeName" label="人员姓名" />
              <el-table-column property="encryptionMobile" label="手机号" />
              <el-table-column
                fixed="right"
                label="操作"
                width="80"
                align="center"
              >
                <template #default="scope">
                  <el-button type="text" @click="deleteEmp(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </TableWithFakePagination>
          </el-card>
          <el-card
            style="margin-bottom: 20px"
            shadow="never"
            v-if="factoreMap.has('addMarketOrderChannelInputList')"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <span>限定条件: 适用下单渠道</span>
                <el-button
                  style="margin-left: 18px"
                  size="small"
                  type="primary"
                  @click="addChannel"
                >
                  添加下单渠道
                </el-button>
              </div>
              <el-button
                type="text"
                @click="deleteFactor('addMarketOrderChannelInputList')"
              >
                删除条件
              </el-button>
            </div>
            <TableWithFakePagination
              :data="factoreMap.get('addMarketOrderChannelInputList')"
              border
              style="width: 100%; margin-top: 15px"
            >
              <el-table-column
                property="marketOrderChannelName"
                label="下单渠道"
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="80"
                align="center"
              >
                <template #default="scope">
                  <el-button type="text" @click="deleteChannel(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </TableWithFakePagination>
          </el-card>
          <OrderLabelPanel
            v-if="factoreMap.get('orderLabel')"
            :mode="'goodsRerun'"
            :order-label-list="factoreMap.get('orderLabel')"
            @change="orderLabelChange"
            @is-remove-panel="deleteFactor('orderLabel')"
          />
        </div>
      </el-form>

      <GoodsCompanyList
        :companyId="formData.companyId"
        :marketShopId="shopInfo.marketShopId"
        :thirdShopId="shopInfo.thirdShopId"
        :operGoodsDetailInputList="factoreMap.get('addlimitGoodsInputList')"
        @onSelected="onSelected"
        ref="GoodsListRef"
      />
      <GoodsEmpList
        :companyId="formData.companyId"
        :marketShopId="shopInfo.marketShopId"
        :thirdShopId="shopInfo.thirdShopId"
        :company-list="companyList"
        :addlimitPromoterInputList="factoreMap.get('addlimitPromoterInputList')"
        @onSelected="onSelectedEmp"
        ref="GoodsEmpListRef"
      />
      <OrderChannelModal
        :ids="factoreMap.get('addMarketOrderChannelInputList')"
        @confirm="orderChannelConfirm"
        ref="OrderChannelModalRef"
      />
      <CommonModal
        :list="radioList"
        @confirm="radioListConfirm"
        ref="CommonModalRef"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toggleDialogStatus">取消</el-button>
          <el-button
            type="primary"
            :loading="saveLoading"
            @click="save(ruleFormRef)"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, unref, customRef, computed } from 'vue'
import OrderLabelPanel from '@/components/orderLabelPanel/order-label-panel.vue'
import type { OrderLabel } from '@/components/orderLabelPanel/types'
import TableWithFakePagination from '@/components/tableWithFakePagination/tableWithFakePagination.vue'
import GoodsCompanyList from './goods-company-list.vue'
import GoodsEmpList from './goods-emp-list.vue'
import CommonModal from '@/components/commonModal/commonModal.vue'
import OrderChannelModal from './order-channel.vue'
import { GetCompanyList } from '@/webapi/common'
import {
  AddSaveOverlayRule,
  EditSaveOverlayRule,
  QueryBaseSuperpositionRule,
  MarketShopList,
  CanusedPromoterList
} from './api'
import type {
  OperGoodsDetailInput,
  ISaveOverlayRule,
  IAddlimitPromoterInputList
} from './api'
import type { MarketOrderChannel } from '@/types/goods'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useFormRulesOverlay } from '@/hooks/useFormRule'
import dayjs from 'dayjs'
import { richRuleName } from '@/utils'

const commonStore = useCommon()
const { cityList, excitationTypeOverlayList } = storeToRefs(commonStore)
const emit = defineEmits(['isConfirm'])
const props = defineProps<{
  status: {
    cityId: number
    companyId: number
    marketShopId: number
  }
}>()
const formData = reactive<ISaveOverlayRule>({
  ruleGroup: 21,
  ruleName: '',
  cityId: undefined,
  companyId: undefined,
  marketShopId: undefined,
  commissionType: null!,
  commissionValue: '',
  addlimitGoodsInputList: [],
  addlimitPromoterInputList: [],
  addMarketOrderChannelInputList: [],
  addGoodsOrderLabelInputList: [],
  startDateTime: undefined,
  endDateTime: undefined,
  startTime: undefined,
  endTime: undefined
})

const defaultDateTime = new Date(0, 0, 0, 23, 59, 59)
const { rules, ruleFormRef, resetForm } =
  useFormRulesOverlay<Partial<ISaveOverlayRule>>(formData)

const disabledDate = (date: Date) => {
  const startDateTime = formData.startDateTime ? formData.startDateTime : null
  return (
    dayjs(startDateTime).startOf('day').valueOf() >
    dayjs(date).startOf('day').valueOf()
  )
}

const saveLoading = ref(false)
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  saveLoading.value = true
  await formEl.validate(valid => {
    if (valid) {
      // 判断限定条件不能为空
      for (let v of factoreMap.value.values()) {
        if (v?.length === 0) {
          ElMessage({
            type: 'error',
            message: '请在已添加的限定条件内添加指定元素，无需则删除条件！'
          })
          saveLoading.value = false
          return
        }
      }
      if (!formData.marketShopId) {
        ElMessage({
          type: 'error',
          message: '企业店铺信息无效'
        })
        saveLoading.value = false
        return
      }
      saveBaseRule()
    } else {
      saveLoading.value = false
    }
  })
}

const returnSaveApi = () => {
  return formData.draftCompanyGoodsExcitationRuleId
    ? EditSaveOverlayRule
    : AddSaveOverlayRule
}

const saveBaseRule = () => {
  formData.addlimitGoodsInputList = factoreMap.value.get(
    'addlimitGoodsInputList'
  )
  formData.addlimitPromoterInputList = factoreMap.value.get(
    'addlimitPromoterInputList'
  )
  formData.addMarketOrderChannelInputList = factoreMap.value
    .get('addMarketOrderChannelInputList')
    ?.map(({ marketOrderChannelId }: MarketOrderChannel) => {
      return {
        marketOrderChannelId
      }
    })
  formData.addGoodsOrderLabelInputList = factoreMap.value.get('orderLabel')
  formData.startTime = dayjs(formData.startDateTime).valueOf()
  formData.endTime = dayjs(formData.endDateTime).valueOf()
  const { commissionValue, ...rest } = formData

  returnSaveApi()({
    commissionValue: parseFloat(commissionValue).toFixed(2),
    ...rest
  }).then(res => {
    saveLoading.value = false
    if (res.code === 200) {
      ElMessage({
        message: '保存成功',
        type: 'success'
      })
      emit('isConfirm')
      setTimeout(() => {
        toggleDialogStatus()
      }, 500)
    } else if (res.code === -20001) {
      // 有未同步的商品需要剔除
    } else if (res.code === -6005) {
      // handleSaveError(res.data)
    } else {
      // 异常有其他处理
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}
const selectDisabled = computed(() => {
  return !!formData.draftCompanyGoodsExcitationRuleId || props.status?.cityId
})
const init = () => {
  setTimeout(() => {
    factoreMap.value.clear()
    resetForm()
    formData.comnanyGoodsExcitationRuleId = undefined
    formData.draftCompanyGoodsExcitationRuleId = undefined
    formData.commissionValue = ''
    companyIdCustomRef.value = undefined
    cityIdCustomRef.value = undefined
    marketShopIdCustomRef.value = undefined
    companyList.value = []
    shopList.value = []
    if (props.status?.cityId) {
      cityIdCustomRef.value = props.status.cityId
      companyIdCustomRef.value = props.status.companyId
      marketShopIdCustomRef.value = props.status.marketShopId
    }
  }, 0)
}

const initEdit = (companyId: number, marketShopId: number) => {
  factoreMap.value?.clear()
  const { draftCompanyGoodsExcitationRuleId } = formData
  QueryBaseSuperpositionRule({
    draftCompanyGoodsExcitationRuleId,
    companyId,
    marketShopId
  }).then(res => {
    if (res.code === 200) {
      formData.cityId = res.data.cityId
      cityIdChange(res.data.cityId)
      companyChange(res.data.companyId)
      marketShopIdChange(res.data.marketShopId)
      formData.comnanyGoodsExcitationRuleId =
        res.data.companyGoodsExcitationRuleId
      formData.companyId = res.data.companyId
      formData.marketShopId = res.data.marketShopId
      companyName.value = res.data.companyName
      formData.ruleGroup = res.data.ruleGroup
      cityIdCustomRef.value = res.data.cityId
      companyIdCustomRef.value = res.data.companyId
      marketShopIdCustomRef.value = res.data.marketShopId
      formData.commissionType = res.data.commissionType
      formData.commissionValue = res.data.commissionValue
      if (res.data.goodsUsedRuleOutputs.length > 0) {
        factoreMap.value.set(
          'addlimitGoodsInputList',
          res.data.goodsUsedRuleOutputs
        )
      }
      if (res.data.promoterUsedRuleOutputs.length > 0) {
        factoreMap.value.set(
          'addlimitPromoterInputList',
          res.data.promoterUsedRuleOutputs
        )
      }
      if (res.data.marketOrderChannelOutputs.length > 0) {
        factoreMap.value.set(
          'addMarketOrderChannelInputList',
          res.data.marketOrderChannelOutputs
        )
      }
      if (res.data.goodsExcitationRuleOrderLabelOutputs.length > 0) {
        factoreMap.value.set(
          'orderLabel',
          res.data.goodsExcitationRuleOrderLabelOutputs
        )
      }
      formData.startDateTime = res.data.startTime
      formData.endDateTime = res.data.endTime
      setTimeout(() => {
        formData.ruleName = res.data.ruleName
        ruleFormRef.value?.validate()
      }, 10)
    }
  })
}

const companyList = ref<CompanyItem[]>([])
const companyName = ref('')
const cityIdChange = (cityId: number) => {
  companyIdCustomRef.value = undefined
  marketShopIdCustomRef.value = undefined
  companyList.value = []
  shopList.value = []
  getCompanyList(cityId)
}

const getCompanyList = (cityId: number) => {
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

const shopInfo = reactive<{
  marketShopId: number | undefined
  thirdShopId: number | undefined
  shopName: string
  thirdShopNo: string
}>({
  marketShopId: undefined,
  thirdShopId: undefined,
  shopName: '',
  thirdShopNo: ''
})
interface Shop {
  marketShopId: number
  thirdShopId: number
  shopName: string
  thirdShopNo: string
}
const shopList = ref<Shop[]>([])
const companyChange = (companyId: number | undefined) => {
  ruleFormRef.value?.validateField('commissionValue')
  if (companyList.value.length > 0) {
    companyName.value = companyList.value.filter(
      item => item.companyId === companyId
    )[0]?.companyName
  }

  // if (!companyId) {
  //   shopInfo.marketShopId = undefined
  //   shopInfo.thirdShopId = undefined
  //   shopInfo.shopName = ''
  //   shopInfo.thirdShopNo = ''
  //   return
  // }
  marketShopIdCustomRef.value = undefined
  shopInfo.marketShopId = undefined
  shopInfo.thirdShopId = undefined
  shopInfo.shopName = ''
  shopInfo.thirdShopNo = ''
  getMarketShopList(companyId)
}
const marketShopIdChange = (marketShopId: number | undefined) => {
  const shop = shopList.value.find(item => item.marketShopId === marketShopId)
  if (shop) {
    const { marketShopId, thirdShopId, shopName, thirdShopNo } = shop
    shopInfo.marketShopId = marketShopId
    shopInfo.thirdShopId = thirdShopId
    shopInfo.shopName = shopName
    shopInfo.thirdShopNo = thirdShopNo
  } else {
    shopInfo.marketShopId = undefined
    shopInfo.thirdShopId = undefined
    shopInfo.shopName = ''
    shopInfo.thirdShopNo = ''
  }
}
const getMarketShopList = (companyId?: number) => {
  MarketShopList({
    cityId: formData.cityId,
    companyId
  }).then(res => {
    if (res.code === 200) {
      shopList.value = res.data
      if (res.data.length === 1) {
        const { marketShopId, thirdShopId, shopName, thirdShopNo } = res.data[0]
        marketShopIdCustomRef.value = marketShopId
        shopInfo.marketShopId = marketShopId
        shopInfo.thirdShopId = thirdShopId
        shopInfo.shopName = shopName
        shopInfo.thirdShopNo = thirdShopNo
      }
      if (res.data?.length > 0) {
        marketShopIdChange(formData.marketShopId)
        getDetailAfter()
      } else {
        shopInfo.marketShopId = undefined
        shopInfo.thirdShopId = undefined
      }
    }
  })
}

const commissionTypeChange = () => {
  ruleFormRef.value?.validateField('commissionValue')
}

watch([() => formData.commissionType, () => formData.commissionValue], () => {
  // if (formData.comnanyGoodsExcitationRuleId) return
  if (!formData.commissionType || !formData.commissionValue) {
    return ''
  }
  const S1 =
    formData.commissionType === 21
      ? '定额叠加'
      : formData.commissionType === 22
      ? '系数叠加'
      : ''
  const S2 = richRuleName(
    formData.commissionType as any,
    formData.commissionValue
  )
  formData.ruleName = `公司商品${S1}${S2}激励规则`
  unref(ruleFormRef)?.validateField('ruleName')
})

const factoreMap = ref<Map<string, any>>(new Map())
const radioList = [
  { value: 'addlimitGoodsInputList', name: '适用指定激励商品' },
  { value: 'addlimitPromoterInputList', name: '适用指定组织员工' },
  { value: 'addMarketOrderChannelInputList', name: '集市下单渠道' },
  { value: 'orderLabel', name: '适用订单标签' }
]
const orderLabelChange = (val: OrderLabel[]) => {
  factoreMap.value.set('orderLabel', val)
}
const radioListConfirm = (selected: string) => {
  if (!factoreMap.value.has(selected)) {
    factoreMap.value.set(selected, [])
  } else {
    ElMessage({
      type: 'error',
      message: '此类限定条件已添加!'
    })
  }
}
const hasFactorItem = () => {
  return factoreMap.value.entries().next().value
}
const CommonModalRef: any = ref<InstanceType<typeof CommonModal>>()
const addFactor = () => {
  CommonModalRef.value.openModal()
}
const deleteFactor = (
  type:
    | 'addlimitGoodsInputList'
    | 'addlimitPromoterInputList'
    | 'addMarketOrderChannelInputList'
    | 'orderLabel'
) => {
  ElMessageBox.confirm('确定要删除此类限定条件吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      factoreMap.value.delete(type)
    })
    .catch(() => {})
}
const GoodsListRef = ref<InstanceType<typeof GoodsCompanyList>>()
const addGoods = () => {
  GoodsListRef.value?.toggleDialogStatus('overlay')
}
const deleteGoods = (row: OperGoodsDetailInput) => {
  const addlimitGoodsInputList = factoreMap.value
    .get('addlimitGoodsInputList')
    .filter((item: any) => item.goodsId !== row.goodsId)
  factoreMap.value.set('addlimitGoodsInputList', addlimitGoodsInputList)
}
const onSelected = (val: OperGoodsDetailInput[]) => {
  factoreMap.value.set('addlimitGoodsInputList', val)
}

const OrderChannelModalRef: any = ref<InstanceType<typeof OrderChannelModal>>()
const addChannel = () => {
  OrderChannelModalRef.value?.openModal()
}
const deleteChannel = (row: MarketOrderChannel) => {
  const addMarketOrderChannelInputList = factoreMap.value
    .get('addMarketOrderChannelInputList')
    .filter(
      (item: any) => item.marketOrderChannelId !== row.marketOrderChannelId
    )
  factoreMap.value.set(
    'addMarketOrderChannelInputList',
    addMarketOrderChannelInputList
  )
}
const orderChannelConfirm = (val: MarketOrderChannel[]) => {
  factoreMap.value.set('addMarketOrderChannelInputList', val)
}

const GoodsEmpListRef = ref<InstanceType<typeof GoodsEmpList>>()
const addEmp = () => {
  GoodsEmpListRef.value?.toggleDialogStatus()
}
const deleteEmp = (row: IAddlimitPromoterInputList) => {
  const addlimitPromoterInputList = factoreMap.value
    .get('addlimitPromoterInputList')
    .filter((item: any) => item.employeeId !== row.employeeId)
  factoreMap.value.set('addlimitPromoterInputList', addlimitPromoterInputList)
}
const onSelectedEmp = ({
  res,
  allDeptList
}: {
  res: IAddlimitPromoterInputList[]
  allDeptList: any[]
}) => {
  factoreMap.value.set(
    'addlimitPromoterInputList',
    genFWordDeptName(allDeptList, res)
  )
}

// 获取详情后处理人员部门归属关系
const getDetailAfter = () => {
  if (!factoreMap.value.has('addlimitPromoterInputList')) return
  // 先获取整个人员部门数据
  CanusedPromoterList({
    storeId: shopInfo.thirdShopId,
    marketShopId: shopInfo.marketShopId
  }).then(res => {
    if (res.code === 200) {
      const { deptList, empList } = res.data
      const addlimitPromoterInputList = factoreMap.value.get(
        'addlimitPromoterInputList'
      )
      addlimitPromoterInputList.forEach((element: any) => {
        empList.forEach((item: any) => {
          if (element.employeeId === item.employeeId) {
            element['deptList'] = item['deptList']
          }
        })
      })
      // console.log(genFWordDeptName(deptList, empList))

      const result = genFWordDeptName(deptList, addlimitPromoterInputList)

      factoreMap.value.set('addlimitPromoterInputList', result)
    }
  })
}

// 纯属浪费时间的功能，简直...yituodabian
const genFWordDeptName = (deptList: any[], empList: any[]) => {
  return empList.map(item => {
    if (item.deptList?.length > 0) {
      item['deptNames'] = foo(deptList, item.deptList)
    } else {
      if (item?.marketDelFlag === 1) {
        item['deptNames'] = '--'
      } else {
        item['deptNames'] = companyName.value
      }
    }
    return item
  })
}

const foo = (deptList: any[], empDeptList: any[]) => {
  const strArr: string[] = []
  for (let v of empDeptList) {
    let parentDeptId = v['parentDeptId']
    let str = v['deptName']
    const deptListBackUp = JSON.parse(JSON.stringify(deptList))

    const find = (parentDeptId: string, str: string): string => {
      if (parentDeptId === '0') {
        return str
      }
      const res = deptListBackUp.filter(
        (item: any) => item.deptId === parentDeptId
      )[0]
      if (res?.parentDeptId !== '0') {
        return find(res.parentDeptId, `${res.deptName}->${str}`)
      } else {
        return `${res.deptName}->${str}`
      }
    }
    strArr.push(find(parentDeptId, str))
  }
  return strArr.join(',')
}

// 拦截城市公司ID的更改，目前没发现别的好办法，这种方式还是比较繁琐
// 繁琐的点在于新建与编辑初始化的过程中要注意与副作用的先后顺序
// 不然会提前触发副作用
const useCityIdCustomRef = (value: number) => {
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        if (hasFactorItem()) {
          if (newValue === formData.cityId) return
          ElMessageBox.confirm(
            '切换城市/公司/店铺将清除下方已选规则限定条件,确认则清除',
            '温馨提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              factoreMap.value.clear()
              value = newValue
              formData.cityId = newValue
              cityIdChange(newValue)
              trigger()
            })
            .catch(() => {})
        } else {
          trigger()
          value = newValue
          formData.cityId = newValue
          if (!formData.draftCompanyGoodsExcitationRuleId && newValue) {
            cityIdChange(newValue)
          }
        }
      }
    }
  })
}
const useCompanyIdCustomRef = (value: number | undefined) => {
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        if (hasFactorItem()) {
          if (!newValue) return
          if (newValue === formData.companyId) return
          ElMessageBox.confirm(
            '切换城市/公司/店铺将清除下方已选规则限定条件,确认则清除',
            '温馨提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              factoreMap.value.clear()
              formData.companyId = newValue
              companyChange(newValue)
              trigger()
              value = newValue
            })
            .catch(() => {
              getMarketShopList(formData.companyId)
            })
        } else {
          trigger()
          value = newValue
          formData.companyId = newValue
          // marketShopIdCustomRef.value = undefined
          if (!formData.draftCompanyGoodsExcitationRuleId && newValue) {
            companyChange(newValue)
          }
        }
      }
    }
  })
}
const useMarketShopIdCustomRef = (value: number | undefined) => {
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        if (hasFactorItem()) {
          if (!newValue) return
          if (newValue === formData.marketShopId) return
          ElMessageBox.confirm(
            '切换城市/公司/店铺将清除下方已选规则限定条件,确认则清除',
            '温馨提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              factoreMap.value.clear()
              formData.marketShopId = newValue
              trigger()
              value = newValue
            })
            .catch(() => {})
        } else {
          trigger()
          value = newValue
          formData.marketShopId = newValue
        }
      }
    }
  })
}
const cityIdCustomRef = useCityIdCustomRef(formData.cityId)
const companyIdCustomRef = useCompanyIdCustomRef(formData.companyId)
const marketShopIdCustomRef = useMarketShopIdCustomRef(formData.marketShopId)

const dialogShow = ref(false)
const toggleDialogStatus = (
  comnanyGoodsExcitationRuleId?: number,
  companyId?: number,
  marketShopId?: number
) => {
  if (!dialogShow.value) {
    // 打开操作
    if (comnanyGoodsExcitationRuleId && companyId) {
      // 编辑操作
      formData.draftCompanyGoodsExcitationRuleId = comnanyGoodsExcitationRuleId
      initEdit(companyId, marketShopId)
    } else {
      init()
    }
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss">
.root {
  :deep(.custom-dialog > .el-dialog__body) {
    background-color: #f1f3f4;
    padding: 20px 10px;
    height: calc(100vh - 130px);
    overflow: auto;
  }
  :deep(.custom-datetime > .el-input__wrapper) {
    width: 215px;
  }
  .custom-el-form-item {
    margin-right: 80px;
  }
  :deep(.custom-dialog > .el-dialog__footer) {
    box-shadow: 0px -1px 4px 0px #d9d9d9;
    position: relative;
    z-index: 99;
    padding: 15px 20px;
  }
  .module-box {
    margin-bottom: 15px;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    &-desc {
      margin-bottom: 15px;
    }
  }
}
.module-box {
  margin-bottom: 10px;
  &-desc {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    &__input {
      max-width: 520px !important;
    }
    &__form-item {
      margin-left: 10px;
      margin-bottom: 0;
      width: 520px;
    }
    &__button {
      margin-left: 10px;
    }
  }
}
</style>
