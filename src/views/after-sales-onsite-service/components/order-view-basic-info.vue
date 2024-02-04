<template>
  <div class="order-view-basic-info">
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex" v-if="props.pageType === PageViewType.CREATE">
        <el-form-item label="上门订单编号" style="width: 280px">
          <el-input v-model="orderNo" placeholder="请输入订单编号" />
        </el-form-item>
        <el-button v-if="!basicInfo.workOrderNo" type="primary" @click="confirm"
          >确认</el-button
        >
        <el-button
          v-if="basicInfo.workOrderNo"
          type="danger"
          plain
          @click="reset"
          >清空重置</el-button
        >
      </div>
      <div
        style="display: flex; align-items: center"
        v-if="props.pageType !== PageViewType.CREATE"
      >
        <div style="margin-right: 30px">
          <span>上门售后单号: </span>
          <span style="font-weight: bold">{{
            basicInfo.afterSaleOrderNo
          }}</span>
          <StatusTag
            style="margin-left: 10px"
            :status="basicInfo.orderStatus"
          />
        </div>
        <div>
          <span>上门订单编号: </span>
          <span style="font-weight: bold">{{ basicInfo.workOrderNo }}</span>
        </div>
      </div>
      <el-button
        v-if="basicInfo.workOrderNo"
        type="primary"
        plain
        @click="addTab(basicInfo.workOrderNo)"
        >查看实际入户服务情况</el-button
      >
    </div>
    <div class="form-content">
      <div class="content-item">
        <div class="content-item-block content-item-block__label">城市</div>
        <div class="content-item-block content-item-block__value">
          {{ basicInfo.cityName ?? '--' }}
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-block content-item-block__label">公司</div>
        <div class="content-item-block content-item-block__value">
          <div v-if="basicInfo.companyName">
            {{ basicInfo.companyName }}
            <span v-if="basicInfo.companyCode">
              ({{ basicInfo.companyCode }})
            </span>
          </div>
          <div v-else>--</div>
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-block content-item-block__label">服务站</div>
        <div class="content-item-block content-item-block__value">
          {{ basicInfo.stationName ?? '--' }}
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-block content-item-block__label">
          订单入户师傅
        </div>
        <div class="content-item-block content-item-block__value">
          <div v-if="basicInfo.empName">
            <span>{{ basicInfo.empName }}</span>
            <span>/{{ basicInfo.empMobile ?? basicInfo.empNo }}</span>
            <span v-if="basicInfo.empStatus">
              (
              <span style="color: rgb(228, 53, 30)">
                {{ basicInfo.empStatus }}
              </span>
              )
            </span>
          </div>
          <div v-else>--</div>
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-block content-item-block__label">客户姓名</div>
        <div class="content-item-block content-item-block__value">
          {{ basicInfo.contactsName ?? '--' }}
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-block content-item-block__label">客户电话</div>
        <div class="content-item-block content-item-block__value">
          {{ basicInfo.contactsMobile ?? '--' }}
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-block content-item-block__label">服务地址</div>
        <div class="content-item-block content-item-block__value">
          <div v-if="basicInfo.detailAddress">
            {{ basicInfo.community }}{{ basicInfo.detailAddress }}
          </div>
          <div v-else>--</div>
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-block content-item-block__label">
          订单完成时间
        </div>
        <div class="content-item-block content-item-block__value">
          {{
            basicInfo.payEndTime
              ? dayjs(basicInfo.payEndTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import StatusTag from './status-tag.vue'
import { PageViewType } from '../types'
import type { CreateBasicInfo, DetailBasicInfo } from '../types'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['change'])
const confirm = () => {
  if (!orderNo.value) {
    ElMessage({
      type: 'error',
      message: '请输入订单编号！'
    })
    return
  }
  emit('change', orderNo.value)
}
const reset = () => {
  orderNo.value = ''
  basicInfo.value = {}
  emit('change')
}

const orderNo = ref('')
const props = defineProps<{
  basicInfo?: CreateBasicInfo & DetailBasicInfo
  pageType: PageViewType
}>()
const basicInfo = ref<CreateBasicInfo & DetailBasicInfo>({})
watch(
  () => props.basicInfo,
  () => {
    if (!props.basicInfo) {
      basicInfo.value = {}
    } else {
      basicInfo.value = props.basicInfo
    }
  }
)

const addTab = (workOrderNo: string) => {
  ;(window.parent as any)?.vm?.addTab(
    '',
    '入户订单核查',
    `/fe-web/house-hold-order-check?workOrderNo=${workOrderNo}`,
    'code233'
  )
}
</script>
<style scoped lang="scss">
.order-view-basic-info {
  .form-content {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    &__3 {
      grid-template-columns: repeat(3, 1fr);
    }
    .content-item {
      display: flex;
      &-block {
        padding: 5px;
        border: 1px solid #eee;
        margin-left: -1px;
        margin-top: -1px;
        display: flex;
        align-items: center;
        &__label {
          border-right: 0;
          min-width: 90px;
          background-color: #f8f8f8;
        }
        &__value {
          flex: 1;
          word-break: break-all;
        }
      }
      &__turn {
        .content-item-block__label {
          border-right: 0;
          min-width: 100px;
          background-color: #f8f8f8;
        }
      }
    }
  }
}
</style>
