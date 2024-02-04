<template>
  <el-dialog
    v-model="dialogShow"
    title="添加指定组织人员"
    width="800"
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
      :tree-data="(pageData.tableData as any)"
      :field-names="fieldNames"
      :selectable="false"
      @check="checkChange"
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
    <div
      v-if="pageData.tableData.length === 0"
      style="text-align: center; padding: 10px 0"
    >
      暂无数据
    </div>
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
  allCheckKeys.value.clear()
  const ids = empRelateList.value.map(item => item.empId)
  ids.forEach(item => allCheckKeys.value.add(item))
  getList()
}

const search = () => {
  getList()
}

const resetFormData = () => {
  formData.empName = ''
  formData.empPhone = ''
}

const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  title: 'label',
  key: 'richValue'
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
      oldData.value = empRelateList.value
        .filter(
          item =>
            !allotEmpList.map((ele: Emp) => ele.empId).includes(item.empId)
        )
        .map(item => {
          item['stationName'] = '--'
          return item
        })
      checkedKeys.value = valueToRichValue(pageData.resData.allotEmpList)
    }
  })
}
const checkChange = (keys: any, { checked, node }: any) => {
  if (node?.isLeaf) {
    // 是叶子节点，直接根据check来增加删除节点
    if (checked) {
      allCheckKeys.value.add(node.value)
    } else {
      // console.log(allCheckKeys.value.keys())
      allCheckKeys.value.delete(node.value)
    }
  } else {
    // 取出所有叶子节点，递归
    const values = getAllCheckedKeys(node)
    for (let v of values) {
      if (checked) {
        allCheckKeys.value.add(v)
      } else {
        allCheckKeys.value.delete(v)
      }
    }
  }
  checkedKeys.value = valueToRichValue(pageData.resData.allotEmpList)
}

const valueToRichValue = (allotEmpList: Emp[]) => {
  return allotEmpList
    .filter(item => allCheckKeys.value.has(item.empId))
    .map(item => `${item.stationId}-${item.empId}`)
}

const getAllCheckedKeys = (node: any) => {
  const arr: Set<number> = new Set()
  deepNode([node], arr)
  return arr.keys()
}

const deepNode = (node: any[], arr: Set<number | string>) => {
  node.forEach((item: any) => {
    if (item?.children?.length > 0) {
      deepNode(item.children, arr)
    } else {
      arr.add(item.value)
    }
  })
}

const oldData = ref([]) // 已被删除的人员，不需要改动原封不动回传
const allCheckKeys = ref<Set<number>>(new Set())
const checkedKeys = ref<string[]>([])
const filterEmpList = (empList: Emp[]) => {
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
  richValue?: string
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
    richValue: '1',
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
      richValue: JSON.stringify(value),
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
      richValue: `${item.stationId}-${item.empId}`,
      label: `${item.empName}`,
      ...item
    }
    if (stationMap.has(element.stationId)) {
      stationMap.get(item.stationId).children.push(element)
    } else {
      rootNode.children.push(element)
    }
  })
  const stationNode = [...stationMap.values()].filter(
    item => item.children.length > 0
  )
  rootNode.children = [...rootNode.children, ...stationNode]
  return stationNode.length > 0 ? [rootNode] : []
}

// 生成选中人员的多服务站名称
const genSelectedEmpList = () => {
  const checkedIds = allCheckKeys.value.keys()
  const checkedNodeLeaf = [...checkedIds]
    .map(item => {
      const stationIds: number[] = []
      let element: Partial<Emp> = null
      pageData.resData.allotEmpList.forEach(ele => {
        if (ele.empId === item) {
          stationIds.push(ele.stationId)
          element = ele
        }
      })
      return element
        ? {
            stationIds,
            ...element
          }
        : null
    })
    .filter(Boolean)
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
  emit('onSelected', [...genSelectedEmpList(), ...oldData.value])
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
