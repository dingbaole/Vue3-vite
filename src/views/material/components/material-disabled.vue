<template>
  <el-dialog
    v-model="dialogShow"
    title="关闭物料激励规则"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-alert
      style="width: 550px"
      title="提示：未限定激励物料的叠加规则，适用所有激励物料，但不可在激励物料中单独关闭"
      type="error"
      :closable="false"
    />
    <el-table :data="selectedList" border style="width: 100%; margin-top: 15px">
      <el-table-column property="materialNo" label="物料号" width="120" />
      <el-table-column property="materialName" label="物料名称" />
      <el-table-column
        property="price"
        label="物料单价(元)"
        width="105"
        align="center"
      >
        <template #default="scope">
          {{
            scope.row.price || scope.row.price === 0 ? scope.row.price : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column label="当前激励规则">
        <template #default="scope">
          <div>
            <el-checkbox
              v-model="scope.row.checked"
              :label="
                richRuleName(
                  scope.row.commissionType,
                  scope.row.commissionValue,
                  true
                )
              "
            />
          </div>
          <div
            v-for="(item, index) in scope.row.materialOverlayRuleList"
            :key="index"
          >
            <div style="display: flex; align-items: center">
              <el-checkbox
                v-model="item.checked"
                :disabled="item.materialRelateType === 10"
                :label="
                  richRuleName(item.commissionType, item.commissionValue, true)
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
import { CloseServiceItemRule } from '@/webapi/material'
import type { MaterialTable } from '@/webapi/material'
import { richRuleName } from '@/utils'
import { ElMessage } from 'element-plus'
export interface ISelectedList extends MaterialTable {
  checked: boolean
}

const selectedList = ref([])
const props = defineProps<{ selectedList: Array<ISelectedList> }>()

const init = () => {
  selectedList.value = props.selectedList.map(item => {
    item['checked'] = false
    if (item?.materialOverlayRuleList?.length > 0) {
      item.materialOverlayRuleList = item?.materialOverlayRuleList.map(ele => {
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
  const materialList = selectedList.value
    .map(
      ({
        checked,
        materialOverlayRuleList,
        comnanyMaterialExcitationRuleId,
        companyId,
        materialId,
        materialNo,
        materialName,
        price
      }) => {
        const overlayRuleList = materialOverlayRuleList.map(
          ({ comnanyMaterialExcitationRuleId, checked }: any) => {
            return {
              checked,
              comnanyMaterialExcitationRuleId,
              companyId,
              materialId,
              materialNo,
              materialName,
              price
            }
          }
        )
        return [
          {
            checked,
            comnanyMaterialExcitationRuleId,
            companyId,
            materialId,
            materialNo,
            materialName,
            price
          },
          ...overlayRuleList
        ]
      }
    )
    .flat()
    .filter(item => item.checked)
  if (materialList.length === 0) {
    ElMessage({
      type: 'error',
      message: '关闭激励规则不能为空'
    })
    return
  }
  confirmLoading.value = true
  CloseServiceItemRule(materialList).then(res => {
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
