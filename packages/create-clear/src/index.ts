#!/usr/bin/env node
import prompts from "prompts"
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'fs-extra';
import chalk from "chalk";

async function init() {
    try {
        const response = await prompts([{
            type: 'text',
            name: 'projectName',
            message: 'What is the name of project ?',
            validate: (dir) => validPackageName(dir) || 'Invalid project name',
        }, {
            type: 'select',
            name: 'template',
            message: 'Pick a project template',
            choices: [
                {title: 'React', description: 'This a react project template', value: 'template-react'},
                {title: 'Next', description: 'This a next project template', value: 'template-next'}
            ],
            initial: 0
        }]);
        const {projectName, template} = response
        const templateDir = path.resolve(
            fileURLToPath(import.meta.url),
            '../..',
            `${template}`,
        );
        const targetDir = `${process.cwd()}/${projectName}`; // 目标路径
        await fs.copy(templateDir, targetDir)
         // npm包发布的npmrc以及gitignore文件会被默认忽略，需要重命名
        await fs.move(`${targetDir}/_gitignore`, '${targetDir}/.gitignore', { overwrite: true });
        await fs.move(`${targetDir}/_npmrc`, '${targetDir}/.npmrc', { overwrite: true });
        
        console.log(chalk.green(`✔ successfully created the project !`));
    } catch (e) {
        console.error(e);
    }
}

function validPackageName(projectName: string): boolean {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName,
    )
}

init().catch(err => {
    console.error(err);
})
