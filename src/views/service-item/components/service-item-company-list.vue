<template>
  <el-dialog
    v-model="dialogShow"
    :title="`添加${mode === 'overlay' ? '指定' : ''}激励服务项目`"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <el-form :inline="true">
      <el-form-item label="服务大类">
        <el-select
          v-model="formData.bigClassId"
          @change="bigClassChange"
          filterable
          clearable
          placeholder="服务大类"
        >
          <el-option
            v-for="item in optionList.bigClass"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备">
        <el-select
          v-model="formData.deviceId"
          @change="deviceChange"
          filterable
          clearable
          placeholder="设备"
        >
          <el-option
            v-for="item in optionList.deviceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务品类">
        <el-select
          v-model="formData.serviceClassId"
          @change="serviceClassChange"
          filterable
          clearable
          placeholder="服务品类"
        >
          <el-option
            v-for="item in optionList.serviceClassList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务项目">
        <el-select
          v-model="formData.serviceItemId"
          filterable
          clearable
          placeholder="服务项目"
        >
          <el-option
            v-for="item in optionList.serviceItemList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
      ref="serviceItemRef"
      row-key="serviceItemId"
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
      <el-table-column property="bigClassName" label="服务大类" width="120" />
      <el-table-column property="deviceName" label="设备" width="100" />
      <el-table-column
        property="serviceClassName"
        label="服务品类"
        width="140"
      />
      <el-table-column property="serviceItemName" label="服务项目" />
      <el-table-column
        v-if="mode === 'overlay'"
        property="ruleName"
        label="激励基础规则"
      />
      <el-table-column
        property="serviceFee"
        label="项目单价(元)"
        width="105"
        align="center"
      />
      <el-table-column
        v-if="mode === 'basic'"
        property="ruleStatus"
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
  GetCompanyBigClassList,
  GetCompanyDeviceList,
  GetCompanyServiceClassList,
  GetCompanyServiceItemList
} from '@/webapi/common'
import {
  ServiceItemDataList,
  SetBaseServiceitemList
} from '@/webapi/serviceItem'
import type { OperServiceItemDetailInputs } from '@/webapi/serviceItem'
import { ElTable, ElTableColumn } from 'element-plus'

const formData = reactive({
  bigClassId: undefined,
  deviceId: undefined,
  serviceClassId: undefined,
  serviceItemId: undefined
})

const props = defineProps<{
  cityId: number | undefined
  companyId: number | undefined
  operServiceItemDetailInputs: OperServiceItemDetailInputs[]
}>()
const { cityId, companyId, operServiceItemDetailInputs } = toRefs(props)

interface IdName {
  id: number
  name: string
}
const optionList = reactive<{
  bigClass: IdName[]
  deviceList: IdName[]
  serviceClassList: IdName[]
  serviceItemList: IdName[]
}>({
  bigClass: [],
  deviceList: [],
  serviceClassList: [],
  serviceItemList: []
})

