# Prompt Audit Module

本模块负责 Prompt 审计、同步防护、审计队列、策略探测和审计结果持久化接入。

## 文件索引

| 前缀 | 职责 |
| --- | --- |
| `prompt_config*`, `prompt_types*` | 配置和公共模型 |
| `prompt_runtime*`, `prompt_worker*`, `prompt_enqueue*` | 运行时、队列和 worker |
| `prompt_client*`, `prompt_probe*`, `prompt_qwen3guard*` | 审计客户端和探测 |
| `prompt_sync_guard*`, `prompt_outbound*` | 同步阻断和出站策略 |
| `prompt_handler*`, `prompt_middleware*` | 模块 HTTP 接入 |
| `prompt_payload_store*`, `prompt_repository*` | 载荷和审计记录端口 |
| `wire.go` | 模块依赖装配 |

同步热路径必须保持有界等待；异步审计不可因队列拥塞无限创建 goroutine。
审计关闭或处于同步阻断模式时不保留异步 worker；切换到异步审计后按
`worker_count` 动态启动。单机部署使用定期数据库配置收敛，不依赖跨实例 Pub/Sub。
异步模式关闭或缩容时停止领取新任务，
已领取任务继续完成；进程关机才取消在途扫描。

同步阻断使用按配置策略和分片内容 SHA-256 隔离的进程内结果缓存：缓存最多
8192 个规范化结果、TTL 为 5 分钟，不保存提示词正文。相同分片的并发未命中
会合并为一次 Guard 调用，缓存命中和合并等待者不占用网络调用舱壁；每个业务
请求仍独立聚合判断并执行审计记录。配置版本、节点、模型、凭据或扫描分类变化
都会形成新的缓存域。

同步 Guard 通过前，handler 不得选择业务账号、占用业务账号槽位、计费或向
模型上游发送任何预热/推测请求。降低首字等待只能优化 Guard 自身、复用确定性
审核结果或扩容审计节点，不能用提前请求业务上游隐藏审核延迟。
