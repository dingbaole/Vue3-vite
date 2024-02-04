<template>
  <div class="refresh-alert" v-if="visible">
    <el-alert type="warning" show-icon  :closable="false">
      <template #title>
        <div style="display: flex;align-items: center;">
          <div>提示：页面长时间停留，核对数据可能发生变化，请</div>
          <el-button type="primary" link @click="refresh">刷新</el-button>
          <div>页面获取最新待核对数据</div>
        </div>
      </template>
    </el-alert>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  showFlag?: number
}>()
const emit = defineEmits(['isRefresh'])
const visible = ref(false)
const refresh = () => {
  emit('isRefresh')
  close()
}
const show = () => visible.value = true
const close = () => visible.value = false
const keepTime = () => {
  let timer: any
  return () => {
    if (timer) {
      if (visible.value) close()
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      show()
    }, 10 * 60 * 1000)
  }
}
const keep = keepTime()
watch(() => props.showFlag, () => keep())
</script>
<style scoped lang="scss">
.refresh-alert {
  width: 600px;
  &:has(+*){
    margin-bottom: 20px;
  }
}
</style>
