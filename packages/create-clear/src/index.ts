#!/usr/bin/env node
import prompts from "prompts"
import { choicesList, pullTemplate } from "./template";

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
            choices: choicesList,
            initial: 0
        }]);
        const { projectName, template } = response // 项目名称和模版名称
        const targetDir = `${process.cwd()}/${projectName}`; // 目标路径
          console.log(projectName, template, targetDir)
        pullTemplate(template, targetDir)
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
