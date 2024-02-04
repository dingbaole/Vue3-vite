import Fetch from './fetch2'
import type { Inventory } from '@/views/inventory/types'
interface Page {
  pageNow: number
  pageSize: number
}
/**
 * @description 	库位清单变动记录
 * @returns
 */
export const QueryStockInventoryList = (params: Inventory & Page) => {
  return Fetch(`/opmaterial/materialPageHttp/queryStockInventoryList`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 	库位清单变动记录异步导出
 * @returns
 */
export const AsyncExport = (params: Inventory) => {
  return Fetch(`/opmaterial/materialPageHttp/asyncExport`, {
    body: JSON.stringify(params)
  })
}
