import type { CONST } from '@/global'

export interface MarketOrderChannel {
  marketOrderChannelId: CONST['marketOrderChannelId']
  marketOrderChannelName: string
  display: boolean
  remark: string
}
