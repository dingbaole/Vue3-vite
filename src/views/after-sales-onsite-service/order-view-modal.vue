<template>
  <div class="order-view-dialog">
    <el-dialog
      class="custom-dialog"
      v-model="dialogShow"
      :title="title[pageType]"
      fullscreen
      destroy-on-close
      :before-close="toggleDialogStatus"
    >
      <OrderView
        ref="OrderViewRef"
        :page-type="pageType"
        :after-sale-order-no="afterSaleOrderNo"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toggleDialogStatus">{{
            pageType !== PageViewType.DETAIL ? '取消' : '关闭'
          }}</el-button>
          <el-button
            v-if="pageType !== PageViewType.DETAIL"
            type="primary"
            :loading="confirmButtonStatus.loading"
            :disabled="confirmButtonDisabled"
            @click="confirm"
            >提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, provide, reactive, computed } from 'vue'
import { PageViewType } from './types'
import OrderView from './order-view.vue'
import { ElMessage } from 'element-plus'

const afterSaleOrderNo = ref('')
const pageType = ref<PageViewType>()
const title = {
  create: '创建上门售后订单',
  audit: '上门售后单审核',
  edit: '上门售后单变更',
  detail: '上门售后单详情'
}
const OrderViewRef = ref<InstanceType<typeof OrderView>>()

const confirmButtonStatus = reactive({
  loading: false,
  disabledReason: true,
  disabledRefund: true
})
provide('confirmButtonStatus', confirmButtonStatus)
const confirmButtonDisabled = computed(() => {
  if (pageType.value === PageViewType.AUDIT) {
    return false
  }
  if (
    !confirmButtonStatus.disabledReason &&
    !confirmButtonStatus.disabledRefund
  ) {
    return false
  }
  return true
  // return !(
  //   pageType.value === PageViewType.AUDIT ||
  //   (!confirmButtonStatus.disabledReason && !confirmButtonStatus.disabledRefund)
  // )
})
const confirm = () => {
  confirmButtonStatus.loading = true
  OrderViewRef.value
    .handleData()
    .then(() => {
      confirmButtonStatus.loading = false
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
      emit('isConfirm')
      setTimeout(() => {
        toggleDialogStatus()
      }, 500)
    })
    .catch(err => {
      confirmButtonStatus.loading = false
      ElMessage({
        type: 'error',
        message: err.message ?? err
      })
    })
}
const dialogShow = ref(false)
const toggleDialogStatus = (type?: PageViewType, orderNo?: string) => {
  if (!dialogShow.value) {
    pageType.value = type
    afterSaleOrderNo.value = orderNo
  }
  dialogShow.value = !dialogShow.value
}
const emit = defineEmits(['isConfirm'])
defineExpose({
  toggleDialogStatus
})
</script>
<style scoped lang="scss">
.order-view-dialog {
  :deep(.custom-dialog > .el-dialog__body) {
    background-color: #f1f3f4;
    padding: 20px 10px;
    height: calc(100vh - 157px);
    overflow: auto;
  }
  :deep(.custom-dialog > .el-dialog__footer) {
    box-shadow: 0px -1px 4px 0px #d9d9d9;
    position: relative;
    z-index: 99;
    padding: 15px 20px;
  }
}
</style>
