<template>
  <el-dialog
    v-model="dialogShow"
    :title="`添加${mode === 'overlay' ? '指定' : ''}激励物料配件`"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-form :inline="true">
      <el-form-item label="物料号/物料名称">
        <el-select
          v-model="materialId"
          filterable
          placeholder="物料号/物料名称"
        >
          <el-option
            v-for="item in materialOptions"
            :label="`${item.materialName}(${item.materialNo})`"
            :value="item.materialId"
            :key="item.materialId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="pageData.loading" @click="search"
          >查询</el-button
        >
        <el-button @click="resetFormData">重置</el-button>
      </el-form-item>
    </el-form>
    <TableWithPagination
      ref="MaterialRef"
      row-key="materialId"
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.currentPage"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        fixed
        :reserve-selection="true"
        :selectable="selectDiabled"
        type="selection"
        width="43"
      />
      <el-table-column property="materialNo" label="物料号" width="150" />
      <el-table-column property="materialName" label="物料名称" />
      <el-table-column
        v-if="mode === 'overlay'"
        property="ruleName"
        label="激励基础规则"
      />
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
      <el-table-column
        v-if="mode === 'basic'"
        label="是否已配置基础规则"
        width="160"
        align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.ruleStatus === 19">是</span>
          <span v-if="scope.row.ruleStatus === 14">是(已失效)</span>
          <span v-if="!scope.row.ruleStatus">否</span>
        </template>
      </el-table-column>
    </TableWithPagination>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="toggleDialogStatus">取消</el-button>
        <el-button type="primary" @click="confirm">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import {
  CanusedlList,
  MaterialList,
  SetBaseMaterialList
} from '@/webapi/material'
import type { OperMaterialDetailInputList } from '@/webapi/material'
import { ElTable, ElTableColumn } from 'element-plus'

const materialId = ref(undefined)
const props = defineProps<{
  cityId: number
  companyId: number
  operMaterialDetailInputList: OperMaterialDetailInputList[]
}>()
const { cityId, companyId, operMaterialDetailInputList } = toRefs(props)

const confirm = () => {
  emit('onSelected', beforeEmit(tempOperMaterialDetailInputList.value))
  toggleDialogStatus()
}

const emit = defineEmits(['onSelected'])
const tempOperMaterialDetailInputList = ref<OperMaterialDetailInputList[]>([])
// const selectedList = ref<OperMaterialDetailInputList[]>([])
const handleSelectionChange = (selectedList: OperMaterialDetailInputList[]) => {
  // selectedList.value = val
  // selectedList与currentSelectedList 都为最新数据
  // tempOperServiceItemDetailInputs为旧数据
  // 将selectedList与currentSelectedList 进行对比，区别出当前新增与删除的数据
  // 在selectedList中，不在currentSelectedList中，为新增数据
  // 在currentSelectedList，不在selectedList中，为删除数据
  // currentSelectedList中剩余为不变数据，但是需要替换，因为currentSelectedList中数据是最新数据
  const selectedIds = selectedList.map(item => item.materialId)
  const currentIds = currentSelectedList.value.map(item => item.materialId)
  const addList = selectedList.filter(
    item => !currentIds.includes(item.materialId)
  )
  const removeList = currentSelectedList.value.filter(
    item => !selectedIds.includes(item.materialId)
  )
  const restList = currentSelectedList.value.filter(item =>
    selectedIds.includes(item.materialId)
  )
  const removeIds = removeList.map(item => item.materialId)

  // console.log('add---', addList);
  // console.log('remove---', removeList);
  // console.log('rest---', restList);

  tempOperMaterialDetailInputList.value =
    tempOperMaterialDetailInputList.value.filter(
      item => !removeIds.includes(item.materialId)
    )
  currentSelectedList.value = currentSelectedList.value.filter(
    item => !removeIds.includes(item.materialId)
  )

  for (let v of tempOperMaterialDetailInputList.value) {
    for (let k of restList) {
      if (v.materialId === k.materialId) {
        v = k
        break
      }
    }
  }

  const ids = tempOperMaterialDetailInputList.value.map(item => item.materialId)
  for (let k of addList) {
    if (!ids.includes(k.materialId)) {
      tempOperMaterialDetailInputList.value.push(k)
      currentSelectedList.value.push(k)
    }
  }
  // console.log(tempOperServiceItemDetailInputs.value);
}
const beforeEmit = (list: OperMaterialDetailInputList[]) => {
  return list
  // if (operMaterialDetailInputList.value.length === 0) {
  //   return list
  // }
  // // list 为当前由接口更新过状态的tempOperMaterialDetailInputList
  // const operList = operMaterialDetailInputList.value
  // for (let v of list) {
  //   for (let k of operList) {
  //     if (v.materialId === k.materialId) {
  //       k = v
  //       break
  //     }
  //   }
  // }
  // // 收集不存在的
  // const allIds = operMaterialDetailInputList.value.map(item => item.materialId)
  // const rest = list.filter(item => !allIds.includes(item.materialId))
  // return [...operList, ...rest]
}
const selectDiabled = (row: OperMaterialDetailInputList) => {
  return mode.value === 'basic' ? row.ruleStatus !== 19 : row.ruleStatus !== 14
}

