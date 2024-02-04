import Fetch from './fetch'
export const GetCityList = () => {
  return Fetch(`/aoss/commonCtl/get-authed-city-list.action`, {
    method: 'POST',
    body: null
  })
}
// 分销员人员信息
export const getEmpList = (params: any) => {
  return Fetch(`/hradmin/common/promoter-list.action `, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}
export const GetCompanyList = (params?: { cityId: number }) => {
  return Fetch<
    Array<{
      cityId: number
      companyCodeNo: string
      companyId: number
      companyName: string
    }>
  >(`/aoss/commonCtl/get-authed-company-list.action`, {
    method: 'POST',
    body: getFormData({ ...params, companyType: 0 }),
    headers: {}
  })
}

export const GetInventoryCompanyList = (params?: { cityId: number }) => {
  return Fetch(`/opmaterial/commonCtl/getCompaniesByCityIdOnSelectFilterNewModel`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

export interface Station {
  stationId: number
  stationName: string
}
export const GetStationList = (params?: { cityId?: number; companyId?: number }) => {
  return Fetch<Station[]>(`/aoss/commonCtl/get-authed-station-list.action`, {
    method: 'POST',
    body: getFormData({ ...params }),
    headers: {}
  })
}

// 店铺list
export const MarketShopList = (params: { cityId: number | null | undefined; companyId: number | null | undefined }) => {
  return Fetch<
    Array<{
      cityId: number
      companyCodeNo: string
      companyId: number
      delFlag: number
      marketShopId: number
      screateTime: number
      shopName: string
      shopStatus: number
      supdateTime: number
      thirdShopId: number
      thirdShopNo: string
    }>
  >(`/hradmin/common/market-shop-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 商品名称下拉选
export const MarketGoodsList = (params: { marketShopId: number | null | undefined; materialNo?: string }) => {
  return Fetch(`/hradmin/common/market-goods-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 获取账期select
export const GetStatementList = (params: { companyId: number }) => {
  return Fetch<
    Array<{
      companyId?: number
      startTime?: number
      endTime?: number
      companyExcitationStatementId: number
      statementMonthName: string
    }>
  >(`/hradmin/common/get-statement-date-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

export const getMenuCodeMap = () => {
  return Fetch(`/base/common/get-menu-code-data.action`, {
    method: 'POST',
    body: null
  })
}
export const getMenuCodeMap2 = () => {
  return Fetch(`/statisticsadmin/common/getMenuCodeMap`)
}

// export const getMenuCodeMap = () => {
//   return Fetch(`/hradmin/common/get-menu-code-map.action`, {
//     method: 'POST',
//     body: null
//   })
// }

// export const getMenuCodeMapNew = () => {
//   return Fetch(`/aoss/commonCtl/getMenuCodeMap`, {
//     method: 'POST',
//     body: null
//   })
// }

// 查询公司服务大类列表
export const GetCompanyBigClassList = (params: { companyId: number | null | undefined }) => {
  return Fetch(`/aoss/commonCtl/get-company-big-class-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 查询平台服务大类列表
export const GetPlatformBigClassList = (params?: {}) => {
  return Fetch(`/aoss/commonCtl/get-platform-big-class-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 查询公司设备列表
export const GetCompanyDeviceList = (params: { companyId: number | null | undefined; bigClassId: number }) => {
  return Fetch(`/aoss/commonCtl/get-company-device-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 查询平台设备列表
export const GetPlatformDeviceList = (params: { bigClassId: number }) => {
  return Fetch(`/aoss/commonCtl/get-platform-device-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 查询公司服务品类列表
export const GetCompanyServiceClassList = (params: { companyId: number | null | undefined; deviceId: number }) => {
  return Fetch(`/aoss/commonCtl/get-company-service-class-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 查询平台服务品类列表
export const GetPlatformServiceClassList = (params: { deviceId: number }) => {
  return Fetch(`/aoss/commonCtl/get-platform-service-class-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 查询公司服务项目列表
export const GetCompanyServiceItemList = (params: { companyId: number | null | undefined; serviceClassId: number }) => {
  return Fetch(`/aoss/commonCtl/get-company-service-item-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 查询数据版本
export const GetdataVersionList = () => {
  return Fetch(`/aoss/service/item/query-data-version.action`, {
    method: 'POST',
    headers: {}
  })
}
// 项目改价列表
export const GetprojectSeverList = (params: any) => {
  return Fetch(`/aoss/service/item/query-table-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务项目改价 批量设置
export const projectPriceBatch = (params: any) => {
  return Fetch(`/aoss/service/item/batch-setting.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}
// 服务项目改价 启用禁用
export const enableDisable = (params: any) => {
  return Fetch(`/aoss/service/item/enable-disable.action`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}
// 服务项目改价 改价设置
export const priceChangeSetting = (params: any) => {
  return Fetch(`/aoss/service/item/change-price.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务项目改价 获取日志
export const getChangeLog = (params: any) => {
  return Fetch(`/aoss/service/item/price-change-log.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务项目改价 导出
export const setExport = (params: any) => {
  return Fetch(`/aoss/service/item/export.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务项目改价 查询单条数据 回显使用
export const getPriceItem = (params: any) => {
  return Fetch(`/aoss/service/item/find-price-change-echo.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 燃控物料改价列表 (燃/非燃)
export const getQueryTableList = (params: any) => {
  return Fetch(`/aoss/service/material/queryTableList.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务物料维保列表 (燃/非燃)
export const getMaintenanceList = (params: any) => {
  return Fetch(`/aoss/service/materialInsurance/queryTableList.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 查询已授权城市列表（燃/非燃）
export const getAuthedCityList = (params: any) => {
  return Fetch(`/aoss/service/material/get-authed-city-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 查询已授权公司列表（燃/非燃）
export const getAuthedCompanyList = (params: any) => {
  return Fetch(`/aoss/service/material/get-authed-company-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 查询改价日志（燃/非燃）
export const getPriceChangeLog = (params: any) => {
  return Fetch(`/aoss/service/material/price-change-log.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务物料维保日志查询（燃和非燃）
export const getMainChangeLog = (params: any) => {
  return Fetch(`/aoss/service/materialInsurance/price-change-log.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 启用禁用（燃/非燃）
export const materialEnableDisable = (params: any) => {
  return Fetch(`/aoss/service/material/enable-disable.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务物料维保启用禁用（燃/非燃）
export const InsurancematerialEnableDisable = (params: any) => {
  return Fetch(`	/aoss/service/materialInsurance/enable-disable.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务物料批量改价（燃/非燃）
export const batchSetting = (params: any) => {
  return Fetch(`/aoss/service/material/batch-setting.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务物料维保设置（燃/非燃）
export const MainbatchSetting = (params: any) => {
  return Fetch(`/aoss/service/materialInsurance/batch-setting.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务物料改价 查询单条数据 回显使用 （燃/非燃）
export const getMaterialItem = (params: any) => {
  return Fetch(`/aoss/service/material/settingQuery.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务物料改价 设置 （燃/非燃）
export const materialChangeSetting = (params: any) => {
  return Fetch(`/aoss/service/material/setting.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 服务物料导出（燃/非燃）
export const materialExport = (params: any) => {
  return Fetch(`/aoss/service/material/export.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}
// 燃控物料维保导出（燃/非燃）
export const MainExport = (params: any) => {
  return Fetch(`/aoss/service/materialInsurance/export.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 查询平台服务项目列表
export const GetPlatformServiceItemList = (params: { serviceClassId: number }) => {
  return Fetch(`/aoss/commonCtl/get-platform-service-item-list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 初始化页面数据（激励类型、状态接口）
export const LoadPageInitRuleService = () => {
  return Fetch(`/hradmin/excitation/company-service-item-rule/load-page-init-data.action`, {
    method: 'POST',
    body: null
  })
}

// 公司管理-初始化
export const CompanyConfigPageInit = () => {
  return Fetch(`/hradmin/company-config/load-page-init-data.action`, {
    method: 'POST',
    body: getFormData(null),
    headers: {}
  })
}

export interface Page {
  ecejPageSize: number
  ecejCurrentPage: number
}
// 公司管理-列表
export const CompanyConfigList = (
  params: {
    cityId?: number
    companyId?: number
    empExcitationVersion?: number
  } & Page
) => {
  return Fetch(`/hradmin/company-config/list.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

// 公司管理-更新员工激励标识
export const UpdateEmpVersion = (params: { companyId: number; cityId: number; empExcitationVersion: number }) => {
  return Fetch(`/hradmin/company-config/update-emp-excitation-version.action`, {
    method: 'POST',
    body: getFormData(params),
    headers: {}
  })
}

function getFormData(object: any) {
  if (!object) return null
  const formData = new FormData()
  Object.keys(object).forEach(key => {
    const value = object[key]
    if (Array.isArray(value)) {
      value.forEach((subValue, i) => formData.append(key + `[${i}]`, subValue))
    } else {
      if (value !== undefined) {
        formData.append(key, object[key])
      }
    }
  })
  return formData
}
