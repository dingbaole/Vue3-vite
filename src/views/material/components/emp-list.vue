<template>
  <el-dialog
    v-model="dialogShow"
    title="添加指定组织人员"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-form :inline="true">
      <el-form-item label="人员姓名">
        <el-input
          style="width: 180px"
          v-model="formData.empName"
          clearable
          placeholder="人员姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="人员手机号">
        <el-input
          style="width: 180px"
          v-model="formData.empPhone"
          clearable
          placeholder="人员手机号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="pageData.loading" @click="search"
          >查询</el-button
        >
        <el-button @click="resetFormData">重置</el-button>
      </el-form-item>
    </el-form>
    <el-alert
      style="width: 680px; margin-bottom: 20px"
      title="提醒：以下服务站会呈现自有归属员工和非本站的服务员工，旨为方便快速锁定指定员工并做选择！"
      type="error"
      :closable="false"
    />
    <Tree
      defaultExpandAll
      checkable
      :key="(pageData.loading as any)"
      v-model:checkedKeys="checkedKeys"
      v-model:selectedKeys="selectedKeys"
      :tree-data="(pageData.tableData as any)"
      :field-names="fieldNames"
    >
      <template #title="{ data }">
        <span v-if="data?.isLeaf">
          <span style="display: inline-block; min-width: 120px">{{
            data.label
          }}</span>
          <span style="margin-left: 15px">({{ data.encryptMobileNo }})</span>
        </span>
        <span v-else>{{ data.label }}</span>
      </template>
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
import { MaterialStationEmpList } from '@/webapi/material'
import { ServiceItemStationEmpList } from '@/webapi/serviceItem'
import type { EmpRelateList } from '@/webapi/material'
import { Tree } from 'ant-design-vue'
import type { TreeProps } from 'ant-design-vue'
import 'ant-design-vue/es/tree/style/css'
import type { CompanyItem } from '@/store/modules/common'

const emit = defineEmits(['onSelected'])
const props = defineProps<{
  companyId: number | undefined
  companyList: any[]
  empRelateList: EmpRelateList[]
}>()
const { companyId, companyList, empRelateList } = toRefs(props)

const formData = reactive({
  empName: '',
  empPhone: ''
})
const init = () => {
  resetFormData()
  pageData.tableData = []
  tempKeys.value = []
  checkedKeys.value = []
  selectedKeys.value = []
}
const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  title: 'label',
  key: 'value'
}

const search = () => {
  getList()
}

const resetFormData = () => {
  formData.empName = ''
  formData.empPhone = ''
}

const pageData = reactive<{
  tableData: TreeNode[]
  loading: boolean
  resData: {
    stationInfoList: Station[]
    allotEmpList: Emp[]
  }
}>({
  tableData: [],
  resData: {
    stationInfoList: [],
    allotEmpList: []
  },
  loading: false
})

const returnApi = () => {
  return mode.value === 'material'
    ? MaterialStationEmpList
    : ServiceItemStationEmpList
}

const getList = () => {
  pageData.loading = true
  returnApi()({
    companyId: companyId.value
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      const { stationInfoList, allotEmpList } = (pageData.resData = res.data)
      pageData.tableData = mountNode(
        stationInfoList,
        filterEmpList(allotEmpList)
      )

      const ids = empRelateList.value.map(item => item.empId)
      tempKeys.value = [...ids, ...tempKeys.value]
      if (tempKeys.value.length > 0) {
        selectedKeys.value = tempKeys.value
        checkedKeys.value = tempKeys.value
      }
      if (!formData.empName && !formData.empPhone) {
        tempKeys.value = []
      }
    }
  })
}
const tempKeys = ref([]) // 临时存放筛选前的数据

const checkedKeys = ref<number[]>([])
const selectedKeys = ref<number[]>([])
const filterEmpList = (empList: Emp[]) => {
  // if (!formData.empName && !formData.empPhone) {
  //   return empList
  // }
  const allNodeLeafIds = allLefaNodeIds()
  const checkedIds = checkedKeys.value.filter(item =>
    allNodeLeafIds.includes(item)
  )
  tempKeys.value = [...new Set([...tempKeys.value, ...checkedIds])]
  console.log(tempKeys.value)

  return empList.filter(item => {
    if (
      item.empName.indexOf(formData.empName) > -1 &&
      item.mobileNo.indexOf(formData.empPhone) > -1
    ) {
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

interface Emp {
  empId: number
  empName: string
  encryptMobileNo: string
  mobileNo: string
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
const mountNode = (stationList: Station[], empList: Emp[]) => {
  const rootNode = genRootTreeNode(companyList.value)
  const stationMap = genStationMap(stationList)
  empList.forEach(item => {
    const element = {
      isLeaf: true,
      value: item.empId,
      label: `${item.empName}`,
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
  return pageData.resData.allotEmpList.map(item => item.empId)
}

const genSelectedEmpList = () => {
  const allNodeLeafIds = allLefaNodeIds()
  const checkedIds = [
    ...new Set([...checkedKeys.value, ...tempKeys.value])
  ].filter(item => allNodeLeafIds.includes(item))
  const checkedNodeLeaf = checkedIds.map(item => {
    const stationIds: number[] = []
    let element: Partial<Emp> = {}
    pageData.resData.allotEmpList.forEach(ele => {
      if (ele.empId === item) {
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
