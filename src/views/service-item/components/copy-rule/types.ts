import type { CopyRuleToCompanyParams } from '@/webapi/serviceItem'
export interface Tree {
  parentId?: number
  id: number
  label: string
  isLeaf: boolean
  disabled: boolean
  children?: Tree[]
}

export interface CompanyItem {
  companyId: number
  companyName: string
  companyCodeNo: string
  cityId?: number
}

export enum Status {
  loading = 'loading',
  success = 'success',
  fail = 'fail'
}

export interface CopyBaseRuleItemOutputs {
  configResultCode: 200 | 500
  failReason?: string
  bigClassName: string
  serviceClassName: string
  deviceName: string
  serviceItemName: string
  serviceFee: number
  updateBeforeRule: string
  copyAfterRule: string
  calcGroupId: 10 | 11
}

interface FetchElementResult {
  successNumber: number
  failNumber: number
  copyBaseRuleItemOutputs: Array<CopyBaseRuleItemOutputs>
}

export interface FetchElement {
  key: number | string
  fetchContent: {
    comnanyItemExcitationRuleId: number
    cityId: number
    companyId: number
    companyName: string
    companyCode: string
  }
  fetchHandler: (params: CopyRuleToCompanyParams) => Promise<any>
  status: Status
  successResult?: FetchElementResult
  failResult?: string
}
