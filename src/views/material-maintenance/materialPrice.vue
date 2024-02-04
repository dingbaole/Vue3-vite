<template>
  <div class="wrap">
    <div class="header">
      <span>查询条件</span>
    </div>
    <el-radio-group v-model="model" size="small" style="margin-bottom: 10px;">
      <el-radio-button label="1">燃控物料</el-radio-button>
      <el-radio-button label="2">非燃控物料</el-radio-button>
    </el-radio-group>
    <TableList :type="1" v-show="model == 1"></TableList>
    <TableList :type="2" v-show="model == 2"></TableList>
  </div>

</template>

<script setup lang="ts">
import { ref } from "vue";
import TableList from "@/views/material-maintenance/components/tableList.vue";
let model = ref<any>(1) //燃和非燃状态
</script>

<style scoped lang="scss">
.wrap {
  padding: 20px;
}

.header {
  border-bottom: 1px solid #C5C4C4;
  padding: 10px 0;
  padding-left: 20px;
  margin-bottom: 15px;

  span {
    font-weight: bolder;
    font-size: 18px;
  }
}
</style>

