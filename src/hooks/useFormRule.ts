import type { FormInstance, FormRules } from 'element-plus'
import { ref, reactive, type UnwrapNestedRefs } from 'vue'
import type { Ref } from 'vue'
import dayjs from 'dayjs'

export const useFormRulesRedress = (): {
  ruleFormRef: Ref<FormInstance>
  rules: FormRules
  resetForm: () => void
} => {
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
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
    empId: [
      {
        required: true,
        message: '请选择员工',
        trigger: 'change'
      }
    ],
    redressType: [
      {
        required: true,
        message: '请选择调整类型',
        trigger: 'change'
      }
    ],
    redressAmount: [
      {
        validator: (rule: any, value: any, callback: any) => {
          const reg =
            /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/
          if (!value) {
            callback(new Error('请输入调整金额'))
          }
          if (!reg.test(value)) {
            callback(
              new Error('调整金额只能输入正数，整数不超过九位，小数不超过两位')
            )
          } else {
            callback()
          }
        },
        required: true,
        trigger: 'blur'
      }
    ],
    remark: [{ required: true, message: '请填写调整原因', trigger: 'blur' }]
  })

  const resetForm = () => {
    ruleFormRef.value.resetFields()
  }
  return {
    ruleFormRef,
    rules,
    resetForm
  }
}

export const useFormRulesEvaluate = (): {
  ruleFormRef: Ref<FormInstance>
  rules: FormRules
  resetForm: () => void
} => {
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    commissionValue: [
      {
        validator: (rule: any, value: any, callback: any) => {
          const reg = /^(0|[1-9]\d{0,2}|-[1-9]\d{0,2})$/
          if (value === '') {
            callback(new Error('请输入评价系数'))
          }
          if (!reg.test(value)) {
            callback(new Error('仅允许输入数字, 最多3位整数'))
          } else {
            callback()
          }
        },
        required: true,
        trigger: 'blur'
      }
    ]
  })

  const resetForm = () => {
    ruleFormRef.value.resetFields()
  }
  return {
    ruleFormRef,
    rules,
    resetForm
  }
}

export const useFormRules = (
  rule?: any
): {
  ruleFormRef: Ref<FormInstance>
  rules: FormRules
  resetForm: () => void
} => {
  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
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
    ...rule
  })
  const resetForm = () => {
    ruleFormRef.value.resetFields()
  }
  return {
    ruleFormRef,
    rules,
    resetForm
  }
}

export const useFormRulesOverlay = <
  T extends { startDateTime?: any; commissionType?: any }
>(
  formData: UnwrapNestedRefs<T>
): {
  ruleFormRef: Ref<FormInstance>
  rules: FormRules
  resetForm: () => void
} => {
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
    startDateTime: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            callback()
          } else {
            callback(new Error(`请选择有效日期时间!`))
          }
        },
        required: true,
        trigger: 'change'
      }
    ],
    endDateTime: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            if (
              formData.startDateTime &&
              !(
                dayjs(value).valueOf() > dayjs(formData.startDateTime).valueOf()
              )
            ) {
              callback(new Error(`结束时间必须晚于开始时间!`))
            }
            const S = dayjs().unix()
            const E = dayjs(value).unix()
            const isEndBeforeStart = E - S < 600
            if (isEndBeforeStart) {
              callback(new Error(`结束时间必须晚于当前系统时间十分钟`))
            }
            callback()
          } else {
            callback(new Error(`请选择有效日期时间!`))
          }
        },
        required: true,
        trigger: 'change'
      }
    ],
    commissionValue: [
      {
        validator: (rule: any, value: any, callback: any) => {
          const reg1 = /^[0-9]+\.{0,1}[0-9]{0,2}$/
          const reg2 = /^-?[0-9]+\.{0,1}[0-9]{0,2}$/
          const val = parseFloat(value)
          const str =
            formData.commissionType === 21
              ? '定额'
              : formData.commissionType === 22
              ? '系数'
              : ''
          if (value === '') {
            callback(new Error(`请输入激励${str}`))
          } else if (formData.commissionType === 21 && !reg2.test(value)) {
            callback(new Error(`只能输入数字并且不能超过两位小数`))
          } else if (formData.commissionType === 22 && !reg2.test(value)) {
            callback(new Error(`只能输入正数并且不能超过两位小数`))
          } else if (
            formData.commissionType === 21 ||
            formData.commissionType === 22
          ) {
            if (val > 9999) {
              callback(new Error(`叠加${str}: 激励${str}上限9999`))
            }
            callback()
          } else {
            callback()
          }
        },
        required: true,
        trigger: 'blur'
      }
    ]
  })
  const resetForm = () => {
    ruleFormRef.value?.resetFields()
  }
  return {
    ruleFormRef,
    rules,
    resetForm
  }
}
