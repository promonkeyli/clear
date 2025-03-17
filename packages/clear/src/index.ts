#!/usr/bin/env node
import { setGenerateProgram } from "./command";
import { getPackageVersion } from "./utils";
import { Command } from "commander";

const program = new Command();

// package version
const version = getPackageVersion();

const log = `
================= Welcome to clear cli Power By Young @2025 ! =================

This is a front-end scaffolding tool, used to generate project development templates.
`
// 主命令
program
    .name('cr')
    .description(`A clear front-end cli(${version})`)
    .version(version);

// cr 无参时，帮助信息显示
program
    .action(() => {
        console.log(`\x1b[32m${log}\x1b[0m`)
        // 输出帮助信息
        program.outputHelp();
    });
// 设置子命令
setGenerateProgram(program)

// 解析命令行参数
// @ts-ignore
program.parse(process.argv);
