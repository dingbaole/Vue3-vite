// import 'whatwg-fetch';
// import { config } from 'config';
import { getUuid } from '@/utils'

function _insertHost(input: RequestInfo) {
  if (typeof input === 'string') {
    return import.meta.env.ECEJ_HOST + `${input}`
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
  code: 200 | number | string
  message: string
  data: T
}

interface IFetch {
  insertHost?: boolean //是否添加bff host
  showTip?: boolean //是否显示错误提示
  isUpload?: boolean // 是否是上传
  isFormData?: boolean
  isResultBlob?: boolean
}

export default async function Fetch<T = any>(
  input: RequestInfo,
  init?: RequestInit,
  opts: IFetch = {
    insertHost: false,
    showTip: true,
    isUpload: false,
    isFormData: false,
    isResultBlob: false
  }
): Promise<API.Result<T>> {
  if (typeof input === 'string') {
    input = `${process.env.NODE_ENV === 'development' ? '/api' : ''}${input}`
  }

  const { insertHost, isUpload, isFormData, isResultBlob } = opts
  input = insertHost ? _insertHost(input) : input

  //封装请求信息
  const request: RequestInit = {
    method: 'POST',
    mode: 'cors', //跨域请求
    headers: isUpload
      ? { 'Content-Type': 'application/x-www-form-urlencoded' }
      : isFormData
      ? {}
      : { 'Content-Type': 'application/json' },
    ...init,
    body: isUpload || isFormData ? transformFormData(init?.body) : init?.body
  }

  // 添加网络超时机制
  const timeoutId = setTimeout(() => {
    return Promise.reject('请求超时')
  }, Number(20) * 1000)

  let result = null
  try {
    const response = await fetch(input, request)
    let res = null
    if (isResultBlob) {
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

function transformFormData<T extends BodyInit = any>(
  data: T | undefined | null
) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(data!)) {
    formData.append(key, value)
  }
  return formData
}
