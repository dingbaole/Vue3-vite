<template>
  <div class="add-order-label">
    <el-form label-position="top">
      <el-form-item label="订单类型" prop="orderClassify">
        <el-select v-model="formData.orderClassify" placeholder="订单类型">
          <el-option
            v-for="item in props.mode === 'goods' || props.mode === 'goodsRerun'
              ? orderClassifyList
              : orderClassifyList2"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单标签" prop="orderLableIdName">
        <el-select
          v-model="formData.orderLableIdName"
          filterable
          remote
          reserve-keyword
          placeholder="请输入标签编码"
          :remote-method="remoteMethod"
          :loading="selectRemote.loading"
        >
          <el-option
            v-for="item in selectRemote.options"
            :key="item.orderLabelId"
            :label="`${item.orderLabelCode}-${item.orderLabelName}`"
            :value="`${item.orderLabelCode}@${item.orderLabelId}@${item.orderLabelName}`"
          />
        </el-select>
        <!-- <span
              style="
                display: inline-block;
                font-size: 12px;
                margin-left: 8px;
                color: #f50;
              "
              >{{ selectRemote.msg }}</span
            > -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import type { OrderLabel, Mode } from './types'
import { ServiceItemGetOrderLabel } from '@/webapi/serviceItem'
import { MaterialGetOrderLabel } from '@/webapi/material'
import { GoodsGetOrderLabel } from '@/webapi/goods'
import { GoodsGetOrderLabelRerun } from '@/components/incentive-test-compute/goods/api'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  mode: Mode
}>()
const formData = reactive({
  orderClassify: undefined,
  orderLableIdName: ''
})
onMounted(() => {
  if (props.mode === 'goods' || props.mode === 'goodsRerun') {
    formData.orderClassify = 3
  } else {
    formData.orderClassify = 2
  }
})
const getLabelInfo = () => {
  if (!formData.orderLableIdName) {
    ElMessage({
      type: 'error',
      message: '订单标签信息不能为空'
    })
    return Promise.reject('订单标签信息不能为空')
  }
  const [orderLabelCode, orderLabelId, orderLabelName] =
    formData.orderLableIdName.split('@')
  return Promise.resolve({
    orderLabelType: formData.orderClassify,
    orderLabelCode,
    orderLabelId,
    orderLabelName
  })
}

defineExpose({ getLabelInfo })

const getLabelApi = computed(() => {
  return props.mode === 'serviceItem'
    ? ServiceItemGetOrderLabel
    : props.mode === 'material'
    ? MaterialGetOrderLabel
    : props.mode === 'goods'
    ? GoodsGetOrderLabel
    : props.mode === 'goodsRerun'
    ? GoodsGetOrderLabelRerun
    : ServiceItemGetOrderLabel
})

const selectRemote = reactive<{
  loading: boolean
  options: OrderLabel[]
  msg: string
}>({
  loading: false,
  options: [],
  msg: ''
})
const remoteMethod = (orderLabelCode: string) => {
  if (orderLabelCode) {
    selectRemote.loading = true
    getLabelApi
      .value({
        orderLabelCode
      })
      .then(res => {
        selectRemote.loading = false
        if (res.code === 200) {
          selectRemote.options = res.data
          if (selectRemote.options.length === 0) {
            selectRemote.msg = '标签不存在，请重新输入'
          } else {
            selectRemote.msg = ''
          }
        } else {
          selectRemote.msg = res.msg
        }
      })
  } else {
    selectRemote.options = []
    selectRemote.msg = ''
  }
}
const orderClassifyList = [
  {
    id: 3,
    name: '集市订单'
  }
]
const orderClassifyList2 = [
  {
    id: 2,
    name: '上门订单'
  }
]
</script>
<style scoped lang="scss">
.add-order-label {
  :deep(.el-select) {
    width: 350px;
    .el-input {
      max-width: 350px !important;
    }
  }
}
</style>
