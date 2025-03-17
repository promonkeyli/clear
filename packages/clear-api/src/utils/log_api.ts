/**
 * 日志记录
 */
export enum LogColor {
	/* 重置颜色 */
	Reset = "\x1b[0m",
	/* 黑色文本 */
	Black = "\x1b[30m",
	/* 红色文本 */
	Red = "\x1b[31m",
	/* 绿色文本 */
	Green = "\x1b[32m",
	/* 黄色文本 */
	Yellow = "\x1b[33m",
	/* 蓝色文本 */
	Blue = "\x1b[34m",
	/* 洋红文本 */
	Magenta = "\x1b[35m",
	/* 青色文本 */
	Cyan = "\x1b[36m",
	/* 白色文本 */
	White = "\x1b[37m",
}
export function logAPI(msg: string, color = LogColor.White) {
	const m = `${color}[API]: ${msg} ${LogColor.Reset}\n`;
	console.log(m);
}
