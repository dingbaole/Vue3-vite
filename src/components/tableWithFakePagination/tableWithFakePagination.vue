<script lang="tsx">
import { defineComponent, reactive, onMounted, ref, toRefs, watch } from 'vue'
import type { PropType } from 'vue'
import { ElTable, ElPagination } from 'element-plus'

export default defineComponent({
  props: {
    data: {
      required: true,
      type: Array as PropType<any[]>,
      default: (): PropType<any[]> => {
        return []
      }
    }
  },
  setup(props, { attrs, slots }) {
    const data = ref([])
    const { data: pageData } = toRefs(props)
    const tableSlots = reactive({ default: slots.default })
    const pageConfig = reactive({
      total: 0,
      pageSize: 10,
      currentPage: 1
    })
    onMounted(() => {
      pageConfig.total = pageData.value.length
      dealData()
    })
    watch(
      () => props.data,
      () => {
        pageConfig.total = pageData.value.length
        dealData()
      }
    )
    watch(
      () => pageConfig.currentPage,
      () => {
        dealData()
      }
    )
    const dealData = () => {
      const { currentPage, pageSize } = pageConfig
      const start = currentPage * pageSize - pageSize
      const end = start + pageSize
      data.value = pageData.value.slice(start, end)
    }
    tableSlots.default = () => {
      return slots.default!()
    }
    return () => (
      <>
        <ElTable data={data.value} {...attrs}>
          {tableSlots}
        </ElTable>
        <ElPagination
          small
          background
          total={pageConfig.total}
          v-model:page-size={pageConfig.pageSize}
          v-model:current-page={pageConfig.currentPage}
          layout="prev, pager, next"
          style="margin-top: 10px;display: flex;justify-content: end;"
        />
      </>
    )
  }
})
</script>
