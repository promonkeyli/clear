// 直接复用 TypeScript 内置类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export type FetchConfig = Omit<RequestInit, 'method' | 'body'> & {
  method?: HttpMethod
  baseURL?: string
  params?: Record<string, any>
  data?: any
  timeout?: number
  signal?: AbortSignal
}

