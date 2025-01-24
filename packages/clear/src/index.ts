#!/usr/bin/env node
import { setGenerateProgram } from "./command";
import { getPackageVersion } from "./utils";

import { Command } from "commander";
const program = new Command();

// package version
const version = getPackageVersion();

// 主命令
program
    .name('cr')
    .description(`A clear front-end cli（${version}）`)
    .version(version);

// cr 无参时，帮助信息显示
program
    .action(() => {
        program.outputHelp();
    });

// 设置子命令
setGenerateProgram(program)

// 解析命令行参数
// @ts-ignore
program.parse(process.argv);
