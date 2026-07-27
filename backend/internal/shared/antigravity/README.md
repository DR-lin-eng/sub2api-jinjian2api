# antigravity

Antigravity 上游客户端与 Claude/Gemini 请求、响应、流和 schema 转换。文件按 `client`, `oauth`, `request_*`, `response_*`, `stream_*`, `*_types` 前缀组织。

`StreamingProcessor` 保留 SSE byte 输出；同进程协议桥接优先使用 `ProcessLineEvents` / `FinishEvents` typed sink，避免事件重复序列化和解析。
