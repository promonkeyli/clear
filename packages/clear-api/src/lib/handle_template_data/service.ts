/**
 * 处理 service 文件的模版数据
 */
import {
	handleBody,
	handleParams,
	replaceBracesWithDollar,
} from "../../utils/index.js";
import type { Operation, PathItem } from "../../utils/openAPI_type.js";

interface ServiceTplData {
	/* 请求库引用路径 */
	requestLibPath: string;
	/* 接口数据 */
	apiData: ApiDataItem[];
}
interface ApiDataItem {
	/* api名称 */
	name: string;
	/* api描述 */
	description: string;
	/* api路径 */
	path: string;
	/* api请求方法 */
	method: string;
	/* api header参数 */
	headers: Array<{ key: string; value: string }>;
	/* api 请求体body是否存在 */
	hasBody: boolean;
	/* api 请求体body类型 */
	bodyType: string;
	/* api 请求体body是否必须 */
	bodyRequired: boolean;
	/* api 查询参数params是否存在 */
	hasParams: boolean;
	/* api 查询参数params类型 */
	paramsType: ParamsType;
}
export interface ParamsType {
	/* 是否存在路径path参数 */
	inPath: boolean;
	/* 查询path参数数组 */
	pathArr: Array<PathAndQueryType>;
	/* 是否存在查询query参数 */
	inQuery: boolean;
	/* 查询query参数数组 */
	queryArr: Array<PathAndQueryType>;
}
export interface PathAndQueryType {
	/* 参数名称 */
	name: string;
	/* 参数描述 */
	description: string;
	/* 参数是否必传 */
	required: boolean;
	/* 参数类型 */
	type: string;
}

export function handleServiceTemplateData(
	requestLibPath: string,
	paths: { [path: string]: PathItem },
): ServiceTplData {
	const apiData: ApiDataItem[] = [];
	for (const pathKey in paths) {
		const pathValue = paths[pathKey];
		for (const methodKey in pathValue) {
			const operation = pathValue[methodKey] as Operation;
			// 请求体body处理
			const { hasBody, bodyType, bodyRequired, mimeType } =
				handleBody(operation);
			// console.log(operation.operationId, hasBody, bodyType);
			// 请求头处理
			const headers: Array<{ key: string; value: string }> = [];
			if (mimeType) {
				headers.push({
					key: "Content-Type",
					value: mimeType,
				});
			}
			// 请求params处理
			const { inPath, inQuery, queryArr, pathArr, hasParams } =
				handleParams(operation);

			const apiDataItem: ApiDataItem = {
				name: operation.operationId, // 生成的函数名称
				description: operation.description, // 函数的描述
				path: replaceBracesWithDollar(pathKey), // 请求url
				method: methodKey, // 请求方法
				hasBody,
				bodyType,
				bodyRequired,
				headers,
				hasParams,
				paramsType: {
					inPath,
					pathArr,
					inQuery,
					queryArr,
				},
			};
			apiData.push(apiDataItem);
		}
	}
	return {
		requestLibPath,
		apiData,
	};
}
