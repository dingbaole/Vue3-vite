import {
  HouseHoldOrderCheckQueryData,
  HouseHoldOrderCheckGetPhotoData
} from '@/webapi/houseHoldOrder'
import type { OrderCheckData, PhotoMap } from '@/webapi/houseHoldOrder'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
function genImgSrc<T>(data?: T[]) {
  return data
    ? data.map(item => `${import.meta.env.ECEJ_IMG_SRC}${item}.jpg`)
    : []
}

export const useData = () => {
  const orderCheckData = reactive<OrderCheckData>({})
  const images = ref<PhotoMap>()
  const loading = ref(false)
  const error = ref(false)
  const init = async (workOrderNo: string) => {
    loading.value = true
    const res = await HouseHoldOrderCheckQueryData({ workOrderNo })
    loading.value = false
    if (res.code === 200) {
      error.value = false
      orderCheckData.orderInfoRespDTO = res.data.orderInfoRespDTO
      orderCheckData.orderBookInfoRespDTO = res.data.orderBookInfoRespDTO
      orderCheckData.orderHouseHoldInfoRespDTO =
        res.data.orderHouseHoldInfoRespDTO
      orderCheckData.orderHouseHoldImputaionInfoRespDTO =
        res.data.orderHouseHoldImputaionInfoRespDTO
      orderCheckData.orderHouseHoldInfoRespDTO.scenePanoramaImgList = genImgSrc(
        orderCheckData.orderHouseHoldInfoRespDTO.scenePanoramaImgList
      )
      orderCheckData.orderHouseHoldInfoRespDTO.sceneSituatioinImgList =
        genImgSrc(
          orderCheckData.orderHouseHoldInfoRespDTO.sceneSituatioinImgList
        )
      const { workOrderId, workOrderNo } = res.data.orderInfoRespDTO
      HouseHoldOrderCheckGetPhotoData({
        workOrderId,
        workOrderNo
      }).then(res => {
        if (res.code === 200) {
          images.value = res.data
        }
      })
    } else {
      error.value = true
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  }
  const orderInfoRespDTOKeyOfField = {
    workOrderNo: '订单编号',
    serviceClassName: '下单品类',
    orderSourceDesc: '订单来源',
    createTime: '创建时间',
    userName: '客户姓名',
    userMobile: '客户电话',
    addressDetail: '服务地址',
    userRemark: '用户备注',
    cityName: '城市',
    companyName: '公司',
    stationName: '服务站',
    createName: '创建人'
  }
  const orderBookInfoRespDTOKeyOfField = {
    bookTime: '预约时间',
    remindCount: '催单次数',
    reschedulingCount: '改约次数',
    empName: '派工师傅',
    empCompanyName: '员工归属公司',
    empStationName: '员工归属服务站'
  }
  return {
    init,
    orderCheckData,
    images,
    loading,
    error,
    orderInfoRespDTOKeyOfField,
    orderBookInfoRespDTOKeyOfField
  }
}
