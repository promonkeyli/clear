import Taro from '@tarojs/taro';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import taroAdapter from './adapter';
import { ResponseData } from './type';
import useUserStore from '@/stores/user';
import { TokenInfo } from '@/stores/user/type';

// 请求白名单，不需要携带 token 的接口
const WHITE_LIST = [
  '/login',
  '/register',
  '/refreshToken',
];

const instance = axios.create({
  baseURL: process.env.TARO_APP_BASE_URL || '', // 从编译时注入的常量获取 baseURL
  timeout: 10000,
  adapter: taroAdapter,
});

// 调试：打印 baseURL 确认环境变量是否正确加载
console.log('HTTP baseURL:', process.env.TARO_APP_BASE_URL);

// 是否正在刷新 token
let isRefreshing = false;
// 重试队列，每一项是一个 resolve 函数
let requests: ((token: string) => void)[] = [];

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 检查是否在白名单中
    const isWhiteList = WHITE_LIST.some((url) => config.url?.includes(url));

    if (!isWhiteList) {
      const tokenInfo = useUserStore.getState().tokenInfo;
      if (tokenInfo?.accessToken) {
        config.headers.Authorization = `Bearer ${tokenInfo.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const { code, message } = response.data;

    // 假设 200 为成功，根据实际情况调整
    if (code === 200) {
      return response.data.data
    }

    // 处理业务错误
    if (code !== 401) {
      Taro.showToast({
        title: message || '请求失败',
        icon: 'none',
      });
      return Promise.reject(new Error(message || 'Error'));
    }

    // 处理 401 Token 过期
    const config = response.config;

    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = useUserStore.getState().tokenInfo?.refreshToken;

      if (!refreshToken) {
        return handleLoginExpired();
      }

      // 尝试刷新 Token
      return refreshTokenFunc(refreshToken)
        .then((newTokenInfo) => {
          useUserStore.getState().setTokenInfo(newTokenInfo);
          config.headers.Authorization = `Bearer ${newTokenInfo.accessToken}`;

          // 执行队列中的请求
          requests.forEach((cb) => cb(newTokenInfo.accessToken));
          requests = [];

          return instance(config);
        })
        .catch(() => {
          return handleLoginExpired();
        })
        .finally(() => {
          isRefreshing = false;
        });
    } else {
      // 正在刷新，将请求加入队列
      return new Promise((resolve) => {
        requests.push((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          resolve(instance(config));
        });
      });
    }
  },
  (error) => {
    // 处理网络错误等
    Taro.showToast({
      title: error.message || '网络异常',
      icon: 'none',
    });
    return Promise.reject(error);
  }
);

// 模拟刷新 Token 的方法，实际应调用后端接口
async function refreshTokenFunc(_refreshToken: string): Promise<TokenInfo> {
  // 这里应该发送请求到后端刷新 token
  // const res = await instance.post('/refreshToken', { refreshToken });
  // return res.data.data;

  // 模拟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        accessToken: 'new_mock_access_token',
        refreshToken: 'new_mock_refresh_token',
        expiresIn: 7200,
        refreshExpiresIn: 2592000
      });
    }, 1000);
  })
}

function handleLoginExpired() {
  useUserStore.getState().clearUser();
  Taro.showToast({
    title: '登录已过期，请重新登录',
    icon: 'none',
  });
  // 跳转登录页
  Taro.navigateTo({ url: '/pages/login/index' });
  return Promise.reject(new Error('Login expired'));
}

export default instance;
