<template>
  <el-dialog
    v-model="dialogShow"
    :title="`添加${mode === 'overlay' ? '指定' : ''}激励商品`"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-form :inline="true">
      <el-form-item label="店铺商品分类">
        <el-tree-select
          ref="TreeSelectRef"
          v-model="formData.cateIds"
          :data="pageData.cateList"
          :render-after-expand="false"
          :default-expand-all="true"
          node-key="value"
          multiple
          show-checkbox
        />
      </el-form-item>
      <el-form-item label="SKU编号/商品名称">
        <el-select
          v-model="formData.goodsId"
          filterable
          clearable
          placeholder="SKU编号/商品名称"
        >
          <el-option
            v-for="item in materialOptions"
            :label="`${item.goodsName}(${item.skuNo})`"
            :value="item.goodsId"
            :key="item.goodsId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="pageData.loading" @click="search">
          查询
        </el-button>
        <el-button @click="resetFormData">重置</el-button>
      </el-form-item>
    </el-form>
    <Table
      defaultExpandAllRows
      :key="(pageData.loading as any)"
      :columns="(columns as any)"
      :data-source="pageData.tableData"
      :loading="pageData.loading"
      :row-selection="rowSelection"
      rowKey="value"
      emptyText="暂无数据"
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
import { ref, reactive, toRefs, h, type VNode } from 'vue'
import { CanusedlGoodsList, MarketGoodsList } from './api'
import type { OperGoodsDetailInput } from '@/webapi/goods'
import type { ElTree } from 'element-plus'
import { Table } from 'ant-design-vue'
import 'ant-design-vue/es/table/style/css'
import { deepClone, richRuleName } from '@/utils'
import { LadderType, type CONST } from '@/global'
interface DataItem {
  id: number
  [key: string]: any
  children?: DataItem[]
}

const props = defineProps<{
  marketShopId: number | undefined
  thirdShopId: number | undefined
  companyId: number | undefined
  operGoodsDetailInputList?: OperGoodsDetailInput[]
}>()
const { marketShopId, thirdShopId, companyId, operGoodsDetailInputList } =
  toRefs(props)
const emit = defineEmits(['onSelected'])

const formData = reactive({
  cateIds: [],
  goodsId: undefined
})
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys: (string | number)[]) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys
  },
  getCheckboxProps: (record: any) => ({
    disabled:
      !record?.optional && record?.isLeafNode && mode.value === 'overlay'
  }),
  onSelect: (
    record: TreesPartial[0],
    selected: boolean,
    selectedRows: TreesPartial
  ) => {
    if (selected) {
      selectedRows
        .filter(item => item?.isLeafNode)
        .map(item => item.value)
        .forEach(value => allCheckKeys.value.add(value))
    } else {
      if (record?.isLeafNode) {
        allCheckKeys.value.delete(record.value)
      } else {
        const values = getLeafNodes(record.children)
        values
          .map(item => item.value)
          .forEach(value => allCheckKeys.value.delete(value))
      }
    }
  },
  onSelectAll: (
    selected: boolean,
    selectedRows: TreesPartial,
    changeRows: TreesPartial
  ) => {
    if (selected) {
      changeRows
        .filter(item => item?.isLeafNode)
        .map(item => item.value)
        .forEach(value => allCheckKeys.value.add(value))
    } else {
      allCheckKeys.value.clear()
    }
  },
  selectedRowKeys: []
})
const getLeafNodes = (data: TreesPartial): TreesPartial => {
  if (!data || data?.length < 1) return []
  if (data?.length > 0 && data[0]?.isLeafNode) {
    return data
  }
  for (const item of data) {
    return getLeafNodes(item.children)
  }
}
const TreeSelectRef = ref<InstanceType<typeof ElTree>>()
const confirm = () => {
  const result = pageData.resData.goodsInfoList.filter(item =>
    allCheckKeys.value.has(item.goodsId)
  )
  emit('onSelected', result)
  toggleDialogStatus()
}
const columns = ref()

const init = () => {
  resetFormData()
  pageData.tableData = []
  allCheckKeys.value.clear()
  operGoodsDetailInputList.value.forEach(item =>
    allCheckKeys.value.add(item.goodsId)
  )
  if (mode.value === 'overlay') {
    columns.value.push({
      title: '激励基础规则',
      dataIndex: 'commissionType',
      key: 'commissionType',
      width: '120px',
      customRender: ({ record }: { record: Goods }): VNode => {
        return h(
          'span',
          {},
          record.ladderType === LadderType.Y
            ? '阶梯激励'
            : richRuleName(
                record.commissionType as any,
                record.commissionValue,
                true
              )
        )
      }
    })
  }
  getList()
}

const search = () => {
  getList()
}

