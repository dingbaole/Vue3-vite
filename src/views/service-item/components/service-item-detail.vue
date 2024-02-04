<template>
  <el-dialog
    v-model="dialogShow"
    :title="`查看激励基础规则`"
    fullscreen
    :before-close="toggleDialogStatus"
  >
    <div class="module-box">
      <div class="module-box-desc">
        激励基础规则名称：
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
        <span
          >激励类型:
          {{
            findNameByIdFromList(
              excitationTypeList,
              detail.commissionType,
              'commissionType',
              'commissionName'
            )
          }}</span
        >
        <span v-if="detail.commissionType === 11"
          >激励金额: {{ detail.commissionValue }} 元/件</span
        >
        <span v-if="detail.commissionType === 12"
          >激励比例: {{ detail.commissionValue }}%</span
        >
      </div>
    </div>
    <div class="module-box">
      <div class="module-box-desc">3.适用服务范围</div>
      <div class="module-box-content">
        <el-table
          :data="detail.serviceItemScopeDetailOutputs"
          border
          style="width: 100%; margin-top: 15px"
        >
          <el-table-column property="bigClassName" label="服务大类" />
          <el-table-column property="deviceName" label="设备" />
          <el-table-column property="serviceClassName" label="服务品类" />
          <el-table-column property="serviceItemName" label="服务项目" />
          <el-table-column
            property="serviceFee"
            label="项目单价(元)"
            width="120"
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
          <el-table-column align="center">
            <template #header>
              <div>多项目最高值激励</div>
              <div style="font-size: 12px">
                (非必选，选择后，将按条件计算激励)
              </div>
            </template>
            <template #default="scope">
              <el-checkbox
                disabled
                v-model="scope.row.calcGroupId"
                :true-label="11"
                :false-label="10"
                size="large"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QueryBaseRule } from '@/webapi/serviceItem'
import { findNameByIdFromList } from '@/utils'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'

const commonStore = useCommon()
const { excitationTypeList } = storeToRefs(commonStore)

const detail = ref({
  ruleName: '',
  cityName: '',
  companyName: '',
  companyCode: '',
  commissionType: undefined,
  commissionValue: undefined,
  serviceItemScopeDetailOutputs: []
})

const init = (comnanyItemExcitationRuleId: number, companyId: number) => {
  QueryBaseRule({
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
