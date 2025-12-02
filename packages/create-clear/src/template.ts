/**
 * @description 模版配置
 */

import tiged from 'tiged';
import chalk from 'chalk';

// 仓库模版前缀
const prefix = 'promonkeyli/program-template';

// 模版列表
const templateList = [
    {
        name: 'mobile-taro',
        description: 'A mobile app template built with Taro v4, TailwindCSS, Axios, and Zustand.',
        repoPath: `${prefix}/frontend/mobile-taro`,
    },
    {
        name: 'admin-react',
        description: 'A modern admin dashboard template built with React 19.2, TanStack Router, TanStack Query, shadcn/ui, TailwindCSS, and Zustand.',
        repoPath: `${prefix}/frontend/admin-react`,
    },
    {
        name: 'admin-gin',
        description: 'A production-ready admin backend template built with Go, Gin, GORM, PostgreSQL, Redis, and MongoDB.',
        repoPath: `${prefix}/backend/admin-gin`,
    }
]

// 命令行选择列表
export const choicesList = templateList.map(item => {
    return {
        title: item.name,
        description: item.description,
        value: item.name
    }
})

/**
 * @description 从github拉取模板
 * @param templateName 模版名称
 * @param targetDir 目标路径
 * @example
 * // 拉取整个仓库
 * await pullTemplate('mobile-taro', './my-project')
 * 
 * // 拉取指定分支
 * await pullTemplate('mobile-taro#dev', './my-project')
 * 
 * // 拉取指定子目录
 * await pullTemplate('mobile-taro#master/packages/create-clear', './my-project')
 * 
 * // 拉取指定分支的子目录
 * await pullTemplate('mobile-taro#dev/packages/create-clear', './my-project')
 */
export const pullTemplate = async (templateName: string, targetDir: string): Promise<void> => {

    const repoPath = templateList.find(item => item.name === templateName)?.repoPath;
    if (!repoPath) {
        throw new Error(`模版 ${templateName} 不存在`);
    }
  console.log(chalk.blue("拉取模版中..."));

  const emitter = tiged(repoPath, {
    disableCache: true,
    force: true,
    verbose: false,
  });

  try {
    await emitter.clone(targetDir);
    console.log(chalk.green("✔ 拉取成功"));
  } catch (error: any) {
    console.error(chalk.red(`✖ 拉取失败: ${error.message}`));
    throw error;
  }
};
