
# Gemini Development Guide

你好！这是一个为 AI 助手（如 Gemini）准备的开发指南。遵循本指南可以帮助你更好地理解和参与此项目。

## 🚀 项目概览

- **框架**: [Taro](https://taro.zone/)
- **UI 框架**: [React](https://react.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Less](https://lesscss.org/)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand)
- **包管理器**: [pnpm](https://pnpm.io/)
- **代码规范**: ESLint, Stylelint, Commitlint

## 🛠️ 核心指令

在执行任何操作前，请确保已安装所有依赖。

- **安装依赖**:
  ```bash
  pnpm install
  ```
  > **注意**: 如果安装过程中出现 `EPERM` 权限错误，这可能是你本地环境的问题。请尝试检查文件权限或以管理员身份运行终端，然后重新执行命令。

- **启动开发服务器 (微信小程序)**:
  ```bash
  pnpm dev:weapp
  ```

- **启动开发服务器 (H5)**:
  ```bash
  pnpm dev:h5
  ```

- **构建生产版本 (微信小程序)**:
  ```bash
  pnpm build:weapp
  ```

- **创建新页面**:
  Taro 提供了方便的命令行工具来创建新页面。
  ```bash
  pnpm new
  ```
  然后根据提示输入页面名称即可。这会自动在 `src/pages` 目录下创建完整的页面结构。

## 📝 架构与开发规范

本项目的核心架构思想是 **关注点分离** 和 **逻辑复用**。所有业务逻辑、状态管理和副作用都应从 UI 组件中抽离到自定义 Hooks 中。

### 1. 核心原则：文件夹即模块

项目中所有功能单元（页面、组件、服务、状态）都应以文件夹的形式组织，文件夹的名称即模块的名称。

- **`src/pages/`**: 页面模块
- **`src/components/`**: 全局通用组件
- **`src/services/`**: API 服务
- **`src/stores/`**: 全局状态
- **`src/utils/`**: 通用工具函数

每个模块文件夹内部都应包含 `index.ts` 或 `index.tsx` 作为入口，并可包含 `type.ts` (类型定义)、`hooks.ts` (逻辑钩子) 等文件。

### 2. 页面开发 (Pages)

页面是业务逻辑的容器，但其本身 **不应包含复杂的业务逻辑**。

- **结构**:
  - `src/pages/my-page/`: 页面根文件夹
    - `components/`: **此页面独有的** 局部组件
      - `my-local-component/`: 局部组件文件夹
        - `index.tsx`
        - `index.less`
    - `useMyPageData.ts`: 此页面的自定义 Hooks (与 `index.tsx` 同级)
    - `index.tsx`: 页面入口（容器组件），负责组织 Hooks 和组件
    - `index.less`: 页面级样式
    - `index.config.ts`: 页面配置
- **职责 (`index.tsx`)**:
  1.  调用一个或多个自定义 Hooks 来获取数据和操作方法。
  2.  将数据和方法传递给一个或多个局部或全局组件。
  3.  负责页面整体布局。

### 3. 组件开发 (Components)

组件分为 **全局组件** 和 **局部组件**。

- **全局组件**:
  - **位置**: `src/components/`
  - **用途**: 可在应用内任何地方复用的组件（如 `Button`, `Modal`, `Avatar`）。
  - **规范**: 遵循文件夹组织，内部逻辑也应尽可能拆分到 Hook 中。

- **局部组件**:
  - **位置**: `src/pages/some-page/components/`
  - **用途**: 仅为特定页面服务的组件，不具备通用性。
  - **规范**: 与全局组件相同，这有助于未来将其重构为全局组件。

### 4. 逻辑开发 (Custom Hooks)

**所有业务逻辑、状态和副作用都必须封装在自定义 Hook 中。**

- **命名**: 以 `use` 开头，例如 `useUserData`, `useCart`。
- **位置**: 放置在所属页面或组件的根文件夹下，与 `index.tsx` 同级。
- **职责**:
  - 调用 API 服务 (`services`) 获取数据。
  - 使用全局状态 (`stores`)。
  - 管理组件内部的临时状态 (`useState`)。
  - 处理副作用 (`useEffect`)。
- **返回值**: 返回一个对象，包含组件渲染所需的数据和事件处理函数。

### 5. 样式规范 (Styling)

为了保持视觉一致性和可维护性，样式必须遵循以下规则：

- **使用变量**: **必须** 使用 `src/app.less` 中定义的全局 Less 变量来设置颜色、字体大小和背景色。
- **禁止硬编码**:
  - **严禁** 在 `.less` 文件中硬编码任何颜色值（例如 `#fff`, `rgb(0,0,0)`）。
  - **严禁** 使用像素单位 (`px`) 定义字体大小，应使用 `@font-size-*` 变量。
- **自动导入**: `src/app.less` 已被配置为全局自动导入，在任何 `.less` 文件中都可以直接使用其中定义的变量。

---

## ✅ 常用操作流程

### 如何添加一个新页面？

1.  **创建页面结构**:
    - 在 `src/pages` 下创建页面文件夹，例如 `user-profile`。
    - 在 `user-profile` 内创建 `index.tsx`, `index.less`, `index.config.ts`。
    - 创建 `components` 子文件夹。
2.  **创建自定义 Hook**:
    - 在 `user-profile` 文件夹下创建 `useUserProfileData.ts` (与 `index.tsx` 同级)，在其中编写获取用户数据的逻辑。
3.  **创建局部组件**:
    - 在 `components` 文件夹下创建 `UserInfoCard` 等局部组件。
4.  **组合页面**:
    - 在 `user-profile/index.tsx` 中，调用 `useUserProfileData`，并将返回的数据传递给 `UserInfoCard` 组件。
5.  **注册页面**:
    - 在 `src/app.config.ts` 中添加 `'pages/user-profile/index'`。

### 如何添加一个新的 API 服务？

此流程演示如何为 `order` 模块添加 API 服务。

1.  在 `src/services` 目录下创建一个新文件夹 `order`。
2.  在 `src/services/order` 中创建 `type.ts` 并定义类型。
3.  在 `src/services/order` 中创建 `index.ts` 并编写 API 函数。
    ```typescript
    // src/services/order/index.ts
    import http from '@/utils/http';
    import type { Order } from './type';

    export const fetchOrderDetails = async (orderId: string): Promise<Order> => {
      const response = await http.get<Order>(`/api/orders/${orderId}`);
      return response; // http 模块已处理了 data 包装
    };
    ```

### 如何使用或创建一个全局状态？

1.  在 `src/stores` 目录下创建一个新的文件夹，例如 `system`。
2.  在 `src/stores/system` 中创建 `type.ts` 和 `index.ts`。
3.  在 `index.ts` 中定义 store。
    ```typescript
    // src/stores/system/index.ts
    import { create } from 'zustand';
    import type { SystemState } from './type';

    const useSystemStore = create<SystemState>((set) => ({
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
    }));

    export default useSystemStore;
    ```
4.  在任何组件或 Hook 中，通过 `import useSystemStore from '@/stores/system';` 来消费状态。
