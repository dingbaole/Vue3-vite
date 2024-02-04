<template>
  <div class="order-label-panel">
    <el-card style="margin-bottom: 20px" shadow="never">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div>
          <span>限定条件: 适用订单标签</span>
          <el-button
            style="margin-left: 18px"
            size="small"
            type="primary"
            @click="dialogShow = true"
            v-if="!props.disabled"
          >
            添加订单标签
          </el-button>
        </div>
        <el-button type="text" @click="removePanel()" v-if="!props.disabled">
          删除条件
        </el-button>
      </div>
      <TableWithFakePagination
        v-if="!props.disabled"
        :data="props.orderLabelList"
        border
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column label="订单类型" width="100" align="center">
          <template #default="{ row }">
            <div>
              {{
                row.orderLabelType === 2
                  ? '上门订单'
                  : row.orderLabelType === 3
                  ? '集市订单'
                  : '--'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          property="orderLabelCode"
          label="标签编码"
          width="120"
          align="center"
        />
        <el-table-column property="orderLabelName" label="订单标签" />
        <el-table-column fixed="right" label="操作" width="80" align="center">
          <template #default="scope">
            <el-button type="text" @click="removeItem(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </TableWithFakePagination>
      <el-table
        v-if="props.disabled"
        :data="props.orderLabelList"
        border
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column label="订单类型" width="100" align="center">
          <template #default="{ row }">
            <div>
              {{
                row.orderLabelType === 2
                  ? '上门订单'
                  : row.orderLabelType === 3
                  ? '集市订单'
                  : '--'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          property="orderLabelCode"
          label="标签编码"
          width="120"
          align="center"
        />
        <el-table-column property="orderLabelName" label="订单标签" />
      </el-table>
    </el-card>
    <el-dialog
      v-model="dialogShow"
      title="添加订单标签"
      destroy-on-close
      width="500"
    >
      <AddOrderLabel ref="AddOrderLabelRef" :mode="props.mode" />
      <template #footer>
        <el-button @click="dialogShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import AddOrderLabel from './add-order-label.vue'
import { ref } from 'vue'
import type { OrderLabel, Mode } from './types'

const dialogShow = ref(false)
const props = defineProps<{
  orderLabelList?: OrderLabel[]
  mode?: Mode
  disabled?: boolean
}>()
const AddOrderLabelRef = ref<InstanceType<typeof AddOrderLabel>>()
const emit = defineEmits(['change', 'isRemovePanel'])
const confirm = () => {
  AddOrderLabelRef.value
    ?.getLabelInfo()
    .then(labelInfo => {
      emit('change', removeSameItem([...props.orderLabelList, labelInfo]))
      dialogShow.value = false
    })
    .catch(() => {})
}
const removeSameItem = (data: OrderLabel[]) => {
  const map: { [key: string]: string } = {}
  return data.filter(item => {
    if (!map[item.orderLabelId]) {
      map[item.orderLabelId] = item.orderLabelCode
      return true
    } else {
      return false
    }
  })
}
const removeItem = (row: OrderLabel) => {
  const data = props.orderLabelList?.filter(
    item => item.orderLabelId !== row.orderLabelId
  )
  emit('change', data)
}
const removePanel = () => {
  emit('isRemovePanel')
}
</script>
<style scoped lang="scss">
.order-label-panel {
}
</style>
