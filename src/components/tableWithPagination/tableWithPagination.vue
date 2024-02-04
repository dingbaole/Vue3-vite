<script lang="tsx">
import { defineComponent, reactive, onMounted, ref, toRefs, watch } from 'vue'
import type { PropType } from 'vue'
import { ElTable, ElPagination } from 'element-plus'

export default defineComponent({
  props: {
    tableData: {
      required: true,
      type: Array as PropType<any[]>,
      default: (): PropType<any[]> => {
        return []
      }
    },
    tableTotal: {
      required: true,
      type: Number,
      default: 0
    },
    tablePageCurrentPage: {
      required: true,
      type: Number,
      default: 1
    },
    tablePageSize: {
      required: true,
      type: Number,
      default: 10
    }
  },
  setup(props, { emit, attrs, slots, expose }) {
    const { tableData, tableTotal, tablePageCurrentPage, tablePageSize } =
      toRefs(props)
    const tableSlots = reactive({ default: slots.default })
    const pageConfig = reactive({
      pageSize: 10,
      currentPage: 1
    })
    onMounted(() => {
      pageConfig.pageSize = tablePageSize.value
    })
    tableSlots.default = () => {
      return slots.default!()
    }
    const sizePageChange = (pageSize: number) => {
      emit('pageChange', { currentPage: 1, pageSize })
    }
    const currentPageChange = (currentPage: number) => {
      emit('pageChange', { currentPage, pageSize: pageConfig.pageSize })
    }
    watch(tablePageCurrentPage, () => {
      pageConfig.currentPage = tablePageCurrentPage.value
    })
    watch(tablePageSize, () => {
      pageConfig.pageSize = tablePageSize.value
    })
    // watch(
    //   [() => pageConfig.pageSize, () => pageConfig.currentPage],
    //   (
    //     [pageSize, currentPage]: [number, number],
    //     [oldPageSize, oldCurrentPage]: [number, number]
    //   ) => {
    //     if (oldCurrentPage !== 1) {
    //       isResetCurrentPage = false
    //     }
    //     if (pageSize !== oldPageSize) {
    //       pageConfig.currentPage = 1
    //     } else if (currentPage !== oldCurrentPage) {
    //       console.log(isResetCurrentPage)
    //       if (!isResetCurrentPage) {
    //         emit('pageChange', { currentPage, pageSize })
    //       }
    //     }
    //   }
    // )
    const tableRef = ref<InstanceType<typeof ElTable>>()
    // const clearSelection = tableRef.value?.clearSelection
    // const toggleRowSelection = tableRef.value?.toggleRowExpansion
    // console.log({ ...tableRef })

    expose({
      tableElement: tableRef
    })

    return () => (
      <>
        <ElTable ref={tableRef} data={tableData.value} {...attrs}>
          {tableSlots}
        </ElTable>
        {/* <ElPagination
          small
          background
          hide-on-single-page
          layout="total, sizes, prev, pager, next"
          total={tableTotal.value}
          v-model:current-page={pageConfig.currentPage}
          v-model:page-size={pageConfig.pageSize}
          style="margin-top: 10px;display: flex;justify-content: end;"
        /> */}
        <ElPagination
          small
          background
          layout="total, sizes, prev, pager, next"
          total={tableTotal.value}
          v-model:current-page={pageConfig.currentPage}
          onCurrent-change={currentPageChange}
          v-model:page-size={pageConfig.pageSize}
          onSize-change={sizePageChange}
          style="margin-top: 10px;display: flex;justify-content: end;"
        />
      </>
    )
  }
})
</script>
