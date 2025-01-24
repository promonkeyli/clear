import { Command } from "commander";
import { generateComponentAction, generateServiceAction, generateStoreAction } from "../action";

export default function setGenerateProgram(program: Command){
    const generateProgram = program
        .command('generate')
        .alias("g")
        .description('generate usage: cr g [component, store, service] name');
    // 01: React 组件/页面生成
    generateProgram
        .command('component <name>')
        .alias('c')
        .description('Generate a new React component')
        .action((name) => {
            generateComponentAction(name)
        });
    // 02: Zustand store生成
    generateProgram
        .command('store <name>')
        .description('Generate a new zustand store')
        .alias('st')
        .action((name) => {
            generateStoreAction(name)
        });
    // 03: 前端服务生成
    generateProgram
        .command('service <name>')
        .alias('s')
        .description('Generate a new service')
        .action((name) => {
            generateServiceAction(name)
        });
}
