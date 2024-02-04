// import { mapTwoLevelRouter } from '@/utils'
import { createRouter, createWebHistory } from 'vue-router'

const CompanyConfig = () => import('@/views/company-config/companyConfig.vue')
const GoodsInstallRule = () =>
  import('@/views/goods-install/goods-rule-list.vue')
const GoodsInstallList = () => import('@/views/goods-install/goods-list.vue')
const GoodsRule = () => import('@/views/goods/goods-rule-list.vue')
const GoodsRuleRecord = () => import('@/views/goods/goods-rule-record.vue')
const GoodsList = () => import('@/views/goods/goods-list.vue')
const GoodsOrderRelatedEmp = () =>
  import('@/views/statistics/goods-order-related-emp.vue')
const ServiceItemRuleRecord = () =>
  import('@/views/service-item/service-item-rule-record.vue')
const ServiceItemRule = () =>
  import('@/views/service-item/service-item-rule-list.vue')
const ServiceItemList = () =>
  import('@/views/service-item/service-item-list.vue')
const ServiceOrderRelatedEmp = () =>
  import('@/views/statistics/service-order-related-emp.vue')
const MaterialRuleRecord = () =>
  import('@/views/material/material-rule-record.vue')
const MaterialRule = () => import('@/views/material/material-rule-list.vue')
const MaterialList = () => import('@/views/material/material-list.vue')
const EvaluateRule = () =>
  import('@/views/evaluate-rule/evaluate-rule-list.vue')
const GoodsStatistics = () => import('@/views/statistics/goods-statistics.vue')
const GoodsInstallStatistics = () =>
  import('@/views/statistics/goods-install-statistics.vue')
const ServiceItemStatistics = () =>
  import('@/views/statistics/service-item-statistics.vue')
const MaterialStatistics = () =>
  import('@/views/statistics/material-statistics.vue')
const EvaluateStatistics = () =>
  import('@/views/statistics/evaluate-statistics.vue')
const RedressStatistics = () =>
  import('@/views/statistics/redress-statistics.vue')
const GoodsEmpRank = () => import('@/views/statistics/goods-emp-rank.vue')
const projectPriceChangeList = () =>
  import('@/views/material-management/projectPriceChangeList.vue')
const materialPriceChangeList = () =>
  import('@/views/material-management/materialPrice.vue')
const otherRule = () => import('@/views/other/other-rule-list.vue')
const orderStatistics = () => import('@/views/statistics/order-statistics.vue')
const materialMaintenance = () =>
  import('@/views/material-maintenance/materialPrice.vue')

const HouseHoldOrderCheck = () =>
  import('@/views/house-hold-order/house-hold-order-check.vue')

const AfterSalesOnsiteService = () =>
  import('@/views/after-sales-onsite-service/order-list.vue')

const InventoryList = () => import('@/views/inventory/inventory-list.vue')

const IncentiveSurplus = () => import('@/views/incentive-surplus/incentive-surplus.vue')
const IncentiveProofread = () =>
  import('@/views/incentive-proofread/incentive-proofread.vue')



