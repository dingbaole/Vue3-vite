import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { Tree, CompanyItem } from './types'
const { cityList, allCompanyList } = storeToRefs(useCommon())

function genCityMap(allCompanyList: CompanyItem[], currentCompanyId: number) {
  const cityMap: {
    [key: number]: Tree[]
  } = {}
  for (const item of allCompanyList) {
    const newItem = {
      parentId: item.cityId,
      id: item.companyId,
      label: `${item.companyName}（公司代码: ${item.companyCodeNo}）`,
      isLeaf: true,
      disabled: item.companyId === currentCompanyId ? true : false
    }
    if (!cityMap[item.cityId]) {
      cityMap[item.cityId] = [newItem]
    } else {
      cityMap[item.cityId].push(newItem)
    }
  }
  return cityMap
}

export const useCityWithCompany = (
  currentCityId: number,
  currentCompanyId: number
) => {
  const defaultCheckedKeys = currentCityId
  const cityWithCompanyTree = ref<Tree[]>([])
  const cityMap = genCityMap(allCompanyList.value, currentCompanyId)
  cityWithCompanyTree.value = cityList.value
    .map(({ cityId: id, cityName: label }) => {
      return {
        id,
        label,
        isLeaf: false,
        disabled: false,
        children: cityMap[id]
      }
    })
    .filter(item => item.children?.length > 0)

  // 获取当前城市索引进行排序
  const currentCityIndex = cityWithCompanyTree.value.findIndex(
    item => item.id === currentCityId
  )
  const current = cityWithCompanyTree.value.splice(currentCityIndex, 1)
  cityWithCompanyTree.value.unshift(...current)

  // 禁用其他节点
  const disabledNode = (id: number) => {
    for (const v of cityWithCompanyTree.value) {
      if (v.id !== id) {
        v['disabled'] = true
        for (const j of v['children']) {
          j['disabled'] = true
        }
      }
    }
  }
  const abledNode = () => {
    for (const v of cityWithCompanyTree.value) {
      v['disabled'] = false
      for (const j of v['children']) {
        if (j.id === currentCompanyId) {
          j['disabled'] = true
        } else {
          j['disabled'] = false
        }
      }
    }
  }
  return {
    defaultCheckedKeys: defaultCheckedKeys,
    cityWithCompanyTree,
    disabledNode,
    abledNode
  }
}