const confirm = () => {
  emit('onSelected', beforeEmit(tempOperServiceItemDetailInputs.value))
  toggleDialogStatus()
  // return
  // // 是否含有失效项目
  // const hasInvalidation = tempOperServiceItemDetailInputs.value.filter(
  //   item => item?.ruleStatus === 14
  // )
  // if (hasInvalidation.length > 0) {
  //   ElMessageBox.confirm(
  //     h('div', null, [
  //       h(
  //         'div',
  //         {
  //           style: {
  //             marginBottom: '10px'
  //           }
  //         },
  //         [
  //           h(
  //             'div',
  //             {},
  //             '以下服务项目的基础规则已失效，服务项目从已失效的基础规则中移除后，才可加入新的规则中。'
  //           ),
  //           h('div', {}, '确认移除吗？若忽略，则以下服务项目不会被继续添加。')
  //         ]
  //       ),
  //       h(
  //         ElTable,
  //         {
  //           data: hasInvalidation,
  //           border: true
  //         },
  //         [
  //           h(ElTableColumn, {
  //             property: 'serviceItemName',
  //             label: '服务项目'
  //           }),
  //           h(
  //             ElTableColumn,
  //             {
  //               property: 'commissionRuleName',
  //               label: '激励规则'
  //             },
  //             {
  //               default: (scope: any) =>
  //                 h(
  //                   'div',
  //                   {
  //                     style: {
  //                       display: 'flex',
  //                       justifyContent: 'space-between'
  //                     }
  //                   },
  //                   [
  //                     h('span', {}, scope.row.commissionRuleName),
  //                     scope.row.ruleStatus === 14
  //                       ? h(
  //                           ElTag,
  //                           {
  //                             type: 'info',
  //                             effect: 'light',
  //                             closable: false
  //                           },
  //                           '已失效'
  //                         )
  //                       : ''
  //                   ]
  //                 )
  //             }
  //           )
  //         ]
  //       )
  //     ]),
  //     '温馨提示',
  //     {
  //       distinguishCancelAndClose: true,
  //       confirmButtonText: '忽略继续添加',
  //       cancelButtonText: '确认移除再添加',
  //       customStyle: {
  //         maxWidth: '800px'
  //       }
  //     }
  //   )
  //     .then(() => {
  //       const list = tempOperServiceItemDetailInputs.value.filter(item => item?.ruleStatus !== 14)
  //       emit('onSelected', beforeEmit(list))
  //       toggleDialogStatus()
  //     })
  //     .catch((action: Action) => {
  //       if (action === 'cancel') {
  //         const invalidation = hasInvalidation.map(
  //           ({ comnanyItemExcitationRuleId, serviceItemId, serviceItemName }) => {
  //             return {
  //               comnanyItemExcitationRuleId,
  //               serviceItemId,
  //               serviceItemName,
  //               companyId: companyId.value
  //             }
  //           }
  //         )
  //         RemoveServiceItemRule(invalidation).then(res => {
  //           if (res.code === 200) {
  //             ElMessage({
  //               message: '操作成功',
  //               type: 'success'
  //             })
  //             setTimeout(() => {
  //               emit('onSelected', beforeEmit(tempOperServiceItemDetailInputs.value))
  //               toggleDialogStatus()
  //             }, 500)
  //           } else {
  //             ElMessage({
  //               type: 'error',
  //               message: res.message
  //             })
  //           }
  //         })
  //       }
  //     })
  // } else {
  //   emit('onSelected', beforeEmit(tempOperServiceItemDetailInputs.value))
  //   toggleDialogStatus()
  // }
}

const emit = defineEmits(['onSelected'])
const tempOperServiceItemDetailInputs = ref<OperServiceItemDetailInputs[]>([])
// const selectedList = ref<OperServiceItemDetailInputs[]>([])
const handleSelectionChange = (selectedList: OperServiceItemDetailInputs[]) => {
  // selectedList.value = val
  // selectedList与currentSelectedList 都为最新数据
  // tempOperServiceItemDetailInputs为旧数据
  // 将selectedList与currentSelectedList 进行对比，区别出当前新增与删除的数据
  // 在selectedList中，不在currentSelectedList中，为新增数据
  // 在currentSelectedList，不在selectedList中，为删除数据
  // currentSelectedList中剩余为不变数据，但是需要替换，因为currentSelectedList中数据是最新数据
  const selectedIds = selectedList.map(item => item.serviceItemId)
  const currentIds = currentSelectedList.value.map(item => item.serviceItemId)
  const addList = selectedList.filter(
    item => !currentIds.includes(item.serviceItemId)
  )
  const removeList = currentSelectedList.value.filter(
    item => !selectedIds.includes(item.serviceItemId)
  )
  const restList = currentSelectedList.value.filter(item =>
    selectedIds.includes(item.serviceItemId)
  )
  const removeIds = removeList.map(item => item.serviceItemId)

  // console.log('add---', addList);
  // console.log('remove---', removeList);
  // console.log('rest---', restList);

  tempOperServiceItemDetailInputs.value =
    tempOperServiceItemDetailInputs.value.filter(
      item => !removeIds.includes(item.serviceItemId)
    )
  currentSelectedList.value = currentSelectedList.value.filter(
    item => !removeIds.includes(item.serviceItemId)
  )

  for (let v of tempOperServiceItemDetailInputs.value) {
    for (let k of restList) {
      if (v.serviceItemId === k.serviceItemId) {
        v = k
        break
      }
    }
  }

  const ids = tempOperServiceItemDetailInputs.value.map(
    item => item.serviceItemId
  )
  for (let k of addList) {
    if (!ids.includes(k.serviceItemId)) {
      tempOperServiceItemDetailInputs.value.push(k)
      currentSelectedList.value.push(k)
    }
  }
  // console.log(tempOperServiceItemDetailInputs.value);
}
const beforeEmit = (tempList: OperServiceItemDetailInputs[]) => {
  return tempList

  // if (operServiceItemDetailInputs.value.length === 0) {
  //   return tempList
  // }
  // // tempList 为当前由接口更新过状态的tempOperServiceItemDetailInputs
  // // 替换共同存在的
  // const operServiceItemList = operServiceItemDetailInputs.value
  // for (let v of tempList) {
  //   for (let k of operServiceItemList) {
  //     if (v.serviceItemId === k.serviceItemId) {
  //       k = v
  //       break
  //     }
  //   }
  // }
  // // 收集不存在的
  // const allIds = operServiceItemDetailInputs.value.map(item => item.serviceItemId)
  // const rest = tempList.filter(item => !allIds.includes(item.serviceItemId))
  // return [...operServiceItemList, ...rest]
}
const selectDiabled = (row: OperServiceItemDetailInputs) => {
  if (mode.value === 'other') return true
  return mode.value === 'basic' ? row.ruleStatus !== 19 : row.ruleStatus !== 14
}

