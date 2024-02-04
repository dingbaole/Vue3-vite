import type { CONST } from '@/global'
import Fetch from './fetch'
import type { MarketOrderChannel } from '@/types/goods'
export { MarketGoodsList, MarketShopList } from '@/webapi/common'
export interface Page {
  pageSize: number
  currentPage: number
}

export interface Page3 {
  pageSize2: number
  currentPage2: number
}

export interface OperGoodsDetailInput {
  cateId: number
  goodsId?: number
  id?: number | string
  skuId: string
  skuNo: string
  goodsName: string
  materialNo: string
  goodsType: number
  price: number
  guidePrice: number
  ruleStatus?: number
  commissionRuleName?: string
  comnanyGoodsExcitationRuleId?: number
  checked?: boolean
  calcType: 10 | 11
}
export interface IAddlimitPromoterInputList {
  employeeId: number
  employeeName: string
  employeeMobile: string
}
export interface TieredItem {
  companyGoodsExcitationRuleLadderId?: number
  ladderStatus: CONST['ladderStatus'] // 14:禁用. 19:启用
  ladderNumStartValue: string
  ladderNumEndValue: string
  commissionValue: string
  ladderName?: string
  ladderRemark: string
}
export interface ISaveBaseRule {
  comnanyGoodsExcitationRuleId?: number
  cityId: number
  companyId: number | undefined
  marketShopId: number | undefined
  ruleGroup: 11 | 21 // 配置组(11:基础配置, 21:叠加配置)
  ladderCalcType: 11 | 12 // 11: 否 12: 是
  ladderType: CONST['ladderType']
  commissionType: 11 | 12
  commissionValue: string
  ruleName: string
  operGoodsDetailInputList: OperGoodsDetailInput[]
  goodsExcitationRuleLadderInputList?: TieredItem[]
}
export interface ISaveOverlayRule {
  comnanyGoodsExcitationRuleId?: number
  cityId: number
  companyId: number | undefined
  marketShopId: number | undefined
  ruleGroup: 11 | 21 // 配置组(11:基础配置, 21:叠加配置)
  commissionType: 21 | 22
  commissionValue: string
  ruleName: string
  addlimitGoodsInputList: any[]
  addlimitPromoterInputList: any[]
  addMarketOrderChannelInputList: Pick<
    MarketOrderChannel,
    'marketOrderChannelId'
  >[]
  addGoodsOrderLabelInputList: Array<{
    orderLabelId: string
    orderLabelName: string
  }>
  startDateTime: any
  endDateTime: any
  startTime: number | undefined
  endTime: number | undefined
}

// 初始化页面数据（激励类型、状态接口）
export const LoadPageInitRuleService = () => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/load-page-init-data.action`,
    {
      method: 'POST',
      body: null
    }
  )
}

// 初始化页面数据（激励类型、状态接口）
export const LoadPageInitRuleGoodsStatistics = () => {
  return Fetch(
    `/hradmin/excitation/order-goods-item/load-page-init-data.action`,
    {
      method: 'POST',
      body: null
    }
  )
}

export interface IRuleList {
  cityId: number | null
  companyId: number | null
  commissionType?: number | null
  ruleStatus?: number | null
  marketShopId?: number
}
// 商品激励规则列表
export const RuleList = (params: IRuleList & Page) => {
  return Fetch(`/hradmin/excitation/company-goods-rule/base-rule-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}
