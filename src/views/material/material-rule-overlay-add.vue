<template>
  <div class="root">
    <el-dialog
      class="custom-dialog"
      v-model="dialogShow"
      :title="`${
        formData.comnanyMaterialExcitationRuleId ? '编辑' : '新建'
      }激励叠加规则`"
      fullscreen
      :before-close="toggleDialogStatus"
    >
      <template #header>
        <div class="title" style="display: flex; align-items: center">
          <span style="font-size: 18px">{{
            `${
              formData.comnanyMaterialExcitationRuleId ? '编辑' : '新建'
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
            title="自动格式生成，可再编辑。自动生成名称格式：公司物料配件+“激励类型”+激励标准+激励规则。最大长度30个文字"
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
              :disabled="!!formData.comnanyMaterialExcitationRuleId"
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
              :disabled="!!formData.comnanyMaterialExcitationRuleId"
              v-model="companyIdCustomRef"
              @change="companyChange"
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
        </div>
        <div class="module-box">
          <div class="module-box-desc">2.激励规则</div>
          <el-alert
            v-if="formData.commissionType === 21"
            style="width: 544px; margin-bottom: 20px"
            title="示例：物料实收价100.00元，激励基础规则10.00%，叠加定额为2元/件，   
                  最终员工获得该物料的激励金额=100.00*10.00%+2=12.00元。"
            type="warning"
            :closable="false"
          />
          <el-alert
            v-if="formData.commissionType === 22"
            style="width: 544px; margin-bottom: 20px"
            title="示例：物料实收价100.00元，激励基础规则10.00%，叠加系数为0.5，   
                  最终员工获得该物料的激励金额=100.00*10.00%*(1+0.5)=15.00元。"
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
            v-if="factoreMap.has('operMaterialDetailInputList')"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <span>限定条件: 适用指定激励物料配件</span>
                <el-button
                  style="margin-left: 18px"
                  size="small"
                  type="primary"
                  @click="addMaterial"
                >
                  添加指定激励物料配件
                </el-button>
              </div>
              <el-button
                type="text"
                @click="deleteFactor('operMaterialDetailInputList')"
              >
                删除条件
              </el-button>
            </div>
            <TableWithFakePagination
              :data="factoreMap.get('operMaterialDetailInputList')"
              border
              style="width: 100%; margin-top: 15px"
            >
              <el-table-column
                property="materialNo"
                label="物料号"
                width="100"
              />
              <el-table-column property="materialName" label="物料名称" />
              <el-table-column
                property="price"
                label="物料单价(元)"
                width="105"
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
                  <el-button type="text" @click="deleteMarterial(scope.row)"
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
            :mode="'material'"
            :order-label-list="factoreMap.get('orderLabel')"
            @change="orderLabelChange"
            @is-remove-panel="deleteFactor('orderLabel')"
          />
        </div>
      </el-form>
      <MaterialCompanyList
        :cityId="formData.cityId"
        :companyId="formData.companyId"
        :operMaterialDetailInputList="
          factoreMap.get('operMaterialDetailInputList')
        "
        @onSelected="onSelectedMaterial"
        ref="MaterialCompanyListRef"
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
import { ref, reactive, watch, customRef } from 'vue'
import OrderLabelPanel from '@/components/orderLabelPanel/order-label-panel.vue'
import type { OrderLabel } from '@/components/orderLabelPanel/types'
import TableWithFakePagination from '@/components/tableWithFakePagination/tableWithFakePagination.vue'
import MaterialCompanyList from './components/material-company-list.vue'
import EmpList from '@/components/empList/empList.vue'
import AreaList from '@/components/areaList/areaList.vue'
import CommonModal from '@/components/commonModal/commonModal.vue'
import { GetCompanyList } from '@/webapi/common'
import {
  AddSaveOverlayRule,
  EditSaveOverlayRule,
  QueryOverlayRule
} from '@/webapi/material'
import type {
  OperMaterialDetailInputList,
  ISaveOverlayRule,
  ServiceAreaRelateList,
  EmpRelateList
} from '@/webapi/material'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { useFormRulesOverlay } from '@/hooks/useFormRule'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { richRuleName } from '@/utils'
import dayjs from 'dayjs'

const commonStore = useCommon()
const { cityList, excitationTypeOverlayList } = storeToRefs(commonStore)
const emit = defineEmits(['isConfirm'])
const formData = reactive<ISaveOverlayRule>({
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
      saveBaseRule()
    } else {
      saveLoading.value = false
    }
  })
}

const returnSaveApi = () => {
  return formData.comnanyMaterialExcitationRuleId
    ? EditSaveOverlayRule
    : AddSaveOverlayRule
}

