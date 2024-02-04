import { ref } from 'vue'
import { CopyRuleToCompany } from '@/webapi/serviceItem'
import type { FetchElement, Tree } from './types'
import { Status } from './types'

export const useCopyCompany = () => {
  const fetchElement = ref<FetchElement[]>([])
  const progress = ref(0)
  let count = 0
  function progressHandle() {
    count++
    if (fetchElement.value.length !== 0) {
      progress.value = Number(
        ((count / fetchElement.value.length) * 100).toFixed(2)
      )
    } else {
      progress.value = 0
    }
  }
  const reset = () => {
    progress.value = 0
    count = 0
    fetchElement.value = []
  }
  const init = (TreeNode: Tree[], comnanyItemExcitationRuleId: number) => {
    reset()
    for (const node of TreeNode) {
      const element = {
        key: node.id,
        fetchContent: {
          comnanyItemExcitationRuleId,
          cityId: node.parentId,
          companyId: node.id,
          companyName: node.label,
          companyCode: node.label
        },
        fetchHandler: CopyRuleToCompany,
        status: Status.loading
      }
      fetchElement.value.push(element)
    }
    count = 0
    for (const v of fetchElement.value) {
      const { fetchContent, fetchHandler } = v
      const {
        comnanyItemExcitationRuleId,
        cityId: copyToCityId,
        companyId: copyToCompanyId
      } = fetchContent
      fetchHandler({
        comnanyItemExcitationRuleId,
        copyToCityId,
        copyToCompanyId
      })
        .then(res => {
          if (res.code === 200) {
            v['status'] = Status.success
            v['successResult'] = res.data
          } else {
            v['status'] = Status.fail
            v['failResult'] = res.message
          }
          progressHandle()
        })
        .catch(err => {
          v['status'] = Status.fail
          v['failResult'] = err
          progressHandle()
        })
    }
  }
  return {
    init,
    reset,
    progress,
    fetchElement
  }
}
