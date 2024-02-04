<template>
  <div class="tiered">
    <el-form :inline="true" :model="list" ref="ruleFormRef">
      <div class="tiered-wrapper" v-for="(item, index) in list" :key="index">
        <div class="tiered-item">
          <div class="tiered-item__title">阶梯 {{ index + 1 }}</div>
          <div class="tiered-item__price">
            <div class="price-a">
              <el-form-item
                :prop="[index, 'ladderNumStartValue']"
                :rules="rule.ladderNumStartValue"
              >
                <el-input
                  :disabled="mode === 'view'"
                  v-model="item.ladderNumStartValue"
                  placeholder="请输入价格"
                />
              </el-form-item>
            </div>
            <div class="price-text">{{ `≤ 成交单价 <` }}</div>
            <div class="price-b">
              <el-form-item
                :prop="[index, 'ladderNumEndValue']"
                :rules="rule.ladderNumEndValue"
              >
                <el-input
                  :disabled="mode === 'view'"
                  v-model="item.ladderNumEndValue"
                  placeholder="请输入价格"
                />
              </el-form-item>
            </div>
          </div>
          <div class="tiered-item__value">
            <el-form-item
              :label="commissionType === 11 ? '激励金额' : '激励比例'"
              :prop="[index, 'commissionValue']"
              :rules="rule.commissionValue"
              :validate="validateItem"
            >
              <el-input
                :disabled="mode === 'view'"
                v-if="commissionType === 11"
                v-model="item.commissionValue"
                placeholder="激励金额"
              >
                <template #append>元/件</template>
              </el-input>
              <el-input
                :disabled="mode === 'view'"
                v-if="commissionType === 12"
                v-model="item.commissionValue"
                placeholder="激励比例"
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="tiered-item__remark">
            <span>备注: </span>
            <el-input
              :disabled="mode === 'view'"
              v-model="item.ladderRemark"
              maxlength="30"
              show-word-limit
              :placeholder="mode === 'edit' ? '备注' : ''"
            />
          </div>
        </div>
        <div class="button-group" v-if="mode === 'edit'">
          <el-button
            type="danger"
            size="small"
            @click="deleteItem(index)"
            v-if="list.length > 1"
            >删除</el-button
          >
          <el-button
            type="success"
            size="small"
            plain
            @click="addItem"
            v-if="index === list.length - 1 && index !== 9"
            >添加</el-button
          >
        </div>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import type { TieredItem } from '@/webapi/goods'
import type { FormInstance, FormRules } from 'element-plus'

