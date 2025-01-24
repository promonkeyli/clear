import path from "path";
import { ILog, getDirname, renderHbsToFile, transformVariableName } from "../utils";

export default async function generateComponentAction(name: string) {
    const { pascalCase: componentName, kebabCase: fileName } = transformVariableName(name)
    const fileData = {
        created: new Date().toISOString().split('T')[0],
        componentName,
    }
    // 当前路径（需要输出文件夹的路径）
    const outPath = path.join(process.cwd(), fileName);
    // 组件 template 所在路径
    const templateDirPath = path.join(getDirname(), "../src", 'template/component');

    const tsxTplPath = path.join(templateDirPath, 'tsx.hbs');
    const tsxTargetFilePath = path.join(outPath, 'index.tsx');

    const interfaceTplPath = path.join(templateDirPath, 'interface.hbs');
    const interfaceTargetFilePath = path.join(outPath, 'interface.ts');

    const storeTplPath = path.join(templateDirPath, 'store.hbs');
    const storeTargetFilePath = path.join(outPath, 'store.ts');

    try {
        await renderHbsToFile(tsxTplPath, tsxTargetFilePath, fileData)
        await renderHbsToFile(interfaceTplPath, interfaceTargetFilePath, fileData)
        await renderHbsToFile(storeTplPath, storeTargetFilePath, fileData)
        ILog(`✔ React ${fileName} 模版文件已生成成功！`, { color: "green" })
    } catch (error: any) {
        console.error(error)
    }
}
