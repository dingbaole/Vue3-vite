<template>
  <div class="recommend-material-list">
    <el-form :inline="true">
      <el-form-item label="物料名称关键字" prop="orderNo">
        <el-input
          v-model="materialName"
          placeholder="物料名称关键字"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="tableData.loading" @click="search">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 8px">
      说明：根据关键字模糊查找已配置激励的物料！
    </div>
    <el-table
      :data="tableData.data"
      v-loading="tableData.loading"
      highlight-current-row
      style="width: 100%"
      max-height="400"
      border
      @current-change="handleCurrentChange"
    >
      <el-table-column property="materialName" label="已配置激励物料" />
      <el-table-column property="ruleDesc" label="激励基础规则" />
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ row }">
          <el-button
            type="text"
            :loading="submit2Loading === row.materialId"
            @click="submit2(row)"
            >应用此规则</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px; padding-left: 10px; font-weight: bold">
      累计 {{ tableData.data.length }} 条数据
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, inject } from 'vue'
import {
  ManualConfigOtherMaterialList,
  ManualConfigOtherMaterial
} from '@/webapi/recommendConfig'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  companyId: number
  materialId: number
  materialNo: string
  companyUnconfigExcitationMaterialItemId: number
}>()
const materialName = ref()
const tableData = reactive({
  data: [],
  loading: false
})

onMounted(() => {
  search()
})
const search = () => {
  tableData.loading = true
  ManualConfigOtherMaterialList({
    materialName: materialName.value,
    companyId: props.companyId
  }).then(res => {
    tableData.loading = false
    if (res.code === 200) {
      tableData.data = res.data
    }
  })
}
const currentRow = ref()
const handleCurrentChange = (val: any) => {
  currentRow.value = val
}

const closeAndConfirm = inject<() => void>('cac')
const submit2Loading = ref()
const submit2 = (row: any) => {
  const {
    materialId,
    comnanyMaterialExcitationRuleId,
    companyId,
    ruleGroup,
    commissionType,
    commissionValue
  } = row
  submit2Loading.value = materialId
  ManualConfigOtherMaterial({
    materialId: props.materialId,
    materialNo: props.materialNo,
    companyUnconfigExcitationMaterialItemId:
      props.companyUnconfigExcitationMaterialItemId,
    comnanyMaterialExcitationRuleId,
    companyId,
    ruleGroup,
    commissionType,
    commissionValue
  }).then(res => {
    submit2Loading.value = undefined
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '应用成功'
      })
      closeAndConfirm()
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}
const submit = () => {
  return new Promise((relove, reject) => {
    if (!currentRow.value) {
      reject({
        message: '请选择激励物料'
      })
    }
    const {
      materialId,
      comnanyMaterialExcitationRuleId,
      companyId,
      ruleGroup,
      commissionType,
      commissionValue
    } = currentRow.value
    ManualConfigOtherMaterial({
      materialId,
      materialNo: props.materialNo,
      companyUnconfigExcitationMaterialItemId:
        props.companyUnconfigExcitationMaterialItemId,
      comnanyMaterialExcitationRuleId,
      companyId,
      ruleGroup,
      commissionType,
      commissionValue
    }).then(res => {
      if (res.code === 200) {
        relove({
          type: 'success',
          message: '应用成功'
        })
      } else {
        reject({
          message: res.message
        })
      }
    })
  })
}

defineExpose({
  submit
})
</script>
<style scoped lang="scss">
.recommend-material-list {
}
</style>
