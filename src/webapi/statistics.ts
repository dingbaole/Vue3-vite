import Fetch from './fetch'
interface Page {
  ecejPageSize: number
  ecejCurrentPage: number
}

// 查询员工列表
export const QueryEmployeeList = (params: {
  empName?: string
  mobileNo?: string
  serviceCompanyId?: number
}) => {
  return Fetch(`/aoss/commonCtl/get-emp-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 商品统计店铺列表
export const MarketShopList = (params: {
  cityId: number
  companyId: number
}) => {
  return Fetch(`/hradmin/excitation/order-goods-item/market-shop-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export interface Goods {
  cityId: number
  companyId: number
  marketShopId: number
  orderNo?: string
  skuNo: string
  materialNo: string
  calculateTimeStart: string
  calculateTimeEnd: string
  orderFinalTimeStart?: string
  orderFinalTimeEnd?: string
  empId?: number
  promoterId?: number
  promoterId2?: number
  promoterId3?: number
  platformId?: Promoter
  extOrderNo?: string
  companyExcitationStatementId?: number
}
export enum Promoter {
  MARKET = 11,
  SAPECC = 21,
  SAPS4 = 22
}
// 商品统计列表
export const GoodsList = (params: Goods & Page) => {
  return Fetch(`/hradmin/excitation/order-goods-item/list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 商品统计导出
export const GoodsListExport = (params: Goods) => {
  return Fetch(`/hradmin/excitation/order-goods-item/asyn-export.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 商品安装统计列表
export const GoodsInstallList = (params: Goods & Page) => {
  return Fetch(`/hradmin/excitation/order-install-item/list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 商品统计导出
export const GoodsInstallListExport = (params: Goods) => {
  return Fetch(`/hradmin/excitation/order-install-item/asyn-export.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export interface ServiceItem {
  cityId: number
  companyId: number
  bigClassId: number
  deviceId: number
  serviceClassId: number
  serviceItemId: number
  calculateTimeStart: string
  calculateTimeEnd: string
  empId: number
  orderNo: string
  companyExcitationStatementId?: number
}
// 服务项目统计列表
export const ServiceItemStatisticsList = (params: ServiceItem & Page) => {
  return Fetch(`/hradmin/excitation/order-serviceitem-item/list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 服务项目统计导出
export const ServiceItemStatisticsExport = (params: ServiceItem) => {
  return Fetch(
    `/hradmin/excitation/order-serviceitem-item/asyn-export.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

export interface OrderServiceRelaEmp {
  cityId?: number
  companyId?: number
  workOrderNo?: string
  orderComplateDateStart?: string
  orderComplateDateEnd?: string
}
export interface IOrderServiceRelevancePromoter {
  orderNoList: string[]
  orderType: 11 | 12
  cityId: number
  companyId: number
  outerPromoterAggList: RelatedEmp[]
}

export interface RelatedEmp {
  roleName: string
  promoterName: string
  mobileNo: string
}
// 服务订单关联其他人员
export const OrderServiceRelevancePromoter = (
  params: IOrderServiceRelevancePromoter
) => {
  return Fetch(
    `/hradmin/excitation/order-goods-rela-emp/relevance-promoter.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}
// 服务订单关联其他人员查看
export const OrderServiceRelevancePromoterDetail = (
  params: {
    orderType: 11 | 12
    orderNo: string
  } & Partial<RelatedEmp>
) => {
  return Fetch(
    `/hradmin/excitation/order-service-rela-emp/outer/promoter/list`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}
// 服务订单关联其他人员信息管理列表
export const OrderServiceRelaEmpList = (params: OrderServiceRelaEmp & Page) => {
  return Fetch(`/hradmin/excitation/order-service-rela-emp/list`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 服务订单关联其他人员信息管理导出
export const OrderServiceRelaEmpExport = (params: OrderServiceRelaEmp) => {
  return Fetch(`/hradmin/excitation/order-service-rela-emp/export`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export interface OrderGoodsRelaEmp {
  cityId?: number
  companyId?: number
  marketShopId?: number
  saleOrderNo?: string
  orderComplateDateStart?: string
  orderComplateDateEnd?: string
  promoterName?: string
}
// 商品订单关联其他人员
export const OrderGoodsRelevancePromoter = (
  params: IOrderServiceRelevancePromoter
) => {
  return Fetch(
    `/hradmin/excitation/order-goods-rela-emp/relevance-promoter.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}
// 商品订单关联其他人员查看
export const OrderGoodsRelevancePromoterDetail = (
  params: {
    orderType: 11 | 12
    orderNo: string
  } & Partial<RelatedEmp>
) => {
  return Fetch(
    `/hradmin/excitation/order-goods-rela-emp/outer-promoter-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}
// 商品订单关联其他人员信息管理列表
export const OrderGoodsRelaEmpList = (params: OrderGoodsRelaEmp & Page3) => {
  return Fetch(`/hradmin/excitation/order-goods-rela-emp/order-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 商品订单关联其他人员信息管理导出
export const OrderGoodsRelaEmpExport = (params: OrderGoodsRelaEmp) => {
  return Fetch(
    `/hradmin/excitation/order-goods-rela-emp/base-order-export.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

export interface Material {
  cityId: number
  companyId: number
  orderNo: string
  materialNo: string
  calculateTimeStart: string
  calculateTimeEnd: string
  empId: number
  companyExcitationStatementId?: number
}
// 物料配件统计列表
export const MaterialStatisticsList = (params: Material & Page) => {
  return Fetch(`/hradmin/excitation/order-material-item/list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 物料配件统计导出
export const MaterialStatisticsExport = (params: Material) => {
  return Fetch(`/hradmin/excitation/order-material-item/asyn-export.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export interface Evaluate {
  cityId: number
  companyId: number
  orderNo: string
  calculateTimeStart: string
  calculateTimeEnd: string
  empId: number
  companyExcitationStatementId?: number
}
// 评价激励统计列表
export const EvaStatisticsList = (params: Evaluate & Page) => {
  return Fetch(`/hradmin/excitation/order-evaluate-item/list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 评价激励统计列表
export const EvaStatisticsExport = (params: Evaluate) => {
  return Fetch(`/hradmin/excitation/order-evaluate-item/asyn-export.action `, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export interface Redress {
  cityId: number
  companyId: number
  createTimeStart: string
  createTimeEnd: string
  empId: number
}
// 人工调整创值激励列表
export const RedressItemList = (params: Redress & Page) => {
  return Fetch(`/hradmin/excitation/redress-item/list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export interface RedressAdd {
  cityId: number
  companyId: number
  empId: number
  orderNo: string
  redressAmount: number
  remark: string
}
// 人工调整创值激励新增调整
export const RedressItemAdd = (params: RedressAdd) => {
  return Fetch(`/hradmin/excitation/redress-item/add.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 人工调整创值激励导出
export const RedressItemExport = (params: Redress) => {
  return Fetch(`/hradmin/excitation/redress-item/asyn-export.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export interface SaleData {
  cityId: number | undefined
  companyId: number | undefined
  empName?: string
  mobileNo?: string
  year?: string
  month?: string
  day?: string
}
interface Page2 {
  pageNum: number
  pageSize: number
}
interface Page3 {
  currentPage: number
  pageSize: number
}
// 商品销售员工排名-分页列表
export const SaleDataList = (params: SaleData & Page2) => {
  return Fetch(`/hradmin/excitation/emp-sale-data-summary/list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 商品销售员工排名-导出
export const SaleDataExport = (params: SaleData) => {
  return Fetch(
    `/hradmin/excitation/emp-sale-data-summary/export.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    },
    {
      isBlob: true
    }
  )
}

// 根据分销员姓名或手机号查询分销员列表
export const PromoterList = (params: {
  mobileNo?: string
  promoterName?: string
  marketPromoterNo?: string
}) => {
  return Fetch(`/hradmin/excitation/order-goods-item/promoter-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// function getFormData(object: any) {
//   const formData = new FormData()
//   Object.keys(object).forEach(key => {
//     const value = object[key]
//     if (Array.isArray(value)) {
//       value.forEach((subValue, i) => formData.append(key + `[${i}]`, subValue))
//     } else {
//       formData.append(key, object[key])
//     }
//   })
//   return formData
// }
