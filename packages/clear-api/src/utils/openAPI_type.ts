/**
 * 自定义openAPI3类型
 */
export interface OpenAPI3 {
	/* OpenAPI 版本 */
	openapi: string;
	/* API 信息 */
	info: Info;
	/* 服务器列表 */
	servers?: Server[];
	/* 路径定义 */
	paths: { [path: string]: PathItem };
	/* 组件定义 */
	components?: Components;
	/* 安全定义 */
	security?: SecurityRequirement[];
	/* 标签定义 */
	tags?: Tag[];
}

export interface Info {
	/* API 标题 */
	title: string;
	/* API 版本 */
	version: string;
	/* 描述 */
	description?: string;
	/* 服务条款 */
	termsOfService?: string;
	/* 联系信息 */
	contact?: Contact;
	/* 许可证信息 */
	license?: License;
}

export interface Server {
	/* 服务器 URL */
	url: string;
	/* 描述 */
	description?: string;
}

export interface PathItem {
	/* GET 操作 */
	get?: Operation;
	/* POST 操作 */
	post?: Operation;
	/* PUT 操作 */
	put?: Operation;
	/* DELETE 操作 */
	delete?: Operation;
	/* OPTIONS 操作 */
	options?: Operation;
	/* HEAD 操作 */
	head?: Operation;
	/* PATCH 操作 */
	patch?: Operation;
	/* TRACE 操作 */
	trace?: Operation;
	/* CONNECT 操作 */
	connect?: Operation;
}

export interface Operation {
	/* 概述 */
	summary?: string;
	/* 描述 */
	description?: string;
	/* 操作 ID */
	operationId?: string;
	/* 参数列表 */
	parameters?: Parameter[];
	/* 响应定义 */
	responses: { [statusCode: string]: Response };
	/* 安全定义 */
	security?: SecurityRequirement[];
	/* 请求体 */
	requestBody?: RequestBody;
	/* 标签 */
	tags?: string[];
	/* 过时标志 */
	deprecated?: boolean;
	/* 服务器 */
	servers?: Server[];
}
export interface RequestBody {
	/* 请求体的描述 */
	description?: string;
	/* 是否必需 */
	required?: boolean;
	/* 内容类型 */
	content: { [mediaType: string]: MediaType };
}
export interface Parameter {
	/* 参数名称 */
	name: string;
	/* 参数位置 */
	in: "query" | "header" | "path" | "cookie";
	/* 是否必需 */
	required?: boolean;
	/* 参数描述 */
	description?: string;
	/* 参数类型 */
	schema: Schema;
}

export interface Response {
	/* 响应描述 */
	description: string;
	/* 内容定义 */
	content?: { [mediaType: string]: MediaType };
}
export type SchemaType =
	| "object"
	| "array"
	| "string"
	| "number"
	| "boolean"
	| "integer"
	| "null";
export interface Schema {
	/* 数据类型 */
	type: SchemaType;
	/* 属性 */
	properties?: { [key: string]: Schema };
	/* 是否必需 */
	required?: boolean[];
	/* 数组项的类型 */
	items?: Schema;
	/* 描述 */
	description?: string;
	/* 默认值 */
	default?: any;
	/* 示例值 */
	example?: any;
	/* 枚举值 */
	enum?: any[];
	/* 额外的属性 */
	additionalProperties?: boolean | Schema;
	/* 格式 */
	format?: string;
	/* 约束条件 */
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: number;
	exclusiveMaximum?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	/* 组合条件 */
	oneOf?: Schema[];
	allOf?: Schema[];
	anyOf?: Schema[];
	not?: Schema;
	/* 引用其他定义 */
	$ref?: string;
}

export interface MediaType {
	/* 媒体类型的 schema */
	schema: Schema;
}

export interface SecurityRequirement {
	/* 安全需求 */
	[name: string]: string[];
}

export interface Components {
	/* 组件中的 schema */
	schemas?: { [name: string]: Schema };
}

export interface Contact {
	/* 联系人名称 */
	name?: string;
	/* 联系人 URL */
	url?: string;
	/* 联系人电子邮件 */
	email?: string;
}

export interface License {
	/* 许可证名称 */
	name: string;
	/* 许可证 URL */
	url?: string;
}
export interface Tag {
	/* 标签名称 */
	name: string;
	/* 标签描述 */
	description?: string;
}
