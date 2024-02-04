import { defineStore } from 'pinia'
import {
  GetCityList,
  GetCompanyList,
  LoadPageInitRuleService
} from '@/webapi/common'
import {
  LoadPageInitRuleService as LoadPageInitRuleServiceGoods,
  LoadPageInitRuleGoodsStatistics
} from '@/webapi/goods'
import { LoadPageInitRuleGoodsInstall } from '@/webapi/goods-install'
import type { MarketOrderChannel } from '@/types/goods'
interface CityItem {
  cityId: number
  cityName: string
}
export interface CompanyItem {
  companyId: number
  companyCodeNo: string
  companyName: string
  cityId?: number
}
interface ExcitationTypeItem {
  commissionName: string
  commissionType: number
}
interface ExcitationStatusItem {
  statusName: string
  statusId: number
}
interface PromoterType {
  name: string
  id: string
}
export const useCommon = defineStore('common', {
  state: (): {
    cityList: CityItem[]
    allCompanyList: CompanyItem[]
    companyList: CompanyItem[]
    excitationTypeList: ExcitationTypeItem[]
    excitationTypeOverlayList: ExcitationTypeItem[]
    excitationStatusList: ExcitationStatusItem[]
    marketOrderChannels: MarketOrderChannel[]
    promoterTypeList: PromoterType[]
  } => ({
    cityList: [],
    allCompanyList: [],
    companyList: [],
    excitationTypeList: [],
    excitationTypeOverlayList: [],
    excitationStatusList: [],
    marketOrderChannels: [],
    promoterTypeList: []
  }),
  actions: {
    async init() {
      LoadPageInitRuleService().then(res => {
        if (res.code === 200) {
          this.excitationTypeList = res.data.excitationTypeList
          this.excitationTypeOverlayList = res.data.excitationTypeOverlayList
          this.excitationStatusList = res.data.excitationStatusList
        }
      })
      await this.getCityList()
      this.getAllCompanyList()
    },
    initGoodsRule () {
      LoadPageInitRuleService().then(res => {
        if (res.code === 200) {
          this.excitationTypeList = res.data.excitationTypeList
          this.excitationTypeOverlayList = res.data.excitationTypeOverlayList
        }
      })
      LoadPageInitRuleServiceGoods().then(res => {
        if (res.code === 200) {
          this.cityList = res.data.cityList
          this.marketOrderChannels = res.data.marketOrderChannels
          this.excitationStatusList = res.data.excitationStatusList
        }
      })
    },
    initGoodsInstallRule() {
      LoadPageInitRuleGoodsInstall().then(res => {
        if (res.code === 200) {
          this.cityList = res.data.cityList
          this.marketOrderChannels = res.data.marketOrderChannels
          this.excitationStatusList = res.data.excitationStatusList
          this.excitationTypeList = res.data.excitationTypeList
        }
      })
    },
    initGoodsRuleStatistics () {
      LoadPageInitRuleGoodsStatistics().then(res => {
        if (res.code === 200) {
          this.cityList = res.data.cityList
          this.promoterTypeList = res.data.excitationPlatformList
        }
      })
    },
    getCommissionTypeLabel(
      commissionType: ExcitationTypeItem['commissionType']
    ) {
      const result = [
        ...this.excitationTypeList,
        ...this.excitationTypeOverlayList
      ].filter(item => item.commissionType === commissionType)
      if (result?.length > 0) {
        return result[0]['commissionName']
      }
      return '--'
    },
    async getCityList() {
      const res = await GetCityList()
      if (res.code === 200) {
        this.cityList = res.data
      }
    },
    getAllCompanyList() {
      GetCompanyList().then(res => {
        if (res.code === 200) {
          this.allCompanyList = res.data
        }
      })
    },
    getCompanyList(cityId: number) {
      GetCompanyList({
        cityId
      }).then(res => {
        if (res.code === 200) {
          this.companyList = res.data
        }
      })
    }
  }
})
