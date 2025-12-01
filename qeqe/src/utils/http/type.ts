export interface ResponseData<T = any> {
    code: number;        // 业务状态码
    message: string;     // 描述信息
    data: T;             // 实际数据
    success: boolean;    // 是否成功
    timestamp: number;   // 服务器时间戳
}
