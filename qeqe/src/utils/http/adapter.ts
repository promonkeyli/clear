import Taro from '@tarojs/taro'
import { AxiosError } from 'axios'
import type {
  AxiosAdapter,
  InternalAxiosRequestConfig, // 注意：Axios v1 使用这个类型作为适配器参数
  AxiosResponse,
  AxiosResponseHeaders
} from 'axios'

const taroAdapter: AxiosAdapter = (
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    const {
      url = '',
      method = 'GET',
      data,
      params,
      headers,
      timeout,
      baseURL,
      signal
    } = config

    // 1. URL 处理：简单的拼接逻辑，处理 baseURL
    const fullUrl = getFullUrl(baseURL, url)

    // 2. Headers 处理：AxiosHeaders 实例转为普通对象
    // Taro 的 header 类型通常要求是 Record<string, any>
    const taroHeader = (headers && typeof headers.toJSON === 'function')
      ? headers.toJSON()
      : (headers as Record<string, any>)

    // 3. Method 处理：确保转换为 Taro 接受的有效大写字符串
    const taroMethod = (method?.toUpperCase() || 'GET') as keyof Taro.request.Method

    // 4. 数据处理：GET 请求通常参数在 params，POST 在 data
    // Taro 的 data 属性在 GET 时作为 query 参数，在 POST 时作为 body
    const requestData = taroMethod === 'GET' ? params : data

    const requestTask = Taro.request({
      url: fullUrl,
      method: taroMethod,
      data: requestData,
      header: taroHeader,
      timeout,
      // 开启 dataType: 'json' 会自动解析 JSON，这是 Taro 默认值，但显式写出更清晰
      dataType: 'json',

      success(res) {
        const response: AxiosResponse = {
          data: res.data,
          status: res.statusCode,
          statusText: res.errMsg || 'OK',
          headers: res.header as AxiosResponseHeaders, // 强制转换 Taro header 类型
          config,
          request: requestTask // 或者 res
        }

        // 校验状态码（Axios 默认 validateStatus 逻辑：200-299）
        // 如果 config 中有自定义 validateStatus，需要在这里处理
        const validateStatus = config.validateStatus || (status => status >= 200 && status < 300)

        if (validateStatus(res.statusCode)) {
          resolve(response)
        } else {
          // 状态码不在成功范围内，抛出 Axios 错误
          reject(new AxiosError(
            `Request failed with status code ${res.statusCode}`,
            [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][0], // 简单映射
            config,
            requestTask,
            response
          ))
        }
      },

      fail(err) {
        const error = new AxiosError(
          err.errMsg || 'Network Error',
          AxiosError.ERR_NETWORK,
          config,
          requestTask
        )
        reject(error)
      }
    })

    // ✅ 支持 AbortController 取消请求
    if (signal) {
      // 如果已经取消了，直接 abort
      if (signal.aborted) {
        requestTask.abort()
      } else {
        signal.addEventListener?.('abort', () => {
          requestTask.abort()
        })
      }
    }
  })
}

export default taroAdapter

// ========================
// 辅助函数
// ========================

/**
 * 拼接 baseURL 和 url
 */
function getFullUrl(baseURL: string | undefined, url: string): string {
  if (!baseURL || /^https?:\/\//.test(url)) {
    return url
  }

  const cleanBaseURL = baseURL.replace(/\/+$/, '')
  const cleanUrl = url.replace(/^\/+/, '')

  return `${cleanBaseURL}/${cleanUrl}`
}
