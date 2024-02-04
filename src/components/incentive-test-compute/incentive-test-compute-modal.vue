<template>
  <div class="incentive-test-compute-modal">
    <el-button
      v-permission="'excitation:rerun-company-goods-rule:load-page-init-data'"
      type="warning"
      plain
      @click="toggleDialogStatus()"
    >
      激励重跑机制入口
    </el-button>
    <el-dialog
      class="custom-dialog"
      v-model="dialogShow"
      title="商品销售激励规则重跑计算"
      width="1000px"
      destroy-on-close
      top="5vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :before-close="toggleDialogStatus"
    >
      <Panel @close="toggleDialogStatus" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Panel from './compute-panel.vue'

const dialogShow = ref(false)
const toggleDialogStatus = () => {
  dialogShow.value = !dialogShow.value
}
</script>
<style scoped lang="scss">
.incentive-test-compute-modal {
  * + & {
    display: inline-flex;
    margin-left: 12px;
  }
}
</style>
