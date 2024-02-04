<template>
  <el-dialog
    v-model="dialogShow"
    title="添加指定组织人员"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-form :inline="true">
      <el-form-item label="人员姓名">
        <el-input v-model="formData.empName" clearable></el-input>
      </el-form-item>
      <el-form-item label="人员手机号">
        <el-input v-model="formData.empPhone" clearable></el-input>
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
import { ServiceItemStationEmpList } from '@/webapi/serviceItem'
import type { EmpRelateList } from '@/webapi/serviceItem'
import { ElTree } from 'element-plus'

const formData = reactive({
  empName: '',
  empPhone: ''
})
const defaultProps = {
  children: 'children',
  label: 'label'
}
const treeRef = ref<InstanceType<typeof ElTree>>()
const props = defineProps<{
  companyId: number | undefined
  companyList: any[]
  empRelateList: EmpRelateList[]
}>()
const { companyId, companyList, empRelateList } = toRefs(props)

const init = () => {
  resetFormData()
  pageData.tableData = []
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
}>({
  tableData: [],
  loading: false
})

const getList = () => {
  pageData.loading = true
  ServiceItemStationEmpList({
    companyId: companyId.value
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      const { stationInfoList, allotEmpList } = res.data
      pageData.tableData = genTree(stationInfoList, allotEmpList)
      const ids = empRelateList.value.map(item => item.empId)
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
const genTree = (stationInfoList: any[], allotEmpList: any[]) => {
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
  allotEmpList.forEach(item => {
    if (stationMap[item.stationId]) {
      stationMap[item.stationId]['children'].push({
        id: item['empId'],
        label: item['empName'],
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
