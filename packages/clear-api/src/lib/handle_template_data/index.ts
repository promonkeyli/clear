/**
 * 处理 index.ts文件的模版数据
 */
import type { OpenAPI3 } from "../../utils/openAPI_type.js";

export function handleIndexTemplateData(openAPI: OpenAPI3): {
	tplData: string[];
} {
	const tags = openAPI.tags || [];
	return { tplData: tags.map((i) => i.name) };
}
