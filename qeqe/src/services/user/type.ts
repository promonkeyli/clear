import { TokenInfo } from '@/stores/user/type';

/**
 * 登录请求参数
 */
export interface LoginParams {
    username: string;
    password: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
    userInfo: any;
    tokenInfo: TokenInfo;
}