// 商品激励规则导出
export const RuleExport = (params: IRuleList) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/base-rule-export.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 验证公司下是否存在基础规则
export const CheckBaseRule = (params: {
  companyId?: number
  marketShopId?: number
  commissionType?: number
  commissionValue?: number
  comnanyGoodsExcitationRuleId?: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/check-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 店铺list
// export const MarketShopList = (params: {
//   cityId: number | null | undefined
//   companyId: number | null | undefined
// }) => {
//   return Fetch(`/hradmin/common/market-shop-list.action`, {
//     method: 'POST',
//     body: JSON.stringify(params)
//   })
// }

// 查询商品激励规则记录列表
export const GoodsOperateRecord = (
  params: {
    cityId?: number
    companyId?: number
    goodsId?: number
    operateTimeStart: number
    operateTimeEnd: number
  } & Page
) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/item-operate-record.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

export interface IMarketGoodsList {
  goodsName: string
  skuNo: string
  goodsId: string
}
// 商品名称下拉选
// export const MarketGoodsList = (params: {
//   marketShopId: number | null | undefined
// }) => {
//   return Fetch(`/hradmin/common/market-goods-list.action`, {
//     method: 'POST',
//     body: JSON.stringify(params)
//   })
// }

// 商品列表
export const CanusedlGoodsList = (params: {
  storeId: number
  marketShopId: number
  companyId: number
  queryType: 0 | 1 // 查询类型: 基础激励传0，叠加激励传1
}) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/canused-goods-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 获取分销员列表
export const CanusedPromoterList = (params: {
  storeId: number | undefined
  marketShopId?: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-goods-superposition-rule/canused-promoter-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 新建保存商品激励基础规则
export const AddSaveBaseRule = (params: ISaveBaseRule) => {
  return Fetch(`/hradmin/excitation/company-goods-rule/add-goods-rule.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 商品激励叠加规则订单标签
export const GoodsGetOrderLabel = (params: { orderLabelCode: string }) => {
  return Fetch(
    `/hradmin/excitation/company-goods-superposition-rule/get-order-label.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 编辑保存商品激励基础规则
export const EditSaveBaseRule = (params: ISaveBaseRule) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/edit-goods-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 新建保存商品激励叠加规则
export const AddSaveOverlayRule = (params: ISaveOverlayRule) => {
  return Fetch(
    `/hradmin/excitation/company-goods-superposition-rule/add-goods-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 编辑保存商品激励叠加规则
export const EditSaveOverlayRule = (params: ISaveOverlayRule) => {
  return Fetch(
    `/hradmin/excitation/company-goods-superposition-rule/edit-goods-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 移除已存在或失效的商品
export const RemoveRule = (
  params: Array<{
    comnanyGoodsExcitationRuleId: number
    goodsId: number
    skuNo: string
    companyId?: number
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/remove-goods-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 商品激励规则详情
export const QueryBaseRule = (params: {
  comnanyGoodsExcitationRuleId: number
  companyId: number
  marketShopId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/query-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 商品激励叠加规则详情
export const QueryBaseSuperpositionRule = (params: {
  comnanyGoodsExcitationRuleId: number
  companyId: number
  marketShopId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-goods-superposition-rule/query-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 开启激励基础规则
export const OpenBaseRule = (params: {
  comnanyGoodsExcitationRuleId: number
  companyId: number
  marketShopId: number
}) => {
  return Fetch(`/hradmin/excitation/company-goods-rule/open-base-rule.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 关闭激励基础规则
export const CloseBaseRule = (
  params: Array<{
    comnanyGoodsExcitationRuleId: number
    commissionType: number
    commissionValue: number
    companyId: number
    marketShopId: number
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/close-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 商品关闭规则
export const CloseServiceItemRule = (
  params: Array<{
    comnanyGoodsExcitationRuleId: number
    companyId: number
    goodsId: string
    ruleName: string
    skuNo: string
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/close-goods-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

export interface ISetList {
  cityId: number | null | undefined
  companyId: number | null | undefined
  marketShopId?: number | null | undefined
  commissionType: number | null | undefined
  goodsId: string
  materialNo?: string
}

export interface IViewExcitationGoods {
  cityId: number
  cityName: string
  companyId: number
  companyName: string
  companyCode: string
  goodsId: number
  skuNo: string
  goodsName: string
  goodsType: number
  materialNo: string
  goodsPrice: string
  shopId: number
  shopName: string
  excitationRuleOutputs: any[]
  commissionType: number
  commissionValue: number
  comnanyGoodsExcitationRuleId: number
  ruleStatus: number
}
// 设置的激励商品列表
export const ViewExcitationGoods = (params: ISetList & Page & Page3) => {
  return Fetch(
    `/hradmin/excitation/company-goods-superposition-rule/view-excitation-goods.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 设置的激励商品列表
export const CountList = (params: { companyId: number }) => {
  return Fetch(`/hradmin/excitation/company-goods-rule/count-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 更新记录
export const QueryHistoryOperlog = (params: {
  comnanyGoodsExcitationRuleId: number
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-goods-rule/query-history-operLog.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 未设置商品
export const UnusedList = (
  params: {
    cityId: number
    companyId: number
  } & Page
) => {
  return Fetch(`/hradmin/excitation/company-goods-rule/unused-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

interface Page2 {
  ecejPageSize: number
  ecejCurrentPage: number
}
// 评价激励规则列表
export const EvaluateRuleList = (
  params: {
    companyId: number
  } & Page2
) => {
  return Fetch(`/hradmin/excitation/comnany-evaluate-rule/page-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 评价激励规则系数更新
export const EvaluateRuleEdit = (params: {
  commissionValue: number
  comnanyEvaluateExcitationRuleRelationId: number
  comnanyEvaluateExcitationRuleId: number
  evaluateStar: number
  companyId: number
}) => {
  return Fetch(`/hradmin/excitation/comnany-evaluate-rule/edit.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 评价激励规则操作记录列表
export const EvaluateRuleRecord = (
  params: {
    excitationRuleId: number
  } & Page2
) => {
  return Fetch(
    `/hradmin/excitation/comnany-evaluate-rule/relation-operate-record-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}
