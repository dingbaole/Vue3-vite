<template>
  <div class="refund-info">
    <div>
      <span style="display: inline-block; margin-right: 40px">
        售后退款总金额:
        <span
          v-if="props.detailData?.orderStatus === AfterSalesStatus.COMPLETED"
          >{{ props.detailData?.totalRefundAmt ?? '--' }}</span
        >
        <span v-else>--</span>
      </span>
      <span>
        退款完成时间:
        <span
          v-if="props.detailData?.orderStatus === AfterSalesStatus.COMPLETED"
        >
          {{
            props.detailData?.endTime
              ? dayjs(props.detailData?.endTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}
        </span>
        <span v-else>--</span>
      </span>
    </div>
    <div style="margin-top: 15px">
      <div style="margin-bottom: 8px">客户退款小票签字图片：</div>
      <div style="margin-bottom: 8px">
        备注：{{ props.detailData?.imageRemark ?? '--' }}
      </div>
      <el-image
        style="width: 100px; height: 100px; margin-right: 15px"
        v-for="(src, index) in imgs"
        :src="src"
        :key="src"
        :zoom-rate="1.2"
        :preview-src-list="imgs"
        :initial-index="index"
        fit="cover"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import {
  AfterSalesStatus,
  type DetailData,
  type SaleAfterOrderImages
} from '../types'
import { watch } from 'vue'

const props = defineProps<{
  detailData: DetailData
}>()
const imgs = ref<string[]>([])
watch(props, () => {
  imgs.value = genImgSrc(props.detailData?.saleAfterOrderImages)
})
function genImgSrc<T extends SaleAfterOrderImages>(data?: T[]) {
  return data
    ? data
        .filter(item => item.imageType === 1)
        .map(item => `${import.meta.env.ECEJ_IMG_SRC}${item.imageSummary}.jpg`)
    : []
}
</script>
<style scoped lang="scss">
.refund-info {
}
</style>
