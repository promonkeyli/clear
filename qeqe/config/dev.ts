import type { UserConfigExport } from "@tarojs/cli"

export default {

  mini: {
    // 注：添加该属性的原因详见：https://github.com/NervJS/taro/issues/17350
    debugReact: true
  },
  h5: {}
} satisfies UserConfigExport<'vite'>
