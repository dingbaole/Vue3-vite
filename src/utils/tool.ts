import dayjs from 'dayjs'
type DateWeek = {
  date: string
  week: string
}
export function isOnline() {
  console.log('-------检测网络变化--------')

  const netWorkDownlink = (navigator as any).connection.downlink // 预估下载速度m/s
  console.log((navigator as any).connection)
  if (
    (navigator as any).connection &&
    (navigator as any).connection.onchange === null
  ) {
    console.log((navigator as any).connection)
    ;(navigator as any).connection.onchange = () => {
      console.log('change')
      if (
        netWorkDownlink !== (navigator as any).connection.downlink ||
        (navigator as any).connection.rtt === 0
      ) {
        //网络断开
        console.log('网络断开')
      } else if (
        netWorkDownlink === (navigator as any).connection.downlink ||
        (navigator as any).connection.rtt !== 0
      ) {
        //连接到网络
        console.log('连接到网络')
      }
    }
  }
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
  // console.log(list);

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
export function formatDate(
  strDate: string | number | Date | undefined,
  strFormat?: any
) {
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
