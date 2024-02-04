import Fetch from '@/webapi/fetch2'

import type { CONST } from '@/global'
import type { MarketOrderChannel } from '@/types/goods'
export { MarketShopList } from '@/webapi/common'
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
  draftCompanyGoodsExcitationRuleId?: number
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
  draftCompanyGoodsExcitationRuleId?: number
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

// 验证公司下是否存在基础规则-试算
export const CheckBaseRule = (params: {
  companyId?: number
  marketShopId?: number
  commissionType?: number
  commissionValue?: number
  comnanyGoodsExcitationRuleId?: number
}) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/check-draft-rule.action`,
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
export const MarketGoodsList = (params: {
  marketShopId: number | null | undefined
}) => {
  return Fetch(`/hradmin/common/market-goods-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 商品列表-试算
export const CanusedlGoodsList = (params: {
  storeId: number
  marketShopId: number
  companyId: number
  queryType: 0 | 1 // 查询类型: 基础激励传0，叠加激励传1
}) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/canused-goods-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 获取分销员列表-试算
export const CanusedPromoterList = (params: {
  storeId: number | undefined
  marketShopId?: number
}) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/canused-promoter-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 新建保存商品激励基础规则-试算
export const AddSaveBaseRule = (params: ISaveBaseRule) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/add-goods-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 编辑保存商品激励基础规则-试算
export const EditSaveBaseRule = (params: ISaveBaseRule) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/edit-goods-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 商品激励叠加规则订单标签-试算
export const GoodsGetOrderLabelRerun = (params: { orderLabelCode: string }) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/get-order-label.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 新建保存商品激励叠加规则-试算
export const AddSaveOverlayRule = (params: ISaveOverlayRule) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/add-overlay-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 编辑保存商品激励叠加规则-试算
export const EditSaveOverlayRule = (params: ISaveOverlayRule) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/edit-overlay-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 移除已存在或失效的商品-试算
export const RemoveRule = (
  params: Array<{
    draftCompanyGoodsExcitationRuleId: number
    goodsId: number
    skuNo: string
    companyId?: number
  }>
) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/remove-goods-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 商品激励规则详情-试算
export const QueryBaseRule = (params: {
  draftCompanyGoodsExcitationRuleId: number
  companyId: number
  marketShopId: number
}) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/query-draft-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 商品激励叠加规则详情-试算
export const QueryBaseSuperpositionRule = (params: {
  draftCompanyGoodsExcitationRuleId: number
  companyId: number
  marketShopId: number
}) => {
  return Fetch(
    `/hradmin/excitation/rerun-company-goods-rule/query-overlay-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}
