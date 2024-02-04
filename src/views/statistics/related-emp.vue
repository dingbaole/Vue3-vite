<template>
  <div class="form-list">
    <el-form :inline="true" :model="formList" ref="ruleFormRef">
      <div class="form-wrapper" v-for="(item, index) in formList" :key="index">
        <el-form-item
          label="激励人名"
          :prop="[index, 'promoterName']"
          :rules="rule.promoterName"
        >
          <el-input
            v-model="item.promoterName"
            placeholder="输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="人员角色"
          :prop="[index, 'roleName']"
          :rules="rule.roleName"
        >
          <el-input v-model="item.roleName" placeholder="请输入"> </el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          :prop="[index, 'mobileNo']"
          :rules="rule.mobileNo"
        >
          <el-input v-model="item.mobileNo" placeholder="请输入"> </el-input>
        </el-form-item>
        <el-button
          style="margin-left: 15px"
          type="text"
          v-if="formList.length > 1"
          @click="deleteItem(index)"
          >删除</el-button
        >
      </div>
      <el-button type="primary" plain @click="addItem">添加</el-button>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { RelatedEmp } from '@/webapi/statistics'
import { ElMessage } from 'element-plus'

const defaultItem = {
  roleName: '',
  promoterName: '',
  mobileNo: ''
}
const deleteItem = (index: number) => {
  formList.value.splice(index, 1)
}
const addItem = () => {
  if (formList.value.length > 9) {
    ElMessage({
      type: 'warning',
      message: '最多可添加10条信息'
    })
    return
  }
  formList.value.push({ ...defaultItem })
}
const formList = ref<Array<RelatedEmp>>([])
const ruleFormRef = ref<FormInstance>()
const rule: FormRules = {
  roleName: [{ required: true, message: '请输入人员角色' }],
  promoterName: [{ required: true, message: '请输入激励人名' }],
  mobileNo: [
    {
      validator: (rule: any, value: any, callback: any) => {
        const reg =
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if (!value) {
          callback(new Error(`请输入手机号`))
        } else if (!reg.test(value)) {
          callback(new Error(`请输入有效的手机号`))
        } else if (isRepeat(formList.value).includes(value)) {
          callback(new Error(`存在重复手机号`))
        }
        callback()
      },
      required: true
    }
  ]
}
onMounted(() => {
  formList.value.push({ ...defaultItem })
})

const isRepeat = (list: RelatedEmp[]) => {
  const relatedMap: {
    [key: string]: number
  } = {}
  list.forEach(item => {
    if (!relatedMap[item.mobileNo]) {
      relatedMap[item.mobileNo] = 1
    } else {
      relatedMap[item.mobileNo]++
    }
  })
  const arr: string[] = []
  for (const v in relatedMap) {
    if (relatedMap[v] > 1) {
      arr.push(v)
    }
  }
  return arr
}

const confirm = async () => {
  const valid = await ruleFormRef.value.validate()
  if (valid) {
    return formList.value
  }
}
defineExpose({
  confirm
})
</script>
<style scoped lang="scss">
.form-wrapper {
  border: 1px dashed #ddd;
  padding: 20px 8px;
  margin-bottom: 8px;
  ::v-deep(.el-form-item) {
    margin: 0;
    margin-right: 10px;
  }
}
</style>
