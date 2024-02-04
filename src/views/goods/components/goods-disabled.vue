<template>
  <el-dialog
    v-model="dialogShow"
    title="关闭商品激励规则"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-alert
      style="margin-top: 10px; width: 580px"
      title="提示：未限定激励商品的叠加规则，适用所有激励商品，但不可在激励商品中单独关闭"
      type="error"
      :closable="false"
    />
    <el-table :data="selectedList" border style="width: 100%; margin-top: 15px">
      <el-table-column property="skuNo" label="SKU编号" width="120" />
      <el-table-column property="goodsName" label="商品名称" />
      <el-table-column
        property="goodsType"
        label="商品类型"
        width="110"
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
      <el-table-column property="materialNo" label="关联物料号" width="120" />
      <el-table-column
        property="price"
        label="商品单价(元)"
        width="105"
        align="center"
      >
        <template #default="scope">
          {{
            scope.row.goodsPrice || scope.row.goodsPrice === 0
              ? scope.row.goodsPrice
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column label="当前激励规则">
        <template #default="scope">
          <div
            v-for="(item, index) in scope.row.excitationRuleOutputs"
            :key="index"
          >
            <div style="display: flex; align-items: center">
              <el-checkbox
                v-model="item.checked"
                :disabled="item.goodsRelateType === 10"
                :label="
                  item.ladderType === LadderType.Y
                    ? '阶梯激励'
                    : richRuleName(
                        item.commissionType,
                        item.commissionValue,
                        true
                      )
                "
              />
              <el-tag
                style="margin-left: 10px"
                effect="light"
                type=""
                size="small"
                v-if="item.ruleStatus === 15"
                >待生效</el-tag
              >
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="toggleDialogStatus">取消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirm"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CloseServiceItemRule } from '@/webapi/goods'
import type { IViewExcitationGoods } from '@/webapi/goods'
import { richRuleName } from '@/utils'
import { ElMessage } from 'element-plus'
import { LadderType } from '@/global'
export interface ISelectedList extends IViewExcitationGoods {
  checked: boolean
}

const selectedList = ref([])
const props = defineProps<{ selectedList: Array<ISelectedList> }>()

const init = () => {
  selectedList.value = props.selectedList.map(item => {
    if (item?.excitationRuleOutputs?.length > 0) {
      item.excitationRuleOutputs = item?.excitationRuleOutputs.map(ele => {
        ele['checked'] = false
        return ele
      })
    }
    return item
  })
}

const emit = defineEmits(['isConfirm'])
const confirmLoading = ref(false)
const confirm = () => {
  const goodsList = selectedList.value
    .map(item => {
      const { companyId, goodsId, skuNo } = item
      const list = item.excitationRuleOutputs
        .filter((item: any) => item.checked)
        .map(({ comnanyGoodsExcitationRuleId, ruleName }: any) => {
          return {
            companyId,
            goodsId,
            comnanyGoodsExcitationRuleId,
            ruleName,
            skuNo
          }
        })
      return list
    })
    .flat()
  if (goodsList.length === 0) {
    ElMessage({
      type: 'error',
      message: '关闭激励规则不能为空'
    })
    return
  }
  confirmLoading.value = true
  CloseServiceItemRule(goodsList).then(res => {
    confirmLoading.value = false
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
      emit('isConfirm')
      setTimeout(() => {
        toggleDialogStatus()
      }, 500)
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}
const dialogShow = ref(false)
const toggleDialogStatus = () => {
  if (!dialogShow.value) {
    init()
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss"></style>
