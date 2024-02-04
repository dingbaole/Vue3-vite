/**
 * @description 激励配置组
 */
export enum RuleGroup {
  basic = 11, // 基础规则
  overlay = 21 // 叠加规则
}

/**
 * @description 激励生效状态
 */
export enum RuleStatus {
  INVALID = 14, // 已失效
  PENDING = 15, // 待生效
  EFFECTIVE = 19 // 生效中
}

/**
 * @description 激励规则类型
 */
export enum RuleCommissionType {
  INVALID = 11, // 已失效
  PENDING = 12, // 待生效
  EFFECTIVE = 21, // 生效中
  EFFECTIVEs = 22 // 生效中
}

/**
 * @description 规则试算重跑状态
 */
export enum RerunStatus {
  CREATE = 11, // 新建
  CONFIRM = 12, // 确认订单范围
  CALCULAING = 13, // 试算中
  FAIL = 14, // 试算失败
  SUCCESS = 16, // 试算成功
  SYNCING = 17, // 数据同步中
  COMPLETE = 19 // 完成
}

/**
 * @description 拉取状态
 */
export enum FetchDraftStatus {
  EMPTY = 11, // 未拉取过草稿数据
  FETCHED = 10, // 已拉取过草稿数据
}

/**
 * @description 阶梯类型
 * N-10:非阶梯激励, Y-11:自定义价格阶梯
 */
export enum LadderType {
  Y = 11,
  N = 10
}