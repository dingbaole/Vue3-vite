<template>
  <el-dialog
    v-model="dialogShow"
    :title="`${
      formData.companyInstallExcitationRuleId ? '编辑' : '新建'
    }安装激励规则`"
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
          <span style="font-size: 18px">{{
            `${
              formData.companyInstallExcitationRuleId ? '编辑' : '新建'
            }安装激励规则`
          }}</span>
          <!-- <el-alert
            style="width: 500px; margin-left: 20px"
            title="提示：在低碳集市平台开通店铺并上架店铺商品后，可在此处设置激励商品！"
            type="error"
            :closable="false"
          /> -->
        </div>
        <!-- <GoodsDesc v-if="!formData.companyInstallExcitationRuleId" /> -->
      </div>
    </template>
    <el-form :inline="true" :model="formData" :rules="rules" ref="ruleFormRef">
      <div class="module-box">
        <el-alert
          style="width: 720px; margin-bottom: 20px; padding-left: 0"
          title="提示：自动格式生成，可再编辑。自动生成名称格式：公司商品+“激励类型”+激励标准+激励规则。最大长度30个文字。"
          type="warning"
          :closable="false"
        />
        <div class="module-box-desc">
          <div style="flex-shrink: 0">激励规则名称</div>
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
            :disabled="!!formData.companyInstallExcitationRuleId"
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
            :disabled="!!formData.companyInstallExcitationRuleId"
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
        <el-form-item label="企业店铺:" prop="marketShopId">
          <el-select
            :disabled="!!formData.companyInstallExcitationRuleId"
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
        <el-form-item label="激励类型" prop="commissionType">
          <el-select
            v-model="formData.commissionType"
            @change="commissionTypeChange"
            placeholder="激励类型"
          >
            <el-option
              v-for="item in excitationTypeList"
              :label="item.commissionName"
              :value="item.commissionType"
              :key="item.commissionType"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.commissionType && false">
          <!-- 先隐藏此模块功能入口 -->
          <!-- <el-checkbox
            style="margin-right: 10px"
            v-model="ladderTypeCustomRef"
            label="阶梯激励: "
            :true-label="11"
            :false-label="10"
            size="large"
          /> -->
          <el-switch
            style="margin-right: 10px"
            v-model="ladderTypeCustomRef"
            :active-value="11"
            :inactive-value="10"
            inline-prompt
            active-text="已启用"
            inactive-text="已禁用"
            size="large"
            @change="ladderTypeChange"
          />
          <span style="margin-right: 10px; display: inline-block"
            >阶梯激励:
          </span>
          <el-select size="small" v-model="selectValue">
            <el-option label="自定义成交单价区间" value="自定义成交单价区间" />
          </el-select>
          <span
            style="font-size: 12px; display: inline-block; margin-left: 10px"
            >提示: 最多可添加10个阶梯区间。</span
          >
        </el-form-item>
      </div>
      <div>
        <el-form-item
          v-if="formData.commissionType && formData.ladderType !== 11"
          :label="formData.commissionType === 11 ? '激励金额' : '激励比例'"
          prop="commissionValue"
        >
          <el-input
            v-if="formData.commissionType === 11"
            v-model="formData.commissionValue"
            placeholder="激励金额"
          >
            <template #append>元/件</template>
          </el-input>
          <el-input
            v-if="formData.commissionType === 12"
            v-model="formData.commissionValue"
            placeholder="激励比例"
          >
            <template #append>%</template>
          </el-input>
        </el-form-item>
      </div>
      <div style="padding-left: 10px">
        <TieredPrice
          v-if="formData.ladderType === LadderType.Y"
          :commission-type="formData.commissionType"
          :tiered-list="formData.goodsExcitationRuleLadderInputList"
          ref="TieredPriceRef"
        />
      </div>

      <div class="module-box" style="margin-top: 30px">
        <div class="module-box-desc">
          3.适用商品范围
          <el-button
            class="module-box-desc__button"
            type="primary"
            :disabled="
              !formData.cityId || !formData.companyId || !formData.marketShopId
            "
            @click="addGoods"
            >添加激励安装的商品</el-button
          >
        </div>
        <!-- <el-alert
          v-if="formData.ladderType === LadderType.N"
          style="width: 500px"
          title="提示：以下标红的商品，其指导价为空或0，勾选设置后将不给予激励"
          type="error"
          :closable="false"
        /> -->
        <el-table
          :data="formData.operGoodsDetailInputList"
          border
          style="width: 100%; margin-top: 15px"
          :cell-style="cellStyle"
        >
          <el-table-column
            property="materialNo"
            label="物料号"
            width="120"
            align="center"
          />
          <el-table-column property="goodsName" label="商品名称" />
          <el-table-column
            property="goodsType"
            label="商品类型"
            width="110"
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
          <el-table-column property="skuNo" label="SKU编号" width="120" />
          <el-table-column
            property="price"
            label="商品单价(元)"
            width="120"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.price ?? '--' }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            property="price"
            label="商品指导单价"
            width="120"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.guidePrice ?? '--' }}
            </template>
          </el-table-column>
          <el-table-column align="center" v-if="formData.ladderType !== 11">
            <template #header>
              <div>
                <el-checkbox
                  v-model="isAllChecked"
                  :indeterminate="isIndeterminate"
                  @change="allCheckedChange"
                ></el-checkbox>
                不低于指导价给予激励
              </div>
              <div style="font-size: 12px">
                (非必选，选择后，将按条件计算激励)
              </div>
            </template>
            <template #default="scope">
              <el-checkbox v-model="scope.row.checked" size="large" />
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="80" align="center">
            <template #default="scope">
              <el-button type="text" @click="deleteGoods(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <GoodsCompanyList
      :marketShopId="shopInfo.marketShopId"
      :thirdShopId="shopInfo.thirdShopId"
      :companyId="formData.companyId"
      :operGoodsDetailInputList="formData.operGoodsDetailInputList"
      @onSelected="onSelected"
      ref="GoodsListRef"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="toggleDialogStatus">取消</el-button>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="save(ruleFormRef)"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, unref, h, customRef, computed } from 'vue'
import GoodsCompanyList from './components/goods-company-list.vue'
import TieredPrice from './components/tiered-price.vue'
import GoodsDesc from './components/goods-desc.vue'
import { GetCompanyList } from '@/webapi/common'
import {
  CheckBaseRule,
  AddSaveBaseRule,
  EditSaveBaseRule,
  QueryBaseRule,
  RemoveRule,
  MarketShopList
} from '@/webapi/goods-install'
import type {
  OperGoodsDetailInput,
  ISaveBaseRule
} from '@/webapi/goods-install'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import {
  ElMessage,
  ElTable,
  ElTableColumn,
  ElMessageBox,
  ElTag
} from 'element-plus'
import type { Action } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { CompanyItem } from '@/store/modules/common'
import { LadderType, type CONST } from '@/global'

const commonStore = useCommon()
const { cityList, excitationTypeList } = storeToRefs(commonStore)

const formData = reactive<ISaveBaseRule>({
  ruleGroup: 11,
  ruleName: '',
  cityId: undefined,
  companyId: undefined,
  marketShopId: undefined,
  commissionType: null!,
  commissionValue: '',
  operGoodsDetailInputList: [],
  ladderType: 10
})
const cellStyle = ({ row }: { row: OperGoodsDetailInput }) => {
  if (row.checked && !row.guidePrice) {
    return { background: '#fef0f0' }
  }
}
const isAllChecked = ref(false)
const isIndeterminate = computed(() => {
  const list = formData.operGoodsDetailInputList
  const listLen = list.length
  const checkedListLen = list.filter(item => item.checked).length
  return checkedListLen > 0 && checkedListLen < listLen
})
const allCheckedChange = (val: boolean) => {
  formData.operGoodsDetailInputList.forEach(item => {
    item.checked = val
  })
}
watch(
  () => formData.operGoodsDetailInputList,
  () => {
    const checked =
      formData.operGoodsDetailInputList.filter(item => item.checked).length ===
        formData.operGoodsDetailInputList.length &&
      formData.operGoodsDetailInputList.length !== 0
    isAllChecked.value = checked
  },
  { deep: true }
)
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
        if (
          formData.operGoodsDetailInputList.length > 0 &&
          !formData.companyInstallExcitationRuleId
        ) {
          if (newValue === formData.cityId) return
          ElMessageBox.confirm(
            '切换城市/公司/店铺将清除下方已选激励商品,确认则清除',
            '温馨提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              formData.operGoodsDetailInputList = []
              formData.cityId = newValue
              companyIdCustomRef.value = undefined
              cityIdChange(newValue)
              trigger()
              value = newValue
            })
            .catch(() => {
              getCompanyList(formData.cityId)
            })
        } else {
          trigger()
          value = newValue
          formData.cityId = newValue
          if (!formData.companyInstallExcitationRuleId && newValue) {
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
        if (
          formData.operGoodsDetailInputList.length > 0 &&
          !formData.companyInstallExcitationRuleId
        ) {
          if (!newValue) return
          if (newValue === formData.companyId) return
          ElMessageBox.confirm(
            '切换城市/公司/店铺将清除下方已选激励商品,确认则清除',
            '温馨提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              formData.operGoodsDetailInputList = []
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
          if (!formData.companyInstallExcitationRuleId && newValue) {
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
        if (
          formData.operGoodsDetailInputList.length > 0 &&
          !formData.companyInstallExcitationRuleId
        ) {
          if (!newValue) return
          if (newValue === formData.marketShopId) return
          ElMessageBox.confirm(
            '切换城市/公司/店铺将清除下方已选激励商品,确认则清除',
            '温馨提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              formData.operGoodsDetailInputList = []
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

const useLadderTypeCustomRef = (value: CONST['ladderType']) => {
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        formData.ladderType = newValue ?? 10
        formData.ruleName = ''
        trigger()
        // if (formData.ladderType === LadderType.Y && newValue === LadderType.N) {
        //   ElMessageBox.confirm(
        //     '取消勾选阶梯激励后将清除下方已配置的阶梯，确认取消勾选吗？',
        //     '温馨提示',
        //     {
        //       confirmButtonText: '确认',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }
        //   )
        //     .then(() => {
        //       value = newValue
        //       formData.ladderType = newValue
        //       trigger()
        //     })
        //     .catch(() => {
        //       // value = 11
        //       // trigger()
        //       // formData.ladderType = 11
        //       // console.log(value)
        //       // console.log(formData.ladderType)
        //     })
        // } else {
        //   value = newValue
        //   formData.ladderType = newValue
        //   trigger()
        // }
      }
    }
  })
}
const cityIdCustomRef = useCityIdCustomRef(formData.cityId)
const companyIdCustomRef = useCompanyIdCustomRef(formData.companyId)
const marketShopIdCustomRef = useMarketShopIdCustomRef(formData.marketShopId)
const ladderTypeCustomRef = useLadderTypeCustomRef(formData.ladderType)

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  ruleName: [
    { required: true, message: '请填写激励规则名称', trigger: 'blur' },
    { max: 30, message: '最长不能超过30个字符', trigger: 'blur' }
  ],
  cityId: [
    {
      required: true,
      message: '请选择城市',
      trigger: 'change'
    }
  ],
  companyId: [
    {
      required: true,
      message: '请选择公司',
      trigger: 'change'
    }
  ],
  marketShopId: [
    {
      required: true,
      message: '请选择店铺',
      trigger: 'change'
    }
  ],
  commissionType: [
    {
      required: true,
      message: '请选择激励类型',
      trigger: 'change'
    }
  ],
  commissionValue: [
    {
      validator: (rule: any, value: any, callback: any) => {
        const reg1 = /^[0-9]+\.{0,1}[0-9]{0,2}$/
        const val = parseFloat(value)
        if (value === '') {
          const str =
            formData.commissionType === 11
              ? '金额'
              : formData.commissionType === 12
              ? '比例'
              : ''
          callback(new Error(`请输入激励${str}`))
        } else if (!reg1.test(value)) {
          callback(new Error(`只能输入数字并且不能超过两位小数`))
        } else if (formData.commissionType === 11 && val === 0) {
          callback(new Error(`固定激励：激励金额不能为0`))
        } else if (formData.commissionType === 11 && val > 99999) {
          callback(new Error(`固定激励：激励金额上限99999`))
        } else if (formData.commissionType === 12 && val > 100) {
          callback(new Error(`比例激励：激励比例最大设置0~100.00%`))
        } else {
          if (!formData.cityId || !formData.companyId) {
            callback(new Error(`请选择城市和公司`))
          } else {
            checkBaseRule(val, callback)
          }
        }
      },
      required: true,
      trigger: 'blur'
    }
  ]
})

const TieredPriceRef = ref<InstanceType<typeof TieredPrice>>()
const emit = defineEmits(['isConfirm'])
const saveLoading = ref(false)
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  saveLoading.value = true
  try {
    await Promise.all([
      TieredPriceRef.value?.tieredPriceFormRef().validate(),
      formEl.validate()
    ])
    if (
      formData.operGoodsDetailInputList.length === 0 ||
      !formData.marketShopId
    ) {
      ElMessage({
        type: 'error',
        message:
          formData.operGoodsDetailInputList.length === 0
            ? '请添加激励商品'
            : '企业店铺信息无效'
      })
      saveLoading.value = false
      return
    }
    saveBaseRule()
  } catch (err) {
    saveLoading.value = false
  }
}

const handleSaveError = (hasInvalidation: any[]) => {
  // 是否含有失效项目
  if (hasInvalidation.length > 0) {
    ElMessageBox.confirm(
      h('div', null, [
        h(
          'div',
          {
            style: {
              marginBottom: '10px'
            }
          },
          [
            h(
              'div',
              {},
              '以下商品已存在其他的基础规则中，商品从其他基础规则中移除后，才可加入新的规则中。'
            ),
            h('div', {}, '确认移除吗？若忽略，则以下商品不会被继续添加。')
          ]
        ),
        h(
          ElTable,
          {
            data: hasInvalidation,
            border: true
          },
          [
            h(ElTableColumn, {
              property: 'goodsName',
              label: '商品'
            }),
            h(
              ElTableColumn,
              {
                property: 'commissionRuleName',
                label: '激励规则'
              },
              {
                default: (scope: any) =>
                  h(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        justifyContent: 'space-between'
                      }
                    },
                    [
                      h('span', {}, scope.row.commissionRuleName),
                      scope.row.ruleStatus === 14
                        ? h(
                            ElTag,
                            {
                              type: 'info',
                              effect: 'light',
                              closable: false
                            },
                            '已失效'
                          )
                        : ''
                    ]
                  )
              }
            )
          ]
        )
      ]),
      '温馨提示',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '忽略继续添加',
        cancelButtonText: '确认移除再添加',
        customStyle: {
          maxWidth: '800px'
        }
      }
    )
      .then(() => {
        // 忽略继续提交, 移除失效的继续添加
        const hasInvalidaIds = hasInvalidation.map(item => item.materialNo)
        formData.operGoodsDetailInputList =
          formData.operGoodsDetailInputList.filter(
            item => !hasInvalidaIds.includes(item.materialNo)
          )
        if (formData.operGoodsDetailInputList.length > 0) {
          saveBaseRule()
        }
      })
      .catch((action: Action) => {
        if (action === 'cancel') {
          const invalidation = hasInvalidation.map(
            ({ companyInstallExcitationRuleId, materialNo, skuNo }) => {
              return {
                companyInstallExcitationRuleId,
                materialNo,
                skuNo,
                companyId: formData.companyId
              }
            }
          )
          RemoveRule(invalidation).then(res => {
            if (res.code === 200) {
              ElMessage({
                message: '操作成功',
                type: 'success'
              })
              saveBaseRule()
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
}

const returnSaveApi = () => {
  return formData.companyInstallExcitationRuleId
    ? EditSaveBaseRule
    : AddSaveBaseRule
}

const saveBaseRule = () => {
  const { commissionValue, operGoodsDetailInputList, ...rest } = formData
  const list = operGoodsDetailInputList.map(item => {
    if (item.checked) {
      item.calcType = 11
    } else {
      item.calcType = 10
    }
    return item
  })
  returnSaveApi()({
    commissionValue: !commissionValue
      ? '0'
      : parseFloat(commissionValue).toFixed(2),
    operMaterialDetailInputList: list,
    ...rest,
    goodsExcitationRuleLadderInputList:
      formData.ladderType === LadderType.Y
        ? TieredPriceRef.value?.getTieredList()
        : formData.goodsExcitationRuleLadderInputList
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
      handleSaveError(res.data)
    } else {
      // 异常有其他处理
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

const init = () => {
  setTimeout(() => {
    ruleFormRef.value?.resetFields()
    formData.companyInstallExcitationRuleId = undefined
    formData.commissionValue = ''
    formData.ladderType = LadderType.N
    formData.operGoodsDetailInputList = []
    formData.goodsExcitationRuleLadderInputList = undefined
    companyIdCustomRef.value = undefined
    cityIdCustomRef.value = undefined
    marketShopIdCustomRef.value = undefined
    ladderTypeCustomRef.value = undefined
    companyList.value = []
    shopList.value = []
  }, 0)
}

const initEdit = (companyId: number, marketShopId: number) => {
  const { companyInstallExcitationRuleId } = formData
  QueryBaseRule({
    companyInstallExcitationRuleId: companyInstallExcitationRuleId!,
    companyId,
    marketShopId
  }).then(res => {
    if (res.code === 200) {
      formData.cityId = res.data.cityId
      cityIdChange(res.data.cityId)
      companyChange(res.data.companyId)
      marketShopIdChange(res.data.marketShopId)

      formData.companyId = res.data.companyId
      formData.marketShopId = res.data.marketShopId
      shopInfo.marketShopId = res.data.marketShopId
      shopInfo.thirdShopId = res.data.thirdShopId
      formData.ruleGroup = res.data.ruleGroup
      cityIdCustomRef.value = res.data.cityId
      companyIdCustomRef.value = res.data.companyId
      marketShopIdCustomRef.value = res.data.marketShopId
      formData.commissionType = res.data.commissionType
      formData.goodsExcitationRuleLadderInputList =
        res.data.goodsExcitationRuleLadderOutputs
      formData.ladderType = res.data.ladderType
      ladderTypeCustomRef.value = res.data.ladderType

      formData.operGoodsDetailInputList = res.data.materialUsedRuleOutputs.map(
        (item: OperGoodsDetailInput) => {
          if (item.calcType === 11) {
            item['checked'] = true
          } else {
            item['checked'] = false
          }
          return item
        }
      )
      setTimeout(() => {
        formData.ruleName = res.data.ruleName
        formData.commissionValue = res.data.commissionValue
        if (formData.ladderType === LadderType.Y) {
          formData.commissionValue = ''
        }
        ruleFormRef.value?.validate()
        TieredPriceRef.value?.tieredPriceFormRef().validate()
      }, 10)
    }
  })
}

const checkBaseRule = (commissionValue: number, callback: any) => {
  const {
    companyId,
    commissionType,
    companyInstallExcitationRuleId,
    marketShopId
  } = formData
  CheckBaseRule({
    companyId,
    commissionType,
    commissionValue,
    companyInstallExcitationRuleId,
    marketShopId
  }).then(res => {
    if (res.code !== 200) {
      callback(new Error(`当前公司下此规则已存在(规则名称: ${res.data})`))
    } else {
      callback()
    }
  })
}

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  // if (!cityId) return
  // formData.companyId = undefined
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

interface Shop {
  marketShopId: number
  thirdShopId: number
  shopName: string
  thirdShopNo: string
}
const shopList = ref<Shop[]>([])
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
const companyChange = (companyId: number | undefined) => {
  ruleFormRef.value?.validateField('commissionValue')
  // ruleFormRef.value?.validateField('marketShopId')
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
const getMarketShopList = (companyId: number) => {
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
    }
  })
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
  ruleFormRef.value?.validateField('commissionValue')
}
const ladderTypeChange = (val: CONST['ladderType']) => {
  if (val === LadderType.N) {
    formData.goodsExcitationRuleLadderInputList =
      TieredPriceRef.value?.getTieredList()
  }
}
const commissionTypeChange = () => {
  ruleFormRef.value?.validateField('commissionValue')
  TieredPriceRef.value?.tieredPriceFormRef().validateField()
}

watch([() => formData.commissionType, () => formData.commissionValue], () => {
  // if (formData.companyInstallExcitationRuleId) return
  if (!formData.commissionType || !formData.commissionValue) {
    return ''
  }
  const S1 =
    formData.commissionType === 11
      ? '固定激励'
      : formData.commissionType === 12
      ? '比例激励'
      : ''
  const S2 = `${formData.commissionValue}${
    formData.commissionType === 11
      ? '元/件'
      : formData.commissionType === 12
      ? '%'
      : ''
  }`
  formData.ruleName = `公司商品${S1}${S2}激励规则`
  unref(ruleFormRef)?.validateField('ruleName')
})

const GoodsListRef = ref<InstanceType<typeof GoodsCompanyList>>()
const addGoods = () => {
  GoodsListRef.value?.toggleDialogStatus()
}
const deleteGoods = (row: OperGoodsDetailInput) => {
  formData.operGoodsDetailInputList = formData.operGoodsDetailInputList.filter(
    item => item.materialNo !== row.materialNo
  )
}
const onSelected = (val: OperGoodsDetailInput[]) => {
  formData.operGoodsDetailInputList = val.map(item => {
    const checkedGoodsIds = formData.operGoodsDetailInputList
      .filter(item => item.checked)
      .map(item => item.materialNo)
    if (checkedGoodsIds.includes(item.materialNo)) {
      item['checked'] = true
    } else {
      item['checked'] = false
    }
    return item
  })
}

const dialogShow = ref(false)
const toggleDialogStatus = (
  companyInstallExcitationRuleId?: number,
  companyId?: number,
  marketShopId?: number
) => {
  if (!dialogShow.value) {
    // 打开操作
    if (companyInstallExcitationRuleId && companyId) {
      // 编辑操作
      formData.companyInstallExcitationRuleId = companyInstallExcitationRuleId
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
const selectValue = ref('自定义成交单价区间')
</script>

<style scoped lang="scss">
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