const init = () => {
  resetFormData()
  pageData.tableData = []
  pageData.total = 0

  setTimeout(() => {
    serviceItemRef.value?.tableElement.clearSelection()
    tempOperServiceItemDetailInputs.value = operServiceItemDetailInputs.value
  }, 0)
}

const search = () => {
  pageConfig.currentPage = 1
  getList()
}

const resetFormData = () => {
  formData.bigClassId = undefined
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  optionList.deviceList = []
  optionList.serviceClassList = []
  optionList.serviceItemList = []
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
  tableData: OperServiceItemDetailInputs[]
  total: number
  loading: boolean
}>({
  tableData: [],
  total: 0,
  loading: false
})
const returnSaveApi = () => {
  return mode.value === 'overlay' ? SetBaseServiceitemList : ServiceItemDataList
}
const getList = () => {
  pageData.loading = true
  returnSaveApi()({
    cityId: cityId.value,
    companyId: companyId.value,
    ...formData,
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

const serviceItemRef = ref()
const currentSelectedList = ref<OperServiceItemDetailInputs[]>([])
const handleSelected = (data: OperServiceItemDetailInputs[]) => {
  // 所有数据
  const allSelectedIds = operServiceItemDetailInputs.value.map(
    item => item.serviceItemId
  )
  // 当前页匹配的数据
  currentSelectedList.value = data.filter(item =>
    allSelectedIds.includes(item.serviceItemId)
  )
  // 选中列表数据，会触发handleSelectionChange事件
  currentSelectedList.value.forEach(ele => {
    serviceItemRef.value?.tableElement.toggleRowSelection(ele, true)
  })
}

const getBigClassList = () => {
  GetCompanyBigClassList({ companyId: companyId.value }).then(res => {
    if (res.code === 200) {
      optionList.bigClass = res.data
    }
  })
}

const bigClassChange = (bigClassId: number) => {
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  optionList.deviceList = []
  optionList.serviceClassList = []
  optionList.serviceItemList = []
  if (!bigClassId) return
  GetCompanyDeviceList({
    companyId: companyId.value,
    bigClassId
  }).then(res => {
    if (res.code === 200) {
      optionList.deviceList = res.data
    }
  })
}

const deviceChange = (deviceId: number) => {
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  optionList.serviceClassList = []
  optionList.serviceItemList = []
  if (!deviceId) return
  GetCompanyServiceClassList({
    companyId: companyId.value,
    deviceId
  }).then(res => {
    if (res.code === 200) {
      optionList.serviceClassList = res.data
    }
  })
}

const serviceClassChange = (serviceClassId: number) => {
  formData.serviceItemId = undefined
  optionList.serviceItemList = []
  if (!serviceClassId) return
  GetCompanyServiceItemList({
    companyId: companyId.value,
    serviceClassId
  }).then(res => {
    if (res.code === 200) {
      optionList.serviceItemList = res.data
    }
  })
}

const dialogShow = ref(false)
type Mode = 'basic' | 'overlay' | 'other' | undefined
const mode = ref<Mode>('basic')
const toggleDialogStatus = (_mode?: Mode) => {
  if (!dialogShow.value) {
    if (_mode) mode.value = _mode
    init()
    getBigClassList()
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
