<template>
  <el-dialog
    v-model="dialogShow"
    :title="`查看激励叠加规则`"
    fullscreen
    :before-close="toggleDialogStatus"
  >
    <div class="module-box">
      <div class="module-box-desc">
        激励叠加规则名称：
        <div>{{ detail.ruleName }}</div>
      </div>
    </div>
    <div class="module-box">
      <div class="module-box-desc">1.适用公司</div>
      <div class="module-box-content">
        <span>城市: {{ detail.cityName }}</span>
        <span style="display: initial"
          >公司: {{ detail.companyName }}(公司代码:
          {{ detail.companyCode }})</span
        >
      </div>
    </div>
    <div class="module-box">
      <div class="module-box-desc">2.激励规则</div>
      <div class="module-box-content">
        <span>
          激励类型:
          {{ getCommissionTypeLabel(detail.commissionType) }}
        </span>
        <span>
          {{ detail.commissionType === 21 ? '叠加定额' : '叠加系数' }}:
          {{ richRuleName(detail.commissionType, detail.commissionValue) }}
        </span>
      </div>
    </div>
    <div class="module-box">
      <div class="module-box-desc">3.有效日期时间</div>
      <div class="module-box-content">
        {{ dayjs(detail.startTime).format('YYYY-MM-DD HH:mm:ss') }} ~
        {{ dayjs(detail.endTime).format('YYYY-MM-DD HH:mm:ss') }}
      </div>
    </div>
    <div class="module-box">
      <div class="module-box-desc">4.规则限定条件(可选)</div>
      <div class="module-box-content">
        <el-card
          style="margin-bottom: 20px"
          shadow="never"
          v-if="detail.serviceItemScopeDetailOutputs?.length > 0"
        >
          <div class="tip">限定条件: 适用指定激励服务</div>
          <el-table
            :data="detail.serviceItemScopeDetailOutputs"
            border
            style="width: 100%"
          >
            <el-table-column property="bigClassName" label="服务大类" />
            <el-table-column property="deviceName" label="设备" />
            <el-table-column property="serviceClassName" label="服务品类" />
            <el-table-column property="serviceItemName" label="服务项目" />
            <el-table-column
              property="serviceFee"
              label="项目单价(元)"
              width="105"
              align="center"
            >
              <template #default="scope">
                {{
                  scope.row.serviceFee || scope.row.serviceFee === 0
                    ? scope.row.serviceFee
                    : '--'
                }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card
          style="margin-bottom: 20px"
          shadow="never"
          v-if="detail.empRelateList?.length > 0"
        >
          <div class="tip">限定条件: 适用指定组织员工</div>
          <el-table :data="detail.empRelateList" border style="width: 100%">
            <el-table-column property="stationName" label="服务站" />
            <el-table-column property="empName" label="人员姓名" />
            <el-table-column property="encryptMobileNo" label="手机号" />
          </el-table>
        </el-card>
        <el-card
          style="margin-bottom: 20px"
          shadow="never"
          v-if="detail.serviceAreaRelateList?.length > 0"
        >
          <div class="tip">限定条件: 适用指定服务区域</div>
          <el-table
            :data="detail.serviceAreaRelateList"
            border
            style="width: 100%"
          >
            <el-table-column property="stationName" label="服务站" />
            <el-table-column property="areaName" label="服务区域名称" />
          </el-table>
        </el-card>
        <OrderLabelPanel
          :disabled="true"
          v-if="detail.orderLabelOutputList?.length > 0"
          :order-label-list="detail.orderLabelOutputList"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderLabelPanel from '@/components/orderLabelPanel/order-label-panel.vue'
import { QueryBaseOverlayRule } from '@/webapi/serviceItem'
import { richRuleName } from '@/utils'
import dayjs from 'dayjs'
import { useCommon } from '@/store'
const { getCommissionTypeLabel } = useCommon()

const detail = ref({
  ruleName: '',
  cityName: '',
  companyName: '',
  companyCode: '',
  commissionType: undefined,
  commissionValue: undefined,
  serviceItemScopeDetailOutputs: [],
  serviceAreaRelateList: [],
  orderLabelOutputList: [],
  empRelateList: [],
  startTime: undefined,
  endTime: undefined
})

const init = (comnanyItemExcitationRuleId: number, companyId: number) => {
  QueryBaseOverlayRule({
    comnanyItemExcitationRuleId,
    companyId
  }).then(res => {
    if (res.code === 200) {
      detail.value = res.data
    }
  })
}

const dialogShow = ref(false)
const toggleDialogStatus = (
  comnanyItemExcitationRuleId: number,
  companyId: number
) => {
  if (!dialogShow.value) {
    // 打开操作
    if (comnanyItemExcitationRuleId && companyId) {
      init(comnanyItemExcitationRuleId, companyId)
    }
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss">
.tip {
  font-size: 16px;
  margin-bottom: 8px;
}
.module-box {
  margin-bottom: 25px;
  &-desc {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    &__input {
      width: 360px;
    }
    &__form-item {
      margin-left: 10px;
      margin-bottom: 0;
    }
    &__button {
      margin-left: 10px;
    }
  }
  &-content {
    padding-left: 14px;
    span {
      margin-right: 15px;
      width: 230px;
      display: inline-block;
    }
  }
}
</style>
