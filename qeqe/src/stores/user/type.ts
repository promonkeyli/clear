/**
 * 用户 Store 相关的 TypeScript 类型定义
 */

export interface TokenInfo {
  /**
   * 访问令牌
   */
  accessToken: string;
  /**
   * 刷新令牌
   */
  refreshToken: string;
  /**
   * 访问令牌的过期时间（秒）
   */
  expiresIn: number;
  /**
   * 刷新令牌的过期时间（秒）
   */
  refreshExpiresIn: number;
}

export interface UserState {
  /**
   * 用户信息
   */
  userInfo: any | null;
  /**
   * Token信息
   */
  tokenInfo: TokenInfo | null;
  /**
   * 设置用户信息
   * @param userInfo 用户信息
   */
  setUserInfo: (userInfo: any) => void;
  /**
   * 设置Token信息
   * @param tokenInfo
   */
  setTokenInfo: (tokenInfo: TokenInfo) => void;
  /**
   * 清除用户状态（用于退出登录）
   */
  clearUser: () => void;
}
