import Fetch from './fetch2'
import { generateEnumMap } from '@/utils'
/**
 * @INIT 初始化
 * @SVC_STA_CALC 服务站待核算"
 * @CANCEL 已作废
 * @SVC_STA_CALC_COMPLETE 服务站核算完成
 * @SVC_STA_CHECK 服务站待核对
 * @SVC_STA_CHECK_COMPLETE 服务站核对完成
 * @COMPANY_CHECK 公司待核对
 * @COMPANY_CHECK_COMPLETE 公司核对完成
 * @CHECK_COMPLETED 核对结束
 * @APPROVAL_COMPLETED 审批完成
 */
export enum MainCheckStatus {
  INIT = 11,
  SVC_STA_CALC = 13,
  CANCEL = 14,
  SVC_STA_CALC_COMPLETE = 15,
  SVC_STA_CHECK = 21,
  SVC_STA_CHECK_COMPLETE = 26,
  COMPANY_CHECK = 31,
  COMPANY_CHECK_COMPLETE = 36,
  CHECK_COMPLETED = 49,
  APPROVAL_COMPLETED = 59
}

export type CheckStatusStation = Pick<
  typeof MainCheckStatus,
  'SVC_STA_CHECK' | 'SVC_STA_CHECK_COMPLETE'
>

export const CheckStatusMap = generateEnumMap<MainCheckStatus>({
  '待核对': MainCheckStatus.SVC_STA_CHECK,
  '已核对': MainCheckStatus.SVC_STA_CHECK_COMPLETE
})

/**
 * @description 服务站核对列表入参
 */
export interface ServiceStationCheck {
  companyMonthStatementExcitationCheckId: number
  checkStatus: MainCheckStatus
  mainCheckStatus: MainCheckStatus
  promoterDeptId: number
  promoterId?: number
  orderNo?: string
  relateOrderNo?: string
  companyId: number
  cityId: number
}

export type CompanyMonthStatementExcitationCheckId = Pick<
  ServiceStationCheck,
  'companyMonthStatementExcitationCheckId'
>

/**
 * @description 订单激励佣金项目
 */
interface CheckOrderExcitationItem {
  checkOrderExcitationItemId: number // 核对订单激励佣金项目id
  orderRelationExcitationItemId: number // 订单关联激励项目id
  orderExcitationItemId: number // 订单激励佣金项目id
  commissionAmount: number // 计提佣金总金额
}

/**
 * @description 服务站订单激励佣金项目入参集合
 */
export type CheckOrderExcitationItemInputListStation = Array<CheckOrderExcitationItem>

export interface InitDataStation {
  cityId: number
  companyId: number
  companyMonthStatementExcitationCheckId: number
  companyName: string
  deptList: Array<{
    deptCheckStatusDesc: string
    deptName: string
    promoterDeptId: number
    thirdDeptNo: string
  }>
  excitationType: string
  mainCheckStatus: number
  statementMonthName: string
}

/**
 * @description 服务站核对初始化数据
 * @param params
 * @returns
 */
