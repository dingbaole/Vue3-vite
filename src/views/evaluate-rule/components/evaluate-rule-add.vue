<template>
  <el-dialog
    v-model="dialogShow"
    title="设置评价激励系数"
    width="60%"
    :before-close="toggleDialogStatus"
  >
    <el-alert
      style="width: 400px; margin-bottom: 20px"
      title="服务工单评价后，根据工单项目激励总额进行评价系数激励"
      type="warning"
      :closable="false"
    />
    <el-form
      label-position="right"
      label-width="100px"
      style="max-width: 560px"
      :model="currentInfo"
      :rules="rules"
      ref="ruleFormRef"
    >
      <el-form-item label="城市:">
        {{ cityName }}
      </el-form-item>
      <el-form-item label="公司:">
        {{ companyName }}
      </el-form-item>
      <el-form-item label="评价星级:">
        {{ currentInfo.evaluateStar }}
      </el-form-item>

      <el-form-item label="评价系数:" prop="commissionValue">
        <div style="display: flex">
          <el-input style="width: 200px" v-model="currentInfo.commissionValue">
            <template #append>%</template>
          </el-input>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="toggleDialogStatus">取消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirm"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EvaluateRuleEdit } from '@/webapi/serviceItem'
import { ElMessage } from 'element-plus'
import { useFormRulesEvaluate } from '@/hooks/useFormRule'

const { ruleFormRef, rules } = useFormRulesEvaluate()
const props = defineProps<{
  currentInfo: any
  cityName: string
  companyName: string
}>()

const currentInfo = ref<any>({
  evaluateStar: undefined,
  commissionValue: undefined
})
const init = () => {
  currentInfo.value = JSON.parse(JSON.stringify(props.currentInfo))
  setTimeout(() => {
    ruleFormRef.value.validateField('commissionValue')
  }, 100)
}

const confirmLoading = ref(false)
const emit = defineEmits(['isConfirm'])
const confirm = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      confirmLoading.value = true
      EvaluateRuleEdit({ ...currentInfo.value }).then(res => {
        confirmLoading.value = false
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '保存成功'
          })
          emit('isConfirm')
          setTimeout(() => {
            toggleDialogStatus()
          }, 500)
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

const dialogShow = ref(false)
const toggleDialogStatus = () => {
  if (!dialogShow.value) {
    setTimeout(() => {
      init()
    }, 0)
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss"></style>
