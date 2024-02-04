<template>
  <div>
    <el-descriptions :column="3" border>
      <el-descriptions-item label="订单编号">{{ selectRow[0].orderNo }}</el-descriptions-item>
      <el-descriptions-item label="关联SAP销售单号">{{ selectRow[0].relateOrderNo }}</el-descriptions-item>
      <el-descriptions-item label="商品名称">{{ selectRow[0].goodsName }}</el-descriptions-item>
      <el-descriptions-item label="关联物料号">
        <el-tag size="small">{{ selectRow[0].materialNo }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="数量">{{ selectRow[0].quantity }}</el-descriptions-item>
      <el-descriptions-item label="实收金额">{{ selectRow[0].paidAmount }}</el-descriptions-item>
      <el-descriptions-item label="激励金额">{{ selectRow[0].commissionAmount }}</el-descriptions-item>
      <el-descriptions-item label="发放金额">{{ selectRow[0].firstCommissionAmount }}</el-descriptions-item>
      <el-descriptions-item label="结余金额">{{ selectRow[0].remainCommissionAmount }}</el-descriptions-item>
    </el-descriptions>
    <div style="margin-top: 10px;">
      <el-form :model="adjustForm" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="修改后激励金额">
              <el-input v-model="adjustForm.commissionAmount" @input="moneyInput" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改后发放金额">
              <el-input v-model="adjustForm.amendGrantMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改后结余金额">
              <el-input v-model="adjustForm.amendSurplusMoney" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="修改调整说明">
              <el-input v-model="adjustForm.remark" :rows="3" type="textarea" placeholder="最多100个文字" show-word-limit
                maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, toRefs, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { UseAction } from '@/components/dialog'
import { updateAdjust } from "@/webapi/incentive-proofread";
const props = defineProps<{
  active: any
  selectRow: any
  initData: any,
  useAction: UseAction
}>()

const { active, initData, selectRow } = toRefs(props)
const adjustForm = reactive({ remark: undefined, commissionAmount: undefined, amendGrantMoney: undefined, amendSurplusMoney: undefined })
// 激励调整提交
props.useAction.confirm.executor(async () => {
  let res = await updateAdjust({
    ...selectRow.value[0],
    companyMonthStatementExcitationCheckId: initData.value.companyMonthStatementExcitationCheckId,
    checkStatus: active.value,
    companyId: initData.value.companyId,
    ...adjustForm
  })
  if (res.code != 200) {
    ElMessage.error(res.message)
    return Promise.reject()
  }else{
    ElMessage.success('激励调整成功')
  }
})

const moneyInput = (value: any) => {
  console.log(value)
  let data = value.replace(/^([0-9-]\d*\.?\d{0,2})?.*$/, '$1')
  // let data: any = value.replace(/[^-\d.]/g, '') // 移除非数字、负号和小数点的字符
  //     .replace(/^(-)\-/g, '$1') // 仅保留一个负号
  //     .replace(/(\.\d\d)\d*/g, '$1') // 保留小数点后两位
  //     .replace(/^(-?\d*\.?\d*)$/, '$1'); // 仅保留一个负号和整数部分
  let firstPayCoefficient = selectRow.value[0].firstPayCoefficient
  let amendGrantMoney: any = data * firstPayCoefficient + ''
  let amendSurplusMoney: any = data - amendGrantMoney + ''
  // let firstPayCoefficient: any = '0.9'
  console.log(data)
  adjustForm.commissionAmount = data
  adjustForm.amendGrantMoney = data != '-' ? Number(amendGrantMoney).toFixed(2) : 0.00
  adjustForm.amendSurplusMoney = data != '-' ? Number(amendSurplusMoney).toFixed(2) : 0.00
}
</script>
<style lang='scss' scoped></style>