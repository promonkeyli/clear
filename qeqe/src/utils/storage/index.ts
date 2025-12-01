import Taro from '@tarojs/taro'
import { createJSONStorage } from 'zustand/middleware'

export const taroStorage = createJSONStorage(() => ({
  getItem: (name) => {
    try {
      return Taro.getStorageSync(name) || null
    } catch (e) {
      console.warn('[taroStorage.getItem]', e)
      return null
    }
  },
  setItem: (name, value) => {
    try {
      Taro.setStorageSync(name, value)
    } catch (e) {
      console.warn('[taroStorage.setItem]', e)
    }
  },
  removeItem: (name) => {
    try {
      Taro.removeStorageSync(name)
    } catch (e) {
      console.warn('[taroStorage.removeItem]', e)
    }
  },
}))
