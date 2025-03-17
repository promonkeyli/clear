/**
 * 处理 typings.d.ts文件的模版数据
 */
import { convertSchemaToTypeScript } from "../../utils/index.js";
import type { OpenAPI3 } from "../../utils/openAPI_type.js";

type TypeTplDataItem = {
	/* schema名称 */
	name: string;
	/* schema 描述 */
	description: string;
	/* schema 类型 */
	type: string;
	/* schema 属性 */
	properties: PropertyItem[];
};
type PropertyItem = {
	/* 属性名称 */
	name: string;
	/* 属性描述 */
	description: string;
	/* 属性类型 */
	type: string;
	/* 是否是必要属性 */
	required: boolean;
};

export function handleTypeTemplateData(openAPI: OpenAPI3): {
	tplData: TypeTplDataItem[];
} {
	const typeTplData: TypeTplDataItem[] = [];
	// 提取 schemas, swagger2中称为 definitions, openAPI3 更换为 components => schemas
	const { schemas } = openAPI.components;
	for (const k in schemas) {
		const schema = schemas[k];

		// 1. schema name 处理
		let schemaName: string;
		if (k.includes(".")) {
			schemaName = k.split(".").at(-1);
		} else {
			schemaName = k;
		}

		// 2. schema type 处理，需要转换为 typescript 类型
		const schemaType = convertSchemaToTypeScript(schema);

		// 3.schema properties 处理
		const schemaProperties: PropertyItem[] = [];
		for (const pk in schema.properties) {
			const pValue = schema.properties[pk];
			const pType = convertSchemaToTypeScript(pValue);
			schemaProperties.push({
				name: pk,
				description: pValue.description,
				type: pType,
				// required: pValue.required[0] || false,
				required: false,
			});
		}

		// 4.数组组装
		const typeTplDataItem: TypeTplDataItem = {
			name: schemaName,
			description: schema.description,
			properties: schemaProperties,
			type: schemaType,
		};
		typeTplData.push(typeTplDataItem);
	}
	return { tplData: typeTplData };
}
