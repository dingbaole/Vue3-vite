import dayjs from 'dayjs'
type DateWeek = {
  date: string
  week: string
}

export const formatStr = (timestamp?: number) => {
  if (!timestamp || timestamp < 86400000) {
    return '--'
  }
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

export function findNameByIdFromList(
  list: any[],
  id: any,
  idKey: string = 'id',
  nameKey: string = 'name'
) {
  const res = list.filter(item => item[idKey] === id)
  return res.length > 0 ? res[0][nameKey] : '--'
}

// function foo(source: any, filter: any) {
//   const intersection = source.filter((v: any) => filter.includes(v))
//   const difference = source
//     .concat(filter)
//     .filter((v: any) => !source.includes(v) || !filter.includes(v))
//   return {
//     intersection,
//     difference
//   }
// }

/**
 * @description 按筛选条件将源数据分组
 * @param source 源数据
 * @param filters 筛选条件
 * @param path 源数据与筛选条件匹配属性的路径
 * @returns
 */
export const inAndOut = (
  source: any[],
  filters: Array<number | string>,
  path: string[] = []
): {
  IN: any[]
  OUT: any[]
} => {
  if (filters.length === 0) {
    return {
      IN: [],
      OUT: source
    }
  }
  const IN = source.filter(v => {
    const value = findValueformPath(v, path)
    return filters.includes(value) && value
  })
  const OUT = source.filter(v => {
    const value = findValueformPath(v, path)
    return !filters.includes(value) || !value
  })

  return {
    IN,
    OUT
  }
}

export function freshUser() {
  const { loginTime } = getAdminData()
  if (!loginTime) {
    return false
  }
  if (localStorage.getItem('loginTime')) {
    if (String(loginTime) === localStorage.getItem('loginTime')) {
      return false
    } else {
      localStorage.setItem('loginTime', String(loginTime))
      return true
    }
  } else {
    localStorage.setItem('loginTime', String(loginTime))
    return true
  }
}
interface AdminData {
  loginName: string
  adminId: string
  userName: string
  loginTime: number
}
export function getAdminData() {
  if (window.self !== window.top) {
    return window.parent.getAdminData()
  } else {
    return {} as AdminData
  }
}

function findValueformPath(object: any, path: string[]) {
  for (let i = 0; i < path.length; i++) {
    const p = path[i]
    // eslint-disable-next-line no-prototype-builtins
    if (object && object.hasOwnProperty(p)) {
      object = object[p]
    } else {
      return undefined
    }
  }
  return object
}

export const splitMinToTimeString = (minute: number) => {
  if (!minute) {
    return {
      hour: 0,
      min: 0,
      hm: 0,
      timeStr: `0小时0分钟`,
      timeStr2: `0分钟`
    }
  }
  const hour = Math.floor(minute / 60)
  const min = Math.floor(minute % 60)
  const hm = (hour + min / 60).toFixed(2)
  const maxHm = Math.ceil(hour + min / 60)
  const _max = Math.floor(Math.round(maxHm) / 10) // 最大值虚位
  const timeStr = `${hour}小时${min}分钟`
  const timeStr2 = hour > 0 ? `${hour}小时${min}分钟` : `${min}分钟`
  return {
    hour,
    min,
    hm,
    maxHm: maxHm + _max,
    timeStr,
    timeStr2
  }
}

export const splitSecToTimeString = (second: number) => {
  if (!second || second < 60) {
    return '0分钟'
  }
  const { timeStr2: str } = splitMinToTimeString(second / 60)
  return str
}

export function getDateWeekDayList(): DateWeek[] {
  const currDate = new Date()
  const list: DateWeek[] = []
  const weekList = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ]
  for (let i = 0; i < 35; i++) {
    const Date = dayjs(currDate).add(i, 'day')
    const date = Date.format('YYYY-MM-DD')
    const week = weekList[Date.day()]
    list.push({
      date,
      week
    })
  }
  return list
}

export function group<T>(array: T[], subGroupLength: number): T[][] {
  let index = 0
  const newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }
  return newArray
}

/**
 * 格式化时间
 * 调用 FormatDate(strDate, "yyyy-MM-dd HH:mm:ss")
 * @param strDate （中国标准时间）时间戳等
 * @param strFormat 返回格式
 * @returns
 */
export const formatDate = (
  strDate: string | number | Date | undefined,
  strFormat?: any
): string => {
  if (!strDate) return
  if (!strFormat) strFormat = 'yyyy-MM-dd'
  switch (typeof strDate) {
    case 'string':
      strDate = new Date(strDate.replace(/-/g, '/'))
      break
    case 'number':
      strDate = new Date(strDate)
      break
  }
  if (strDate instanceof Date) {
    const dict: any = {
      yyyy: strDate.getFullYear(),
      M: strDate.getMonth() + 1,
      d: strDate.getDate(),
      H: strDate.getHours(),
      m: strDate.getMinutes(),
      s: strDate.getSeconds(),
      MM: ('' + (strDate.getMonth() + 101)).substr(1),
      dd: ('' + (strDate.getDate() + 100)).substr(1),
      HH: ('' + (strDate.getHours() + 100)).substr(1),
      mm: ('' + (strDate.getMinutes() + 100)).substr(1),
      ss: ('' + (strDate.getSeconds() + 100)).substr(1)
    }
    return strFormat.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
      // eslint-disable-next-line prefer-rest-params
      return dict[arguments[0]]
    })
  }
}

