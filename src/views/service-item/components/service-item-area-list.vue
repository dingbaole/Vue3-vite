<template>
  <el-dialog
    v-model="dialogShow"
    title="添加指定服务区域"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-form :inline="true">
      <el-form-item label="服务区域名称">
        <el-input v-model="formData.areaName" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="pageData.loading" @click="search"
          >查询</el-button
        >
        <el-button @click="resetFormData">重置</el-button>
      </el-form-item>
    </el-form>
    <el-tree
      ref="treeRef"
      :data="pageData.tableData"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
    />
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
import { ServiceItemAreaList } from '@/webapi/serviceItem'
import type { ServiceAreaRelateList } from '@/webapi/serviceItem'
import { ElTree } from 'element-plus'

const formData = reactive({
  areaName: ''
})
const defaultProps = {
  children: 'children',
  label: 'label'
}
const treeRef = ref<InstanceType<typeof ElTree>>()
const props = defineProps<{
  companyId: number | undefined
  companyList: any[]
  serviceAreaRelateList: ServiceAreaRelateList[]
}>()
const { companyId, companyList, serviceAreaRelateList } = toRefs(props)

const init = () => {
  resetFormData()
  pageData.tableData = []
}

const search = () => {
  getList()
}

const resetFormData = () => {
  formData.areaName = ''
}

const pageData = reactive<{
  tableData: TreeNode[]
  loading: boolean
}>({
  tableData: [],
  loading: false
})

const getList = () => {
  pageData.loading = true
  ServiceItemAreaList({
    companyId: companyId.value
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      const { stationInfoList, serviceAreaList } = res.data
      pageData.tableData = genTree(stationInfoList, serviceAreaList)
      const ids = serviceAreaRelateList.value.map(item => item.serviceAreaId)
      treeRef.value?.setCheckedKeys(ids, false)
    }
  })
}

interface TreeNode {
  id: number
  label: string
  children: TreeNode[]
  [x: string]: any
}
const genTree = (stationInfoList: any[], serviceAreaList: any[]) => {
  const companyName = companyList.value.filter(
    item => item.companyId === companyId.value
  )[0]['companyName']
  const rootNode: TreeNode = {
    id: 0,
    label: companyName,
    children: []
  }
  const stationMap: any = {}
  stationInfoList = stationInfoList.map(item => {
    item['id'] = item['stationId']
    item['label'] = item['stationName']
    item['children'] = []
    stationMap[item.stationId] = item
    return item
  })
  serviceAreaList.forEach(item => {
    if (stationMap[item.stationId]) {
      stationMap[item.stationId]['children'].push({
        id: item['serviceAreaId'],
        label: item['areaName'],
        isLeaf: true,
        ...item
      })
    }
  })
  rootNode['children'] = stationInfoList
  return [rootNode]
}

const confirm = () => {
  const res = treeRef.value
    ?.getCheckedNodes(false, false)
    ?.filter(item => item.isLeaf)
  emit('onSelected', res)
  toggleDialogStatus()
}

const emit = defineEmits(['onSelected'])

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
