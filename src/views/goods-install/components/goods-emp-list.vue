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
      style="width: 650px; margin-bottom: 20px"
      title="提醒：以下展示人员均是该公司下的分销员，当前只有分销员可参与商品销售相关的激励。"
      type="error"
      :closable="false"
    />
    <Tree
      defaultExpandAll
      checkable
      v-if="pageData.tableData.length"
      v-model:checkedKeys="checkedKeys"
      :tree-data="(pageData.tableData as any)"
      :selectable="false"
      :field-names="fieldNames"
      @check="checkChange"
    >
      <template #title="{ data }">
        <span v-if="data?.isLeafNode">
          <span style="display: inline-block; min-width: 120px">{{
            data.label
          }}</span>
          <span style="margin-left: 15px">({{ data.encryptionMobile }})</span>
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
import { CanusedPromoterList } from '@/webapi/goods-install'
import { Tree } from 'ant-design-vue'
import 'ant-design-vue/es/tree/style/css'
import { inAndOut } from '@/utils'

const formData = reactive({
  empName: '',
  empPhone: ''
})

const props = defineProps<{
  thirdShopId: number | undefined
  marketShopId: number | undefined
  companyId: number | undefined
  companyList: any[]
  addlimitPromoterInputList?: any[]
}>()
const {
  thirdShopId,
  marketShopId,
  companyId,
  companyList,
  addlimitPromoterInputList
} = toRefs(props)

