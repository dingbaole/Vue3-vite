<template>
  <div class="recommend-material-list-modal">
    <el-dialog
      class="custom-dialog"
      v-model="dialogShow"
      title="手动匹配其他物料"
      width="700px"
      top="10vh"
      destroy-on-close
      :before-close="toggleDialogStatus"
    >
      <RecommendMaterialList
        :companyId="manualMaterialConfig.companyId"
        :materialNo="manualMaterialConfig.materialNo"
        :material-id="manualMaterialConfig.materialId"
        :companyUnconfigExcitationMaterialItemId="
          manualMaterialConfig.companyUnconfigExcitationMaterialItemId
        "
        ref="RecommendMaterialListRef"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toggleDialogStatus">取消</el-button>
          <!-- <el-button type="primary" @click="confirm" :loading="confirmLoading">
            应用已选物料激励规则
          </el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import RecommendMaterialList from './components/recommend-material-list.vue'
import { ref, provide, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const RecommendMaterialListRef =
  ref<InstanceType<typeof RecommendMaterialList>>()
const confirmLoading = ref(false)
const confirm = () => {
  confirmLoading.value = true
  RecommendMaterialListRef.value
    ?.submit()
    .then(res => {
      confirmLoading.value = false
      ElMessage(res)
      setTimeout(() => {
        toggleDialogStatus()
      }, 500)
    })
    .catch(err => {
      confirmLoading.value = false
      ElMessage({
        type: 'error',
        message: err.message ?? err
      })
    })
}

const manualMaterialConfig = reactive({
  companyId: undefined,
  materialId: undefined,
  materialNo: undefined,
  companyUnconfigExcitationMaterialItemId: undefined
})
const dialogShow = ref(false)
const toggleDialogStatus = (
  companyId?: number,
  materialId?: number,
  materialNo?: string,
  companyUnconfigExcitationMaterialItemId?: number
) => {
  if (!dialogShow.value && companyId) {
    manualMaterialConfig.companyId = companyId
    manualMaterialConfig.materialId = materialId
    manualMaterialConfig.materialNo = materialNo
    manualMaterialConfig.companyUnconfigExcitationMaterialItemId =
      companyUnconfigExcitationMaterialItemId
  }
  dialogShow.value = !dialogShow.value
}

const closeAndConfirm = () => {
  emit('isConfirm')
  toggleDialogStatus()
}
provide('cac', closeAndConfirm)
const emit = defineEmits(['isConfirm'])
defineExpose({
  toggleDialogStatus
})
</script>
<style scoped lang="scss">
.recommend-material-list-modal {
}
</style>