export const LoadPageInitDataStation = (
  params: CompanyMonthStatementExcitationCheckId
) => {
  return Fetch<InitDataStation>(
    `/hradmin/excitation/service-station-check/load-page-init-data.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

/**
 * @description 查询服务站核对分页
 * @param params
 * @returns
 */
export const GetListStation = (
  params: ServiceStationCheck & API.PageConfig
) => {
  return Fetch<{
    list: Array<{
        checkOrderExcitationItemId: number
        orderRelationExcitationItemId: number
        commissionAmount: number
        deptName: string
        detailAddr: string
        empNo: string
        firstCommissionAmount: 0
        goodsName: string
        materialNo: string
        orderExcitationId: 5072
        orderFinishTime: 1699263250000
        orderInvoiceTime: 1699263244000
        orderNo: string
        paidAmount: number
        promoterName: string
        quantity: number
        relateOrderNo: string
        extOrderNo: string
        remainCommissionAmount: number
        statementMonthName: string
        commissionRemark: string
    }>
  total: number
  }>(`/hradmin/excitation/service-station-check/list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

/**
 * @description 服务站核对激励问题标记
 * @param params
 * @returns
 */
export const ProblemMarkersStation = (params: {
  checkOrderExcitationItemInputList: CheckOrderExcitationItemInputListStation
  processRemark: string
  companyId: number
} & CompanyMonthStatementExcitationCheckId) => {
  return Fetch(
    `/hradmin/excitation/service-station-check/problem-markers.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

/**
 * @description 服务站确认核对
 * @param params
 * @returns
 */
export const ConfirmCheckStation = (params: {
  checkOrderExcitationItemInputList: CheckOrderExcitationItemInputListStation
  companyId: number
} & CompanyMonthStatementExcitationCheckId) => {
  return Fetch(
    `/hradmin/excitation/service-station-check/confirm-check.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

/**
 * @description 服务站核对列表异步导出
 * @param params
 * @returns
 */
export const AsyncExportStation = (
  params: ServiceStationCheck & API.PageConfig
) => {
  return Fetch(`/hradmin/excitation/service-station-check/asyn-export.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

/**
 * @description 服务站核对导入数据
 * @param params
 * @returns
 */
export const ImportDataStation = (
  params: {
    file: any
    checkStatus: MainCheckStatus
    companyId: number
    promoterDeptId: number
  } & CompanyMonthStatementExcitationCheckId
) => {
  return Fetch(
    `/hradmin/excitation/service-station-check/import.action`,
    {
      method: 'POST',
      body: params as any
    },
    {
      isFormData: true
    }
  )
}

/**
 * @description 审批结果
 * @WAIT_CHECK 待核对
 * @CHECK_REJECT 核对驳回
 * @CHECK_PASS 核对通过
 */
export enum AuditResult {
  WAIT_CHECK = 12,
  CHECK_REJECT = 14,
  CHECK_PASS = 19
}

export const AuditResultMap = generateEnumMap<AuditResult>({
  '待核对': AuditResult.WAIT_CHECK,
  '已核对': AuditResult.CHECK_PASS
})

export type CompanyCheck = Omit<ServiceStationCheck, 'checkStatus' | 'promoterDeptId'> & {
  companyMonthStatementExcitationCheckRoleId: number
  companyMonthStatementExcitationCheckRoleUserRelationId: number
  auditResult: AuditResult
}

export type RoleID = {
  companyMonthStatementExcitationCheckRoleId: number
  companyMonthStatementExcitationCheckRoleUserRelationId: number
} & CompanyMonthStatementExcitationCheckId

/**
 * @description 公司订单激励佣金项目入参集合
 */
export type CheckOrderExcitationItemInputListCompany = Array<CheckOrderExcitationItem & {auditRelationId: number}>

export interface InitDataCompany extends RoleID {
  cityId: number
  companyId: number
  companyName: string
  excitationType: string
  mainCheckStatus: MainCheckStatus
  statementMonthName: string
}
/**
 * @description 公司核对初始化数据
 * @param params
 * @returns
 */
export const LoadPageInitDataCompany = (
  params: RoleID
) => {
  return Fetch<InitDataCompany>(`/hradmin/excitation/company-check/load-page-init-data.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

/**
 * @description 公司核对分页列表
 * @param params
 * @returns
 */
export const GetListCompany = (params: CompanyCheck & API.PageConfig) => {
  return Fetch<{
    list: Array<{
      auditRelationId: number
      checkOrderExcitationItemId: number
      commissionAmount: number
      deptName: string
      detailAddr: string
      empNo: string
      firstCommissionAmount: number
      goodsName: string
      materialNo: string
      orderExcitationId: number
      orderExcitationItemId: number
      orderFinishTime: number
      orderInvoiceTime: number
      orderNo: string
      orderRelationExcitationItemId: number
      paidAmount: number
      promoterName: string
      quantity: number
      relateOrderNo: string
      extOrderNo: string
      remainCommissionAmount: number
      statementMonthName: string
      commissionRemark: string
    }>
    total: number
  }>(`/hradmin/excitation/company-check/list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

/**
 * @description 公司核对激励问题标记
 * @param params
 * @returns
 */
export const ProblemMarkersCompany = (
  params: {
    checkOrderExcitationItemInputList: CheckOrderExcitationItemInputListCompany
    processRemark: string
    companyId: number
  } & RoleID
) => {
  return Fetch(`/hradmin/excitation/company-check/problem-markers.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

/**
 * @description 公司确认核对
 * @param params
 * @returns
 */
export const ConfirmCheckCompany = (
  params: {
    checkOrderExcitationItemInputList: CheckOrderExcitationItemInputListCompany
    companyId: number
  } & RoleID
) => {
  return Fetch(`/hradmin/excitation/company-check/confirm-check.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

/**
 * @description 公司核对列表异步导出
 * @param params
 * @returns
 */
export const AsyncExportCompany = (params: CompanyCheck & API.PageConfig) => {
  return Fetch(`/hradmin/excitation/company-check/asyn-export.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

/**
 * @description 公司核对导入数据
 * @param params
 * @returns
 */
export const ImportDataCompany = (
  params: {
    file: any
    auditResult: AuditResult
    companyId: number
  } & RoleID
) => {
  return Fetch(
    `/hradmin/excitation/company-check/import.action`,
    {
      method: 'POST',
      body: params as any
    },
    {
      isFormData: true
    }
  )
}
