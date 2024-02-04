/**
 * @description ladderType 10:非阶梯激励, 11:自定义价格阶梯
 * @description ladderStatus 14:禁用, 19:启用
 * @description marketOrderChannelId 10:其他, 11:自然订单, 12:现场下单, 13:线上分销
 */
export interface CONST {
  ladderType: 10 | 11
  ladderStatus: 14 | 19
  marketOrderChannelId: 10 | 11 | 12 | 13
}

/**
 * @description N-10:非阶梯激励, Y-11:自定义价格阶梯
 */
export enum LadderType {
  Y = 11,
  N = 10
}
