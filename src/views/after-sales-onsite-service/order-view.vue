<template>
  <div class="order-view">
    <div class="module-box">
      <div class="module-box-title">1.选择上门服务订单</div>
      <BasicInfo
        @change="orderNoConfirm"
        :page-type="props.pageType"
        :basic-info="
          props.pageType === PageViewType.CREATE ? createData : detailData
        "
      />
    </div>
    <div class="module-box">
      <div class="module-box-title">2.选择售后的服务/物料</div>
      <ServiceItemAndMaterial
        ref="ServiceItemAndMaterialRef"
        :page-type="props.pageType"
        :create-data="createData?.serviceItemList"
        :detail-data="detailData?.afterSaleOrderItemRespDTOList"
        :detail-refund-amount="detailData?.totalRefundAmt"
      />
    </div>
    <div class="module-box">
      <div class="module-box-title">3.填写售后原因</div>
      <el-input
        v-if="
          pageType === PageViewType.CREATE || pageType === PageViewType.EDIT
        "
        v-model="afterSaleReason"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 6 }"
        maxlength="200"
        show-word-limit
        placeholder="请输入, 最长可输入200个文字。"
      ></el-input>
      <div
        v-if="
          pageType === PageViewType.DETAIL || pageType === PageViewType.AUDIT
        "
      >
        {{ detailData?.afterSaleReason }}
      </div>
    </div>
    <div class="module-box" v-if="pageType === PageViewType.DETAIL">
      <div class="module-box-title">4.退款信息</div>
      <RefundInfo :detail-data="detailData" />
    </div>
    <div class="module-box" v-if="props.pageType === PageViewType.AUDIT">
      <div class="module-box-title">售后审核</div>
      <div style="display: flex; align-items: center">
        <el-radio-group v-model="auditContent.type">
          <el-radio :label="1">同意</el-radio>
          <el-radio :label="2">驳回</el-radio>
        </el-radio-group>
        <el-input
          style="margin-left: 10px; max-width: 300px !important"
          v-if="auditContent.type === 2"
          maxlength="100"
          show-word-limit
          clearable
          v-model="auditContent.rejectReason"
          placeholder="请输入驳回原因"
        ></el-input>
      </div>
    </div>
    <div class="module-box" v-if="pageType !== PageViewType.CREATE">
      <div class="module-box-title">售后日志</div>
      <HistoryLog :data="detailData?.saleAfterOrderOperHis" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, inject, watch } from 'vue'
import type { UnwrapNestedRefs } from 'vue'
import { PageViewType } from './types'
import BasicInfo from './components/order-view-basic-info.vue'
import ServiceItemAndMaterial from './components/order-view-item.vue'
import RefundInfo from './components/refund-info.vue'
import HistoryLog from './components/history-log.vue'
import {
  GetOrderOfCanCreateSaleOByNum,
  SaleAfterOrderQueryDetail,
  CreateAfterSaleOrder,
  ExamineRejectAfterSaleOrder,
  ChangeAfterSaleOrder
} from '@/webapi/after-sales-onsite-service'
import type { CreateData, DetailData } from './types'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  pageType: PageViewType
  afterSaleOrderNo?: string
}>()

onMounted(() => {
  afterSaleReason.value = ''
  confirmButtonStatus.disabledReason = true
  if (props.afterSaleOrderNo) {
    getPageDetail(props.afterSaleOrderNo)
  }
})

const afterSaleReason = ref('')
const confirmButtonStatus = inject<
  UnwrapNestedRefs<{ disabledReason: boolean; disabledRefund: boolean }>
>('confirmButtonStatus')
watch(afterSaleReason, val => {
  if ((createData.value || detailData.value) && val) {
    confirmButtonStatus.disabledReason = false
  } else {
    confirmButtonStatus.disabledReason = true
  }
})
const ServiceItemAndMaterialRef =
  ref<InstanceType<typeof ServiceItemAndMaterial>>()

