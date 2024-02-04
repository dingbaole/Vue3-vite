import { reactive, type Ref } from 'vue'
import { QueryEmployeeList } from '@/webapi/statistics'
import { getEmpList } from '@/webapi/common'
import { GetOrderLabel, type LabelList } from '@/webapi/other'
export const useRemoteSearchPromoter = () => {
  const selectRemote = reactive({
    loading: false,
    options: []
  }) as {
    loading: boolean
    options: Array<{
      promoterId: number
      mobileNo: string
      empNo: string
      promoterName: string
    }>
  }
  const remoteMethod = (val: string) => {
    if (val) {
      const isPhoneNo = !isNaN(Number(val))
      const params: {
        empNo?: string
        promoterName?: string
      } = {
        // serviceCompanyId: companyId.value
      }
      if (isPhoneNo) {
        params['empNo'] = val
      } else {
        params['promoterName'] = val
      }
      selectRemote.loading = true
      getEmpList({ ...params }).then(res => {
        selectRemote.loading = false
        if (res.code === 200) {
          selectRemote.options = res.data ?? []
        }
      })
    } else {
      selectRemote.options = []
    }
  }

  return {
    selectRemote,
    remoteMethod
  }
}
export const useRemoteSearchEmp = () => {
  const selectRemote = reactive({
    loading: false,
    options: []
  })
  const remoteMethod = (val: string) => {
    if (val) {
      const isPhoneNo = !isNaN(Number(val))
      const params: {
        empName?: string
        mobileNo?: string
        serviceCompanyId?: number
      } = {
        // serviceCompanyId: companyId.value
      }
      if (isPhoneNo) {
        params['mobileNo'] = val
      } else {
        params['empName'] = val
      }
      selectRemote.loading = true
      QueryEmployeeList({ ...params }).then(res => {
        selectRemote.loading = false
        if (res.code === 1) {
          selectRemote.options = res?.data ? res.data : []
        }
      })
    } else {
      selectRemote.options = []
    }
  }

  return {
    selectRemote,
    remoteMethod
  }
}

export const useRemoteSearchOrderLabel = (orderLabelId: Ref<number>) => {
  const selectRemote = reactive<{
    loading: boolean
    options: LabelList[]
    msg: string
  }>({
    loading: false,
    options: [],
    msg: ''
  })
  const remoteMethod = (orderLabelCode: string) => {
    if (orderLabelCode) {
      selectRemote.loading = true
      GetOrderLabel({
        orderLabelCode
      }).then(res => {
        selectRemote.loading = false
        if (res.code === 200) {
          selectRemote.options = res.data
          if (selectRemote.options.length === 0) {
            selectRemote.msg = '标签不存在，请重新输入'
          } else {
            selectRemote.msg = ''
          }
        } else {
          selectRemote.msg = res.msg
        }
      })
    } else {
      selectRemote.options = []
      selectRemote.msg = ''
    }
  }

  return {
    selectRemote,
    remoteMethod
  }
}
