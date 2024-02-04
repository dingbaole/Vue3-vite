import Fetch from './fetch2'
import type { AfterSalesStatus } from '@/views/after-sales-onsite-service/types'

export interface Page {
  pageSize: number
  pageNum: number
}
export interface SaleAfterManage {
  cityId?: number
  companyId?: number
  stationId?: number
  orderStatus?: AfterSalesStatus
  afterSaleOrderNo?: string
  workOrderNo?: string
  startScreateTime?: string
  endScreateTime?: string
  startEndTime?: string
  endEndTime?: string
}
/**
 * @description 	上门服务售后订单
 * @returns
 */
export const SaleAfterOrderManageQueryList = (
  params: SaleAfterManage & { pageManager: Page }
) => {
  return Fetch(`/aoss/after-sale-order/saleAfterOrderManage-query-list`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 	上门服务售后订单退款
 * @returns
 */
export const RefundData = (params: { saleOrderId: string }) => {
  return Fetch(`/aoss/after-sale-order/refund-data`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 	上门服务售后订单取消
 * @returns
 */
export const CancelAfterSaleOrder = (params: {
  saleOrderId: string
  operateSource: number
  cancelReason: string
}) => {
  return Fetch(`/aoss/after-sale-order/cancel-afterSaleOrder`, {
    body: JSON.stringify(params)
  })
}

interface CreateAfterSaleOrderDto {
  orderSource: number
  workOrderNo: string
  cityId: number
  cityName: string
  companyId: number
  stationId: number
  provinceName: string
  districtName: string
  communityName: string
  detailAddress: string
  afterSaleReason: string
  afterSaleCreateOrderItemReqParamList: Array<{
    serviceItemId: number
    paidAmt: number
    quantity: number
    afterSaleCreateOrderMaterialReqParamList: Array<{
      materialUsedId: number
      serviceItemId: number
      materialNum: number
      materialPaidAmt: number
    }>
  }>
}

/**
 * @description 	创建上门服务售后订单
 * @returns
 */
export const CreateAfterSaleOrder = (params: CreateAfterSaleOrderDto) => {
  return Fetch(`/aoss/after-sale-order/create-afterSaleOrder`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 	上门服务售后订单变更
 * @returns
 */
export const ChangeAfterSaleOrder = (
  params: Pick<
    CreateAfterSaleOrderDto,
    'afterSaleCreateOrderItemReqParamList'
  > & { saleOrderNo: string; afterSaleReason: string }
) => {
  return Fetch(`/aoss/after-sale-order/change-data`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 	上门服务售后订单审核
 * @returns
 */
export const ExamineRejectAfterSaleOrder = (params: {
  saleOrderId: string
  type: 1 | 2 // 1-同意；2-驳回
  rejectReason: string
  operateSource: 4 // 来源为运营平台
}) => {
  return Fetch(`/aoss/after-sale-order/examine-reject-afterSaleOrder`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 	根据服务工单号查询工单详情
 * @returns
 */
export const GetOrderOfCanCreateSaleOByNum = (params: {
  workOrderNo: string
}) => {
  return Fetch(`/aoss/after-sale-order/get-orderOfCanCreateSaleOByNum`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 	售后单详情
 * @returns
 */
export const SaleAfterOrderQueryDetail = (params: {
  afterSaleOrderNo: string
  queryType: string
}) => {
  return Fetch(`/aoss/after-sale-order/saleAfterOrder-query-detail`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 	获取物料规格
 * @returns
 */
export const QueryMaterialInfo = (params: number[]) => {
  return Fetch(`/opmaterial/materialMallInvokeHttp/queryMaterialInfo`, {
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbnZDb2RlIjoidGVzdDEiLCJzeXN0ZW1Db2RlIjoiZDJjU3RvcmUiLCJpcCI6IjEyNy4wLjAuMSIsInJvbGVOYW1lIjoiIiwiZW1wbG95ZWVJZCI6IjJjODA4MDgxNWNkM2E3NGEwMTVjZDNhZTg2ODUwMDAxIiwidmFsdWVfYWRkZWRfc2VydmljZXMiOiJ7fSIsImV4cCI6NDc2MzQxNDU3NCwiRW1wbG95ZWVOYW1lIjoic3lzdGVtIiwidXNlcklkIjoiMDAwMDAwIiwicGxhdGZvcm0iOiJQTEFURk9STSIsInJlYWxFbXBsb3llZU5hbWUiOiJzeXN0ZW0ifQ'
    }
  })
}
