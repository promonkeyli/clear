#!/usr/bin/env node
import prompts from "prompts"
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import fs from 'fs-extra';
import { console } from "node:inspector";

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
                { title: 'React', description: 'This a react project template', value: 'template-react' },
                { title: 'Next', description: 'This a next project template', value: 'template-next' }
            ],
            initial: 0
        }]);
        const { projectName, template } = response

        const __filename = fileURLToPath(import.meta.url);
        const sourceRootPath = dirname(__filename);
        const sourceDir = `${sourceRootPath}/${template}`; // 模版所在目录
        const targetDir = `${process.cwd()}/${projectName}`; // 目标路径
        console.log(sourceDir, targetDir);
        await fs.copy(sourceDir, targetDir)
    } catch (e) {
        console.error(e);
    }
}

function validPackageName(projectName) {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName,
    )
}

init().catch(error => {
    console.error(error)
})