export const constantRoutes = [
  {
    path: '/inventory-list',
    name: 'inventory-list',
    component: InventoryList,
    hidden: true,
    meta: {
      title: '库位变动记录'
    }
  },
  {
    path: '/after-sales-onsite-service-list',
    name: 'after-sales-onsite-service-list',
    component: AfterSalesOnsiteService,
    hidden: true,
    meta: {
      title: '上门售后单管理'
    }
  },
  {
    path: '/house-hold-order-check',
    name: 'house-hold-order-check',
    component: HouseHoldOrderCheck,
    hidden: true,
    meta: {
      title: '入户订单核查'
    }
  },
  {
    path: '/other-rule',
    name: 'other-rule',
    component: otherRule,
    hidden: true,
    meta: {
      title: '其他创值激励规则'
    }
  },
  {
    path: '/service-item-rule-record',
    name: 'service-item-rule-record',
    component: ServiceItemRuleRecord,
    hidden: true,
    meta: {
      title: '服务项目激励规则记录'
    }
  },
  {
    path: '/material-rule-record',
    name: 'material-rule-record',
    component: MaterialRuleRecord,
    hidden: true,
    meta: {
      title: '物料配件激励规则记录'
    }
  },
  {
    path: '/goods-rule-record',
    name: 'goods-rule-record',
    component: GoodsRuleRecord,
    hidden: true,
    meta: {
      title: '商品激励规则记录'
    }
  },
  {
    path: '/company-config',
    name: 'company-config',
    component: CompanyConfig,
    hidden: true,
    meta: {
      title: '创值激励模式开通'
    }
  },
  {
    path: '/goods-install-rule',
    name: 'goods-install-rule',
    component: GoodsInstallRule,
    hidden: true,
    meta: {
      title: '商品安装激励规则'
    }
  },
  {
    path: '/goods-install-list',
    name: 'goods-install-list',
    component: GoodsInstallList,
    hidden: true,
    meta: {
      title: '激励商品'
    }
  },
  {
    path: '/goods-rule',
    name: 'goods-rule',
    component: GoodsRule,
    hidden: true,
    meta: {
      title: '商品激励规则'
    }
  },
  {
    path: '/goods-list',
    name: 'goods-list',
    component: GoodsList,
    hidden: true,
    meta: {
      title: '激励商品'
    }
  },
  {
    path: '/goods-order-related-emp',
    name: 'goods-order-related-emp',
    component: GoodsOrderRelatedEmp,
    hidden: true,
    meta: {
      title: '商品订单关联其他人员信息管理'
    }
  },
  {
    path: '/service-order-related-emp',
    name: 'service-order-related-emp',
    component: ServiceOrderRelatedEmp,
    hidden: true,
    meta: {
      title: '服务订单关联其他人员信息管理'
    }
  },
  {
    path: '/service-item-rule',
    name: 'service-item-rule',
    component: ServiceItemRule,
    hidden: true,
    meta: {
      title: '服务项目激励规则'
    }
  },
  {
    path: '/service-item-list',
    name: 'service-item-list',
    component: ServiceItemList,
    hidden: true,
    meta: {
      title: '激励服务项目'
    }
  },
  {
    path: '/material-rule',
    name: 'material-rule',
    component: MaterialRule,
    hidden: true,
    meta: {
      title: '物料配件激励规则'
    }
  },
  {
    path: '/material-list',
    name: 'material-list',
    component: MaterialList,
    hidden: true,
    meta: {
      title: '激励物料配件'
    }
  },
  {
    path: '/evaluate-rule',
    name: 'evaluate-rule',
    component: EvaluateRule,
    hidden: true,
    meta: {
      title: '评价激励规则'
    }
  },
  {
    path: '/order-excitation-detail-statistics',
    name: 'order-statistics',
    component: orderStatistics,
    hidden: true,
    meta: {
      title: '商品销售统计'
    }
  },
  {
    path: '/goods-statistics',
    name: 'goods-statistics',
    component: GoodsStatistics,
    hidden: true,
    meta: {
      title: '商品销售统计'
    }
  },
  {
    path: '/goods-install-statistics',
    name: 'goods-install-statistics',
    component: GoodsInstallStatistics,
    hidden: true,
    meta: {
      title: '商品安装销售统计'
    }
  },
  {
    path: '/service-item-statistics',
    name: 'service-item-statistics',
    component: ServiceItemStatistics,
    hidden: true,
    meta: {
      title: '服务项目激励统计'
    }
  },
  {
    path: '/material-statistics',
    name: 'material-statistics',
    component: MaterialStatistics,
    hidden: true,
    meta: {
      title: '物料配件激励统计'
    }
  },
  {
    path: '/evaluate-statistics',
    name: 'evaluate-statistics',
    component: EvaluateStatistics,
    hidden: true,
    meta: {
      title: '评价激励统计'
    }
  },
  {
    path: '/incentiveProofread',
    name: 'incentiveProofread',
    component: IncentiveProofread,
    hidden: true,
    meta: {
      title: '激励核算核对列表'
    }
  },
  {
    path: '/incentive-surplus',
    name: 'incentive-surplus',
    component: IncentiveSurplus,
    hidden: true,
    meta: {
      title: '激励结余管理'
    }
  },
  {
    path: '/redress-statistics',
    name: 'redress-statistics',
    component: RedressStatistics,
    hidden: true,
    meta: {
      title: '人工调整创值激励'
    }
  },
  {
    path: '/goods-emp-rank',
    name: 'goods-emp-rank',
    component: GoodsEmpRank,
    hidden: true,
    meta: {
      title: '商品销售员工排名'
    }
  },
  {
    path: '/projectPriceChangeList',
    name: 'projectPriceChangeList',
    component: projectPriceChangeList,
    hidden: true,
    meta: {
      title: '项目改价管理'
    }
  },
  {
    path: '/materialPriceChangeList',
    name: 'materialPriceChangeList',
    component: materialPriceChangeList,
    hidden: true,
    meta: {
      title: '物料改价管理'
    }
  },
  {
    path: '/materialMaintenance',
    name: 'materialMaintenance',
    component: materialMaintenance,
    hidden: true,
    meta: {
      title: '服务物料维保管理'
    }
  }
]
const base =
  process.env.NODE_ENV === 'development' ? '' : import.meta.env.ECEJ_BASE
const router = createRouter({
  history: createWebHistory(base),
  routes: constantRoutes
})

export default router
