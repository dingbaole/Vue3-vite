<template>
  <div class="recommend-company-list">
    <el-scrollbar>
      <div class="scrollbar-flex-content">
        <div
          v-for="item in companyList"
          :key="item.companyId"
          class="scrollbar-item"
          :class="[currentCompanyId === item.companyId ? 'active' : '']"
          @click="tap(item.companyId)"
        >
          <p>{{ item.companyName }}</p>
          <p>(公司代码: {{ item.companyCode }})</p>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Company {
  companyId: number
  companyName: number
  companyCode: number
}

const props = defineProps<{
  companyList: Company[]
}>()
onMounted(() => {
  if (props.companyList?.length > 0) {
    emitCompanyId(props.companyList[0].companyId)
  }
})

const currentCompanyId = ref<number>()
const tap = (companyId: number) => {
  if (currentCompanyId.value === companyId) return
  emitCompanyId(companyId)
}
const emitCompanyId = (companyId: number) => {
  currentCompanyId.value = companyId
  emit('onChange', companyId)
}
const emit = defineEmits(['onChange'])
</script>
<style scoped lang="scss">
.recommend-company-list {
  .scrollbar-flex-content {
    display: flex;
    padding: 15px 8px;
  }
  .scrollbar-item {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    min-height: 50px;
    margin-right: 20px;
    text-align: center;
    border-radius: 4px;
    background: #efefef;
    color: #666;
    animation: 0.2s;
    cursor: pointer;
    padding: 0 10px;
    p {
      margin: 0;
    }
    &:hover {
      background: rgba(64, 158, 255, 0.8);
      color: #fff;
    }
    &.active {
      background: rgba(64, 158, 255, 1);
      color: #fff;
    }
  }
}
</style>
