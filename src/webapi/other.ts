import Fetch from './fetch2'

interface Page {
  pageSize: number
  currentPage: number
}

interface Page2 {
  ecejPageSize: number
  ecejCurrentPage: number
}

export interface PageList<T> {
  dataList: T[]
  totalCount: number
}

export interface PageInitResult {
  cityList: Array<{
    cityId: number
    cityName: string
    cityCodeNo: string
  }>
  excitationStatusList: Array<{
    statusId: number
    statusName: string
  }>
}
/**
 * @description 初始化页面数据
 * @returns
 */
export const PageInitData = () => {
  return Fetch<PageInitResult>(
    `/hradmin/excitation/company-order-level-rule/load-page-init-data.action`,
    {
      body: null
    }
  )
}
export interface BaseRuleListResult {
  companyOrderLevelExcitationRuleId: number
  cityName: string
  companyId: number
  companyName: string
  companyCode: string
  ruleName: string
  ruleStatus: 14 | 19
  orderClassify: number
  commissionType: number
  commissionValue: number
  updateTime: number
}
/**
 * @description 查询订单标签激励规则列表
 * @returns
 */
export const BaseRuleList = (
  params: {
    cityId?: number
    companyId?: number
    ruleStatus?: number
  } & Page
) => {
  return Fetch<PageList<BaseRuleListResult>>(
    `/hradmin/excitation/company-order-level-rule/base-rule-list.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

export interface AddRuleRequest {
  companyOrderLevelExcitationRuleId?: number
  cityId?: number
  companyId?: number
  ruleName: string
  orderClassify: 11 | 12
  commissionType?: number
  commissionValue?: number
  orderLabelId: string
  orderTagName: string
  orderLabelCode: string
}
/**
 * @description 新增订单标签规则
 * @returns
 */
export const AddRule = (params: AddRuleRequest) => {
  return Fetch(`/hradmin/excitation/company-order-level-rule/add-rule.action`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 编辑订单标签规则
 * @returns
 */
export const EditRule = (params: AddRuleRequest) => {
  return Fetch(
    `/hradmin/excitation/company-order-level-rule/edit-rule.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

export interface RuleDetailRueult extends AddRuleRequest {
  cityName: string
  companyName: string
  companyCode: string
  ruleStatus: 14 | 19
  orderLabelName: string
  orderLabelCode: string
}
/**
 * @description 查看规则详情
 * @returns
 */
export const RuleDetail = (params: {
  companyId: number
  companyOrderLevelExcitationRuleId: number
}) => {
  return Fetch<RuleDetailRueult>(
    `/hradmin/excitation/company-order-level-rule/view-rule-detail.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

export interface LabelList {
  orderLabelId: string
  orderLabelCode: string
  orderLabelName: string
}
/**
 * @description 查看规则详情
 * @returns
 */
export const GetOrderLabel = (params: {
  orderLabelId?: string
  orderLabelCode: string
}) => {
  return Fetch<LabelList[]>(
    `/hradmin/excitation/company-order-level-rule/get-order-label.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

export interface History {
  operTime: number
  operRemark: string
  createUserName: string
}
/**
 * @description 查看规则更新记录
 * @returns
 */
export const QueryHistoryOperlog = (params: {
  companyOrderLevelExcitationRuleId: number
  companyId: number
}) => {
  return Fetch<History[]>(
    `/hradmin/excitation/company-order-level-rule/query-history-operLog.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

/**
 * @description 修改规则状态（开启或关闭规则）
 * @returns
 */
export const ToggleRuleStatus = (
  params: Array<{
    companyOrderLevelExcitationRuleId: number
    ruleStatus: 14 | 19
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-order-level-rule/modify-rule-status.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

export interface OrderDetailStatisticsParams {
  cityId?: number
  companyId?: number
  empId?: number
  calculateTimeStart?: string
  calculateTimeEnd?: string
  companyExcitationStatementId?: number
}
/**
 * @description 订单激励明细统计-分页列表
 * @returns
 */
export const OrderDetailStatistics = (
  params: OrderDetailStatisticsParams & Page2
) => {
  return Fetch(`/hradmin/excitation/order-detail-statistics/list.action`, {
    body: JSON.stringify(params)
  })
}

/**
 * @description 订单激励明细统计-异步导出
 * @returns
 */
export const OrderDetailStatisticsAsynExport = (
  params: OrderDetailStatisticsParams
) => {
  return Fetch(
    `/hradmin/excitation/order-detail-statistics/asyn-export.action`,
    {
      body: JSON.stringify(params)
    }
  )
}
