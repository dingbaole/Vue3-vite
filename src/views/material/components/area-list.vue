<template>
  <el-dialog
    v-model="dialogShow"
    title="添加指定服务区域"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-form :inline="true">
      <el-form-item label="服务区域名称">
        <el-input
          style="width: 180px"
          v-model="formData.areaName"
          clearable
          placeholder="服务区域名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="pageData.loading" @click="search"
          >查询</el-button
        >
        <el-button @click="resetFormData">重置</el-button>
      </el-form-item>
    </el-form>
    <Tree
      defaultExpandAll
      checkable
      :key="(pageData.loading as any)"
      v-model:checkedKeys="checkedKeys"
      v-model:selectedKeys="selectedKeys"
      :tree-data="(pageData.tableData as any)"
      :field-names="fieldNames"
    >
    </Tree>
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
import { MaterialAreaList } from '@/webapi/material'
import { ServiceItemAreaList } from '@/webapi/serviceItem'
import type { ServiceAreaRelateList } from '@/webapi/material'
import { Tree } from 'ant-design-vue'
import type { TreeProps } from 'ant-design-vue'
import 'ant-design-vue/es/tree/style/css'
import type { CompanyItem } from '@/store/modules/common'

const emit = defineEmits(['onSelected'])
const props = defineProps<{
  companyId: number | undefined
  companyList: any[]
  serviceAreaRelateList: ServiceAreaRelateList[]
}>()
const { companyId, companyList, serviceAreaRelateList } = toRefs(props)

const formData = reactive({
  areaName: ''
})
const init = () => {
  resetFormData()
  pageData.tableData = []
  tempKeys.value = []
  checkedKeys.value = []
  selectedKeys.value = []
}
const search = () => {
  getList()
}

const resetFormData = () => {
  formData.areaName = ''
}

const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  title: 'label',
  key: 'value'
}

const pageData = reactive<{
  tableData: TreeNode[]
  loading: boolean
  resData: {
    stationInfoList: Station[]
    serviceAreaList: Area[]
  }
}>({
  tableData: [],
  resData: {
    stationInfoList: [],
    serviceAreaList: []
  },
  loading: false
})

const returnApi = () => {
  return mode.value === 'material' ? MaterialAreaList : ServiceItemAreaList
}

const getList = () => {
  pageData.loading = true
  returnApi()({
    companyId: companyId.value
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      const { stationInfoList, serviceAreaList } = (pageData.resData = res.data)
      pageData.tableData = mountNode(
        stationInfoList,
        filterEmpList(serviceAreaList)
      )

      const ids = serviceAreaRelateList.value.map(item => item.serviceAreaId)
      tempKeys.value = [...ids, ...tempKeys.value]
      if (tempKeys.value.length > 0) {
        selectedKeys.value = tempKeys.value
        checkedKeys.value = tempKeys.value
      }
      if (!formData.areaName) {
        tempKeys.value = []
      }
    }
  })
}
const tempKeys = ref([]) // 临时存放筛选前的数据
const checkedKeys = ref<number[]>([])
const selectedKeys = ref<number[]>([])
const filterEmpList = (empList: Area[]) => {
  const allNodeLeafIds = allLefaNodeIds()
  const checkedIds = checkedKeys.value.filter(item =>
    allNodeLeafIds.includes(item)
  )
  tempKeys.value = [...new Set([...tempKeys.value, ...checkedIds])]
  return empList.filter(item => {
    if (item.areaName.indexOf(formData.areaName) > -1) {
      return true
    }
  })
}

interface TreeNode {
  value: number
  label: string
  children?: TreeNode[]
  [x: string]: any
}

interface Area {
  serviceAreaId: number
  areaName: string
  stationId: number
  stationName: string
}

interface Station {
  stationId: number
  stationName: string
  children?: []
}

const genRootTreeNode = (companyList: CompanyItem[]) => {
  const companyItem = companyList.filter(
    item => item.companyId === companyId.value
  )
  const companyName =
    companyItem?.length > 0 ? companyItem[0]['companyName'] : '--'
  const rootNode: TreeNode = {
    value: 1,
    label: companyName,
    children: []
  }
  return rootNode
}
const genStationMap = (stationList: Station[]) => {
  const stationMap: Map<number, TreeNode> = new Map()
  stationList.forEach(item => {
    const { stationId: value, stationName: label } = item
    stationMap.set(value, {
      value,
      label,
      children: [],
      ...item
    })
  })
  return stationMap
}
const mountNode = (stationList: Station[], empList: Area[]) => {
  const rootNode = genRootTreeNode(companyList.value)
  const stationMap = genStationMap(stationList)
  empList.forEach(item => {
    const element = {
      isLeaf: true,
      value: item.serviceAreaId,
      label: `${item.areaName}`,
      ...item
    }
    if (stationMap.has(element.stationId)) {
      stationMap.get(item.stationId).children.push(element)
    } else {
      rootNode.children.push(element)
    }
  })
  rootNode.children = [
    ...rootNode.children,
    ...[...stationMap.values()].filter(item => item.children.length > 0)
  ]
  return [rootNode]
}

const allLefaNodeIds = () => {
  return pageData.resData.serviceAreaList.map(item => item.serviceAreaId)
}

const genSelectedEmpList = () => {
  const allNodeLeafIds = allLefaNodeIds()
  const checkedIds = [
    ...new Set([...checkedKeys.value, ...tempKeys.value])
  ].filter(item => allNodeLeafIds.includes(item))
  const checkedNodeLeaf = checkedIds.map(item => {
    const stationIds: number[] = []
    let element: Partial<Area> = {}
    pageData.resData.serviceAreaList.forEach(ele => {
      if (ele.serviceAreaId === item) {
        stationIds.push(ele.stationId)
        element = ele
      }
    })
    return {
      stationIds,
      ...element
    }
  })
  const stationMap = genStationMap(pageData.resData.stationInfoList)
  return checkedNodeLeaf.map(item => {
    let nodeLeafStationLabel = ''
    item.stationIds.forEach(ele => {
      if (stationMap.has(ele)) {
        nodeLeafStationLabel += `${stationMap.get(ele).label}, `
      }
    })
    nodeLeafStationLabel = nodeLeafStationLabel.slice(0, -2)
    return {
      nodeLeafStationLabel,
      ...item
    }
  })
}

const confirm = () => {
  emit('onSelected', genSelectedEmpList())
  toggleDialogStatus()
}
type Mode = 'serviceItem' | 'material'
const mode = ref<Mode>('serviceItem')
const dialogShow = ref(false)
const toggleDialogStatus = (_mode?: Mode) => {
  if (!dialogShow.value) {
    if (_mode) {
      mode.value = _mode
    }
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
