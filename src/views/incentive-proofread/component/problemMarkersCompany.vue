<template>
<div class="problem-markers-company">
  <el-form :model="formData" label-position="top" ref="ruleFormRef">
    <el-form-item label="问题描述" prop="processRemark">
      <el-input
        v-model="formData.processRemark"
        placeholder="请描述未通过原因，不超过100个文字"
        maxlength="100"
        type="textarea"
        show-word-limit
        :autosize="{minRows: 4}">
      </el-input>
    </el-form-item>
  </el-form>
</div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import type { UseAction } from '@/components/dialog'
import { ProblemMarkersCompany, type CheckOrderExcitationItemInputListCompany, type RoleID } from '@/webapi/incentive-collate'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  checkOrderExcitationItemInputList: CheckOrderExcitationItemInputListCompany,
  companyId: number
  roleIds: RoleID
  useAction: UseAction
}>()

const formData = reactive({
  processRemark: ''
})

props.useAction.confirm.executor(() => {
  return ProblemMarkersCompany({
    checkOrderExcitationItemInputList: props.checkOrderExcitationItemInputList,
    companyId: props.companyId,
    processRemark: formData.processRemark,
    ...props.roleIds
  }).then(({ code, message }) => {
    if (code === 200) {
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
    } else {
      ElMessage({
        type: 'error',
        message
      })
      return Promise.reject()
    }
  })
})
</script>
<style scoped lang="scss">
.problem-markers-company {}
</style>