const init = () => {
  resetFormData()
  pageData.tableData = []
  allCheckKeys.value.clear()
  const ids = addlimitPromoterInputList.value.map(item => item.employeeId)

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

const pageData = reactive<{
  tableData: TreesPartial
  resData: {
    deptList: Dept[]
    empList: Emp[]
  }
  loading: boolean
}>({
  tableData: [],
  resData: {
    deptList: [],
    empList: []
  },
  loading: false
})
const fieldNames: any['fieldNames'] = {
  children: 'children',
  title: 'label',
  key: 'richValue'
}
/**
 * @description 清洗数据
  // 生成固定key用于tree
  // 生成id，name用于明确各个节点
  // 标记分类父节点与商品叶子节点
  // 将叶子节点挂载所属父节点上
  // 组装父节点

  // 筛选商品 直接过滤名称
  // 筛选品类 逐级过滤

  // 
 */
interface Dept {
  deptGrade: string
  parentDeptId: string
  deptId: string
  deptName: string
  parentDeptIds: string
}
interface Emp {
  employeeId: string
  employeeName: string
  employeeMobile: string
  encryptionMobile: string
  deptList: Dept[]
}

type Loop<T> = {
  [P in keyof T]: T[P]
}
type TreeNodes<T> = Loop<TreeFields<T> & T>

interface TreeFields<T> {
  value: string
  label: string
  richValue?: string
  isBranchNode?: boolean
  isLeafNode?: boolean
  children?: Array<TreeNodes<T>>
}

type Trees<T> = Array<TreeNodes<T>>
type TreesPartial = Trees<Partial<Dept> & Partial<Emp>>
// 清洗组装数据，需要将字段通用化（还未做）
/**
 * @description 返回符合TreeNode数据
 * @param dept
 * @param emp
 */
const treeDataClean = (dept: Dept[], emp: Emp[]) => {
  const deptList: Trees<Partial<Dept> & Partial<Emp>> = dept.map(item => {
    return {
      value: item.deptId,
      richValue: JSON.stringify(item.deptId),
      label: item.deptName,
      children: [],
      isBranchNode: true,
      ...item
    }
  })
  const empList: Trees<Emp> = emp.map(item => {
    return {
      value: item.employeeId,
      label: item.employeeName,
      isLeafNode: true,
      ...item
    }
  })
  return {
    deptList,
    empList
  }
}
// 分支节点挂载叶子节点
const branchNodeWithLeafNode = (dept: Dept[], emp: Emp[]) => {
  const { deptList, empList } = treeDataClean(dept, emp)
  const deptMap = mapState<typeof deptList[0]>(deptList)
  // 叶子节点不属于任何分支节点的情况下，挂载到root节点下
  const rootEmp: Array<TreeNodes<Emp>> = []
  empList.forEach(item => {
    // deptList为叶子节点所属分支节点
    if (item?.deptList.length > 0) {
      item.deptList.forEach(ele => {
        const dept = deptMap.get(ele.deptId)
        dept.children.push({
          ...item,
          richValue: `${ele.deptId}-${item.employeeId}`
        })
        deptMap.set(ele.deptId, dept)
      })
    } else {
      rootEmp.push({
        ...item,
        richValue: `1-${item.employeeId}`
      })
    }
  })
  // 组装分支节点后修剪掉多余(不存在叶子)的分支节点
  const deptWithEmpClean = postPruning([...deptMap.values()])
  const rootNode = genRootNodeWithCompany(rootEmp, deptWithEmpClean)
  return {
    rootNode,
    rootEmp,
    deptWithEmpClean
  }
}
// 以公司来构造根节点
const genRootNodeWithCompany = (
  root: TreesPartial,
  deptWithEmpClean: TreesPartial
) => {
  const companyName: string = companyList.value.filter(
    item => item.companyId === companyId.value
  )[0]['companyName']
  const rootNode: TreesPartial[0] = {
    value: '0',
    label: companyName,
    children: [...root, ...deptWithEmpClean]
  }
  return rootNode.children.length > 0 ? [rootNode] : []
}
/**
 * 组装分支节点
 * @param dept
 */
const handleDept = (dept: TreesPartial) => {
  const deptMap = mapState<typeof dept[0]>(dept)
  const treeList: TreesPartial = []
  dept.forEach(item => {
    const depatParent = deptMap.get(item.parentDeptId)
    if (depatParent) {
      // 这里需要判断，如果当前节点下没有叶子节点都是分支节点的话就禁止插入
      // 但是插入时有可能分子节点可能还未被处理，所以不能在此处理。。。
      depatParent.children.push(item)
      deptMap.set(item.parentDeptId, depatParent)
    } else {
      treeList.push(item)
    }
  })
  return treeList
}
// 修剪分支节点
const postPruning = (_data: TreesPartial): TreesPartial => {
  const data = handleDept(_data)
  const newTree = data.filter(item => {
    if (!hasLeafNodes(item.children) && item?.isLeafNode) {
      return true
    }
    return hasLeafNodes(item.children)
  })
  newTree.forEach(ele => {
    if (ele?.children) {
      ele.children = postPruning(ele.children)
    }
  })
  return newTree
}
// 判断是否含有叶子节点
const hasLeafNodes = (data: TreesPartial) => {
  if (!data || data?.length === 0) return false
  const arr: boolean[] = []
  const hasLeafNode = (
    data: Trees<Partial<Dept> & Partial<Emp>>,
    arr: boolean[]
  ): void => {
    while (data.length > 0) {
      const item = data.pop()
      if (item?.isLeafNode) arr.push(true)
      if (item?.children?.length > 0) {
        hasLeafNode(item.children, arr)
      }
    }
  }
  hasLeafNode(JSON.parse(JSON.stringify(data)), arr)
  return arr.length > 0
}

// 用泛型的箭头函数eslint居然会报错，估计是版本的问题，之后再研究吧～
/**
 * @description 转为map结构
 * @param data
 */
const mapState = function <T extends { value: string }>(data: T[]) {
  const map: Map<string, T> = new Map()
  data.forEach(item => {
    map.set(item.value, item)
  })
  return map
}

const checkChange = (keys: any, { checked, node }: any) => {
  if (node?.isLeafNode) {
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
  checkedKeys.value = valueToRichValue(pageData.resData.empList)
}

const valueToRichValue = (allotEmpList: Emp[]) => {
  return allotEmpList
    .filter(item => allCheckKeys.value.has(item.employeeId))
    .map(item => {
      return item?.deptList.length > 0
        ? item.deptList.map(ele => `${ele.deptId}-${item.employeeId}`)
        : `1-${item.employeeId}`
    })
    .flat()
}

const getAllCheckedKeys = (node: any) => {
  const arr: Set<string> = new Set()
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

const oldData = ref([])
const allCheckKeys = ref<Set<string>>(new Set())
const allDeptList = ref([])
const empListNode = ref<any[]>([])
const allNodeIds = ref<string[]>([])
const checkedKeys = ref<string[]>([])
const getList = () => {
  pageData.loading = true
  CanusedPromoterList({
    storeId: thirdShopId.value,
    marketShopId: marketShopId.value
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      const { deptList, empList } = (pageData.resData = res.data)
      allNodeIds.value = (empList as Emp[]).map(item => item.employeeId)
      const { empList: empLeafNode } = treeDataClean(deptList, empList)
      empListNode.value = empLeafNode
      allDeptList.value = deptList
      const { rootNode } = branchNodeWithLeafNode(
        deptList,
        filterEmpList(empList)
      )
      pageData.tableData = rootNode
      const ids = pageData.resData.empList.map((ele: Emp) => ele.employeeId)
      oldData.value = addlimitPromoterInputList.value
        .filter(item => !ids.includes(item.employeeId))
        .map(item => {
          item['deptNames'] = '--'
          return item
        })
      checkedKeys.value = checkedKeys.value = valueToRichValue(
        pageData.resData.empList
      )
    }
  })
}

const tempKeys = ref([]) // 临时存放筛选前的数据
const filterEmpList = (empList: any[]) => {
  // tempKeys.value = checkedKeys.value
  return empList.filter(item => {
    if (
      item.employeeName.indexOf(formData.empName) > -1 &&
      item.employeeMobile.indexOf(formData.empPhone) > -1
    ) {
      return true
    }
  })
}

// interface TreeNode {
//   key: string
//   title: string
//   children: TreeNode[]
//   [x: string]: any
// }

// // 叶子节点id集合

// const selectedKeys = ref<string[]>([])
// // 将员工挂载到对应部门，没有部门则挂载到公司下
// const genTree = (stationInfoList: any[], allotEmpList: any[]) => {
//   const stationInfoListBackup = JSON.parse(JSON.stringify(stationInfoList))
//   const companyName = companyList.value.filter(
//     item => item.companyId === companyId.value
//   )[0]['companyName']
//   const rootNode: TreeNode = {
//     key: '0',
//     title: companyName,
//     children: []
//   }
//   const stationMap: any = {}
//   const stationList = stationInfoList.map(item => {
//     item['key'] = item['deptId']
//     item['title'] = item['deptName']
//     item['children'] = []
//     stationMap[item.deptId] = item
//     return item
//   })
//   const empList = allotEmpList.map(item => {
//     item['isLeaf'] = true
//     item['key'] = item['employeeId']
//     item['title'] = `${item['employeeName']}(${item['encryptionMobile']})`
//     if (item?.deptList.length > 0) {
//       // 将人员加入所有部门
//       for (let v of item.deptList) {
//         // 使不同部分下的相同人员node-key不唯一
//         // const id = `${item['employeeId']}-${v['deptId']}`
//         stationMap[v.deptId]['children'].push(item)
//       }
//     } else {
//       rootNode['children'].push(item)
//     }
//     // 收集所有叶子节点id
//     allNodeIds.value.push(item['key'])
//     return item
//   })
//   // newListToTree(JSON.parse(JSON.stringify(stationList)))
//   // const tree = newListToTree(
//   //   stationList,
//   //   findTreeLeafPath(stationInfoListBackup)
//   // ).filter(item => item.children?.length > 0)
//   const tree = listToTree(stationList).filter(item => item.children?.length > 0)

//   rootNode['children'] = [...rootNode['children'], ...tree]
//   return {
//     rootNode: rootNode.children.length > 0 ? [rootNode] : [],
//     stationList,
//     empList
//   }
// }

// // 返回叶子节点的path
// // const findTreeLeafPath = (list: DeptList[]) => {
// //   const obj: {
// //     [key: string | number]: DeptList
// //   } = {}
// //   list.forEach(item => {
// //     obj[item.deptId] = item
// //   })
// //   const treeList: DeptList[] = []
// //   // 生成树状结构
// //   list.forEach(item => {
// //     const parent = obj[item.parentDeptId]
// //     if (parent) {
// //       parent.children = parent.children || []
// //       parent.children.push(item)
// //     } else {
// //       treeList.push(item)
// //     }
// //   })
// //   const paths: string[] = []
// //   const deepPath = (list: DeptList[]) => {
// //     list.forEach(item => {
// //       if (item?.children?.length > 0) {
// //         deepPath(item.children)
// //       } else {
// //         const path = `${item.parentDeptIds}${item.deptId}`
// //         paths.push(path)
// //       }
// //     })
// //   }
// //   deepPath(treeList)
// //   return paths
// // }
// // 将所有部门变成树形结构
// const newListToTree = (data: any[], paths: string[]) => {
//   const treeList: any[] = []
//   paths.forEach(path => {
//     const gradePath = path.split('|')
//     const obj: {
//       [key: number | string]: any
//     } = {}
//     data = data.map(item => {
//       const key = item['deptId']
//       obj[key] = item
//       item['key'] = key
//       if (!item.children) {
//         item['children'] = []
//       }
//       return item
//     })

//     while (gradePath.length > 0) {
//       const current = gradePath.pop()
//       if (obj[current]?.children.length > 0) {
//         const currentParent = obj[obj[current]['parentDeptId']]
//         currentParent?.children.push(obj[current])
//         if (!currentParent) {
//           treeList.push(obj[current])
//         }
//       }
//     }
//     console.log(treeList)
//   })
//   return treeList
// }
// const listToTree = (data: any[]) => {
//   const obj: {
//     [key: number]: any
//   } = {}
//   data = data.map(item => {
//     const key = item['deptId']
//     obj[key] = item
//     item['key'] = key
//     return item
//   })
//   const treeList: any[] = []
//   data.forEach(item => {
//     const parent = obj[item['parentDeptId']]
//     if (parent) {
//       parent.children = parent.children || []
//       parent.children.push(item)
//     } else {
//       treeList.push(item)
//     }
//   })
//   return treeList
// }

const confirm = () => {
  // 所有选中的key
  // const { IN } = inAndOut(checkedKeys.value, allNodeIds.value)
  // const res = empListNode.value.filter(item => IN.includes(item.value))
  // console.log(res)
  const res1 = pageData.resData.empList.filter(item =>
    allCheckKeys.value.has(item.employeeId)
  )

  emit('onSelected', {
    res: [...res1, ...oldData.value],
    allDeptList: allDeptList.value
  })
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
