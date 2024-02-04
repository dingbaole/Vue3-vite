<template>
  <div class="order-view-item">
    <el-alert
      type="error"
      title="提示：0收费项目或物料暂不支持售后；添加售后数量时请参考可售后的数量！"
      v-if="createData.length > 0"
    >
    </el-alert>
    <el-table
      v-if="
        props.pageType === PageViewType.CREATE ||
        props.pageType === PageViewType.EDIT
      "
      :data="createData"
      :span-method="objectSpanMethod"
      border
      cell-class-name="turn-cell"
      row-class-name="turn-row"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="订单项目/物料">
        <template #default="scope">
          <el-table
            :data="scope.row?.materialList"
            :header-row-style="{ display: 'none' }"
            style="width: 100%"
          >
            <el-table-column prop="name" label="订单项目/物料">
              <template #default="scopes">
                <div v-if="scopes.row.flag === Flag.SERVICEITEM">
                  <div>
                    <el-tag style="margin-right: 10px" type="info" plain>
                      {{ scopes.row.serviceClassName }}
                    </el-tag>
                    {{ scopes.row.name }}
                  </div>
                </div>
                <div v-else>
                  <span>-- </span>
                  <span style="color: rgb(153 153 153)">{{
                    scopes.row.name
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="insuranceMark"
              label="保内保外标识"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                {{ insuranceMarkMap[row.insuranceMark] ?? '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量"
              width="80"
              align="center"
            />
            <el-table-column
              prop="amount"
              label="实收金额"
              width="90"
              align="center"
            />
            <el-table-column
              prop="availableQuantity"
              label="可售后数量"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                <div>{{ row.amount > 0 ? row.availableQuantity : 0 }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="refundQuantity"
              label="本次售后数量"
              width="150"
              align="center"
            >
              <template #default="{ row }">
                <el-input-number
                  type="number"
                  :min="0"
                  :max="row.availableQuantity"
                  :precision="
                    row.flag === Flag.SERVICEITEM
                      ? 0
                      : materialPrecision.get(row.materialId) ?? 2
                  "
                  :value-on-clear="'max'"
                  :disabled="
                    (!row.amount || !row.availableQuantity) &&
                    row.refundQuantity === 0
                  "
                  v-model="row.refundQuantity"
                  size="small"
                />
                <div></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="paidAmt"
              label="售后应退金额"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                {{ computedRefundValue2(row) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="保内保外标识" width="120" align="center" />
      <el-table-column label="数量" width="80" align="center" />
      <el-table-column label="实收金额" width="90" align="center" />
      <el-table-column label="可售后数量" width="120" align="center" />
      <el-table-column label="本次售后数量" width="150" align="center" />
      <el-table-column label="售后应退金额" width="120" align="center" />
    </el-table>
    <el-table
      v-else
      :data="detailData"
      :span-method="objectSpanMethod"
      border
      cell-class-name="turn-cell"
      row-class-name="turn-row"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="订单项目/物料">
        <template #default="scope">
          <el-table
            :data="scope.row.materialList"
            :header-row-style="{ display: 'none' }"
            style="width: 100%"
          >
            <el-table-column prop="name" label="订单项目/物料">
              <template #default="{ row }">
                <div v-if="row.flag === Flag.SERVICEITEM">
                  <div>
                    <el-tag style="margin-right: 10px" type="info" plain>
                      {{ row.serviceClassName }}
                    </el-tag>
                    <span
                      v-if="
                        !(
                          row.refundQuantity === 0 &&
                          row.flag === Flag.SERVICEITEM
                        )
                      "
                      >{{ row.name }}</span
                    >
                  </div>
                </div>
                <div v-else>
                  <span>-- </span>
                  <span style="color: rgb(153 153 153)">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="保内保外标识" width="120" align="center">
              <template #default="{ row }">
                <div
                  v-if="
                    !(row.refundQuantity === 0 && row.flag === Flag.SERVICEITEM)
                  "
                >
                  {{ insuranceMarkMap[row.insuranceMark] ?? '--' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="使用数量" width="90" align="center">
              <template #default="{ row }">
                <div
                  v-if="
                    !(row.refundQuantity === 0 && row.flag === Flag.SERVICEITEM)
                  "
                >
                  {{ row.quantity ?? '--' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="已售后数量" width="100" align="center">
              <template #default="{ row }">
                <div
                  v-if="
                    !(row.refundQuantity === 0 && row.flag === Flag.SERVICEITEM)
                  "
                >
                  {{ row.soldQuantity ?? '--' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实收金额" width="90" align="center">
              <template #default="{ row }">
                <div
                  v-if="
                    !(row.refundQuantity === 0 && row.flag === Flag.SERVICEITEM)
                  "
                >
                  {{ row.amount ?? '--' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="本次售后申请数量"
              width="150"
              align="center"
            >
              <template #default="{ row }">
                <div
                  v-if="
                    !(row.refundQuantity === 0 && row.flag === Flag.SERVICEITEM)
                  "
                >
                  {{ row.refundQuantity ?? '--' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="售后应退金额" width="120" align="center">
              <template #default="{ row }">
                <div
                  v-if="
                    !(row.refundQuantity === 0 && row.flag === Flag.SERVICEITEM)
                  "
                >
                  {{ row.refundAmount ?? '--' }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="保内保外标识" width="120" align="center" />
      <el-table-column label="使用数量" width="90" align="center" />
      <el-table-column label="已售后数量" width="100" align="center" />
      <el-table-column label="实收金额" width="90" align="center" />
      <el-table-column label="本次售后申请数量" width="150" align="center" />
      <el-table-column label="售后应退金额" width="120" align="center" />
    </el-table>
    <div
      v-if="createData.length > 0 || detailData.length > 0"
      style="
        margin-top: 10px;
        padding: 5px 0px 5px 10px;
        text-align: right;
        font-weight: 500;
      "
    >
      应退总金额:
      <span style="display: inline-block; width: 120px; text-align: center">
        {{ createData?.length > 0 ? totalRefundAmt : props.detailRefundAmount }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, inject, computed } from 'vue'
import type { UnwrapNestedRefs } from 'vue'
import { PageViewType } from '../types'
import type { ServiceItem, AfterSaleOrderItem } from '../types'
import { QueryMaterialInfo } from '@/webapi/after-sales-onsite-service'
import { Decimal } from 'decimal.js'

const props = defineProps<{
  pageType: PageViewType
  createData?: ServiceItem[]
  detailData?: AfterSaleOrderItem[]
  detailRefundAmount?: number
}>()

enum Flag {
  MATERIAL = 'material',
  SERVICEITEM = 'serviceItem'
}
interface CreateServiceItem {
  materialList: Material[]
}
interface Material {
  materialId?: number
  materialUsedId?: number
  serviceItemId?: number
  flag: Flag
  name: string
  serviceClassName: string
  insuranceMark: number
  quantity: number
  amount: number
  availableQuantity?: number
  soldQuantity?: number
  canRefundAmt?: number
  refundQuantity: number
  refundAmount: number
}
const createData = ref<CreateServiceItem[]>([])
const detailData = ref<CreateServiceItem[]>([])
const init = () => {
  if (props.pageType === PageViewType.CREATE) {
    initCreate()
  } else if (props.pageType === PageViewType.EDIT) {
    initEdit()
  } else {
    initDetail()
  }
}
watch(props, () => {
  init()
})
const confirmButtonStatus = inject<
  UnwrapNestedRefs<{ disabledReason: boolean; disabledRefund: boolean }>
>('confirmButtonStatus')
watch(
  createData,
  val => {
    confirmButtonStatus.disabledRefund = true
    val.forEach(ele => {
      ele.materialList.forEach(item => {
        if (item.availableQuantity > 0 && item.refundQuantity > 0) {
          confirmButtonStatus.disabledRefund = false
        }
      })
    })
  },
  { deep: true }
)
const getData = () => {
  return createData.value
    ?.map(item => {
      const afterSaleCreateOrderMaterialReqParamList = item.materialList
        ?.filter(ele => ele.flag === 'material' && ele.refundQuantity > 0)
        .map(ele => {
          const refundAmount = computedRefundValue2(ele)
          return {
            materialUsedId: ele.materialUsedId,
            serviceItemId: ele.serviceItemId,
            materialPaidAmt: refundAmount,
            materialNum: ele.refundQuantity
          }
        })
      const { refundQuantity, serviceItemId } = item.materialList[0]
      const refundAmount = computedRefundValue2(item.materialList[0])
      return {
        serviceItemId,
        paidAmt: refundAmount,
        quantity: refundQuantity,
        afterSaleCreateOrderMaterialReqParamList
      }
    })
    .filter(
      item =>
        !(
          item.quantity === 0 &&
          item.afterSaleCreateOrderMaterialReqParamList.length === 0
        )
    )
}
const initCreate = async () => {
  const result =
    props.createData?.map(serviceItem => {
      const materialList: Material[] =
        serviceItem.materialUsedDtoList?.map(material => {
          return {
            flag: Flag.MATERIAL,
            materialId: material.fittingId,
            materialUsedId: material.materialUsedId,
            serviceItemId: serviceItem.serviceItemId,
            name: material.fittingName,
            serviceClassName: serviceItem.serviceClassName,
            insuranceMark: material.insuranceMark,
            quantity: material.usedCount,
            amount: material.paidMoney,
            availableQuantity: material.canUsedCount,
            canRefundAmt: material.canRefundAmt,
            refundQuantity: 0,
            refundAmount: 0
          }
        }) ?? []
      materialList.unshift({
        flag: Flag.SERVICEITEM,
        name: serviceItem.itemName,
        serviceItemId: serviceItem.serviceItemId,
        serviceClassName: serviceItem.serviceClassName,
        insuranceMark: serviceItem.insuranceMark,
        quantity: serviceItem.quantity,
        amount: serviceItem.paidMoney,
        availableQuantity: serviceItem.canUsedCount,
        canRefundAmt: serviceItem.canRefundAmt,
        refundQuantity: 0,
        refundAmount: 0
      })
      return { materialList }
    }) ?? []
  const materialIds = result
    .map(item =>
      item.materialList
        .filter(item => item.availableQuantity && item.amount)
        .map(item => item.materialId)
    )
    .flat()
    .filter(Boolean)
  await getMaterialInfo([...new Set(materialIds)])
  createData.value = result
}
const initEdit = async () => {
  const result = props.detailData?.map(serviceItem => {
    const materialList: Material[] =
      serviceItem.afterSaleOrderMaterialRespDTOList?.map(material => {
        return {
          flag: Flag.MATERIAL,
          materialId: material.fittingId,
          materialUsedId: material.materialUsedId,
          serviceItemId: material.serviceItemId,
          name: material.materialName,
          serviceClassName: serviceItem.serviceClassName,
          insuranceMark: material.insuranceMark,
          quantity: material.materialNum,
          amount: material.materialPaidAmt,
          availableQuantity: material.canMaterialNum,
          canRefundAmt: material.canRefundAmt,
          refundQuantity: material.usedCount,
          refundAmount: material.materialRefundAmt
        }
      }) ?? []
    materialList.unshift({
      flag: Flag.SERVICEITEM,
      name: serviceItem.itemName,
      serviceItemId: serviceItem.serviceItemId,
      serviceClassName: serviceItem.serviceClassName,
      insuranceMark: serviceItem.insuranceMark,
      quantity: serviceItem.itemNum,
      amount: serviceItem.itemPaidAmt,
      availableQuantity: serviceItem.canItemNum,
      canRefundAmt: serviceItem.canRefundAmt,
      refundQuantity: serviceItem.quantity,
      refundAmount: serviceItem.refundItemAmt
    })
    return { materialList }
  })
  const materialIds = result
    .map(item =>
      item.materialList
        .filter(item => item.availableQuantity && item.amount)
        .map(item => item.materialId)
    )
    .flat()
    .filter(Boolean)
  await getMaterialInfo([...new Set(materialIds)])
  createData.value = result
}
const initDetail = () => {
  detailData.value = props.detailData?.map(serviceItem => {
    const materialList: Material[] =
      serviceItem.afterSaleOrderMaterialRespDTOList?.map(material => {
        return {
          flag: Flag.MATERIAL,
          name: material.materialName,
          materialUsedId: material.materialUsedId,
          serviceItemId: material.serviceItemId,
          serviceClassName: serviceItem.serviceClassName,
          insuranceMark: material.insuranceMark,
          quantity: material.materialNum,
          amount: material.materialPaidAmt,
          soldQuantity: material.finishedNum,
          refundQuantity: material.usedCount,
          refundAmount: material.materialRefundAmt
        }
      }) ?? []
    materialList.unshift({
      flag: Flag.SERVICEITEM,
      name: serviceItem.itemName,
      serviceItemId: serviceItem.serviceItemId,
      serviceClassName: serviceItem.serviceClassName,
      insuranceMark: serviceItem.insuranceMark,
      quantity: serviceItem.itemNum,
      amount: serviceItem.itemPaidAmt,
      soldQuantity: serviceItem.finishedNum,
      refundQuantity: serviceItem.quantity,
      refundAmount: serviceItem.refundItemAmt
    } as Material)
    return { materialList }
  })
}

const materialPrecision = new Map<number, number>()
const getMaterialInfo = async (materialIdList: number[]) => {
  if (materialIdList?.length === 0) return
  await QueryMaterialInfo(materialIdList).then(res => {
    if (res.code === 200) {
      res.data.forEach((ele: any) =>
        materialPrecision.set(ele.materialId, ele.decimalScale)
      )
    } else {
      materialPrecision.clear()
    }
  })
}

defineExpose({ getData })
const totalRefundAmt = computed(() => {
  return createData.value
    .map(item => [...item.materialList])
    .flat()
    .filter(item => item.availableQuantity && item.amount)
    .reduce((prev: Decimal, cur) => {
      return prev.add(computedRefundValue2(cur))
    }, new Decimal(0)).toNumber()
})
const computedRefundValue = (
  quantity: number = 0, // 退货数量
  paidMoney: number = 0, // 总金额
  usedCount: number = 0 // 总数量
) => {
  if (!paidMoney || !usedCount) {
    return 0
  }
  const singlePrice = Math.floor((paidMoney / usedCount) * 100) / 100
  const refundPrice = Math.floor(singlePrice * quantity * 100) / 100
  return refundPrice
}

const computedRefundValue2 = ({
  quantity: _quantity,
  amount: _amount,
  refundQuantity: _refundQuantity,
  availableQuantity,
  canRefundAmt
}: Material) => {
  if (!_quantity || !_amount || !_refundQuantity) {
    return 0
  }

  const amount = new Decimal(_amount)
  const quantity = new Decimal(_quantity)
  const refundQuantity = new Decimal(_refundQuantity)
  // const singlePrice = Math.floor((_amount / _quantity) * 100) / 100
  // const refundPrice = Math.floor(singlePrice * _refundQuantity * 100) / 100
  // return _refundQuantity === availableQuantity ? canRefundAmt : refundPrice

  const singlePrice = amount.div(quantity)
  const refundPrice = singlePrice
    .mul(refundQuantity)
    .toDP(2, Decimal.ROUND_DOWN)
    .toNumber()
  return _refundQuantity === availableQuantity ? canRefundAmt : refundPrice
}

const objectSpanMethod = () => {
  return {
    rowspan: 1,
    colspan: 7
  }
}
const insuranceMarkMap: { [key: number]: string } = {
  0: '保外收费',
  1: '保内不收费',
  2: '保外不收费'
}
</script>
<style scoped lang="scss">
.order-view-item {
  :deep(.turn-row) {
    background-color: #f0f0f0;
    &:hover {
      background-color: #f0f0f0;
    }
  }
  :deep(.turn-cell > .cell) {
    padding: 0;
  }
}
</style>
