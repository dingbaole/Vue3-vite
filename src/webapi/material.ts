import Fetch from './fetch'
import type { OperServiceItemDetailInputs } from './serviceItem'
export interface Page {
  pageSize: number
  currentPage: number
}
export interface OperMaterialDetailInputList {
  materialId: number
  materialNo: string
  materialName: string
  price: number
  ruleStatus: number
  commissionRuleName: string
  comnanyMaterialExcitationRuleId: number
}

export interface ISaveBaseRule {
  cityId: number
  companyId: number
  comnanyMaterialExcitationRuleId?: number
  ruleGroup?: number
  commissionType?: number
  commissionValue?: string
  ruleName: string
  operMaterialDetailInputList: OperMaterialDetailInputList[]
  serviceItemRelationInputList: OperServiceItemDetailInputs[]
}

export interface ISaveOverlayRule {
  cityId?: number
  companyId?: number
  comnanyMaterialExcitationRuleId?: number
  ruleGroup?: number
  commissionType?: number
  commissionValue?: string
  ruleName?: string
  empRelateType?: 10 | 11
  empRelateList?: OperMaterialDetailInputList[]
  materialRelateType?: 10 | 11
  operMaterialDetailInputList?: OperMaterialDetailInputList[]
  serviceAreaRelateType?: 10 | 11
  serviceAreaRelateList?: OperMaterialDetailInputList[]
  orderLabelRelateType?: 10 | 11
  addMaterialOrderLabelInputList?: Array<{
    orderLabelId: string
    orderLabelName: string
  }>
  startDateTime: any
  endDateTime: any
  startTime?: number
  endTime?: number
}

export interface EmpRelateList {
  empId: number
  empName: string
  stationName: string
}

export interface ServiceAreaRelateList {
  serviceAreaId: number
  areaName: string
}

// 初始化页面数据（激励类型、状态接口）
export const LoadPageInitRuleService = () => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/load-page-init-data.action`,
    {
      method: 'POST',
      body: null
    }
  )
}

// 物料配件激励规则列表
export const RuleList = (
  params: {
    cityId: number
    companyId: number
    commissionType?: number
    ruleStatus?: number
  } & Page
) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/base-rule-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 验证公司下是否存在基础规则
export const CheckBaseRule = (params: {
  companyId: number
  commissionType?: number
  commissionValue?: number
  comnanyMaterialExcitationRuleId?: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/check-base-rule.action`,
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

