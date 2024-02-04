<template>
  <div class="root">
    <el-dialog
      class="custom-dialog"
      v-model="dialogShow"
      :title="`${
        formData.companyOrderLevelExcitationRuleId ? '编辑' : '新建'
      }订单激励规则`"
      fullscreen
      :before-close="toggleDialogStatus"
    >
      <el-form
        :inline="true"
        :model="formData"
        :rules="rules"
        ref="ruleFormRef"
      >
        <div class="module-box">
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
              v-model="formData.cityId"
              :disabled="formData.companyOrderLevelExcitationRuleId"
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
          <el-form-item label="服务公司" prop="companyId">
            <el-select
              v-model="formData.companyId"
              :disabled="formData.companyOrderLevelExcitationRuleId"
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
          <el-form-item label="激励类型" prop="commissionType">
            <el-select v-model="formData.commissionType" placeholder="激励类型">
              <el-option
                v-for="item in excitationTypeList"
                :label="item.commissionName"
                :value="item.commissionType"
                :key="item.commissionType"
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
              <template #append>元/单</template>
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
          <div class="module-box-desc">3.适用订单标签</div>
          <el-form-item label="订单类型" prop="orderClassify">
            <el-select v-model="formData.orderClassify" placeholder="订单类型">
              <el-option
                v-for="item in orderClassifyList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="订单标签" prop="orderLabelIdName">
            <el-select
              v-model="formData.orderLabelIdName"
              filterable
              remote
              reserve-keyword
              placeholder="请输入标签编码"
              :remote-method="remoteMethod"
              :loading="selectRemote.loading"
            >
              <el-option
                v-for="item in selectRemote.options"
                :key="item.orderLabelId"
                :label="`${item.orderLabelCode}-${item.orderLabelName}`"
                :value="`${item.orderLabelId}@${item.orderLabelCode}@${item.orderLabelName}`"
              />
            </el-select>
            <!-- <span
              style="
                display: inline-block;
                font-size: 12px;
                margin-left: 8px;
                color: #f50;
              "
              >{{ selectRemote.msg }}</span
            > -->
          </el-form-item>
        </div>
      </el-form>
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
import { ref, reactive, onMounted, toRef } from 'vue'
import { GetCompanyList } from '@/webapi/common'
import { AddRule, EditRule, RuleDetail } from '@/webapi/other'
import type { AddRuleRequest } from '@/webapi/other'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { CompanyItem } from '@/store/modules/common'
import { useRemoteSearchOrderLabel } from '@/hooks/useRemoteSearch'

const emit = defineEmits(['isConfirm'])
const commonStore = useCommon()
const { cityList } = storeToRefs(commonStore)
const excitationTypeList = [
  {
    commissionName: '固定激励',
    commissionType: 11
  }
]
const orderClassifyList = [
  {
    id: 11,
    name: '上门订单'
  }
  // {
  //   id: 12,
  //   name: '集市订单'
  // }
]
const formData = reactive<
  AddRuleRequest & {
    orderLabelIdName: string
  }
>({
  cityId: undefined,
  companyId: undefined,
  ruleName: '',
  orderClassify: 11,
  commissionType: 11,
  commissionValue: undefined,
  orderLabelId: '',
  orderTagName: '',
  orderLabelCode: '',
  orderLabelIdName: ''
})
const { remoteMethod, selectRemote } = useRemoteSearchOrderLabel(
  toRef(formData, 'orderClassify')
)
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
  orderLabelIdName: [
    {
      required: true,
      message: '请选择订单标签',
      trigger: 'change'
    }
  ],
  commissionValue: [
    {
      validator: (rule: any, value: any, callback: any) => {
        const reg1 = /^[0-9]+\.{0,1}[0-9]{0,2}$/
        const val = parseFloat(value)
        if (!value) {
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
        }
        callback()
      },
      required: true,
      trigger: 'blur'
    }
  ]
})

onMounted(() => {})
const init = () => {
  formData.companyOrderLevelExcitationRuleId = undefined
  companyList.value = []
  selectRemote.options = []
}

const initEdit = (companyId: number) => {
  const { companyOrderLevelExcitationRuleId } = formData
  RuleDetail({
    companyOrderLevelExcitationRuleId,
    companyId
  }).then(res => {
    if (res.code === 200) {
      cityIdChange(res.data.cityId)
      remoteMethod(res.data.orderLabelCode)
      formData.ruleName = res.data.ruleName
      formData.cityId = res.data.cityId
      formData.companyId = res.data.companyId
      formData.commissionType = res.data.commissionType
      formData.commissionValue = res.data.commissionValue
      formData.orderLabelId = res.data.orderLabelId
      formData.orderTagName = res.data.orderLabelName
      formData.orderLabelCode = res.data.orderLabelCode
      formData.orderClassify = res.data.orderClassify
      formData.orderLabelIdName = `${res.data.orderLabelId}@${res.data.orderLabelCode}@${res.data.orderLabelName}`
    }
  })
}

const saveLoading = ref(false)
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  saveLoading.value = true
  await formEl.validate(valid => {
    if (valid) {
      const [orderLabelId, orderLabelCode, orderTagName] =
        formData.orderLabelIdName.split('@')
      getSaveAPi()({
        ...formData,
        orderLabelId,
        orderTagName,
        orderLabelCode
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
        } else {
          ElMessage({
            message: res.message,
            type: 'error'
          })
        }
      })
    } else {
      saveLoading.value = false
    }
  })
}

const getSaveAPi = () => {
  return formData.companyOrderLevelExcitationRuleId ? EditRule : AddRule
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

const dialogShow = ref(false)
const toggleDialogStatus = (ruleId?: number, companyId?: number) => {
  if (!dialogShow.value) {
    // 打开操作
    setTimeout(() => {
      ruleFormRef.value?.resetFields()
    }, 0)
    if (ruleId && companyId) {
      // 编辑操作
      formData.companyOrderLevelExcitationRuleId = ruleId
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
    height: calc(100vh - 156px);
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
