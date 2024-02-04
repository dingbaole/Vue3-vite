import Fetch from './fetch2'

/**
 * @description 	激励配置推荐公司列表
 * @returns
 */
export const ExcitationConfigRecommendCompanyList = (params = {}) => {
  return Fetch(
    `/hradmin/excitation/company-unconfig-material-item-rule/excitation-config-recommend-company-list.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

/**
 * @description 	激励配置推荐列表
 * @returns
 */
export const ExcitationConfigRecommendList = (params: {
  companyId: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-unconfig-material-item-rule/excitation-config-recommend-list.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

/**
 * @description 	一键配置相同激励
 * @returns
 */
export const OneClickConfigIdenticalExcitation = (
  params: Array<{
    similarMaterialId: number // 物料ID
    materialNo: string
    similarComnanyMaterialExcitationRuleId: number // 相似物料公司激励配置ID
    companyUnconfigExcitationMaterialItemId: number
  }>
) => {
  return Fetch(
    `/hradmin/excitation/company-unconfig-material-item-rule/one-click-config-identical-excitation.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

/**
 * @description 	手动配置其他物料列表
 * @returns
 */
export const ManualConfigOtherMaterialList = (params: {
  companyId: number
  materialName: string
}) => {
  return Fetch(
    `/hradmin/excitation/company-unconfig-material-item-rule/manual-config-other-material-list.action`,
    {
      body: JSON.stringify(params)
    }
  )
}

/**
 * @description 	手动配置
 * @returns
 */
export const ManualConfigOtherMaterial = (params: {
  materialId: number
  materialNo: string
  companyUnconfigExcitationMaterialItemId: number
  comnanyMaterialExcitationRuleId: number
  companyId: number
  ruleGroup: number
  commissionType: number
  commissionValue: number
}) => {
  return Fetch(
    `/hradmin/excitation/company-unconfig-material-item-rule/manual-config-other-material.action`,
    {
      body: JSON.stringify(params)
    }
  )
}
