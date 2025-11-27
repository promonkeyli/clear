# create-clear

> 快速创建前端项目的脚手架工具

[![npm version](https://img.shields.io/npm/v/create-clear.svg)](https://www.npmjs.com/package/create-clear)
[![node version](https://img.shields.io/node/v/create-clear.svg)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/create-clear.svg)](https://github.com/promonkeyli/clear/blob/master/LICENSE)

## 简介

`create-clear` 是一个简单易用的 CLI 工具，帮助你快速创建预配置的前端项目。无需手动配置，一键生成包含最佳实践的项目模板。

## 特性

- 🚀 **快速创建** - 一条命令即可创建完整的项目结构
- 📦 **多种模板** - 支持 React、Taro 等多种前端框架
- 🎨 **开箱即用** - 预配置了常用的开发工具和最佳实践
- 🔧 **灵活定制** - 可根据需求选择不同的项目模板
- 💡 **交互式界面** - 友好的命令行交互体验

## 使用方法

### 使用 npm

```bash
npm create clear@latest
```

### 使用 pnpm

```bash
pnpm create clear
```

### 使用 yarn

```bash
yarn create clear
```

## 可用模板

### mobile-taro
基于 Taro 的多端移动应用模板，支持微信小程序、H5、React Native 等多个平台。

**特性：**
- ✅ TypeScript 支持
- ✅ 状态管理
- ✅ 路由配置
- ✅ UI 组件库
- ✅ 开发工具配置

### admin-react
基于 React 的后台管理系统模板，适合快速搭建企业级管理后台。

**特性：**
- ✅ React 18+
- ✅ TypeScript
- ✅ 路由管理
- ✅ 状态管理
- ✅ UI 组件库
- ✅ 权限管理

## 使用示例

运行命令后，按照提示操作：

```bash
$ pnpm create clear

✔ What is the name of project? … my-awesome-project
✔ Pick a project template › mobile-taro
正在拉取模版: promonkeyli/program-template/frontend/mobile-taro...
✔ 模版拉取成功
```

然后进入项目目录并安装依赖：

```bash
cd my-awesome-project
pnpm install
pnpm dev
```

## 系统要求

- Node.js >= 19.0.0 || >= 20.0.0 || >= 22.0.0

## 工作原理

`create-clear` 使用 [tiged](https://github.com/tiged/tiged) 从 GitHub 仓库拉取项目模板，无需克隆整个 Git 历史，速度更快。

## 开发

```bash
# 克隆仓库
git clone https://github.com/promonkeyli/clear.git

# 进入项目目录
cd clear/packages/create-clear

# 安装依赖
pnpm install

# 构建
pnpm build

# 本地测试
pnpm test
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT](https://github.com/promonkeyli/clear/blob/master/LICENSE)

## 相关链接

- [GitHub 仓库](https://github.com/promonkeyli/clear)
- [问题反馈](https://github.com/promonkeyli/clear/issues)
- [模板仓库](https://github.com/promonkeyli/program-template)

---

Made with ❤️ by [promonkeyli](https://github.com/promonkeyli)