const handleData = () => {
  if (props.pageType === PageViewType.CREATE) {
    return createAferSalesOrder()
  } else if (props.pageType === PageViewType.AUDIT) {
    return auditAfterSalesOrder()
  } else if (props.pageType === PageViewType.EDIT) {
    return changeAfterSalesOrder()
  }
}

const auditContent = reactive<{
  type: 1 | 2
  rejectReason: string
}>({
  type: 1,
  rejectReason: ''
})
// 审核售后单
const auditAfterSalesOrder = () => {
  return new Promise((resolve, reject) => {
    if (auditContent.type === 2 && !auditContent.rejectReason.trim()) {
      reject({
        type: 'error',
        message: '请输入驳回原因'
      })
      return
    }
    const { afterSaleOrderNo } = detailData.value
    const { type, rejectReason } = auditContent
    ExamineRejectAfterSaleOrder({
      saleOrderId: afterSaleOrderNo,
      type,
      rejectReason: rejectReason.trim(),
      operateSource: 4
    }).then(res => {
      if (res.code === 200) {
        resolve({
          type: 'success',
          message: '已同意'
        })
      } else {
        reject({
          type: 'error',
          message: res.message
        })
      }
    })
  })
}

// 变更售后单
const changeAfterSalesOrder = () => {
  afterSaleReason.value = afterSaleReason.value.trim()
  const afterSaleCreateOrderItemReqParamList =
    ServiceItemAndMaterialRef.value.getData()
  const { afterSaleOrderNo } = detailData.value
  return new Promise((resolve, reject) => {
    if (!afterSaleReason.value) {
      reject({
        type: 'error',
        message: '售后原因不能为空!'
      })
    }
    ChangeAfterSaleOrder({
      saleOrderNo: afterSaleOrderNo,
      afterSaleReason: afterSaleReason.value,
      afterSaleCreateOrderItemReqParamList
    }).then(res => {
      if (res.code === 200) {
        resolve({
          type: 'success',
          message: '变更成功'
        })
      } else {
        reject({
          type: 'error',
          message: res.message
        })
      }
    })
  })
}

// 创建售后单
const createAferSalesOrder = () => {
  const afterSaleCreateOrderItemReqParamList =
    ServiceItemAndMaterialRef.value.getData()
  const {
    orderSource,
    workOrderNo,
    cityId,
    cityName,
    companyId,
    stationId,
    provinceName,
    districtName,
    community: communityName,
    detailAddress
  } = createData.value
  return new Promise((resolve, reject) => {
    CreateAfterSaleOrder({
      orderSource,
      workOrderNo,
      cityId,
      cityName,
      companyId,
      stationId,
      provinceName,
      districtName,
      communityName,
      detailAddress,
      afterSaleReason: afterSaleReason.value,
      afterSaleCreateOrderItemReqParamList
    }).then(res => {
      if (res.code === 200) {
        resolve({
          type: 'success',
          message: '创建成功'
        })
      } else {
        reject({
          type: 'error',
          message: res.message
        })
      }
    })
  })
}
const detailData = ref<DetailData>()
const getPageDetail = (afterSaleOrderNo: string) => {
  const queryType = props.pageType === PageViewType.EDIT ? '2' : '1'
  SaleAfterOrderQueryDetail({ afterSaleOrderNo, queryType }).then(res => {
    if (res.code === 200) {
      detailData.value = res.data
      afterSaleReason.value = res.data?.afterSaleReason
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

const createData = ref<CreateData>()
const orderNoConfirm = (workOrderNo?: string) => {
  if (workOrderNo) {
    GetOrderOfCanCreateSaleOByNum({ workOrderNo }).then(res => {
      if (res.code === 200) {
        createData.value = res.data
        createData.value.cityName = res.data.city
      } else {
        ElMessage({
          type: 'error',
          message: res.message
        })
      }
    })
  } else {
    createData.value = undefined
    afterSaleReason.value = ''
  }
}
defineExpose({ handleData })
</script>
<style scoped lang="scss">
.order-view {
  .module-box {
    margin-bottom: 15px;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    &-title {
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }
}
</style>
