import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserState } from './type';
import { taroStorage } from '@/utils/storage';

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: null,
      tokenInfo: null,
      setUserInfo: (userInfo) => set({ userInfo }),
      setTokenInfo: (tokenInfo) => set({ tokenInfo }),
      clearUser: () => set({ userInfo: null, tokenInfo: null }),
    }),
    {
      name: 'user-store', // 在本地存储中使用的键名
      storage: taroStorage, // 使用自定义的 Taro 存储引擎
    }
  )
);

export default useUserStore;