const resetFormData = () => {
  formData.cateIds = []
  formData.goodsId = undefined
  columns.value = [
    {
      title: '分类',
      dataIndex: 'cateName',
      key: 'cateName',
      width: '20%'
    },
    {
      title: 'SKU编号',
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: '130px'
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName'
    },
    {
      title: '商品类型',
      dataIndex: 'goodsType',
      key: 'goodsType',
      width: '100px',
      customRender: ({ record }: any): VNode => {
        return h(
          'span',
          {},
          record?.goodsType === 0
            ? '自采商品'
            : record?.goodsType === 1
            ? '直发代销'
            : ''
        )
      }
    },
    {
      title: '关联物料号',
      dataIndex: 'materialNo',
      key: 'materialNo',
      width: '110px'
    },
    {
      title: '商品单价(元)',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: '130px'
    }
  ]
}

const materialOptions = ref([])
const getMarketGoodsList = () => {
  MarketGoodsList({
    marketShopId: marketShopId.value!
  }).then(res => {
    if (res.code === 200) {
      materialOptions.value = res.data
    }
  })
}

interface Cate {
  cateGrade: number
  cateId: number
  cateName: string
  cateParentId: number
  catePath: string
}
interface Goods {
  cateId: number
  goodsId: number
  goodsName: string
  goodsType: number
  materialNo: string
  optional: boolean
  price: number
  skuId: string
  skuNo: string
  commissionType: number
  commissionValue: number
  ladderType: CONST['ladderType']
}
interface TreeFields<T> {
  value: number
  label: string
  isBranchNode?: boolean
  isLeafNode?: boolean
  children?: Array<TreeNodes<T>>
}
type Loop<T> = {
  [P in keyof T]: T[P]
}
type TreeNodes<T> = Loop<TreeFields<T> & T>
type Trees<T> = Array<TreeNodes<T>>
type TreesPartial = Trees<Partial<Cate> & Partial<Goods>>

// 清洗组装数据，需要将字段通用化（还未做）
/**
 * @description 返回符合TreeNode数据
 * @param dept
 * @param emp
 */
const treeDataClean = (cate: Cate[], goods: Goods[] = []) => {
  const cateList: TreesPartial = cate.map(item => {
    return {
      value: item.cateId,
      label: item.cateName,
      children: [],
      isBranchNode: true,
      ...item
    }
  })
  const goodsList: Trees<Goods> = goods.map(item => {
    return {
      value: item.goodsId,
      label: item.goodsName,
      isLeafNode: true,
      ...item
    }
  })
  return {
    cateList,
    goodsList
  }
}
// 分支节点挂载叶子节点
const branchNodeWithLeafNode = (cate: Cate[], goods: Goods[]) => {
  const { cateList, goodsList } = treeDataClean(cate, goods)
  const { _map } = mapState<typeof cateList[0]>(cateList)
  goodsList.forEach(item => {
    const cate = _map.get(item.cateId)
    if (cate) {
      cate.children.push(item)
      _map.set(item.cateId, cate)
    }
  })
  // 组装分支节点后修剪掉多余(不存在叶子)的分支节点
  const handleCateList = handleDept([..._map.values()])
  const cateWithGoodsCleaned = postPruning(handleCateList)
  return {
    cateWithGoodsCleaned
  }
}

/**
 * 组装分支节点
 * @param dept
 */