export const uuid = function () {
  const s: any = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = ''

  return s.join('')
}

export function displayTime() {
  function check(val: number) {
    return val < 10 ? `0${val}` : val
  }

  const date = new Date()
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${check(hour)}:${check(minutes)}:${check(seconds)}`
}

//全屏
export function enterFullScreen() {
  const element: any = document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  }
}

//退出全屏
export function exitFullscreen() {
  if ((document as any).exitFullscreen) {
    ;(document as any).exitFullscreen()
  } else if ((document as any).msExitFullscreen) {
    ;(document as any).msExitFullscreen()
  } else if ((document as any).mozCancelFullScreen) {
    ;(document as any).mozCancelFullScreen()
  } else if ((document as any).webkitExitFullscreen) {
    ;(document as any).webkitExitFullscreen()
  }
}

export function isFull() {
  return !!(
    (document as any).webkitIsFullScreen ||
    (document as any).mozFullScreen ||
    (document as any).msFullscreenElement ||
    (document as any).fullscreenElement
  )
}

type _typeObj = { [anyKey: string]: any }

/**
 * @param copy 深拷贝
 * @param _object 如果不传返回为空对象 必须是js的{}对象
 * @param _obj 可选 返回传入的@param _object 必须是js的{}对象,
 */
export const copy = (_object: _typeObj, _obj: _typeObj = {}): _typeObj => {
  if (!(Object.prototype === Object.getPrototypeOf(_object))) {
    return new Error('传入参数***_object***类型错误')
  }
  for (const key in _object) {
    if (Object.prototype === Object.getPrototypeOf(_object[key])) {
      _obj[key] = copy(_object[key])
    } else {
      _obj[key] = _object[key]
    }
  }
  return _obj
}

/**
 *
 * @description 金额千分位格式化，仅限于整型
 * @param num
 * @returns
 */
export const fnum = (num: number): string => {
  if (typeof num !== 'number') {
    return num
  }
  const numStrArr = JSON.stringify(num).split('')
  if (numStrArr.length < 4) {
    return JSON.stringify(num)
  }
  const numArr = numStrArr.reverse().reduce((prev, curr, index) => {
    if (index !== 0 && index % 3 === 0) {
      prev.push(',')
    }
    prev.push(curr)
    return prev
  }, [] as string[])
  return numArr.reverse().join('')
}

export const numFormat = (num: number) => {
  if (num < 1000) {
    return `${num}元`
  }
  return `${(num / 10000).toFixed(2)}万元`
}

export const getUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 *
 * @param commissionType 11:固定激励 | 12:比例激励 | 21:定额叠加 | 22:系数叠加
 * @param commissionValue 数值
 * @returns `${数值}${类型}`
 */
export const richRuleName = (
  commissionType: 11 | 12 | 21 | 22,
  commissionValue: number | string,
  hasPre?: boolean
) => {
  let preStr = ''
  let str = ''
  switch (commissionType) {
    case 11:
      preStr = '固定激励'
      str = `${commissionValue}元/件`
      break
    case 12:
      preStr = '比例激励'
      str = `${commissionValue}%`
      break
    case 21:
      preStr = '定额叠加'
      str = `${commissionValue}元/件`
      break
    case 22:
      preStr = '系数叠加'
      str = `${commissionValue}倍`
      break
  }
  if (hasPre) {
    return `${preStr}${str}`
  }
  return str
}

export const deepClone = (target: any) => {
  const map = new WeakMap()

  function isObject(target: any) {
    return (
      (typeof target === 'object' && target) || typeof target === 'function'
    )
  }

  function clone(data: any) {
    if (!isObject(data)) {
      return data
    }
    if ([Date, RegExp].includes(data.constructor)) {
      return new data.constructor(data)
    }
    if (typeof data === 'function') {
      return new Function('return ' + data.toString())()
    }
    const exist = map.get(data)
    if (exist) {
      return exist
    }
    if (data instanceof Map) {
      const result = new Map()
      map.set(data, result)
      data.forEach((val, key) => {
        if (isObject(val)) {
          result.set(key, clone(val))
        } else {
          result.set(key, val)
        }
      })
      return result
    }
    if (data instanceof Set) {
      const result = new Set()
      map.set(data, result)
      data.forEach(val => {
        if (isObject(val)) {
          result.add(clone(val))
        } else {
          result.add(val)
        }
      })
      return result
    }
    const keys = Reflect.ownKeys(data)
    const allDesc = Object.getOwnPropertyDescriptors(data)
    const result = Object.create(Object.getPrototypeOf(data), allDesc)
    map.set(data, result)
    keys.forEach(key => {
      const val = data[key]
      if (isObject(val)) {
        result[key] = clone(val)
      } else {
        result[key] = val
      }
    })
    return result
  }

  return clone(target)
}

/**
 * @description 将键值对与枚举类型转换为Map
 * @param obj 键值对映射
 * @param map 枚举类型Map
 * @returns map
 */
export const generateEnumMap = <T>(obj: { [key: string | number]: T }) => {
  const map = new Map<T, string>()
  for (const key in obj) {
    map.set(obj[key], key)
  }
  return map
}
