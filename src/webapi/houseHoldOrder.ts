import Fetch from './fetch2'

export interface OrderHouseHoldImputaionInfoRespDTO {
  orderTotalAmt: number
  orderServiceAmt: number
  orderAppreciationAmt: number
  orderHouseHoldImputaionDetailInfoRespDTOList: OrderHouseHoldImputaionDetailInfoRespDTO[]
}
export interface OrderHouseHoldImputaionDetailInfoRespDTO {
  workOrderNo: string
  orderStatus: string
  cityName: string
  companyName: string
  stationName: string
  totalPayableAmt: string
  totalPaidAmt: string
  totalEmpReductionAmt: string
  marketFlag: 0 | 1 // 0非集市, 1集市
  orderHouseHoldImputaionItemInfoRespDTOList: OrderHouseHoldImputaionItemInfoRespDTO[]
}
export type OrderHouseHoldImputaionItemInfoRespDTO = Omit<
  ServiceItemAndMaterial,
  'materialName'
>
export interface ServiceItemAndMaterial {
  itemName: string
  materialName: string
  insuranceMark: string
  unitAmt: string
  num: string
  payableAmt: string
  paidAmt: string
  empReductionAmt: string
  orderHouseHoldImputaionMaterialInfoRespDTOList: Omit<
    ServiceItemAndMaterial,
    'itemName' | 'orderHouseHoldImputaionMaterialInfoRespDTOList'
  >[]
}
export interface OrderInfoRespDTO {
  workOrderId: number
  workOrderNo: string
  serviceClassName: string
  orderSourceDesc: string
  createTime: string
  userName: string
  userMobile: string
  addressDetail: string
  userRemark: string
  cityName: string
  companyName: string
  stationName: string
  createName: string
}
export interface OrderBookInfoRespDTO {
  bookTime: string
  remindCount: string
  reschedulingCount: string
  empName: string
  empCompanyName: string
  empStationName: string
}
export interface OrderHouseHoldInfoRespDTO {
  arriveTime: string
  endTime: string
  lateType: 0 | 1 // 0-未迟到；1-迟到
  longitude: number
  latitude: number
  distance: number
  empName: string
  empMobile: string
  scenePanoramaImgList: string[]
  sceneSituatioinImgList: string[]
}
export interface OrderCheckData {
  orderInfoRespDTO?: OrderInfoRespDTO
  orderBookInfoRespDTO?: OrderBookInfoRespDTO
  orderHouseHoldInfoRespDTO?: OrderHouseHoldInfoRespDTO
  orderHouseHoldImputaionInfoRespDTO?: OrderHouseHoldImputaionInfoRespDTO
}
/**
 * @description 	入户订单归集查询
 * @returns
 */
export const HouseHoldOrderCheckQueryData = (params: {
  workOrderNo?: string
}) => {
  return Fetch<OrderCheckData>(
    `/statisticsadmin/house-hold-order-check/query-data`,
    {
      body: params as any
    },
    {
      isFormData: true
    }
  )
}

export interface Photo {
  imageSummary?: string
  imgPath?: string
  telImageUrl?: string
}
export enum ImagesTitleMap {
  aiList = '安检工单',
  ajbjList = '燃气表图片',
  cancelImgList = '订单取消图片',
  dangerAfterImageList = '隐患整改',
  dangerBeforeImageList = '隐患发现',
  orderTelResolutionList = '电话解决图片',
  icList = '在保凭证',
  liveImageList = '服务图片',
  moiList = '换表图片',
  otherList = '其他位置',
  receiptList = '安检小票图片',
  shdiList = '隐患告知',
  signatureList = '电子签名',
  situationList = '现场全景',
  snmrList = '到访不遇图片',
  spprList = '关键环节图片',
  tableImgList = '抄表图片',
  tmList = '到访不遇技术方式图',
  uopList = '用户下单拍照',
  xchqkList = '现场情况',
  xctjList = '现场图集'
}
export type Photos = Photo | string
export type PhotoMap = Record<keyof typeof ImagesTitleMap, Photos[]>
/**
 * @description 	入户订单归集图片查询
 * @returns
 */
export const HouseHoldOrderCheckGetPhotoData = (params: {
  workOrderId?: number
  workOrderNo?: string
  dataPeriod?: 1
}) => {
  return Fetch<PhotoMap>(
    `/statisticsadmin/orderManage/get-photo-data`,
    {
      body: params as any
    },
    {
      isFormData: true
    }
  )
}
