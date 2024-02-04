import Fetch from '@/webapi/fetch2'
import type { RerunStatus, RuleGroup, RuleStatus, RuleCommissionType, FetchDraftStatus, LadderType } from '@/types'

type Page = {
  currentPage: number
  pageSize: number
}

// 获取重跑状态
export const GetRerunStatus = (params: {
  cityId: number
  companyId: number
  marketShopId: number
}) => {
  return Fetch<{
    workStatus: RerunStatus // 重跑状态
    pullStatus: FetchDraftStatus // 拉取状态
    companyExcitationStatementId?: number // 账期ID
    orderExcitationCalculateWorkId: number // 订单激励重新计算工作id
  }>(`/hradmin/excitation/rerun-company-goods-rule/get-rerun-status.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 查询商品激励草稿规则
export const DraftRuleList = (params: {
  cityId: number
  companyId: number
  marketShopId: number
}) => {
  return Fetch<Array<{
    draftCompanyGoodsExcitationRuleId: number
    companyGoodsExcitationRuleId: number
    cityId: number
    companyId: number
    marketShopId: number
    ruleName: string
    ruleStatus: RuleStatus
    ruleGroup: RuleGroup
    commissionType: RuleCommissionType
    commissionValue: string
    updateTime: number
    ladderType: LadderType
  }>>(`/hradmin/excitation/rerun-company-goods-rule/draft-rule-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 拉取线上有效规则到草稿
export const PullValidRule = (params: {
  cityId: number
  companyId: number
  marketShopId: number
}) => {
  return Fetch(`/hradmin/excitation/rerun-company-goods-rule/pull-valid-rule.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 重置草稿规则
export const ResetGoodsRule = (params: {
  marketShopId: number
}) => {
  return Fetch(`/hradmin/excitation/rerun-company-goods-rule/reset-goods-rule.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 删除草稿规则
export const DeleteGoodsRule = (params: {
  draftCompanyGoodsExcitationRuleId: number
}) => {
  return Fetch(`/hradmin/excitation/rerun-company-goods-rule/delete-goods-rule.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 开始重跑计算
export const StartRerunCalc = (params: {
  cityId: number
  companyId: number
  marketShopId: number
  companyExcitationStatementId: number
  orderExcitationCalculateWorkId: number
}) => {
  return Fetch(`/hradmin/excitation/rerun-company-goods-rule/start-rerun-calc.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}


// 重跑结果列表
export const GetRerunCalcResult = (params: {
  orderExcitationCalculateWorkId: number
} & Page) => {
  return Fetch<{
    list: Array<CalcResult>
    total: number
  }>(`/hradmin/excitation/rerun-company-goods-rule/get-rerun-calc-difference-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 重跑结果列表异步导出
export const GetRerunCalcResultExport = (params: {
  orderExcitationCalculateWorkId: number
} ) => {
  return Fetch(`/hradmin/excitation/rerun-company-goods-rule/rerun-calc-difference-asyn-export.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 返回上一步
export const ReturnPrevStep = (params: {
  orderExcitationCalculateWorkId: number
}) => {
  return Fetch(`/hradmin/excitation/rerun-company-goods-rule/return-previous-step.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export interface CalcResult {
  /**
   * 订单激励重新计算工作id orderExcitationCalculateWorkId order_excitation_calculate_work_id
   */
  orderExcitationCalculateWorkId: number

  /**
   * 订单号 orderNo order_no
   */
  orderNo: string

  /**
   * 集市店铺id marketShopId market_shop_id
   */
  marketShopId: number

  /**
   * 集市店铺名称
   */
  marketShopName: string

  /**
   * 商家编号
   */
  thirdShopNo: string

  /**
   * 公司id companyId company_id
   */
  companyId: number;

  /**
   * 公司名称
   */
  companyName: string;

  /**
   * 公司代码
   */
  companyCodeNo: string;

  /**
   * 城市id cityId city_id
   */
  cityId: number;

  /**
   * 城市名称
   */
  cityName: string;

  /**
   * 销售数量 quantity quantity
   */
  quantity: number

  /**
   * 应收金额 receivableAmount receivable_amount
   */
  receivableAmount: number

  /**
   * 实付金额 paidAmount paid_amount
   */
  paidAmount: number

  /**
   * 差异类型(11:无差异, 21:金额有差异, 22:账期有差异) differenceType difference_type
   */
  differenceType: number

  /**
   * 原计提佣金金额(上次计算金额) originalCommissionAmount original_commission_amount
   */
  originalCommissionAmount: number

  /**
   * 计提佣金金额 commissionAmount commission_amount
   */
  commissionAmount: number

  /**
   * 物料编号 materialNo material_no
   */
  materialNo: string

  /**
   * 商品sku编号 goodsSkuNo goods_sku_no
   */
  goodsSkuNo: string

  /**
   * 商品名称 goodsName goods_name
   */
  goodsName: string
}
