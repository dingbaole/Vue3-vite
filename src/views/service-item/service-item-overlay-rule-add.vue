<template>
  <div class="root">
    <el-dialog
      class="custom-dialog"
      v-model="dialogShow"
      :title="`${
        formData.comnanyItemExcitationRuleId ? '编辑' : '新建'
      }激励叠加规则`"
      fullscreen
      :before-close="toggleDialogStatus"
    >
      <template #header>
        <div class="title" style="display: flex; align-items: center">
          <span style="font-size: 18px">{{
            `${
              formData.comnanyItemExcitationRuleId ? '编辑' : '新建'
            }激励叠加规则`
          }}</span>
          <el-alert
            style="width: 420px; margin-left: 20px"
            title="提示: 叠加激励均在基础规则激励的基础上做额外的激励。"
            type="error"
            :closable="false"
          />
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
            title="提示: 自动格式生成, 可再编辑。自动生成名称格式: 公司服务+“激励类型”+激励标准+激励规则。最大长度30个文字。"
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
              :disabled="formData.comnanyItemExcitationRuleId"
              v-model="cityIdCustomRef"
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
          <el-form-item label="服务公司" prop="companyId">
            <el-select
              :disabled="formData.comnanyItemExcitationRuleId"
              v-model="companyIdCustomRef"
              @change="companyChange"
              filterable
              placeholder="公司"
            >
              <el-option
                v-for="item in companyList"
                :key="item.companyId"
                :label="`${item.companyName}(公司代码: ${item.companyCodeNo})`"
                :value="item.companyId"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="module-box">
          <div class="module-box-desc">2.激励规则</div>
          <el-alert
            v-if="formData.commissionType === 21"
            style="width: 544px; margin-bottom: 20px"
            title="示例: 服务实收价100.00元, 激励基础规则10.00%, 叠加定额为2元/件,    
                  最终员工获得该服务的激励金额=100.00*10.00%+2=12.00元。"
            type="warning"
            :closable="false"
          />
          <el-alert
            v-if="formData.commissionType === 22"
            style="width: 544px; margin-bottom: 20px"
            title="示例: 服务实收价100.00元, 激励基础规则10.00%, 叠加系数为0.5,    
                  最终员工获得该服务的激励金额=100.00*10.00%*(1+0.5)=15.00元。"
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
                :key="item.commissionType"
                :label="item.commissionName"
                :value="item.commissionType"
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
            >
            </el-input>
            <el-input
              v-if="formData.commissionType === 22"
              v-model="formData.commissionValue"
              placeholder="叠加系数"
            >
            </el-input>
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
              :disabled="!formData.cityId || !formData.companyId"
              @click="addFactor"
            >
              添加限定条件
            </el-button>
          </div>
          <el-card
            style="margin-bottom: 20px"
            shadow="never"
            v-if="factoreMap.has('operServiceItemDetailInputs')"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <span>限定条件: 适用指定激励服务</span>
                <el-button
                  style="margin-left: 18px"
                  size="small"
                  type="primary"
                  @click="addServiceItem"
                >
                  添加指定激励服务
                </el-button>
              </div>
              <el-button
                type="text"
                @click="deleteFactor('operServiceItemDetailInputs')"
              >
                删除条件
              </el-button>
            </div>
            <TableWithFakePagination
              :data="factoreMap.get('operServiceItemDetailInputs')"
              border
              style="width: 100%; margin-top: 15px"
            >
              <el-table-column
                property="bigClassName"
                label="服务大类"
                width="100"
              />
              <el-table-column property="deviceName" label="设备" width="100" />
              <el-table-column
                property="serviceClassName"
                label="服务品类"
                width="140"
              />
              <el-table-column property="serviceItemName" label="服务项目" />
              <el-table-column
                property="serviceFee"
                label="项目单价(元)"
                width="105"
                align="center"
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="80"
                align="center"
              >
                <template #default="scope">
                  <el-button type="text" @click="deleteServiceItem(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </TableWithFakePagination>
          </el-card>
          <el-card
            style="margin-bottom: 20px"
            shadow="never"
            v-if="factoreMap.has('empRelateList')"
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
              <el-button type="text" @click="deleteFactor('empRelateList')">
                删除条件
              </el-button>
            </div>
            <TableWithFakePagination
              :data="factoreMap.get('empRelateList')"
              border
              style="width: 100%; margin-top: 15px"
            >
              <el-table-column property="stationName" label="服务站">
                <template #default="scope">
                  <span>{{
                    scope.row.nodeLeafStationLabel
                      ? scope.row.nodeLeafStationLabel
                      : scope.row.stationName
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column property="empName" label="人员姓名" />
              <el-table-column property="encryptMobileNo" label="手机号" />
              <el-table-column
                fixed="right"
                label="操作"
                width="80"
                align="center"
              >
                <template #default="scope">
                  <el-button type="text" @click="deleteEmp(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </TableWithFakePagination>
          </el-card>
          <el-card
            style="margin-bottom: 20px"
            shadow="never"
            v-if="factoreMap.has('serviceAreaRelateList')"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <span>限定条件: 适用指定服务区域</span>
                <el-button
                  style="margin-left: 18px"
                  size="small"
                  type="primary"
                  @click="addArea"
                >
                  添加指定服务区域
                </el-button>
              </div>
              <el-button
                type="text"
                @click="deleteFactor('serviceAreaRelateList')"
              >
                删除条件
              </el-button>
            </div>
            <TableWithFakePagination
              :data="factoreMap.get('serviceAreaRelateList')"
              border
              style="width: 100%; margin-top: 15px"
            >
              <el-table-column property="stationName" label="服务站" />
              <el-table-column property="areaName" label="服务区域名称" />
              <el-table-column
                fixed="right"
                label="操作"
                width="80"
                align="center"
              >
                <template #default="scope">
                  <el-button type="text" @click="deleteArea(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </TableWithFakePagination>
          </el-card>
          <OrderLabelPanel
            v-if="factoreMap.get('orderLabel')"
            :mode="'serviceItem'"
            :order-label-list="factoreMap.get('orderLabel')"
            @change="orderLabelChange"
            @is-remove-panel="deleteFactor('orderLabel')"
          />
        </div>
      </el-form>
      <ServiceItemCompanyList
        :cityId="formData.cityId"
        :companyId="formData.companyId"
        :operServiceItemDetailInputs="
          factoreMap.get('operServiceItemDetailInputs')
        "
        @onSelected="onSelectedService"
        ref="ServiceItemCompanyListRef"
      />
      <EmpList
        :companyId="formData.companyId"
        :companyList="companyList"
        :emp-relate-list="factoreMap.get('empRelateList')"
        @onSelected="onSelectedEmp"
        ref="EmpListRef"
      />
      <AreaList
        :companyId="formData.companyId"
        :companyList="companyList"
        :service-area-relate-list="factoreMap.get('serviceAreaRelateList')"
        @onSelected="onSelectedArea"
        ref="AreaListRef"
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
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, customRef, watch } from 'vue'
import TableWithFakePagination from '@/components/tableWithFakePagination/tableWithFakePagination.vue'
import ServiceItemCompanyList from './components/service-item-company-list.vue'
import OrderLabelPanel from '@/components/orderLabelPanel/order-label-panel.vue'
import EmpList from '@/components/empList/empList.vue'
import AreaList from '@/components/areaList/areaList.vue'
import CommonModal from '@/components/commonModal/commonModal.vue'
import { GetCompanyList } from '@/webapi/common'
import {
  AddSaveBaseOverlayRule,
  EditSaveBaseOverlayRule,
  QueryBaseOverlayRule
} from '@/webapi/serviceItem'
import type {
  OperServiceItemDetailInputs,
  ISaveBaseOverlayRule,
  EmpRelateList,
  ServiceAreaRelateList
} from '@/webapi/serviceItem'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { useFormRulesOverlay } from '@/hooks/useFormRule'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import { richRuleName } from '@/utils'
import type { OrderLabel } from '@/components/orderLabelPanel/types'

const commonStore = useCommon()
const { cityList, excitationTypeOverlayList } = storeToRefs(commonStore)
const emit = defineEmits(['isConfirm'])
const formData = reactive<Partial<ISaveBaseOverlayRule>>({
  ruleGroup: 21,
  ruleName: '',
  cityId: undefined,
  companyId: undefined,
  commissionType: undefined,
  commissionValue: '',
  startDateTime: undefined,
  endDateTime: undefined
})
const defaultDateTime = new Date(0, 0, 0, 23, 59, 59)
const { rules, ruleFormRef } =
  useFormRulesOverlay<Partial<ISaveBaseOverlayRule>>(formData)

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
            message: '请在已添加的限定条件内添加指定元素, 无需则删除条件！'
          })
          saveLoading.value = false
          return
        }
      }
      saveBaseRule()
    } else {
      saveLoading.value = false
    }
  })
}

const returnSaveApi = () => {
  return formData.comnanyItemExcitationRuleId
    ? EditSaveBaseOverlayRule
    : AddSaveBaseOverlayRule
}

const saveBaseRule = () => {
  const empRelateList = factoreMap.value.get('empRelateList')
  const operServiceItemDetailInputs = factoreMap.value.get(
    'operServiceItemDetailInputs'
  )
  const serviceAreaRelateList = factoreMap.value.get('serviceAreaRelateList')
  const orderLabelInputList = factoreMap.value.get('orderLabel')
  formData.empRelateType = empRelateList?.length > 0 ? 11 : 10
  formData.empRelateList = empRelateList ? empRelateList : []
  formData.serviceItemRelateType =
    operServiceItemDetailInputs?.length > 0 ? 11 : 10
  formData.operServiceItemDetailInputs = operServiceItemDetailInputs
    ? operServiceItemDetailInputs
    : []
  formData.serviceAreaRelateType = serviceAreaRelateList?.length > 0 ? 11 : 10
  formData.serviceAreaRelateList = serviceAreaRelateList
    ? serviceAreaRelateList
    : []
  formData.orderLabelRelateType = orderLabelInputList?.length > 0 ? 11 : 10
  formData.serviceItemOrderLabelInputList = orderLabelInputList ?? []
  formData.startTime = dayjs(formData.startDateTime).valueOf()
  formData.endTime = dayjs(formData.endDateTime).valueOf()
  const { commissionValue, ...rest } = formData

  returnSaveApi()({
    commissionValue: parseFloat(commissionValue!).toFixed(2),
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

const commissionTypeChange = () => {
  ruleFormRef.value?.clearValidate('commissionValue')
}

const companyChange = () => {
  ruleFormRef.value?.validateField('commissionValue')
}

const init = () => {
  setTimeout(() => {
    factoreMap.value.clear()
    ruleFormRef.value?.resetFields()
    formData.commissionValue = ''
    formData.comnanyItemExcitationRuleId = undefined
    formData.operServiceItemDetailInputs = []
    companyIdCustomRef.value = undefined
    cityIdCustomRef.value = undefined
    companyList.value = []
  }, 100)
}

const initEdit = (companyId: number) => {
  factoreMap.value?.clear()
  const { comnanyItemExcitationRuleId } = formData
  QueryBaseOverlayRule({
    comnanyItemExcitationRuleId,
    companyId
  }).then(res => {
    if (res.code === 200) {
      const {
        cityId,
        companyId,
        ruleGroup,
        ruleName,
        commissionType,
        commissionValue,
        serviceItemRelateType,
        serviceItemScopeDetailOutputs,
        empRelateType,
        empRelateList,
        serviceAreaRelateType,
        serviceAreaRelateList,
        orderLabelRelateType,
        orderLabelOutputList,
        startTime,
        endTime
      } = res.data
      // cityIdChange(cityId)
      formData.cityId = cityId
      formData.companyId = companyId
      formData.ruleGroup = ruleGroup
      cityIdCustomRef.value = cityId
      companyIdCustomRef.value = companyId
      formData.commissionType = commissionType
      formData.commissionValue = commissionValue
      if (empRelateType === 11) {
        factoreMap.value.set('empRelateList', empRelateList)
      }
      if (serviceAreaRelateType === 11) {
        factoreMap.value.set('serviceAreaRelateList', serviceAreaRelateList)
      }
      if (serviceItemRelateType === 11) {
        factoreMap.value.set(
          'operServiceItemDetailInputs',
          serviceItemScopeDetailOutputs
        )
      }
      if (orderLabelRelateType === 11) {
        factoreMap.value.set('orderLabel', orderLabelOutputList)
      }
      formData.startDateTime = startTime
      formData.endDateTime = endTime
      setTimeout(() => {
        formData.ruleName = ruleName
        ruleFormRef.value?.validate()
      }, 10)
    }
  })
}

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number | undefined) => {
  if (!cityId) return
  formData.companyId = undefined
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

watch([() => formData.commissionType, () => formData.commissionValue], () => {
  // if (formData.comnanyItemExcitationRuleId) return
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
  formData.ruleName = `公司服务${S1}${S2}激励规则`
  ruleFormRef.value?.validateField('ruleName')
})

const factoreMap = ref<Map<string, any>>(new Map())
const radioList = [
  { value: 'operServiceItemDetailInputs', name: '适用指定激励服务' },
  { value: 'empRelateList', name: '适用指定组织员工' },
  { value: 'serviceAreaRelateList', name: '适用指定服务区域' },
  { value: 'orderLabel', name: '适用订单标签' }
]
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
  // for (let v of factoreMap.value.entries()) {
  //   if (v && v[1].length > 0) {
  //     return true
  //   }
  // }
  // return false
}
const CommonModalRef: any = ref<InstanceType<typeof CommonModal>>()
const addFactor = () => {
  CommonModalRef.value.openModal()
}
const deleteFactor = (
  type:
    | 'operServiceItemDetailInputs'
    | 'empRelateList'
    | 'serviceAreaRelateList'
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
// 添加服务项目
const ServiceItemCompanyListRef =
  ref<InstanceType<typeof ServiceItemCompanyList>>()
const addServiceItem = () => {
  ServiceItemCompanyListRef.value?.toggleDialogStatus('overlay')
}
const deleteServiceItem = (row: OperServiceItemDetailInputs) => {
  const operServiceItemDetailInputs = factoreMap.value
    .get('operServiceItemDetailInputs')
    .filter((item: any) => item.serviceItemId !== row.serviceItemId)
  factoreMap.value.set(
    'operServiceItemDetailInputs',
    operServiceItemDetailInputs
  )
}
const onSelectedService = (val: OperServiceItemDetailInputs[]) => {
  factoreMap.value.set('operServiceItemDetailInputs', val)
}

// 添加组织人员
const EmpListRef = ref<InstanceType<typeof EmpList>>()
const addEmp = () => {
  EmpListRef.value?.toggleDialogStatus('serviceItem')
}
const deleteEmp = (row: EmpRelateList) => {
  const empRelateList = factoreMap.value
    .get('empRelateList')
    .filter((item: any) => item.empId !== row.empId)
  factoreMap.value.set('empRelateList', empRelateList)
}
const onSelectedEmp = (val: EmpRelateList[]) => {
  factoreMap.value.set('empRelateList', val)
}

// 添加服务区域
const AreaListRef = ref<InstanceType<typeof AreaList>>()
const addArea = () => {
  AreaListRef.value?.toggleDialogStatus('serviceItem')
}
const deleteArea = (row: ServiceAreaRelateList) => {
  const serviceAreaRelateList = factoreMap.value
    .get('serviceAreaRelateList')
    .filter((item: any) => item.serviceAreaId !== row.serviceAreaId)
  factoreMap.value.set('serviceAreaRelateList', serviceAreaRelateList)
}
const onSelectedArea = (val: ServiceAreaRelateList[]) => {
  factoreMap.value.set('serviceAreaRelateList', val)
}
const orderLabelChange = (val: OrderLabel[]) => {
  factoreMap.value.set('orderLabel', val)
}
// 拦截城市公司ID的更改, 目前没发现别的好办法, 这种方式还是比较繁琐
// 繁琐的点在于新建与编辑初始化的过程中要注意与副作用的先后顺序
// 不然会提前触发副作用
const useCompanyIdCustomRef = (value: number | undefined) => {
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        if (hasFactorItem()) {
          if (newValue === formData.companyId) return
          ElMessageBox.confirm(
            '切换城市/公司将清除下方已选规则限定条件,确认则清除',
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
              companyChange()
              trigger()
              value = newValue
            })
            .catch(() => {})
        } else {
          trigger()
          value = newValue
          formData.companyId = newValue
          if (!formData.comnanyItemExcitationRuleId) {
            companyChange()
          }
        }
      }
    }
  })
}
const companyIdCustomRef = useCompanyIdCustomRef(formData.companyId)
const useCityIdCustomRef = (value: number | undefined) => {
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
            '切换城市/公司将清除下方已选规则限定条件,确认则清除',
            '温馨提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              factoreMap.value.clear()
              formData.cityId = newValue
              companyIdCustomRef.value = undefined
              cityIdChange(newValue)
              trigger()
              value = newValue
            })
            .catch(() => {})
        } else {
          trigger()
          value = newValue
          formData.cityId = newValue
          companyIdCustomRef.value = undefined
          cityIdChange(newValue)
        }
      }
    }
  })
}
const cityIdCustomRef = useCityIdCustomRef(formData.cityId)

const dialogShow = ref(false)
const toggleDialogStatus = (
  comnanyItemExcitationRuleId?: number,
  companyId?: number
) => {
  if (!dialogShow.value) {
    // 打开操作
    if (comnanyItemExcitationRuleId && companyId) {
      // 编辑操作
      formData.comnanyItemExcitationRuleId = comnanyItemExcitationRuleId
      initEdit(companyId)
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
