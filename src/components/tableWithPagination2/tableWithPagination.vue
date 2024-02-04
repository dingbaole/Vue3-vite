<script lang="tsx">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import type { PropType } from 'vue'
import { ElTable, ElPagination, ElTableColumn } from 'element-plus'
import dayjs from 'dayjs'
export default defineComponent({
  props: {
    tableConfig: {
      required: true,
      type: Object as PropType<{
        data: any[]
        total: number
        loading: boolean
      }>
    },
    pageConfig: {
      type: Object as PropType<{
        currentPage: number
        pageSize: number
      }>
    }
  },
  setup(props, { emit, attrs, slots, expose }) {
    const { tableConfig, pageConfig } = toRefs(props)
    const tableSlots = reactive({ default: slots.default })
    onMounted(() => {
      tableSlots.default = () => {
        return slots.default!().map(item => {
          if (item.children || item.props.type === 'selection') return item 
          return (
            <ElTableColumn {...item.props}>
              {{
                default: (scope: any) => {
                  const value = scope.row[item.props.prop]
                  if (item.props.date) {
                    return (scope.row[item.props.prop] ? dayjs(scope.row[item.props.prop]).format(item.props.date) : '--')
                  }
                  if (typeof value === 'string' && !value) {
                    return (<>{scope.row[item.props.prop] ? scope.row[item.props.prop] : '--'}</>)
                  }
                  return (<>{scope.row[item.props.prop] ?? '--'}</>)
                }
              }}
            </ElTableColumn>
          )
        })
      }
    })
    
    
    const sizePageChange = (pageSize: number) => {
      emit('pageChange', { currentPage: 1, pageSize })
    }
    const currentPageChange = (currentPage: number) => {
      emit('pageChange', { currentPage, pageSize: pageConfig.value.pageSize })
    }
    const tableRef = ref<InstanceType<typeof ElTable>>()

    expose({
      tableElement: tableRef
    })

    return () => (
      <>
        <ElTable
          ref={tableRef}
          data={tableConfig.value.data}
          v-loading={tableConfig.value.loading}
          {...attrs}
        >
          {tableSlots}
        </ElTable>
        <ElPagination
          small
          background
          layout="total, sizes, prev, pager, next"
          total={tableConfig.value.total}
          v-model:current-page={pageConfig.value.currentPage}
          onCurrent-change={currentPageChange}
          v-model:page-size={pageConfig.value.pageSize}
          onSize-change={sizePageChange}
          style="margin-top: 10px;display: flex;justify-content: end;"
        />
      </>
    )
  }
})
</script>
