export interface OrderLabel {
  orderLabelName: string
  orderLabelId: string
  orderLabelCode: string
  orderLabelType: number
}

export type Mode = 'serviceItem' | 'material' | 'goods' | 'goodsRerun'
