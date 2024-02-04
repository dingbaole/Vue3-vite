<template>
  <el-button type="success" @click="dialogShow = true" plain
    >常见企业商品零售激励规则</el-button
  >
  <el-dialog
    v-model="dialogShow"
    width="800px"
    :title="`企业零售商品常见激励规则`"
  >
    <template #header>
      <div style="text-align: center; font-size: 18px; font-weight: bold">
        企业零售商品常见激励规则
      </div>
    </template>
    <p
      style="
        margin-top: 15px;

        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
        font-size: 16px;
        font-weight: bold;
      "
    >
      常见激励场景1：<span style="color: rgb(2, 167, 240)"
        >销售激励按定额分配</span
      >
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      企业零售商品常见激励规则
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      示例：民用报警器 (198 元/个)
      ，激励总额为毛利的20%，业务线激励为激励总额的80%。
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      <span
        style="
          font-family: PingFangSC-Semibold, 'PingFang SC Semibold',
            'PingFang SC';
          font-weight: 650;
        "
        >激励规则配置方法</span
      >：首先把毛利比例的激励换算成定额，假设毛利*20%*80%≈10，则再按场景1的规则设置方法配置民用报警器的激励规则。
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      激励计算：①员工销售1件后，获取的激励=1*10=10；②员工销售2件后，获取的激励=2*10=20。
    </p>
    <p
      style="
        margin-top: 15px;

        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
        font-size: 16px;
        font-weight: bold;
      "
    >
      常见激励场景2：<span style="color: rgb(2, 167, 240)"
        >业务线按激励总额(即按毛利的一定比例激励)的标准比例激励</span
      >
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      适用场景:按销售额比例分配销售激励
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      示例：灶具-格瑞泰-JZT-C050S (289元/个)，销售激励占销售额6%
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      <span
        style="
          font-family: PingFangSC-Semibold, 'PingFang SC Semibold',
            'PingFang SC';
          font-weight: 650;
        "
        >激励规则配置方法</span
      >：创建商品基础规则，选择“比例激励”类型，填写比例6%，在选择商品“灶具-格瑞泰-JZT-C050S”。
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      激励计算①员工销售1件后，获取的激励=1*289*6%=17.34；②员工销售2件后，获取激励=2*289*6%=34.68。
    </p>
    <p
      style="
        margin-top: 15px;

        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
        font-size: 16px;
        font-weight: bold;
      "
    >
      常见激励场景3：<span style="color: rgb(2, 167, 240)"
        >按销售额比例分配销售激励</span
      >
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      示例：燃气灶具，采购成本价100，指导价150，标牌价180
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      ①实际成交价=成本价，激励0 ；
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      ②【（采购价+直接费用）*1.1】≤实际成交价＜指导价，激励为：实际成交价*标准计提比例*70%(假设价格区间换算设置为100~150，激励销售额比例7%)；
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      ③实际成交价=指导价，激励为：实际成交价*标准计提比例*70%
      (激励假设换算成激励销售额比例7%，同阶梯2)；
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      ④指导价＜P≤标牌价，激励为：指导价*标准计提比例+（实际成交价-标牌价）*30%（激励假设换算销售额比例8%）。
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      <span
        style="
          font-family: PingFangSC-Semibold, 'PingFang SC Semibold',
            'PingFang SC';
          font-weight: 650;
        "
        >激励规则配置方法</span
      >：创建商品激励基础规则，选择“比例激励”，接着打开阶梯激励。配置2个成交价阶梯，如下：
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      阶梯1：成交价配置在101~150区间，销售额比例填写7%
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      阶梯2：成交价配置在150~180区间，销售额比例填写8%
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      最后选择燃气灶具。
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      激励计算：
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      ①员工销售1件后，实际成交单价（100），获取的激励=0；②员工销售1件后，实际成交单价（120），处于100~150阶梯区间，获取的激励=1*120*7%=8.4；③员工销售1件厚，实际成交单价（160），属于150~180阶梯区间，获取的激励=1*160*8%=12.8
    </p>
    <p
      style="
        margin-top: 15px;

        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
        font-size: 16px;
        font-weight: bold;
      "
    >
      常见激励场景4：<span style="color: rgb(2, 167, 240)"
        >商品零售实际成交价在成本价、指导价、标牌价间的不同区间，分档激励</span
      >
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      示例：格瑞泰品牌燃气灶具S084，销售价350元/台，员工现场销售激励50元/件，而员工通过社群/企微分享给用户激励商品后，用户自行下单完成后则激励员工60元/件。
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      <span
        style="
          font-family: PingFangSC-Semibold, 'PingFang SC Semibold',
            'PingFang SC';
          font-weight: 650;
        "
        >激励规则配置方法</span
      >：
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      创建商品激励基础规则，选择“固定激励”，填写激励金额50，选择“格瑞泰品牌燃气灶具S084&quot;，提交基础规则；
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      然后，创建商品激励叠加规则，选择“定额叠加”，填写定额10元，限定条件中添加选择“适用指定激励商品”，再选择“格瑞泰品牌燃气灶具S084&quot;，再添加限定条件适用集市下单渠道，选择“线上分销”，提交叠加规则
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      激励计算：
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      ①员工面对客户现场销售1件该商品后，员工即获取的激励=50；
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      ②员工分享商品给用户，用户自购该商品后，员工获取的激励=基础激励（1*50）+叠加激励（1*10）=60
    </p>
    <p
      style="
        margin-top: 15px;

        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
        font-size: 16px;
        font-weight: bold;
      "
    >
      常见激励场景5：<span style="color: rgb(2, 167, 240)"
        >集市不同下单渠道，给予一线员工不同的激励</span
      >
    </p>
    <p
      style="
        margin-top: 20px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      其他说明：
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      1.商品销售订单完成后才会激励员工；
    </p>
    <p
      style="
        margin-top: 0px;
        padding-left: 30px;
        margin-bottom: 0px;
        text-rendering: optimizelegibility;
        font-feature-settings: 'kern';
        font-kerning: normal;
      "
    >
      2.商品订单产生售后退货，对于原激励计算金额，系统将自动产生一条扣减的激励数据。
    </p>
    <p>
      <br />
    </p>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dialogShow = ref(false)
</script>

<style scoped lang="scss"></style>