const saveBaseRule = () => {
  const empRelateList = factoreMap.value.get('empRelateList')
  const operMaterialDetailInputList = factoreMap.value.get(
    'operMaterialDetailInputList'
  )
  const serviceAreaRelateList = factoreMap.value.get('serviceAreaRelateList')

  formData.empRelateType = empRelateList?.length > 0 ? 11 : 10
  formData.empRelateList = empRelateList ? empRelateList : []
  formData.materialRelateType =
    operMaterialDetailInputList?.length > 0 ? 11 : 10
  formData.operMaterialDetailInputList = operMaterialDetailInputList
    ? operMaterialDetailInputList
    : []
  formData.serviceAreaRelateType = serviceAreaRelateList?.length > 0 ? 11 : 10
  formData.serviceAreaRelateList = serviceAreaRelateList
    ? serviceAreaRelateList
    : []
  const orderLabelInputList = factoreMap.value.get('orderLabel')
  formData.orderLabelRelateType = orderLabelInputList?.length > 0 ? 11 : 10
  formData.addMaterialOrderLabelInputList = orderLabelInputList ?? []
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

const init = () => {
  setTimeout(() => {
    factoreMap.value?.clear()
    ruleFormRef.value?.resetFields()
    formData.commissionValue = ''
    formData.comnanyMaterialExcitationRuleId = undefined
    formData.operMaterialDetailInputList = []
    companyIdCustomRef.value = undefined
    cityIdCustomRef.value = undefined
    companyList.value = []
  }, 0)
}

const initEdit = (companyId: number) => {
  factoreMap.value?.clear()
  const { comnanyMaterialExcitationRuleId } = formData
  QueryOverlayRule({
    comnanyMaterialExcitationRuleId,
    companyId
  }).then(res => {
    if (res.code === 200) {
      // cityIdChange(res.data.cityId)
      formData.cityId = res.data.cityId
      formData.companyId = res.data.companyId
      formData.ruleGroup = res.data.ruleGroup
      cityIdCustomRef.value = res.data.cityId
      companyIdCustomRef.value = res.data.companyId
      formData.commissionType = res.data.commissionType
      formData.commissionValue = res.data.commissionValue
      if (res.data.empRelateType === 11) {
        factoreMap.value.set('empRelateList', res.data.empRelateList)
      }
      if (res.data.serviceAreaRelateType === 11) {
        factoreMap.value.set(
          'serviceAreaRelateList',
          res.data.serviceAreaRelateList
        )
      }
      if (res.data.materialRelateType === 11) {
        factoreMap.value.set(
          'operMaterialDetailInputList',
          res.data.materialDetailOutputs
        )
      }
      if (res.data.orderLabelRelateType === 11) {
        factoreMap.value.set('orderLabel', res.data.orderLabelList)
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
const cityIdChange = (cityId: number) => {
  if (!cityId) return
  formData.companyId = undefined
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}
const commissionTypeChange = () => {
  ruleFormRef.value?.validateField('commissionValue')
}

const companyChange = () => {
  ruleFormRef.value?.validateField('commissionValue')
}

watch([() => formData.commissionType, () => formData.commissionValue], () => {
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
  formData.ruleName = `公司物料配件${S1}${S2}激励规则`
  ruleFormRef.value?.validateField('ruleName')
})

type FactoreMapKey =
  | 'operMaterialDetailInputList'
  | 'empRelateList'
  | 'serviceAreaRelateList'
  | 'orderLabel'
const factoreMap = ref<Map<FactoreMapKey, any>>(new Map())

const radioList = [
  { value: 'operMaterialDetailInputList', name: '适用指定激励物料配件' },
  { value: 'empRelateList', name: '适用指定组织员工' },
  { value: 'serviceAreaRelateList', name: '适用指定服务区域' },
  { value: 'orderLabel', name: '适用订单标签' }
]
const radioListConfirm = (selected: FactoreMapKey) => {
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
const deleteFactor = (type: FactoreMapKey) => {
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
const orderLabelChange = (val: OrderLabel[]) => {
  factoreMap.value.set('orderLabel', val)
}
const MaterialCompanyListRef =
  ref<InstanceType<typeof MaterialCompanyList>>(null)
const addMaterial = () => {
  MaterialCompanyListRef.value.toggleDialogStatus('overlay')
}
const deleteMarterial = (row: OperMaterialDetailInputList) => {
  const operMaterialDetailInputList = factoreMap.value
    .get('operMaterialDetailInputList')
    .filter((item: any) => item.materialId !== row.materialId)
  factoreMap.value.set(
    'operMaterialDetailInputList',
    operMaterialDetailInputList
  )
}
const onSelectedMaterial = (val: OperMaterialDetailInputList[]) => {
  factoreMap.value.set('operMaterialDetailInputList', val)
}
// 添加组织人员
const EmpListRef = ref<InstanceType<typeof EmpList>>()
const addEmp = () => {
  EmpListRef.value?.toggleDialogStatus('material')
}
const deleteEmp = (row: EmpRelateList) => {
  const empRelateList = factoreMap.value
    .get('empRelateList')
    .filter((item: any) => item.empId !== row.empId)
  console.log(empRelateList)

  factoreMap.value.set('empRelateList', empRelateList)
}
const onSelectedEmp = (val: EmpRelateList[]) => {
  factoreMap.value.set('empRelateList', val)
}

// 添加服务区域
const AreaListRef = ref<InstanceType<typeof AreaList>>()
const addArea = () => {
  AreaListRef.value?.toggleDialogStatus('material')
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

// 拦截城市公司ID的更改，目前没发现别的好办法，这种方式还是比较繁琐
// 繁琐的点在于新建与编辑初始化的过程中要注意与副作用的先后顺序
// 不然会提前触发副作用
const useCompanyIdCustomRef = (value: number) => {
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
          if (!formData.comnanyMaterialExcitationRuleId) {
            companyChange()
          }
        }
      }
    }
  })
}
const companyIdCustomRef = useCompanyIdCustomRef(formData.companyId)
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
  comnanyMaterialExcitationRuleId?: number,
  companyId?: number
) => {
  if (!dialogShow.value) {
    // 打开操作
    if (comnanyMaterialExcitationRuleId && companyId) {
      // 编辑操作
      formData.comnanyMaterialExcitationRuleId = comnanyMaterialExcitationRuleId
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
