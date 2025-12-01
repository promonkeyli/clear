import { View, Text } from '@tarojs/components'
import './index.css'
import { login } from '@/services/user';
import { useEffect } from "react";

export default function Index() {

  useEffect(() => {
    console.log('开始调用登录接口...');
    login({
      username: "admin",
      password: "123456"
    })
      .then(res => {
        console.log('登录成功:', res);
      })
      .catch(err => {
        console.error('登录失败:', err);
      });
  }, []);

  return (
    <View>
      <Text className='text-[#123456] bg-amber-100'>Weapp-tailwindcss 模板</Text>
      <View className='index bg-[#123456]'>
        <Text className='text-[55rpx] text-[#aae90b]'>Hello world!</Text>
      </View>
      <View className='h-14 bg-linear-to-r from-cyan-500 to-blue-500'></View>
      <View className='h-14 bg-linear-to-t from-sky-500 to-indigo-500'></View>
      <View className='h-14 bg-linear-to-bl from-violet-500 to-fuchsia-500'></View>
      <View className='h-14 bg-linear-65 from-purple-500 to-pink-500'></View>
    </View>
  )
}
