import path from "node:path";
import { getPathsByTag } from "../utils/index.js";
import { LogColor, logAPI } from "../utils/log_api.js";
import type { PathItem } from "../utils/openAPI_type.js";
import { renderTemplate } from "../utils/render_template.js";
import { convertToOpenAPI } from "./convert_to_openAPI.js";
import { createDirectory } from "./create_directory.js";
import { handleIndexTemplateData } from "./handle_template_data/index.js";
import { handleServiceTemplateData } from "./handle_template_data/service.js";
import { handleTypeTemplateData } from "./handle_template_data/type.js";

export interface GenerateAPIOptions {
	/* openAPI 文档路径 */
	docUrl: string;
	/* 请求库 引用路径 */
	requestLibPath: string;
	/* 输出目录名称(默认: 根目录下) */
	outDir: string;
}
export async function generateAPI(options: GenerateAPIOptions) {
	const { docUrl, requestLibPath } = options;
	// 1. 转换openAPI
	const openapi = await convertToOpenAPI(docUrl);
	logAPI("OPEN API 数据转换完成！", LogColor.Green);

	// 2. 创建目录
	const rootPath = process.cwd();
	let apiPath: string;
	if (options?.outDir === "") {
		apiPath = path.join(rootPath, "api");
	} else {
		apiPath = path.join(rootPath, options.outDir, "api");
	}
	createDirectory(apiPath);

	// 3. 依据模版渲染 index.ts 文件(用于导出所有生成的controller接口文件)
	renderTemplate({
		template: "index",
		templateData: handleIndexTemplateData(openapi),
		outFileName: path.join(apiPath, "index.ts"),
	});
	// 4. 依据模版渲染 typings.d.ts 文件(用于导出openAPI生成的类型文件)
	renderTemplate({
		template: "type",
		templateData: handleTypeTemplateData(openapi),
		outFileName: path.join(apiPath, "typing.d.ts"),
	});
	// 5. 依据模版渲染 各个controller接口文件(依据 openAPI paths数据生成); 循环tags生成接口文件
	const tags = openapi.tags || [];
	for (const { name: tagName } of tags) {
		// 获取指定tag的paths
		const paths: { [path: string]: PathItem } = getPathsByTag(
			tagName,
			openapi.paths,
		);
		renderTemplate({
			template: "service",
			templateData: handleServiceTemplateData(requestLibPath, paths),
			outFileName: path.join(apiPath, `${tagName}.ts`),
		});
	}
}
