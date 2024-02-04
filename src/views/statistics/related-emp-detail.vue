<template>
  <div class="related-emp-detail">
    <div style="font-size: 15px">
      <span
        >{{ props.orderType === orderType.goods ? '销售员' : '上门师傅' }}:
      </span>
      <span>{{ props.emp }}</span>
      <span style="display: inline-block; margin-left: 10px">{{
        props.phone
      }}</span>
    </div>
    <div v-if="list.length > 0" style="margin-top: 15px">
      <div style="font-size: 16px; font-weight: bold">其他激励人员：</div>
      <div v-for="item in list" :key="item.orderNo" style="margin-top: 8px">
        <span>{{ item.roleName }}: </span>
        <span>{{ item.promoterName }}</span>
        <span style="display: inline-block; margin-left: 10px">{{
          item.mobileNo
        }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  OrderGoodsRelevancePromoterDetail,
  OrderServiceRelevancePromoterDetail
} from '@/webapi/statistics'
import type { orderType as OrderType } from './types'
import { orderType } from './types'

const props = defineProps<{
  orderNo: string
  orderType: OrderType
  emp: string
  phone: string
}>()
const list = ref([])
const returnApi = () => {
  return props.orderType === orderType.goods
    ? OrderGoodsRelevancePromoterDetail
    : OrderServiceRelevancePromoterDetail
}
onMounted(() => {
  const { orderNo, orderType } = props
  returnApi()({ orderNo, orderType }).then(res => {
    if (res.code === 200) {
      list.value = res.data
    }
  })
})
</script>
<style scoped lang="scss">
.related-emp-detail {
}
</style>