const init = () => {
  resetFormData()
  pageData.tableData = []
  pageData.total = 0

  setTimeout(() => {
    MaterialRef.value?.tableElement.clearSelection()
    tempOperMaterialDetailInputList.value = operMaterialDetailInputList.value
  }, 0)
}

const search = () => {
  pageConfig.currentPage = 1
  getList()
}

const resetFormData = () => {
  materialId.value = undefined
}

const materialOptions = ref([])
const getMaterialList = () => {
  MaterialList({
    cityId: cityId.value,
    companyId: companyId.value
  }).then(res => {
    if (res.code === 200) {
      materialOptions.value = res.data
    }
  })
}

const pageConfig = reactive({
  currentPage: 1,
  pageSize: 10
})

const tablePageChange = ({
  currentPage,
  pageSize
}: {
  currentPage: number
  pageSize: number
}) => {
  pageConfig.currentPage = currentPage
  pageConfig.pageSize = pageSize
  getList()
}
const pageData = reactive<{
  tableData: OperMaterialDetailInputList[]
  total: number
  loading: boolean
}>({
  tableData: [],
  total: 0,
  loading: false
})
const returnSaveApi = () => {
  return mode.value === 'overlay' ? SetBaseMaterialList : CanusedlList
}
const getList = () => {
  pageData.loading = true
  returnSaveApi()({
    cityId: cityId.value,
    companyId: companyId.value,
    materialId: materialId.value,
    ...pageConfig
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      pageData.tableData = res.data.dataList
      pageData.total = res.data.totalCount
      setTimeout(() => {
        handleSelected(res.data.dataList)
      }, 0)
    }
  })
}

const MaterialRef = ref()
const currentSelectedList = ref<OperMaterialDetailInputList[]>([])
const handleSelected = (data: OperMaterialDetailInputList[]) => {
  // 所有数据
  const allSelectedIds = operMaterialDetailInputList.value.map(
    item => item.materialId
  )
  // 当前页匹配的数据
  currentSelectedList.value = data.filter(item =>
    allSelectedIds.includes(item.materialId)
  )
  // 选中列表数据，会触发handleSelectionChange事件
  currentSelectedList.value.forEach(ele => {
    MaterialRef.value?.tableElement.toggleRowSelection(ele, true)
  })
}

const dialogShow = ref(false)
const mode = ref<'basic' | 'overlay' | undefined>('basic')
const toggleDialogStatus = (_mode?: 'basic' | 'overlay') => {
  if (!dialogShow.value) {
    if (_mode) mode.value = _mode
    init()
    getMaterialList()
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss">
.module-box {
  margin-bottom: 10px;
  &-desc {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    &__input {
      width: 360px;
      margin-left: 10px;
    }
    &__button {
      margin-left: 10px;
    }
  }
}
</style>
