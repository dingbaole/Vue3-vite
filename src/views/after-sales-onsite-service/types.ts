export enum AfterSalesStatus {
  WAIT_AUDIT = 1, // 待审核
  WAIT_HANDLE = 2, // 待处理
  WAIT_REFUND = 3, // 待退款
  REFUND_FAIL = 4, // 退款失败
  COMPLETED = 5, // 已完成
  CANCELED = 6, // 已取消
  REJECTED = 7 // 已驳回
}

// export type PageViewType = 'create' | 'audit' | 'edit' | 'detail'
export enum PageViewType {
  CREATE = 'create',
  AUDIT = 'audit',
  EDIT = 'edit',
  DETAIL = 'detail'
}

export enum OperateType {
  APPLY = 1,
  PASS = 2,
  REJECT = 3,
  CHANGE = 4,
  SUBMIT = 5,
  CANCEL = 6,
  REFUND = 7
}

export interface CreateData extends CreateBasicInfo {
  serviceItemList?: ServiceItem[]
}

export interface DetailData extends DetailBasicInfo {
  afterSaleOrderItemRespDTOList: AfterSaleOrderItem[]
  saleAfterOrderOperHis: SaleAfterOrderOperHis[]
  saleAfterOrderImages: SaleAfterOrderImages[]
}
export interface SaleAfterOrderOperHis {
  operatorTime: string
  operatorUser: string
  operatorReason: string
  operatorType: OperateType
  newOrderStatus: AfterSalesStatus
}
export interface SaleAfterOrderImages {
  imageSummary: string
  imageType?: number // 1-售后单客户签名小票
}
export interface AfterSaleOrderItem {
  serviceItemId: number
  serviceClassName: string
  insuranceMark: number
  itemName: string
  itemNum: number
  itemUnitAmt: number
  quantity: number
  finishedNum: number
  canItemNum: number
  itemPaidAmt: number
  refundItemNum: number
  refundItemAmt: number
  canRefundAmt?: number
  afterSaleOrderMaterialRespDTOList?: AfterSaleOrderMaterial[]
}

export interface AfterSaleOrderMaterial {
  serviceItemId: number
  materialUsedId: number
  fittingId?: number
  insuranceMark?: number
  materialName?: string
  materialNo?: string
  materialUnitAmt?: number
  materialNum?: number
  usedCount?: number
  finishedNum?: number
  canMaterialNum?: number
  materialPaidAmt?: number
  materialRefundAmt?: number
  canRefundAmt?: number
}

export interface DetailBasicInfo {
  afterSaleOrderNo?: string
  workOrderNo?: string
  orderStatus?: AfterSalesStatus
  cityName?: string
  companyName?: string
  companyCode?: string
  stationName?: string
  empName?: string
  empMobile?: string
  contactsName?: string
  contactsMobile?: string
  detailAddress?: string
  endTime?: string
  payEndTime?: string
  afterSaleReason?: string
  totalRefundAmt?: number
  imageRemark?: string
}

export interface CreateBasicInfo {
  orderSource?: number
  saleOrderId?: string
  workOrderNo?: string
  orderStatus?: AfterSalesStatus
  provinceName?: string
  cityName?: string
  companyName?: string
  companyCode?: string
  stationName?: string
  empName?: string
  empNo?: string
  empStatus?: string
  contactsName?: string
  contactsMobile?: string
  community?: string
  detailAddress?: string
  payEndTime?: string
  cityId?: number
  companyId?: number
  stationId?: number
  districtName?: string
}

export interface ServiceItem {
  serviceItemId: number
  itemName: string
  serviceClassName: string
  insuranceMark: number
  quantity: number
  paidMoney: number
  canUsedCount: number
  canRefundAmt?: number
  materialUsedDtoList: MaterialUsed[]
}

export interface MaterialUsed {
  materialUsedId?: number
  fittingId?: number
  fittingName?: string
  insuranceMark: number
  usedCount: number
  paidMoney: number
  canUsedCount: number
  canRefundAmt?: number
}
