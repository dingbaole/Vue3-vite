<template>
  <el-dialog
    v-model="dialogShow"
    :title="`查看激励叠加规则`"
    fullscreen
    :before-close="toggleDialogStatus"
  >
    <template #header>
      <div class="title" style="display: flex; align-items: center">
        <span style="font-size: 18px">{{ `查看激励叠加规则` }}</span>
        <el-alert
          style="width: 500px; margin-left: 20px"
          title="提示: 叠加激励均在基础规则激励的基础上做额外的激励。"
          type="error"
          :closable="false"
        />
      </div>
    </template>
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
      <el-card
        style="margin-bottom: 20px"
        shadow="never"
        v-if="detail.goodsUsedRuleOutputs.length > 0"
      >
        <div class="tip">限定条件: 适用指定激励商品</div>
        <el-table
          :data="detail.goodsUsedRuleOutputs"
          border
          style="width: 100%; margin-top: 15px"
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
            width="180"
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
        </el-table>
      </el-card>
      <el-card
        style="margin-bottom: 20px"
        shadow="never"
        v-if="detail.promoterUsedRuleOutputs.length > 0"
      >
        <div class="tip">限定条件: 适用指定组织员工</div>
        <el-table
          :data="detail.promoterUsedRuleOutputs"
          border
          style="width: 100%; margin-top: 15px"
        >
          <el-table-column property="deptNames" label="组织部门" />
          <el-table-column property="employeeName" label="人员姓名" />
          <el-table-column property="encryptionMobile" label="手机号" />
        </el-table>
      </el-card>
      <el-card
        style="margin-bottom: 20px"
        shadow="never"
        v-if="detail.marketOrderChannelOutputs.length > 0"
      >
        <div class="tip">限定条件: 适用下单渠道</div>
        <el-table
          :data="detail.marketOrderChannelOutputs"
          border
          style="width: 100%; margin-top: 15px"
        >
          <el-table-column property="marketOrderChannelName" label="下单渠道" />
        </el-table>
      </el-card>
      <OrderLabelPanel
        :disabled="true"
        v-if="detail.goodsExcitationRuleOrderLabelOutputs?.length > 0"
        :order-label-list="detail.goodsExcitationRuleOrderLabelOutputs"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderLabelPanel from '@/components/orderLabelPanel/order-label-panel.vue'
import { QueryBaseSuperpositionRule, CanusedPromoterList } from '@/webapi/goods'
import { richRuleName } from '@/utils'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { MarketOrderChannel } from '@/types/goods'

const commonStore = useCommon()
const { getCommissionTypeLabel } = commonStore
const { marketOrderChannels } = storeToRefs(commonStore)

const detail = ref({
  ruleName: '',
  cityName: '',
  companyName: '',
  companyCode: '',
  commissionType: undefined,
  commissionValue: undefined,
  goodsUsedRuleOutputs: [],
  promoterUsedRuleOutputs: [],
  marketOrderChannelOutputs: [],
  goodsExcitationRuleOrderLabelOutputs: [],
  shopName: '',
  thirdShopNo: '',
  thirdShopId: undefined,
  marketShopId: undefined,
  startTime: undefined,
  endTime: undefined
})

const init = (
  comnanyGoodsExcitationRuleId: number,
  companyId: number,
  marketShopId: number
) => {
  QueryBaseSuperpositionRule({
    comnanyGoodsExcitationRuleId,
    companyId,
    marketShopId
  }).then(res => {
    if (res.code === 200) {
      detail.value = res.data
      getDetailAfter()
    }
  })
}

// 获取详情后处理人员部门归属关系
const getDetailAfter = () => {
  if (detail.value?.promoterUsedRuleOutputs?.length < 1) return
  // 先获取整个人员部门数据
  CanusedPromoterList({
    storeId: detail.value.thirdShopId,
    marketShopId: detail.value.marketShopId
  }).then(res => {
    if (res.code === 200) {
      const { deptList, empList } = res.data
      detail.value.promoterUsedRuleOutputs.forEach((element: any) => {
        empList.forEach((item: any) => {
          if (element.employeeId === item.employeeId) {
            element['deptList'] = item['deptList']
          }
        })
      })
      // console.log(genFWordDeptName(deptList, empList))

      // const result = genFWordDeptName(deptList, empList).filter(item =>
      //   detail.value.promoterUsedRuleOutputs
      //     .map((item: any) => item.employeeId)
      //     .includes(item.employeeId)
      // )
      const result = genFWordDeptName(
        deptList,
        detail.value.promoterUsedRuleOutputs
      )
      detail.value.promoterUsedRuleOutputs = result
    }
  })
}

// 纯属浪费时间的功能，简直...yituodabian
const genFWordDeptName = (deptList: any[], empList: any[]) => {
  return empList.map(item => {
    if (item.deptList?.length > 0) {
      item['deptNames'] = foo(deptList, item.deptList)
    } else {
      if (item?.marketDelFlag === 1) {
        item['deptNames'] = '--'
      } else {
        item['deptNames'] = detail.value.companyName
      }
    }
    return item
  })
}

const foo = (deptList: any[], empDeptList: any[]) => {
  const strArr: string[] = []
  for (let v of empDeptList) {
    let parentDeptId = v['parentDeptId']
    let str = v['deptName']
    const deptListBackUp = JSON.parse(JSON.stringify(deptList))

    const find = (parentDeptId: string, str: string): string => {
      if (parentDeptId === '0') {
        return str
      }
      const res = deptListBackUp.filter(
        (item: any) => item.deptId === parentDeptId
      )[0]
      if (res?.parentDeptId !== '0') {
        return find(res.parentDeptId, `${res.deptName}->${str}`)
      } else {
        return `${res.deptName}->${str}`
      }
    }
    strArr.push(find(parentDeptId, str))
  }
  return strArr.join(',')
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
