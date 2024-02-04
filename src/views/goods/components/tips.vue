<template>
  <div class="tips-word">
    <el-popover placement="top-start" :width="450" trigger="hover">
      <template #default>
        <p>超出阶梯累加计算说明：</p>
        <p>一、比例阶梯设置为：</p>
        <p>1、成交单价在0~80，比例5%</p>
        <p>2、成交单价在80~100，比例8%</p>
        <p>3、成交单价在100-120，比例10%</p>
        <div style="font-size: 12px; color: #333">
          假设成交价是110，若选择按超出阶梯累加计算方法 (同个税计算方法)，
          <br />
          则激励金额=80*5%+（100-80）*8%+（110-100）*10% = 6.6
        </div>
      </template>
      <template #reference>
        <el-icon><QuestionFilled /></el-icon>
      </template>
    </el-popover>
  </div>
</template>
<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
</script>
<style scoped lang="scss">
.tips-word {
  line-height: 1;
}
</style>
