<template>
  <div id="body">
    <!-- <div id="header">
            <h1>核算激励</h1>
        </div>
        <el-divider /> -->
    <div id="box">

      <el-card shadow="never" style="margin-bottom: 10px;">
        <div id="infor">
          <div>
            <label>公司名称：</label>
            <span>{{ initData.companyName }}</span>
          </div>
          <div>
            <label>激励类型：</label>
            <span>{{ initData.excitationTypeName }}</span>
          </div>
          <div>
            <label>账期月份：</label>
            <span>{{ initData.statementMonthName }}</span>
          </div>
        </div>

      </el-card>

      <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="待核算" name="13">
          <AccountingTab active="13" :initData="initData"></AccountingTab>
        </el-tab-pane>
        <el-tab-pane label="已核算" name="15">
          <AccountingTab active="15" :initData="initData"></AccountingTab>
        </el-tab-pane>
        <el-tab-pane label="已作废" name="14">
          <AccountingTab active="14" :initData="initData"></AccountingTab>
        </el-tab-pane>
        <!-- <el-tab-pane label="Task" name="3">Task</el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
    
<script lang='ts' setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import AccountingTab from "@/views/incentive-proofread/component/accountingTab.vue";
import { accountingInitData } from "@/webapi/incentive-proofread";
const activeName = ref('13')
const props: any = defineProps({
  id: String,
  companyId: String,
})
const initData = ref({ excitationTypeName: '', companyName: '', statementMonthName: '', startTime: '', endTime: '' })
onMounted(() => {
  accountingInitData({ companyMonthStatementExcitationCheckId: props.id, companyId: props.companyId }).then(res => {
    initData.value = res.data.list[0]
  })
})
const handleClick = () => {
  console.log(activeName.value)
}
</script>
<style lang='scss' scoped>
#header {}

:deep(.el-divider--horizontal) {
  margin: 10px 0;
}

#box {
  // padding: 0 20px;

  #infor {
    display: flex;
    // margin-bottom: 10px;
  }
}

h1 {
  padding: 0;
  margin: 0;
  font-size: 18px;
  padding-top: 10px;
  padding-left: 20px;
}

#body {
  // min-height: 80vh;
}

#infor {
  >div {
    margin-right: 20px;
  }
}
</style>