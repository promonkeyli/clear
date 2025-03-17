/**
 * 模版渲染函数
 */
import fs from "node:fs";
import path from "node:path";
import handlebars from "handlebars";
import { LogColor, logAPI } from "./log_api.js";

export interface RenderTemplateOptions {
	/* 模版类型 */
	template: "index" | "service" | "type";
	/* 模版所需要的数据 */
	templateData: any;
	/* 生成的文件名称 */
	outFileName: string;
}

export function renderTemplate(options: RenderTemplateOptions) {
	const { template, templateData, outFileName } = options;
	// 1. 读取模版
	const __dirname = path.resolve(path.dirname(""));
	const templatePath = path.join(
		__dirname,
		"src",
		"template",
		`${template}.hbs`,
	);
	const data = fs.readFileSync(templatePath, "utf-8");
	// 2. 模版自定义一些助手函数
	handlebars.registerHelper("length0", (array) => array.length === 0);
	// 3. 编译、渲染模版
	const result = handlebars.compile(data)(templateData);
	// 4. 写入文件
	fs.writeFile(outFileName, result, (err) => {
		if (err) {
			logAPI(err.name, LogColor.Red);
		}
	});
}
