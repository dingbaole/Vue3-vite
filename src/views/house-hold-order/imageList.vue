<template>
  <div class="image-list">
    <div>{{ props.title }}{{ props.images?.length ?? 0 }}张:</div>
    <div>
      <el-image
        style="width: 100px; height: 100px; margin-right: 15px"
        v-for="(src, index) in images"
        :src="src"
        :key="src"
        :zoom-rate="1.2"
        :preview-src-list="images"
        :initial-index="index"
        fit="cover"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Photos } from '@/webapi/houseHoldOrder'

const props = defineProps<{
  images: Photos[]
  title: string
}>()

const images = ref<string[]>([])
onMounted(() => {
  images.value = props.images?.map(item => {
    if (typeof item === 'object') {
      return item.imageSummary
        ? item.imageSummary
        : item.imgPath
        ? item.imgPath
        : item.telImageUrl
    }
    return item
  })
})
</script>
<style scoped lang="scss">
.image-list {
}
</style>