// 物料号物料名称下拉选(物料激励规则记录用)
// export const RecordMaterialList = (params: {
//   cityId: number
//   companyId: number
// }) => {
//   return Fetch(`/hradmin/excitation/company-material-rule/record-material-list.action`, {
//     method: 'POST',
//     body: JSON.stringify(params)
//   });
// };
export const RecordMaterialList = (params: {
  limit: number
  offset: number
  materialNo?: number
  materialName?: string
}) => {
  return Fetch(`/opmaterial/materialInventoryManage/list `, {
    method: 'POST',
    body: getFormData(params),
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbnZDb2RlIjoidGVzdDEiLCJzeXN0ZW1Db2RlIjoiZDJjU3RvcmUiLCJpcCI6IjEyNy4wLjAuMSIsInJvbGVOYW1lIjoiIiwiZW1wbG95ZWVJZCI6IjJjODA4MDgxNWNkM2E3NGEwMTVjZDNhZTg2ODUwMDAxIiwidmFsdWVfYWRkZWRfc2VydmljZXMiOiJ7fSIsImV4cCI6NDc2MzQxNDU3NCwiRW1wbG95ZWVOYW1lIjoic3lzdGVtIiwidXNlcklkIjoiMDAwMDAwIiwicGxhdGZvcm0iOiJQTEFURk9STSIsInJlYWxFbXBsb3llZU5hbWUiOiJzeXN0ZW0ifQ'
    }
  })
}
// 物料列表
export const CanusedlList = (
  params: {
    cityId: number
    companyId: number
    materialId: number
  } & Page
) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/canused-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 指定激励物料配件列表
export const SetBaseMaterialList = (
  params: {
    cityId: number
    companyId: number
    materialId: number
  } & Page
) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/set-base-material-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 物料公司服务区域列表
export const MaterialAreaList = (params: { companyId?: number }) => {
  return Fetch(`/hradmin/excitation/company-material-rule/area-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 物料公司服务站和人员列表
export const MaterialStationEmpList = (params: { companyId?: number }) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/station-emp-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 新建保存物料配件激励规则
export const AddSaveBaseRule = (params: ISaveBaseRule) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/add-material-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 物料配件激励叠加规则订单标签
export const MaterialGetOrderLabel = (params: { orderLabelCode: string }) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/get-order-label.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 编辑保存物料配件激励规则
export const EditSaveBaseRule = (params: ISaveBaseRule) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/edit-material-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 物料配件激励规则详情
export const QueryBaseRule = (params: {
  comnanyMaterialExcitationRuleId: number
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/query-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 新建保存物料配件激励叠加规则
export const AddSaveOverlayRule = (params: ISaveOverlayRule) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/add-overlay-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 编辑保存物料配件激励叠加规则
export const EditSaveOverlayRule = (params: ISaveOverlayRule) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/edit-overlay-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 物料配件激励叠加规则详情
export const QueryOverlayRule = (params: {
  comnanyMaterialExcitationRuleId: number
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/query-overlay-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 移除已存在或失效的物料
export const RemoveMaterialRule = (
  params: Array<{
    comnanyMaterialExcitationRuleId: number
    materialId: number
    materialNo: string
    companyId: number
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/remove-material-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 开启激励基础规则
export const OpenBaseRule = (params: {
  comnanyMaterialExcitationRuleId: number
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/open-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 关闭激励基础规则
export const CloseBaseRule = (
  params: Array<{
    comnanyMaterialExcitationRuleId: number
    commissionType: number
    commissionValue: number
    companyId: number
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/close-base-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 物料配件关闭规则
export const CloseServiceItemRule = (
  params: Array<{
    comnanyMaterialExcitationRuleId: number
    companyId: number
    materialId: number
    materialNo: string
    materialName: string
    price: number
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/close-material-rule.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

export interface ISetList {
  cityId: number
  companyId: number
  commissionType: number
  materialId: number
}

export interface MaterialTable {
  companyId: number
  materialId: number
  materialNo: string
  materialName: string
  price: number
  materialStatus: number
  commissionType: 11 | 12 | 21 | 22
  commissionValue: number
  comnanyMaterialExcitationRuleId: number
  ruleStatus: number
  materialOverlayRuleList: any[]
}
// 设置的激励物料配件列表
export const SetList = (params: ISetList & Page) => {
  return Fetch(`/hradmin/excitation/company-material-rule/set-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 设置的激励物料配件列表
export const CountList = (params: { companyId: number }) => {
  return Fetch(`/hradmin/excitation/company-material-rule/count-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 更新记录
export const QueryHistoryOperlog = (params: {
  comnanyMaterialExcitationRuleId: number
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/query-history-operLog.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 未设置物料配件
export const UnusedList = (
  params: {
    cityId: number
    companyId: number
  } & Page
) => {
  return Fetch(`/hradmin/excitation/company-material-rule/unused-list.action`, {
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

// 物料配件激励规则记录列表
export const MaterialOperateRecord = (
  params: {
    cityId?: number
    companyId?: number
    materialId?: number
    startTime: number
    endTime: number
  } & Page
) => {
  return Fetch(
    `/hradmin/excitation/company-material-rule/material-operate-record-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

function getFormData(object: any) {
  if (!object) return null
  const formData = new FormData()
  Object.keys(object).forEach(key => {
    const value = object[key]
    if (Array.isArray(value)) {
      value.forEach((subValue, i) => formData.append(key + `[${i}]`, subValue))
    } else {
      formData.append(key, object[key])
    }
  })
  return formData
}
