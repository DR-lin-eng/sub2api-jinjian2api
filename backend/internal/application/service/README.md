# Application Services

本包是现有业务兼容层，集中保存应用端口、核心用例和跨模块编排。package 名仍为 `service`，以保持现有构造器和调用方稳定。

## 文件索引

| 前缀 | 职责 |
| --- | --- |
| `account*`, `admin_account*`, `admin_group*` | 上游账号、分组与管理用例 |
| `auth*`, `api_key*`, `oauth*`, `token*`, `totp*`, `passkey*` | 单管理员会话、网关 Key 和上游凭据刷新 |
| `gateway*` | Anthropic/Claude 通用网关请求、调度、转发和用量成本 |
| `openai*` | OpenAI/Codex/Responses/Images/WS 管线 |
| `gemini*`, `grok*`, `antigravity*`, `bedrock*` | 各上游协议适配与重试 |
| `scheduler*`, `channel*`, `ratelimit*`, `concurrency*` | 调度、通道和并发控制 |
| `billing*`, `usage*`, `pricing*` | 成本计算、用量记录和统计 |
| `image_task*`, `image_storage*` | 异步图片任务与结果存储 |
| `ops*`, `audit*`, `content_moderation*` | 运维、审计和内容策略 |
| `setting*`, `notification*`, `backup*` | 配置、通知和维护用例 |
| `wire.go` | application provider 集合 |

### 核心拆分索引

| 文件组 | 职责 |
| --- | --- |
| `content_moderation.go` | 内容审核常量、传输模型、端口和服务状态 |
| `content_moderation_config_api.go`, `content_moderation_config_rules.go`, `content_moderation_validation.go` | 配置读写、默认规则和校验 |
| `content_moderation_check.go`, `content_moderation_queue.go` | 同步审核决策与异步任务处理 |
| `content_moderation_runtime.go`, `content_moderation_cleanup.go`, `content_moderation_admin.go` | 运行快照、清理和管理查询 |
| `content_moderation_client.go`, `content_moderation_key_health.go` | 上游审核 API 和密钥健康状态 |
| `content_moderation_side_effects.go`, `content_moderation_cyber_policy.go` | 命中后的审计、通知和网络安全事件处理 |
| `content_moderation_test_input.go` | 管理端测试输入和确定性评分辅助 |
| `setting_parse.go`, `setting_parse_core.go` | 持久设置默认值、解析编排与基础站点设置 |
| `setting_parse_features.go`, `setting_parse_gateway.go`, `setting_parse_notifications.go` | 网关功能、调度与通知设置 |
| `setting_update.go`, `setting_update_prepare.go` | 持久设置更新编排、首错顺序与跨域预处理 |
| `setting_update_core.go`, `setting_update_product.go` | 单管理员产品设置写入 |
| `setting_update_gateway.go`, `setting_update_notifications.go` | 网关调度、通知与平台额度设置写入 |

## 拆分约定

单个功能按 `types/plan/request/forward/response/billing/runtime` 职责拆文件，不按“公共 helper”堆积。新增功能若不需要访问本包大量私有状态，应建立 `modules/<domain>` 并通过接口接入。

本包禁止导入 `internal/infrastructure/repository`；例外只能在 lint 配置中显式记录并附迁移原因。

内容审计的队列与 worker 按运行快照惰性启动；全局风控关闭、内容审计禁用或
`mode=off` 时不预分配大队列，也不保留 worker。运行时配置关闭或缩容会先完成
已接受的记录任务；进程关机仍通过生命周期上下文取消在途 I/O 并有界退出。
已确认关闭的运行快照也会让网关跳过审计请求对象与日志构造；未知或加载失败状态
保持保守路径并继续进入审计检查。
