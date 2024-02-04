<template>
  <div>
    <div class="pText">
      <p>确认作废激励吗？</p>
      <p>作废后，将不再核对核查此激励，后续核查完成后，会通知员工激励作废及原因！</p>
    </div>
    <div>
      <p style="font-weight: bold;font-size: 18px;">作废原因：</p>
      <el-input v-model="reasonsForVoiding" :rows="3" type="textarea" placeholder="最多100个文字" show-word-limit
        maxlength="100" />
    </div>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="incentiveInvalidPopStatus = false">取消</el-button>
        <el-button type="primary" @click="invalidConfirm">
          确定
        </el-button>
      </span>
    </template> -->
  </div>
</template>

<script lang='ts' setup>
import { ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { updateCancel, } from "@/webapi/incentive-proofread";
import type { UseAction } from '@/components/dialog'
const reasonsForVoiding = ref('')
const props = defineProps<{
  active: any
  selectRow: any
  initData: any,
  useAction: UseAction
}>()
const { active, initData, selectRow } = toRefs(props)
// console.log(11111)
// console.log(active, initData, selectRow)
// 激励作废
props.useAction.confirm.executor(async () => {
  let res = await updateCancel({
    companyId: initData.value.companyId,
    companyMonthStatementExcitationCheckId: initData.value.companyMonthStatementExcitationCheckId,
    checkStatus: active.value,
    remark: reasonsForVoiding.value,
    checkOrderExcitationItemInputList: [...selectRow.value]
  })
  if (res.code != 200) {
    ElMessage.error(res.message)
    return Promise.reject()
  }else{
    ElMessage.success('激励作废成功')
  }
})
</script>
<style lang='scss' scoped>
.pText {
  font-size: 18px;

  p {
    margin: 5px 0;
  }
}
</style>