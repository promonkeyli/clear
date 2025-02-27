import { FetchConfig } from "../typings"

export class FetchClient {
    private defaults: FetchConfig
    private interceptors = {
      request: [] as Array<(config: FetchConfig) => FetchConfig | Promise<FetchConfig>>,
      response: [] as Array<(response: Response) => any | Promise<any>>
    }
  
    constructor(defaults: FetchConfig = {}) {
      this.defaults = {
        headers: { 'Content-Type': 'application/json' },
        ...defaults
      }
    }
  
    async request<T = any>(url: string, config: FetchConfig = {}): Promise<T> {
      // 合并配置
      const mergedConfig: FetchConfig = {
        ...this.defaults,
        ...config,
        headers: {
          ...this.defaults.headers,
          ...config.headers
        }
      }
  
      // 处理 baseURL
      const fullURL = mergedConfig.baseURL 
        ? new URL(url, mergedConfig.baseURL).toString()
        : url
  
      // 处理 query 参数
      const query = new URLSearchParams(mergedConfig.params).toString()
      const finalURL = query ? `${fullURL}?${query}` : fullURL
  
      // 请求拦截
      let requestConfig = mergedConfig
      for (const interceptor of this.interceptors.request) {
        requestConfig = await interceptor(requestConfig)
      }
  
      // 处理超时
      const controller = new AbortController()
      const timeoutId = requestConfig.timeout && setTimeout(
        () => controller.abort(`Timeout of ${requestConfig.timeout}ms exceeded`),
        requestConfig.timeout
      )
  
      // 发送请求
      try {
        const response = await fetch(finalURL, {
          ...requestConfig,
          signal: controller.signal,
          body: requestConfig.data ? JSON.stringify(requestConfig.data) : null
        })
  
        clearTimeout(timeoutId)
  
        // 响应拦截
        let processedResponse = response
        for (const interceptor of this.interceptors.response) {
          processedResponse = await interceptor(processedResponse)
        }
  
        // 自动解析 JSON
        return processedResponse.json() as Promise<T>
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new Error(error.message || 'Request canceled')
        }
        throw error
      }
    }
  
      get<T = any>(url: string, config?: Omit<FetchConfig, 'method' | 'data'>) {
        return this.request<T>(url, { ...config, method: 'GET' })
      }
    
      post<T = any>(url: string, data?: any, config?: Omit<FetchConfig, 'method' | 'data'>) {
        return this.request<T>(url, { ...config, method: 'POST', data })
      }
    
      put<T = any>(url: string, data?: any, config?: Omit<FetchConfig, 'method' | 'data'>) {
        return this.request<T>(url, { ...config, method: 'PUT', data })
      }
    
      delete<T = any>(url: string, config?: Omit<FetchConfig, 'method'>) {
        return this.request<T>(url, { ...config, method: 'DELETE' })
      }
    
      patch<T = any>(url: string, data?: any, config?: Omit<FetchConfig, 'method' | 'data'>) {
        return this.request<T>(url, { ...config, method: 'PATCH', data })
      }
    
      head<T = any>(url: string, config?: Omit<FetchConfig, 'method'>) {
        return this.request<T>(url, { ...config, method: 'HEAD' })
      }
    
      options<T = any>(url: string, config?: Omit<FetchConfig, 'method'>) {
        return this.request<T>(url, { ...config, method: 'OPTIONS' })
      }
    // 其他 HTTP 方法类似实现...
  
    // 拦截器方法
    useRequestInterceptor(
      interceptor: (config: FetchConfig) => FetchConfig | Promise<FetchConfig>
    ) {
      this.interceptors.request.push(interceptor)
    }
  
    useResponseInterceptor(interceptor: (response: Response) => any | Promise<any>) {
      this.interceptors.response.push(interceptor)
    }
  }