const defaultItem: TieredItem = {
  ladderStatus: 19,
  ladderNumStartValue: '',
  ladderNumEndValue: '',
  commissionValue: '',
  ladderRemark: ''
}
const props = withDefaults(
  defineProps<{
    mode?: 'edit' | 'view'
    commissionType: 11 | 12
    tieredList: TieredItem[]
  }>(),
  {
    mode: 'edit',
    commissionType: 11,
    tieredList: () => [
      {
        ladderStatus: 19,
        ladderNumStartValue: '',
        ladderNumEndValue: '',
        commissionValue: '',
        ladderRemark: ''
      }
    ]
  }
)
const { tieredList, commissionType, mode } = toRefs(props)
const ruleFormRef = ref<FormInstance>()
const rule: FormRules = {
  ladderNumStartValue: [
    {
      validator: (rule: any, value: any, callback: any) => {
        const reg1 = /^[0-9]+\.{0,1}[0-9]{0,2}$/
        const val = parseFloat(value)
        if (value === '') {
          callback(new Error(`请填写价格`))
        } else if (!reg1.test(value)) {
          callback(new Error(`仅数字且不超过两位小数`))
        } else if (val > 100000) {
          callback(new Error(`价格数值限制为0-100000`))
        }
        callback()
      },
      required: true,
      trigger: 'blur'
    }
  ],
  ladderNumEndValue: [
    {
      validator: (rule: any, value: any, callback: any) => {
        const reg1 = /^[0-9]+\.{0,1}[0-9]{0,2}$/
        const val = parseFloat(value)
        if (value === '') {
          callback(new Error(`请填写价格`))
        } else if (!reg1.test(value)) {
          callback(new Error(`仅数字且不超过两位小数`))
        } else if (val > 100000) {
          callback(new Error(`价格数值限制为0-100000`))
        }
        callback()
      },
      required: true,
      trigger: 'blur'
    }
  ],
  commissionValue: [
    {
      validator: (rule: any, value: any, callback: any) => {
        const reg1 = /^[0-9]+\.{0,1}[0-9]{0,2}$/
        const val = parseFloat(value)
        if (value === '') {
          const str =
            commissionType.value === 11
              ? '金额'
              : commissionType.value === 12
              ? '比例'
              : ''
          callback(new Error(`请输入激励${str}`))
        } else if (!reg1.test(value)) {
          callback(new Error(`仅数字且不超过两位小数`))
        } else if (commissionType.value === 11 && val === 0) {
          callback(new Error(`固定激励：激励金额不能为0`))
        } else if (commissionType.value === 11 && val > 99999) {
          callback(new Error(`固定激励：激励金额上限99999`))
        } else if (commissionType.value === 12 && val > 100) {
          callback(new Error(`比例激励：激励比例最大设置0~100.00%`))
        }
        callback()
      },
      required: true,
      trigger: 'blur'
    }
  ]
}
type Rules = { rule?: FormRules }
const list = ref<Array<TieredItem & Rules>>([])

const addItem = () => {
  if (list.value.length > 9) return
  list.value.push({ ...defaultItem })
}
const deleteItem = (index: number) => {
  list.value.splice(index, 1)
}
const getTieredList = () => {
  return list.value
}
const tieredPriceFormRef = () => {
  return ruleFormRef.value
  // ruleFormRef.value?.validate()
}
const validateItem = () => {
  // console.log(ruleFormRef.value)
}
defineExpose({
  getTieredList,
  tieredPriceFormRef,
  validateItem
})
watch(
  () => tieredList.value,
  () => {
    init()
  }
)
const init = () => {
  list.value = tieredList.value
}
init()
</script>
<style scoped lang="scss">
.tiered {
  border: 1px solid #a0cfff;
  border-radius: 4px;
  padding: 15px 10px;
  margin: 0 0px 15px 0px;
  .tiered-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
    ::v-deep(.el-form-item__error) {
      width: 225px;
    }
  }
  .button-group {
    width: 110px;
    margin-left: 15px;
  }
  .tiered-item {
    display: flex;
    align-items: center;
    border: 1px dashed #cecece;
    border-radius: 5px;
    padding: 20px 0 20px 16px;
    flex: 1;
    min-height: 46px;
    &:hover {
      border-color: #409eff;
      // border-width: 2px;
    }
    ::v-deep(.el-form-item) {
      margin: 0;
    }
    .tiered-item__title {
      width: 50px;
    }
    .tiered-item__price {
      .price-text {
        flex-shrink: 0;
        margin: 0 10px;
      }
      .price-a,
      .price-b {
        width: 100px;
        ::v-deep(input) {
          text-align: center;
        }
      }
    }
    .tiered-item__value {
      ::v-deep(input) {
        width: 60px;
      }
      ::v-deep(.el-input-group__append) {
        padding: 0 5px;
      }
    }
    .tiered-item__remark {
      flex: 1;
      ::v-deep(.el-input) {
        max-width: 100% !important;
      }
    }
    .tiered-item__value,
    .tiered-item__remark {
      span {
        flex-shrink: 0;
        margin-right: 8px;
      }
    }
    div[class^='tiered-item__'] {
      display: flex;
      align-items: center;
      margin-right: 15px;
    }
  }
}
</style>
