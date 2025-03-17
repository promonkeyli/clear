import type { OpenAPI3 } from "./openAPI_type.js";

export type Swagger2Doc = {
	swagger: string;
	info: {
		title: string;
		version: string;
		description?: string;
	};
	paths: {
		[key: string]: {
			get?: Operation;
			post?: Operation;
			put?: Operation;
			delete?: Operation;
			options?: Operation;
			head?: Operation;
			patch?: Operation;
		};
	};
};

type Operation = {
	summary?: string;
	description?: string;
	parameters?: Parameter[];
	responses: {
		[key: string]: ApiResponse; // 使用 ApiResponse
	};
};

type Parameter = {
	name: string;
	in: "query" | "header" | "path" | "body" | "formData";
	required?: boolean;
	type?: string;
	schema?: any; // 更复杂的结构
	description?: string;
};

type ApiResponse = {
	description: string;
	content?: {
		// 添加 content 属性
		[mediaType: string]: {
			schema?: Schema; // 确保使用 Schema 类型
		};
	};
};

// 添加 Schema 类型定义
type Schema = {
	type: string;
	properties?: { [key: string]: any };
};

export function convertSwaggerToOpenAPI(swaggerDoc: Swagger2Doc): OpenAPI3 {
	const openApiDoc: OpenAPI3 = {
		openapi: "3.0.0",
		info: {
			title: swaggerDoc.info.title,
			version: swaggerDoc.info.version,
			description: swaggerDoc.info.description,
		},
		paths: {},
	};

	for (const [path, methods] of Object.entries(swaggerDoc.paths)) {
		openApiDoc.paths[path] = {};

		for (const [method, operation] of Object.entries(methods)) {
			if (operation) {
				const openApiOperation: Operation = {
					summary: operation.summary,
					description: operation.description,
					parameters: operation.parameters?.map((param) => {
						const openApiParam: Parameter = {
							name: param.name,
							in: param.in as Parameter["in"], // 这里确保类型匹配
							required: param.required,
							schema: {
								type: param.type || "string",
								properties: param.schema?.properties,
							},
						};
						return openApiParam;
					}),
					responses: {},
				};

				// 处理响应
				for (const [statusCode, response] of Object.entries(
					operation.responses,
				)) {
					openApiOperation.responses[statusCode] = {
						description: response.description,
						content: response.content // 使用响应的 content
							? response.content
							: undefined,
					};
				}

				openApiDoc.paths[path][method] = openApiOperation;
			}
		}
	}

	return openApiDoc;
}
