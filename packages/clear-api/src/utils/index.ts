/**
 * 公共方法
 */
import fs from "node:fs";
import path from "node:path";
import type {
	ParamsType,
	PathAndQueryType,
} from "../lib/handle_template_data/service.js";
import type { MediaType, Operation, PathItem, Schema } from "./openAPI_type.js";

/* 检查目录是否存在 */
export function directoryExists(dirPath: string): boolean {
	return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

/* 删除目录中的所有内容 */
export function deleteAllInDirectory(dirPath: string) {
	if (directoryExists(dirPath)) {
		// 读取目录中的所有文件和子目录
		const files = fs.readdirSync(dirPath);

		for (const file of files) {
			const filePath = path.join(dirPath, file);
			// 检查是否是目录
			if (fs.statSync(filePath).isDirectory()) {
				// 如果是目录，递归删除内容
				deleteAllInDirectory(filePath);
				// 删除空目录
				fs.rmdirSync(filePath);
			} else {
				// 如果是文件，直接删除
				fs.unlinkSync(filePath);
			}
		}
	}
}

/* 创建目录(包括所有父目录) */
export function createAllDirectory(dirPath: string) {
	const normalizedPath = path.resolve(dirPath);
	if (!fs.existsSync(normalizedPath)) {
		createAllDirectory(path.dirname(normalizedPath));
		fs.mkdirSync(normalizedPath);
	}
}

/* openAPI schema type => typeScript 类型 */
export function convertSchemaToTypeScript(schema: Schema): string {
	switch (schema.type) {
		case "string":
			return "string";
		case "number":
			return "number";
		case "integer":
			return "number"; // TypeScript 中 integer 也用 number 表示
		case "boolean":
			return "boolean";
		case "array":
			if (schema.items) {
				return `${convertSchemaToTypeScript(schema.items)}[]`;
			}
			return "any[]";
		case "object":
			if (schema.properties) {
				const properties = Object.entries(schema.properties)
					.map(([key, value]) => `${key}: ${convertSchemaToTypeScript(value)}`)
					.join("; ");
				return `{ ${properties} }`;
			}
			return "{}";
		default:
			if (schema.enum) {
				return schema.enum.map((value) => JSON.stringify(value)).join(" | ");
			}
			return "any"; // 默认返回 any 类型
	}
}

/* openapi 按照tag 分类paths */
export function getPathsByTag(
	tag: string,
	paths: { [path: string]: PathItem },
): { [path: string]: PathItem } {
	const filterPaths: { [path: string]: PathItem } = {};
	for (const pathKey in paths) {
		const pathValue = paths[pathKey];
		const [_, firstValue] = Object.entries(pathValue)[0];
		const currentTag = firstValue.tags[0];
		if (currentTag === tag) {
			filterPaths[pathKey] = pathValue;
		}
	}
	return filterPaths;
}

/* ur中path {} => ${} */
export function replaceBracesWithDollar(url: string): string {
	if (!url.includes("{")) return url; // 提前返回
	return url.replace(/{(.*?)}/g, "${$1}");
}

/* 处理body */
export function handleBody(o: Operation): {
	hasBody: boolean;
	bodyType: string;
	bodyRequired: boolean;
	mimeType: string;
} {
	const hasBody = !!o.requestBody;
	if (!hasBody) {
		return {
			hasBody: false,
			bodyRequired: false,
			bodyType: "",
			mimeType: "",
		};
	}
	const bodyRequired = o.requestBody.required;
	const content = o.requestBody.content;
	// 存在多个mime type 取其中一个就可
	let bodyType: string;
	let mimeType: string;
	let mediaType: MediaType;

	if (content) {
		if (content["application/json"]) {
			mimeType = "application/json";
			mediaType = content["application/json"];
		} else {
			// 没有 application/json，取其中任意一项
			const k = Object.keys(content)[0];
			mediaType = content[k];
			mimeType = k;
		}
		if (mediaType.schema.$ref) {
			bodyType = `API.${getSchemaRefTypeString(mediaType.schema.$ref)}`;
		} else {
			bodyType = convertSchemaToTypeScript(mediaType.schema);
		}
	}

	return {
		hasBody,
		bodyRequired,
		bodyType,
		mimeType,
	};
}

/* schema 中 $ref引用类型string剥离 */
export function getSchemaRefTypeString(ref: string): string {
	return ref.split("/").at(-1);
}

/* 处理params */
export function handleParams(
	o: Operation,
): ParamsType & { hasParams: boolean } {
	const params = o.parameters || [];
	const hasParams = params.length !== 0;
	let inPath = false;
	let inQuery = false;
	const pathArr: Array<PathAndQueryType> = [];
	const queryArr: Array<PathAndQueryType> = [];
	if (hasParams) {
		for (const param of params) {
			if (param.in === "path") {
				inPath = true;
				const pathItem: PathAndQueryType = {
					name: param.name,
					description: param.description,
					required: param.required,
					type: convertSchemaToTypeScript(param.schema),
				};
				pathArr.push(pathItem);
			}
			if (param.in === "query") {
				inQuery = true;
				const queryItem: PathAndQueryType = {
					name: param.name,
					description: param.description,
					required: param.required,
					type: convertSchemaToTypeScript(param.schema),
				};
				queryArr.push(queryItem);
			}
		}
	}
	return {
		hasParams,
		inPath,
		inQuery,
		pathArr,
		queryArr,
	};
}
