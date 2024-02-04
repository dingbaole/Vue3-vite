<template>
  <el-dialog
    v-model="dialogShow"
    title="关闭服务激励规则"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-alert
      style="width: 650px"
      title="提示：未限定激励服务项目的叠加规则，适用所有激励服务项目，但不可在激励服务项目中单独关闭"
      type="error"
      :closable="false"
    />
    <el-table :data="selectedList" border style="width: 100%; margin-top: 15px">
      <el-table-column property="bigClassName" label="服务大类" width="150" />
      <el-table-column property="deviceName" label="设备" width="150" />
      <el-table-column
        property="serviceClassName"
        label="服务品类"
        width="180"
      />
      <el-table-column property="serviceItemName" label="服务项目" />
      <el-table-column
        property="serviceFee"
        label="项目单价(元)"
        width="105"
        align="center"
      >
        <template #default="scope">
          {{
            scope.row.serviceFee || scope.row.serviceFee === 0
              ? scope.row.serviceFee
              : '--'
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
            v-for="(item, index) in scope.row.serviceItemOverlayRuleList"
            :key="index"
          >
            <div style="display: flex; align-items: center">
              <el-checkbox
                v-model="item.checked"
                :disabled="item.serviceItemRelateType === 10"
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
import { CloseServiceItemRule } from '@/webapi/serviceItem'
import type { ServiceItemTable } from '@/webapi/serviceItem'
import { richRuleName } from '@/utils'
import { ElMessage } from 'element-plus'
export interface ISelectedList extends ServiceItemTable {
  checked: boolean
}

const selectedList = ref<Array<ISelectedList>>([])
const props = defineProps<{ selectedList: Array<ISelectedList> }>()

const init = () => {
  selectedList.value = props.selectedList.map(item => {
    item['checked'] = false
    if (item?.serviceItemOverlayRuleList?.length > 0) {
      item.serviceItemOverlayRuleList = item?.serviceItemOverlayRuleList.map(
        ele => {
          ele['checked'] = false
          return ele
        }
      )
    }
    return item
  })
}

const emit = defineEmits(['isConfirm'])
const confirmLoading = ref(false)
const confirm = () => {
  const serviceItemList = selectedList.value
    .map(item => {
      const {
        checked,
        comnanyItemExcitationRuleId,
        companyId,
        serviceItemId,
        serviceItemName
      } = item
      const overlayRuleList = item.serviceItemOverlayRuleList.map(
        ({ checked, comnanyItemExcitationRuleId }) => {
          return {
            checked,
            comnanyItemExcitationRuleId,
            companyId,
            serviceItemId,
            serviceItemName
          }
        }
      )
      return [
        {
          checked,
          comnanyItemExcitationRuleId,
          companyId,
          serviceItemId,
          serviceItemName
        },
        ...overlayRuleList
      ]
    })
    .flat()
    .filter(item => item.checked)
  if (serviceItemList.length === 0) {
    ElMessage({
      type: 'error',
      message: '关闭激励规则不能为空'
    })
    return
  }
  confirmLoading.value = true
  CloseServiceItemRule(serviceItemList).then(res => {
    confirmLoading.value = false
    if (res.code === 200) {
      ElMessage({
        message: '操作成功',
        type: 'success'
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
