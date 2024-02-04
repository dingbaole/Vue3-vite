<template>
  <div class="root">
    <el-dialog
      class="custom-dialog"
      v-model="dialogShow"
      :title="`查看订单激励规则`"
      fullscreen
      :before-close="toggleDialogStatus"
    >
      <el-form :inline="true">
        <div class="module-box">
          <div class="module-box-desc">
            <div style="flex-shrink: 0">激励规则名称</div>
          </div>
          <div class="module-box-desc">
            <div>{{ detail.ruleName }}</div>
          </div>
        </div>
        <div class="module-box">
          <div class="module-box-desc">1.适用公司</div>
          <el-form-item label="城市:" prop="cityId">
            {{ detail.cityName }}
          </el-form-item>
          <el-form-item label="服务公司:" prop="companyId">
            <span>{{ detail.companyName }}</span>
            <span style="display: initial"
              >(公司代码: {{ detail.companyCode }})</span
            >
          </el-form-item>
        </div>
        <div class="module-box">
          <div class="module-box-desc">2.激励规则</div>
          <el-form-item label="激励类型:" prop="commissionType">
            <div>固定激励</div>
          </el-form-item>
          <el-form-item label="激励金额:">
            <div>{{ detail.commissionValue }}元/单</div>
          </el-form-item>
        </div>
        <div class="module-box">
          <div class="module-box-desc">3.适用订单标签</div>
          <el-form-item label="订单类型:" prop="orderClassify">
            <div>
              {{
                detail.orderClassify === 11
                  ? '上门订单'
                  : detail.orderClassify === 12
                  ? '集市订单'
                  : '--'
              }}
            </div>
          </el-form-item>
          <el-form-item label="订单标签:">
            <div>{{ `${detail.orderLabelCode}-${detail.orderLabelName}` }}</div>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toggleDialogStatus">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RuleDetail } from '@/webapi/other'
import type { RuleDetailRueult } from '@/webapi/other'

const detail = ref<Partial<RuleDetailRueult>>({})
const getDetail = (
  companyOrderLevelExcitationRuleId: number,
  companyId: number
) => {
  RuleDetail({
    companyOrderLevelExcitationRuleId,
    companyId
  }).then(res => {
    if (res.code === 200) {
      detail.value = res.data
    }
  })
}

const dialogShow = ref(false)
const toggleDialogStatus = (ruleId: number, companyId: number) => {
  getDetail(ruleId, companyId)
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss">
.root {
  :deep(.custom-dialog > .el-dialog__body) {
    background-color: #f1f3f4;
    padding: 20px 10px;
    height: calc(100vh - 156px);
    overflow: auto;
  }
  :deep(.custom-datetime > .el-input__wrapper) {
    width: 215px;
  }
  .custom-el-form-item {
    margin-right: 80px;
  }
  :deep(.custom-dialog > .el-dialog__footer) {
    box-shadow: 0px -1px 4px 0px #d9d9d9;
    position: relative;
    z-index: 99;
    padding: 15px 20px;
  }
  .module-box {
    margin-bottom: 15px;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    &-desc {
      margin-bottom: 15px;
    }
  }
}
.module-box {
  margin-bottom: 10px;
  &-desc {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    &__input {
      max-width: 520px !important;
    }
    &__form-item {
      margin-left: 10px;
      margin-bottom: 0;
      width: 520px;
    }
    &__button {
      margin-left: 10px;
    }
  }
}
</style>
