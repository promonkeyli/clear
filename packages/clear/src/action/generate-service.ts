import path from "path";
import { ILog, getDirname, renderHbsToFile, transformVariableName } from "../utils";

export default async function generateServiceAction(name: string) {
    const { pascalCase: serviceName, kebabCase: fileName } = transformVariableName(name)
    const fileData = {
        created: new Date().toISOString().split('T')[0],
        serviceName,
    }
    // 当前路径（需要输出文件夹的路径）
    const outPath = path.join(process.cwd(), `${fileName}.service.ts`);
    // 组件 template 所在路径
    const tplPath = path.join(getDirname(), "../src", 'template/service/service.hbs');
    try {
        await renderHbsToFile(tplPath, outPath, fileData)
        ILog(`✔ Service ${fileName} 模版文件已生成成功 !`, { color: "green" })
    } catch (error: any) {
        console.error(error)
    }
}
