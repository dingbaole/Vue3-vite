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
        <span style="display: initial">
          公司: {{ detail.companyName }}(公司代码: {{ detail.companyCode }})
        </span>
        <span style="display: initial; margin-left: 20px">
          企业店铺 : {{ detail.shopName }}(店铺编码: {{ detail.thirdShopNo }})
        </span>
      </div>
    </div>
    <div class="module-box">
      <div class="module-box-desc">2.激励规则</div>
      <div class="module-box-content">
        <span>
          激励类型:
          {{ getCommissionTypeLabel(detail.commissionType) }}
        </span>
        <span
          v-if="
            detail.commissionType === 11 && detail.ladderType === LadderType.N
          "
        >
          激励金额: {{ detail.commissionValue }} 元/件
        </span>
        <span
          v-if="
            detail.commissionType === 12 && detail.ladderType === LadderType.N
          "
        >
          激励比例: {{ detail.commissionValue }}%
        </span>
        <span
          v-if="detail.ladderType === LadderType.Y"
          style="margin-right: 20px"
        >
          阶梯激励: 自定义成交单价区间
        </span>
        <span v-if="detail.ladderCalcType === 12">超出阶梯累加计算</span>
        <div style="padding: 10px 0">
          <TieredPrice
            v-if="detail.ladderType === LadderType.Y"
            :commission-type="detail.commissionType"
            :tiered-list="detail.goodsExcitationRuleLadderOutputs"
            mode="view"
          />
        </div>
      </div>
    </div>
    <div class="module-box">
      <div class="module-box-desc">3.适用商品范围</div>
      <div class="module-box-content">
        <el-table
          :data="detail.goodsUsedRuleOutputs"
          border
          style="width: 100%; margin-top: 15px"
          :cell-style="cellStyle"
        >
          <el-table-column property="skuNo" label="SKU编号" width="150" />
          <el-table-column property="goodsName" label="商品名称" />
          <el-table-column
            property="goodsType"
            label="商品类型"
            width="120"
            align="center"
          >
            <template #default="scope">
              {{
                scope.row.goodsType === 0
                  ? '自采商品'
                  : scope.row.goodsType === 1
                  ? '直发代销'
                  : '--'
              }}
            </template>
          </el-table-column>
          <el-table-column
            property="materialNo"
            label="关联物料号"
            width="100"
          />
          <el-table-column
            property="price"
            label="商品单价(元)"
            width="120"
            align="center"
          >
            <template #default="scope">
              {{
                scope.row.price || scope.row.price === 0
                  ? scope.row.price
                  : '--'
              }}
            </template>
          </el-table-column>
          <el-table-column
            property="price"
            label="商品指导单价"
            width="120"
            align="center"
          >
            <template #default="scope">
              {{
                scope.row.guidePrice || scope.row.guidePrice === 0
                  ? scope.row.guidePrice
                  : '--'
              }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            v-if="detail.ladderType !== LadderType.Y"
          >
            <template #header>
              <div>不低于指导价给予激励</div>
              <div style="font-size: 12px">
                (非必选，选择后，将按条件计算激励)
              </div>
            </template>
            <template #default="scope">
              <el-checkbox
                disabled
                v-model="scope.row.calcType"
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
import TieredPrice from './tiered-price.vue'
import { QueryBaseRule, type OperGoodsDetailInput } from '@/webapi/goods'
import { useCommon } from '@/store'
import { LadderType } from '@/global'

const { getCommissionTypeLabel } = useCommon()

const detail = ref({
  ruleName: '',
  cityName: '',
  companyName: '',
  companyCode: '',
  commissionType: undefined,
  commissionValue: undefined,
  ladderType: undefined,
  ladderCalcType: 11,
  shopName: '',
  thirdShopNo: '',
  thirdShopId: undefined,
  goodsUsedRuleOutputs: [],
  goodsExcitationRuleLadderOutputs: []
})
const cellStyle = ({ row }: { row: OperGoodsDetailInput }) => {
  if (row.calcType === 11 && !row.guidePrice) {
    return { background: '#fef0f0' }
  }
}
const init = (
  comnanyGoodsExcitationRuleId: number,
  companyId: number,
  marketShopId: number
) => {
  QueryBaseRule({
    comnanyGoodsExcitationRuleId,
    companyId,
    marketShopId
  }).then(res => {
    if (res.code === 200) {
      detail.value = res.data
    }
  })
}

const dialogShow = ref(false)
const toggleDialogStatus = (
  comnanyGoodsExcitationRuleId: number,
  companyId: number,
  marketShopId: number
) => {
  if (!dialogShow.value) {
    // 打开操作
    if (comnanyGoodsExcitationRuleId && companyId) {
      init(comnanyGoodsExcitationRuleId, companyId, marketShopId)
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
