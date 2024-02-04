import Fetch from './fetch'

// 公司查员工
export const queryEmpList = (params: any) => {
  return Fetch(`/hradmin/excitation/emp-account-item/query-emp-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 分销员人员信息
export const getEmpList = (params: any) => {
  return Fetch(`/hradmin/common/promoter-list.action `, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 结余管理表格
export const selectListEmpAccountList = (params: any) => {
  return Fetch(`/hradmin/excitation/emp-account-item/emp-account-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 激励结余明细-月度结余
export const selectListEmpMonthList = (params: any) => {
  return Fetch(`/hradmin/excitation/emp-account-item/emp-month-list.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 激励结余明细-结余明细
export const selectListEmpMonthDetailList = (params: any) => {
  return Fetch(
    `/hradmin/excitation/emp-account-item/emp-month-detail-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 激励结余明细-异步导出
export const asynExport = (params: any) => {
    return Fetch(
        `/hradmin/excitation/emp-excitation/asyn-export.action`,
        {
            method: 'POST',
            body: JSON.stringify(params)
        }
    )
}

// 查看员工激励-左侧侧表格
export const selectListEmpMonthExStList = (params: any) => {
  return Fetch(
    `/hradmin/excitation/emp-excitation/emp-month-exst-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 查看员工激励-左侧表格下方数据
export const empAccountCompanyAmount = (params: any) => {
  return Fetch(
    `/hradmin/excitation/emp-excitation/emp-account-company-amount.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 查看员工激励-右侧表格
export const selectListEmpMonthExStDetailList = (params: any) => {
  return Fetch(
    `/hradmin/excitation/emp-excitation/emp-month-exst-detail-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 查看员工激励-右侧表格下方数据
export const selectListEmpMonthExStDetailAmount = (params: any) => {
  return Fetch(
    `/hradmin/excitation/emp-excitation/emp-month-exst-detail-amount.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 公司核对-公司级审核角色权限校验
export const checkRoleVerification = (params: any) => {
  return Fetch(
    `/hradmin/excitation/company-check/check-role-verification.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 核算核查列表页初始化数据
export const initData = () => {
  return Fetch(
    `/hradmin/excitation/company-month-statement-excitation-check/load-page-init-data.action`,
    {
      method: 'POST'
    }
  )
}

// 激励核算核查表格数据
export const getTableList = (params: any) => {
  return Fetch(
    `/hradmin/excitation/company-month-statement-excitation-check/list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 激励核算核对-确认核对结束
export const checkEnd = (params: any) => {
  return Fetch(
    `/hradmin/excitation/company-month-statement-excitation-check/update-check-completed.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 激励核算核对-确认审批结束
export const approvalEnd = (params: any) => {
  return Fetch(
    `/hradmin/excitation/company-month-statement-excitation-check/update-approval-completed.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 核算初始化信息
export const accountingInitData = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/load-page-init-data.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 核算分页列表
export const calculatList = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/calculate-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务站核算确认核算
export const confirmCalculate = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/confirm-calculate.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务站核算激励调整
export const updateAdjust = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/update-adjust.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务站核算激励作废
export const updateCancel = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/update-cancel.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务站核算重新核算
export const updateRecalculate = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/update-recalculate.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务站核算异步导出
export const updateExport = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/asyn-export.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务站核算导入激励自动核算
export const importCalculate = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/import-calculate`,
    {
      method: 'POST',
      body: getFormData(params),
      headers: {}
    }
  )
}

// 服务站核算下载导入模板
export const downloadTpl = (params: any) => {
  return Fetch(`/hradmin/excitation/service-station-calculate/downloadTpl`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 服务站核算导入
export const accountingImport = (params: any) => {
  return Fetch(`/hradmin/excitation/service-station-calculate/import`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 服务站核算激励变动记录
export const changeRecordList = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/change-record-list.action`,
    {
      method: 'POST',
      body: JSON.stringify(params)
    }
  )
}

// 服务站核算激励问题记录
export const problemRecordList = (params: any) => {
  return Fetch(
    `/hradmin/excitation/service-station-calculate/problem-record-list.action`,
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