const handleDept = (cate: TreesPartial) => {
  const { _map, _data } = mapState<typeof cate[0]>(cate)
  const treeList: TreesPartial = []
  _data.forEach(item => {
    const parent = _map.get(item.cateParentId)
    if (parent) {
      // 这里需要判断，如果当前节点下没有叶子节点都是分支节点的话就禁止插入
      // 但是插入时有可能分子节点可能还未被处理，所以不能在此处理。。。
      parent.children.push(item)
      _map.set(item.cateParentId, parent)
    } else {
      treeList.push(item)
    }
  })
  return treeList
}
// 修剪分支节点
const postPruning = (handleCateList: TreesPartial): TreesPartial => {
  const newTree = handleCateList.filter(item => {
    if (item?.isLeafNode) {
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
  const hasLeafNode = (data: TreesPartial, arr: boolean[]): void => {
    while (data.length > 0) {
      const item = data.pop()
      if (item?.isLeafNode) arr.push(true)
      if (item?.children?.length > 0) {
        hasLeafNode(item.children, arr)
      }
    }
  }
  hasLeafNode(deepClone(data) as TreesPartial, arr)
  return arr.length > 0
}

// 用泛型的箭头函数eslint居然会报错，估计是版本的问题，之后再研究吧～
/**
 * @description 转为map结构
 * @param data
 */
const mapState = function <T extends { value: number }>(data: T[]) {
  const _data: T[] = deepClone(data)
  const _map: Map<number, T> = new Map()
  _data.forEach((item: T) => {
    _map.set(item.value, item)
  })
  return {
    _map,
    _data
  }
}
const allCheckKeys = ref<Set<number>>(new Set())
const pageData = reactive<{
  tableData: any[]
  cateList: any[]
  resData: {
    goodsCateList: Cate[]
    goodsInfoList: Goods[]
  }
  loading: boolean
}>({
  tableData: [],
  cateList: [],
  resData: {
    goodsCateList: [],
    goodsInfoList: []
  },
  loading: false
})
const getList = () => {
  pageData.loading = true
  CanusedlGoodsList({
    storeId: thirdShopId.value!,
    marketShopId: marketShopId.value!,
    companyId: companyId.value!,
    queryType: mode.value === 'basic' ? 0 : 1
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      const { goodsCateList, goodsInfoList } = (pageData.resData = res.data)
      // 过滤商品和分类
      const { filterCate, filterGoods } = filterHandler(
        goodsCateList,
        goodsInfoList
      )
      // 组装数据
      const { cateWithGoodsCleaned } = branchNodeWithLeafNode(
        filterCate,
        filterGoods
      )
      pageData.tableData = cateWithGoodsCleaned
      // 原始分类数据
      const { cateList } = treeDataClean(goodsCateList)
      const handleCateListWithoutGoods = handleDept(cateList)
      pageData.cateList = handleCateListWithoutGoods

      rowSelection.value.selectedRowKeys = [...allCheckKeys.value.keys()]
    }
  })
}
const filterHandler = (cate: Cate[], goods: Goods[]) => {
  const cateIds = TreeSelectRef.value
    ?.getCheckedNodes(false, true)
    .map(item => item.value)
  const filterCate = cate.filter(item => {
    if (cateIds.length > 0) {
      return cateIds.includes(item.cateId)
    }
    return true
  })
  const filterGoods = goods
    .filter(item => !(mode.value !== 'basic' && !item.optional))
    .filter(item => {
      if (formData.goodsId) {
        return item.goodsId === formData.goodsId
      }
      return true
    })
  return {
    filterCate,
    filterGoods
  }
}
const genGoodsTree = ({ goodsCateList, goodsInfoList }: any) => {
  const cateList = JSON.parse(JSON.stringify(goodsCateList))
  for (let v of cateList) {
    if (!v.children) {
      v['children'] = []
    }
    for (let k of goodsInfoList) {
      if (k.cateId === v.cateId) {
        v.children.push({
          id: k.goodsId,
          ...k
        })
      }
    }
  }

  // return newListToTree(cateList, findTreeLeafPath(goodsCateList))
  return listToTree(cateList)
}

interface GoodsCateList {
  cateGrade: number
  cateParentId: number
  cateId: number
  cateName: string
  catePath: string
  children?: GoodsCateList[]
}

// 返回分类叶子节点的path
const findTreeLeafPath = (goodsCateList: GoodsCateList[]) => {
  const obj: {
    [key: number]: GoodsCateList
  } = {}
  goodsCateList.forEach(item => {
    obj[item.cateId] = item
  })
  const treeList: GoodsCateList[] = []
  // 生成树状结构
  goodsCateList.forEach(item => {
    const parent = obj[item.cateParentId]
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(item)
    } else {
      treeList.push(item)
    }
  })
  const paths: string[] = []
  const deepPath = (list: GoodsCateList[]) => {
    list.forEach(item => {
      if (item?.children?.length > 0) {
        deepPath(item.children)
      } else {
        const path = `${item.catePath}${item.cateId}`
        paths.push(path)
      }
    })
  }
  deepPath(treeList)
  return paths
}

// 不用递归的原因是，数据量大的时候性能差，所以不要改！！！
const newListToTree = (data: any[], paths: string[]) => {
  const treeList: any[] = []
  for (const path of paths) {
    const gradePath = path.split('|')
    const obj: {
      [key: number | string]: any
    } = {}
    data = data.map(item => {
      const key = item['cateId']
      item['id'] = key
      item['name'] = item['cateName']
      if (!item.children) {
        item['children'] = []
      }
      obj[key] = item
      return item
    })

    while (gradePath.length > 0) {
      const current = gradePath.pop()
      if (obj[current]?.children.length > 0) {
        const currentParent = obj[obj[current]['cateParentId']]
        currentParent?.children.push(obj[current])
        if (!currentParent) {
          treeList.push(obj[current])
        }
      }
    }
  }
  return treeList
}
const listToTree = (
  data: any[],
  fields: {
    id: string
    name: string
  } = {
    id: 'id',
    name: 'name'
  }
) => {
  const obj: {
    [key: number]: any
  } = {}
  data = data.map(item => {
    obj[item['cateId']] = item
    item[fields.id] = item['cateId']
    item[fields.name] = item['cateName']
    return item
  })
  const treeList: any[] = []
  data.forEach(item => {
    const parent = obj[item['cateParentId']]
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(item)
    } else {
      treeList.push(item)
    }
  })
  return treeList
}

const dialogShow = ref(false)
const mode = ref<'basic' | 'overlay'>('basic')
const toggleDialogStatus = (_mode?: 'basic' | 'overlay') => {
  if (!dialogShow.value) {
    if (_mode) mode.value = _mode
    init()
    getMarketGoodsList()
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
