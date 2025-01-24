import path from "path";
import { getDirname, renderHbsToFile, transformVariableName } from "../utils";

export default async function generateStoreAction(name: string){
    const { pascalCase: storeName, kebabCase: fileName } = transformVariableName(name)
    const fileData = {
        created: new Date().toISOString().split('T')[0],
        storeName,
    }
    // 当前路径（需要输出文件夹的路径）
    const outPath = path.join(process.cwd(), `${fileName}.store.ts`);
    // 组件 template 所在路径
    const tplPath = path.join(getDirname(), "../src", 'template/store/store.hbs');
    try {
        await renderHbsToFile(tplPath, outPath, fileData)
        console.log(`Zustand ${fileName} 模版文件已生成成功 ！`)
    } catch (error: any){
        console.error(error)
    }
}
