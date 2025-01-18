import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path, { dirname, join } from 'node:path';
import fs from 'fs-extra';
import Handlebars from "handlebars";

/**
 * @description 获取当前项目下 package.json 的 version 信息
 * @returns {string} package.json 中的 version 字段
 */
export function getPackageVersion() {
    // 创建 require 函数
    const nodeRequire = createRequire(import.meta.url);
    // 获取当前模块的目录路径
    const __dirname = dirname(fileURLToPath(import.meta.url));
    // 假设 package.json 在项目根目录（当前模块的上级目录）
    const packageJsonPath = join(__dirname, '../package.json');
    try {
        // 加载 package.json
        const packageJson = nodeRequire(packageJsonPath);
        // 返回 version 字段
        return packageJson.version;
    } catch (error: any) {
        console.error('Failed to load package.json:', error?.message);
        throw new Error('Could not find or parse package.json');
    }
}

/**
 * @description 将 HBS 模板文件渲染并输出到对应的文件内
 * @param {string} templatePath - HBS 模板文件的路径
 * @param {string} outputPath - 输出文件的路径
 * @param {object} data - 渲染模板时使用的数据
 */
export async function renderHbsToFile(templatePath: string, outputPath: string, data: any = {}) {
    try {
        // 读取 HBS 模板文件
        const templateContent = await fs.readFile(templatePath, 'utf8');
        // 编译模板
        const template = Handlebars.compile(templateContent);
        // 渲染模板
        const renderedContent = template(data);
        // 确保输出目录存在（fs-extra 会自动创建不存在的目录）
        await fs.ensureDir(path.dirname(outputPath));
        // 将渲染结果写入输出文件
        await fs.writeFile(outputPath, renderedContent, 'utf8');
    } catch (error) {
        console.error('渲染或写入文件时出错：', error);
    }
}

/**
 * @description 驼峰、下划线或连字符命名的变量，全部转成帕斯卡命名
 * @param {string} str - 需要进行帕斯卡命名转换的单词
 */
export function transformVariableName(str: string) {
    // 转换为帕斯卡命名
    const pascalCase = str
        .replace(/[_-]/g, ' ') // 将下划线或连字符替换为空格
        .replace(/\b\w/g, (match) => match.toUpperCase()) // 每个单词首字母大写
        .replace(/\s+/g, ''); // 去掉空格

    // 转换为中划线分割命名
    const kebabCase = str
        .replace(/([a-z])([A-Z])/g, '$1-$2') // 在驼峰命名处插入中划线
        .replace(/[_\s]/g, '-') // 将下划线或空格替换为中划线
        .toLowerCase(); // 全部转换为小写
    return { pascalCase, kebabCase };
}

/**
 * @description 繁获取当前模块文件的目录路径
 */
export function getDirname() {
    return path.dirname(fileURLToPath(import.meta.url));
}
