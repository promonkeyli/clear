/**
 * 旧版本的swagger2 转换为 openAPI3
 */
import fetch from "node-fetch";
import swagger2openapi from "swagger2openapi";
import { LogColor, logAPI } from "../utils/log_api.js";
import type { OpenAPI3 } from "../utils/openAPI_type.js";

export async function convertToOpenAPI(docUrl: string): Promise<OpenAPI3> {
	try {
		const res = await fetch(docUrl).then((res) => res.json());
		const o = await swagger2openapi.convertObj(res, {});
		return o.openapi;
	} catch (e) {
		logAPI(e, LogColor.Red);
	}
}
