import http from '@/utils/http';
import type { LoginParams, LoginResponse } from './type';
import { ResponseData } from '@/utils/http/type';

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应数据
 */
export function login(params: LoginParams): Promise<ResponseData<LoginResponse>> {
    return http.post('/login', params);
}

/**
 * 用户登出
 */
export function logout(): Promise<ResponseData<void>> {
    return http.post('/logout');
}
