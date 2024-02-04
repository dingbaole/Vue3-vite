import { reactive, ref, type Ref } from 'vue'

type FunctionFetch<T, U> = (
  params: T & API.PageConfig
) => Promise<API.Result<U>>
type FunctionCallback<U> = (result: API.Result<U>) => void
type TableConfig<D> = {
  data: Array<D>
  total: number
  loading: boolean
}
export const useTableFetch = <T, U = any, D = any>(
  params: T,
  fetchApi: FunctionFetch<T, U>,
  callback: FunctionCallback<U>
): {
  pageConfig: API.PageConfig
  tableConfig: Ref<TableConfig<D>>
  tablePageChange: (pageConfig: API.PageConfig) => void
  getData: () => void
} => {
  const pageConfig = reactive({
    currentPage: 1,
    pageSize: 10
  })
  const tableConfig = ref<TableConfig<D>>({
    data: [],
    total: 0,
    loading: false
  }) as Ref<TableConfig<D>>
  const tablePageChange = ({ currentPage, pageSize }: API.PageConfig) => {
    pageConfig.currentPage = currentPage
    pageConfig.pageSize = pageSize
    getData()
  }
  const getData = async () => {
    tableConfig.value.loading = true
    fetchApi({
      ...params,
      ...pageConfig
    }).then(res => {
      tableConfig.value.loading = false
      callback(res)
    })
  }

  return {
    pageConfig,
    tableConfig,
    tablePageChange,
    getData
  }
}

// export { useTableFetch }
