import Fetch from './fetch'
export interface Page {
  pageSize: number
  currentPage: number
}
export interface OperServiceItemDetailInputs {
  serviceItemId: number
  serviceItemName: string
  bigClassId: number
  bigClassName: string
  deviceId: number
  deviceName: string
  serviceClassId: number
  serviceClassName: string
  serviceFee: number
  ruleStatus: number
  commissionRuleName: string
  comnanyItemExcitationRuleId: number
  checked?: boolean
  calcGroupId: 10 | 11
}
export interface EmpRelateList {
  empId: number
  empName: number
}

export interface ServiceAreaRelateList {
  serviceAreaId: number
  areaName: number
}
export interface ISaveBaseRule {
  cityId: number | undefined
  companyId: number | undefined
  comnanyItemExcitationRuleId?: number
  ruleGroup?: number
  commissionType?: number
  commissionValue?: string
  ruleName: string
  operServiceItemDetailInputs: OperServiceItemDetailInputs[]
}

export interface ISaveBaseOverlayRule extends ISaveBaseRule {
  startTime: number | null
  endTime: number | null
  empRelateType: 10 | 11
  serviceItemRelateType: 10 | 11
  serviceAreaRelateType: 10 | 11
  empRelateList: EmpRelateList[]
  serviceAreaRelateList: ServiceAreaRelateList[]
  orderLabelRelateType: 10 | 11
  serviceItemOrderLabelInputList: Array<{
    orderLabelId: string
    orderLabelName: string
  }>
  startDateTime: any
  endDateTime: any
}

// 初始化页面数据（激励类型、状态接口）
export const LoadPageInitRuleService = () => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/load-page-init-data.action`,
    {
      method: 'POST',
      body: null
    }
  )
}

// 服务项目激励规则列表
export const ServiceItemRuleList = (
  params: {
    cityId: number | null | undefined
    companyId: number | null | undefined
    commissionType?: number | null | undefined
    ruleStatus?: number | null | undefined
  } & Page
) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/base-rule-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务项目激励规则列表导出
export const ServiceItemRuleExport = (params: {
  cityId: number | null | undefined
  companyId: number | null | undefined
  commissionType?: number | null | undefined
  ruleStatus?: number | null | undefined
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/base-rule-export.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 验证公司下是否存在基础规则
export const CheckBaseRule = (params: {
  companyId: number | undefined
  commissionType?: number
  commissionValue?: number
  comnanyItemExcitationRuleId?: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/check-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务项目列表
export const ServiceItemDataList = (
  params: {
    cityId?: number
    companyId?: number
    bigClassId?: number
    deviceId?: number
    serviceClassId?: number
    serviceItemId?: number
  } & Page
) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/canused-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 新建保存服务项目激励基础规则
export const AddSaveBaseRule = (params: ISaveBaseRule) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/add-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 新建保存服务项目激励叠加规则
export const AddSaveBaseOverlayRule = (
  params: Partial<ISaveBaseOverlayRule>
) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/add-overlay-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务项目激励叠加规则订单标签
export const ServiceItemGetOrderLabel = (params: {
  orderLabelCode: string
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/get-order-label.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}
// 编辑保存服务项目激励基础规则
export const EditSaveBaseRule = (params: ISaveBaseRule) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/edit-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 编辑保存服务项目激励叠加规则
export const EditSaveBaseOverlayRule = (
  params: Partial<ISaveBaseOverlayRule>
) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/edit-overlay-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务项目激励基础规则详情
export const QueryBaseRule = (params: {
  comnanyItemExcitationRuleId: number | undefined
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/query-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务项目激励叠加规则详情
export const QueryBaseOverlayRule = (params: {
  comnanyItemExcitationRuleId: number | undefined
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/query-overlay-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 移除已存在或失效的服务项目
export const RemoveServiceItemRule = (
  params: Array<{
    comnanyItemExcitationRuleId: number
    serviceItemId: number
    serviceItemName: string
    companyId: number | undefined
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/remove-serviceitem-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 开启激励基础规则
export const OpenBaseRule = (params: {
  comnanyItemExcitationRuleId: number
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/open-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 关闭激励基础规则
export const CloseBaseRule = (
  params: Array<{
    comnanyItemExcitationRuleId: number
    commissionType: number
    commissionValue: number
    companyId: number
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/close-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务项目关闭规则
export const CloseServiceItemRule = (
  params: Array<{
    comnanyItemExcitationRuleId: number
    companyId: number
    serviceItemId: number
    serviceItemName: string
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/close-serviceitem-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

export interface ISetList {
  cityId: number | undefined
  companyId: number | undefined
  bigClassId: number | undefined
  deviceId: number | undefined
  serviceClassId: number | undefined
  serviceItemId: number | undefined
  commissionType: number | undefined
}

export interface ServiceItemTable {
  companyName: string
  companyId: number
  bigClassId: number
  bigClassName: string
  deviceId: number
  deviceName: string
  serviceClassId: number
  serviceClassName: string
  serviceItemId: number
  serviceItemName: string
  serviceItemStatus: number
  serviceFee: number
  commissionType: 11 | 12 | 21 | 22
  commissionValue: number
  comnanyItemExcitationRuleId: number
  ruleStatus: number
  serviceItemOverlayRuleList: ServiceItemOverlayRuleList[]
}
interface ServiceItemOverlayRuleList {
  commissionType: 11 | 12 | 21 | 22
  commissionValue: number
  comnanyItemExcitationRuleId: number
  endTime: number
  overlayRuleSpliceName: string
  ruleStatus: number
  serviceItemRelateType: number
  serviceAreaRelateType: 10 | 11
  empRelateType: 10 | 11
  orderLabelRelateType: 10 | 11
  overlayRuleAreaSpliceName: string
  overlayRuleEmpSpliceName: string
  overlayRuleOrderLabelSpliceName: string
  startTime: number
  checked?: boolean
}
// 设置的激励服务项目列表
export const SetList = (params: ISetList & Page) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/set-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 查看激励服务项目结果统计
export const CountList = (params: { companyId: number }) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/count-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 更新记录
export const QueryHistoryOperlog = (params: {
  comnanyItemExcitationRuleId: number
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/query-history-operLog.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 未设置服务项目
export const UnusedList = (
  params: {
    cityId: number | undefined
    companyId: number | undefined
  } & Page
) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/unused-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
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

// 物料号物料名称下拉选
export const MaterialList = (params: { cityId: number; companyId: number }) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/material-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 物料列表
export const CanusedlList = (params: any) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/canused-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 公司服务区域列表
export const ServiceItemAreaList = (params: {
  companyId: number | null | undefined
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/area-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 公司服务站和人员列表
export const ServiceItemStationEmpList = (params: {
  companyId: number | null | undefined
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/station-emp-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 指定激励服务项目列表
export const SetBaseServiceitemList = (params: {
  companyId: number | null | undefined
}) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/set-base-serviceitem-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务项目激励规则记录列表
export const ServiceItemOperateRecord = (
  params: {
    cityId?: number
    companyId?: number
    serviceItemId?: number
    startTime: number
    endTime: number
  } & Page
) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/item-operate-record-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

export interface CopyRuleToCompanyParams {
  comnanyItemExcitationRuleId: number
  copyToCompanyId: number
  copyToCityId: number
}
// 服务激励规则复制发布至其他公司
export const CopyRuleToCompany = (params: CopyRuleToCompanyParams) => {
  return Fetch(
    `/hradmin/excitation/company-service-item-rule/copy-rule-to-company.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}
