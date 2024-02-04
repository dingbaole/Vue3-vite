// import 'whatwg-fetch';
// import { config } from 'config';
// import { common } from 'utils';

// function _insertHost(input: RequestInfo) {
//   if (typeof input === 'string') {
//     return input
//   } else {
//     return input
//   }
// }

function _newInsertHost(input: RequestInfo) {
  if (typeof input === 'string') {
    return (
      window.location.origin +
      `${process.env.NODE_ENV === 'development' ?  '/api' : ''}${input}`
    )
  } else {
    return input
  }
}

/**
 * 封装业务fetch
 * @param input 输入url等
 * @param init 初始化http header信息等
 */

export interface Result<T> {
  [x: string]: any
  code: number
  message: string
  data: T
}

interface IFetch {
  proxyUrl?: string
  insertHost?: boolean //是否添加bff host
  showTip?: boolean //是否显示错误提示
  isUpload?: boolean // 是否是上传
  isBlob?: boolean
}
export default async function Fetch<T = any>(
  input: RequestInfo,
  init?: RequestInit,
  opts: IFetch = {
    insertHost: true,
    showTip: true,
    isUpload: false,
    isBlob: false
  }
): Promise<API.Result<T>> {
  const { insertHost } = opts
  input = insertHost == null || insertHost ? _newInsertHost(input) : input
  //封装请求信息
  const request: RequestInit = {
    method: 'GET',
    mode: 'cors', //跨域请求
    headers: opts.isUpload
      ? {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      : {
        'Content-Type': 'application/json'
      },
    ...init
  }

  // 添加网络超时机制
  const timeoutId = setTimeout(() => {
    return Promise.reject('请求超时')
  }, Number(10) * 1000)

  let result = null
  try {
    const response = await fetch(input, request)
    let res = null
    if (opts.isBlob) {
      res = await response.blob()
    } else {
      res = await response.json()
      if (res.code === 6001) {
        window.location.href = '/'
      }
    }
    clearTimeout(timeoutId)
    result = res
  } catch (err) {
    clearTimeout(timeoutId)
    // dev
    if (process.env.NODE_ENV !== 'production') {
      console.log('err', JSON.stringify(err))
    }

    //全局消息通知
    if (opts.showTip == null || opts.showTip) {
      // Alert({ text: '您的网络可能不给力' });
    }
    return Promise.reject('网络错误')
  }
  return result
}
