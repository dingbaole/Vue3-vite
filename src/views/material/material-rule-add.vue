<template>
  <el-dialog
    v-model="dialogShow"
    :title="`${
      formData.comnanyMaterialExcitationRuleId ? '编辑' : '新建'
    }激励基础规则`"
    fullscreen
    :before-close="toggleDialogStatus"
  >
    <template #header>
      <div class="title" style="display: flex; align-items: center">
        <span style="font-size: 18px">
          {{
            `${
              formData.comnanyMaterialExcitationRuleId ? '编辑' : '新建'
            }激励基础规则`
          }}
        </span>
        <el-alert
          style="width: 420px; margin-left: 20px"
          title="公司开通使用燃气供应链后，可在此处设置物料配件激励规则"
          type="error"
          :closable="false"
        />
      </div>
    </template>
    <el-form :inline="true" :model="formData" :rules="rules" ref="ruleFormRef">
      <div class="module-box">
        <el-alert
          style="width: 720px; margin-bottom: 20px; padding-left: 0"
          title="自动格式生成，可再编辑。自动生成名称格式：公司物料配件+“激励类型”+激励标准+激励规则。最大长度30个文字"
          type="warning"
          :closable="false"
        />
        <div class="module-box-desc">
          <div style="flex-shrink: 0">激励基础规则名称</div>
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
            :disabled="formData.comnanyMaterialExcitationRuleId"
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
            :disabled="formData.comnanyMaterialExcitationRuleId"
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
        <el-form-item label="激励类型" prop="commissionType">
          <el-select
            v-model="formData.commissionType"
            @change="commissionTypeChange"
            placeholder="激励类型"
          >
            <el-option
              v-for="item in excitationTypeList"
              :key="item.commissionType"
              :label="item.commissionName"
              :value="item.commissionType"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.commissionType"
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
      <div class="module-box">
        <div class="module-box-desc">
          3.适用物料范围
          <el-button
            class="module-box-desc__button"
            type="primary"
            :disabled="!formData.cityId || !formData.companyId"
            @click="addMarterial"
          >
            添加激励物料配件
          </el-button>
        </div>
        <el-table
          :data="formData.operMaterialDetailInputList"
          border
          style="width: 100%; margin-top: 15px"
        >
          <el-table-column property="materialNo" label="物料号" width="100" />
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
          <el-table-column fixed="right" label="操作" width="80" align="center">
            <template #default="scope">
              <el-button type="text" @click="deleteMarterial(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="module-box">
        <div class="module-box-desc">
          4.可使用激励物料的服务范围
          <el-button
            class="module-box-desc__button"
            type="primary"
            :disabled="
              !formData.cityId ||
              !formData.companyId ||
              formData.operMaterialDetailInputList.length === 0
            "
            @click="addServiceItem"
          >
            添加服务项目
          </el-button>
          <!-- <el-button
            class="module-box-desc__button"
            type="primary"
            @click="addServiceItem"
          >
            添加服务项目
          </el-button> -->
        </div>
        <el-alert type="warning" :closable="false">
          说明：非必选，不选择指定服务项目时，即在任何服务项目下使用激励物料时，系统都计算物料激励。
        </el-alert>
        <el-table
          :data="formData.serviceItemRelationInputList"
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
          >
            <template #default="scope">
              {{ scope.row.serviceFee ?? '--' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="80" align="center">
            <template #default="scope">
              <el-button type="text" @click="deleteServiceItem(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <MaterialCompanyList
      :cityId="formData.cityId"
      :companyId="formData.companyId"
      :operMaterialDetailInputList="formData.operMaterialDetailInputList"
      @onSelected="onSelected"
      ref="MaterialCompanyListRef"
    />
    <ServiceItemCompanyList
      :cityId="formData.cityId"
      :companyId="formData.companyId"
      :operServiceItemDetailInputs="formData.serviceItemRelationInputList"
      @onSelected="onSelectedServiceItem"
      ref="serviceItemCompanyListRef"
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
</template>

<script setup lang="ts">
import { ref, reactive, watch, unref, h, customRef } from 'vue'
import MaterialCompanyList from './components/material-company-list.vue'
import ServiceItemCompanyList from '../service-item/components/service-item-company-list.vue'
import { GetCompanyList } from '@/webapi/common'
import {
  CheckBaseRule,
  AddSaveBaseRule,
  EditSaveBaseRule,
  QueryBaseRule,
  RemoveMaterialRule
} from '@/webapi/material'
import type {
  OperMaterialDetailInputList,
  ISaveBaseRule
} from '@/webapi/material'
import type { OperServiceItemDetailInputs } from '@/webapi/serviceItem'
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

const commonStore = useCommon()
const { cityList, excitationTypeList } = storeToRefs(commonStore)

const formData = reactive<ISaveBaseRule>({
  ruleGroup: 11,
  ruleName: '',
  cityId: undefined,
  companyId: undefined,
  commissionType: undefined,
  commissionValue: '',
  operMaterialDetailInputList: [],
  serviceItemRelationInputList: []
})

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
        if (
          (formData.operMaterialDetailInputList.length > 0 ||
            formData.serviceItemRelationInputList.length > 0) &&
          !formData.comnanyMaterialExcitationRuleId
        ) {
          if (newValue === formData.companyId) return
          ElMessageBox.confirm(
            '切换城市/公司将清除下方已选适用物料或服务范围,确认则清除',
            '温馨提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              formData.operMaterialDetailInputList = []
              formData.serviceItemRelationInputList = []
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
        if (
          (formData.operMaterialDetailInputList.length > 0 ||
            formData.serviceItemRelationInputList.length > 0) &&
          !formData.comnanyMaterialExcitationRuleId
        ) {
          if (newValue === formData.cityId) return
          ElMessageBox.confirm(
            '切换城市/公司将清除下方已选适用物料或服务范围,确认则清除',
            '温馨提示',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              formData.operMaterialDetailInputList = []
              formData.serviceItemRelationInputList = []
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

const deleteMarterial = (row: OperMaterialDetailInputList) => {
  formData.operMaterialDetailInputList =
    formData.operMaterialDetailInputList.filter(
      item => item.materialId !== row.materialId
    )
}

const emit = defineEmits(['isConfirm'])

const saveLoading = ref(false)
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  saveLoading.value = true
  await formEl.validate(valid => {
    if (valid) {
      if (formData.operMaterialDetailInputList.length === 0) {
        ElMessage({
          type: 'error',
          message: '请添加激励物料配件'
        })
        saveLoading.value = false
        return
      }
      if (formData.serviceItemRelationInputList.length === 0) {
        // ElMessage({
        //   type: 'error',
        //   message: '请添加可使用激励物料的服务范围'
        // })
        // saveLoading.value = false
        // return
      }
      saveBaseRule()
    } else {
      saveLoading.value = false
    }
  })
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
              '以下物料已存在其他的基础规则中，物料从其他基础规则中移除后，才可加入新的规则中。'
            ),
            h('div', {}, '确认移除吗？若忽略，则以下物料不会被继续添加。')
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
              property: 'materialName',
              label: '物料名称'
            }),
            h(ElTableColumn, {
              property: 'materialNo',
              label: '物料号'
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
        const hasInvalidaIds = hasInvalidation.map(item => item.materialId)
        formData.operMaterialDetailInputList =
          formData.operMaterialDetailInputList.filter(
            item => !hasInvalidaIds.includes(item.materialId)
          )
        if (formData.operMaterialDetailInputList.length > 0) {
          saveBaseRule()
        }
      })
      .catch((action: Action) => {
        if (action === 'cancel') {
          const invalidation = hasInvalidation.map(
            ({ comnanyMaterialExcitationRuleId, materialId, materialNo }) => {
              return {
                comnanyMaterialExcitationRuleId,
                materialId,
                materialNo,
                companyId: formData.companyId
              }
            }
          )
          RemoveMaterialRule(invalidation).then(res => {
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
  return formData.comnanyMaterialExcitationRuleId
    ? EditSaveBaseRule
    : AddSaveBaseRule
}

const saveBaseRule = () => {
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

const commissionTypeChange = () => {
  unref(ruleFormRef).validateField('commissionValue')
}

const companyChange = () => {
  unref(ruleFormRef).validateField('commissionValue')
}

const init = () => {
  setTimeout(() => {
    unref(ruleFormRef).resetFields()
    formData.commissionValue = ''
    formData.comnanyMaterialExcitationRuleId = undefined
    formData.operMaterialDetailInputList = []
    formData.serviceItemRelationInputList = []
    companyIdCustomRef.value = undefined
    cityIdCustomRef.value = undefined
    companyList.value = []
  }, 0)
}

const initEdit = (companyId: number) => {
  const { comnanyMaterialExcitationRuleId } = formData
  QueryBaseRule({
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
      formData.operMaterialDetailInputList = res.data.materialUsedRuleOutputs
      formData.serviceItemRelationInputList =
        res.data.serviceItemRelationOutputList
      setTimeout(() => {
        formData.ruleName = res.data.ruleName
        unref(ruleFormRef).validate()
      }, 10)
    }
  })
}

const onSelected = (val: OperMaterialDetailInputList[]) => {
  formData.operMaterialDetailInputList = val
}
const onSelectedServiceItem = (val: OperServiceItemDetailInputs[]) => {
  formData.serviceItemRelationInputList = val
}

const checkBaseRule = (commissionValue: number, callback: any) => {
  const { companyId, commissionType, comnanyMaterialExcitationRuleId } =
    formData
  CheckBaseRule({
    companyId,
    commissionType,
    commissionValue,
    comnanyMaterialExcitationRuleId
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
  if (!cityId) return
  formData.companyId = undefined
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

watch([() => formData.commissionType, () => formData.commissionValue], () => {
  // if (formData.comnanyMaterialExcitationRuleId) return
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
  formData.ruleName = `公司物料配件${S1}${S2}激励规则`
  unref(ruleFormRef).validateField('ruleName')
})

const serviceItemCompanyListRef =
  ref<InstanceType<typeof ServiceItemCompanyList>>()
const addServiceItem = () => {
  serviceItemCompanyListRef.value?.toggleDialogStatus('other')
}
const deleteServiceItem = (row: OperServiceItemDetailInputs) => {
  formData.serviceItemRelationInputList =
    formData.serviceItemRelationInputList.filter(
      item => item.serviceItemId !== row.serviceItemId
    )
}
const MaterialCompanyListRef = ref<InstanceType<typeof MaterialCompanyList>>()
const addMarterial = () => {
  MaterialCompanyListRef.value.toggleDialogStatus()
}

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
