# Sub2API 代码地图

本文按“要改什么”组织入口，目标是在不读取整个仓库的情况下快速缩小上下文。表中路径是起点，不代表修改只限于单个文件。

## 一分钟定位

| 任务 | 先读 | 继续追踪 | 优先测试 |
| --- | --- | --- | --- |
| 服务启动、依赖注入 | `backend/cmd/server/main.go`, `wire.go` | 各层 `wire.go`、`server/router.go` | `go test ./cmd/server/...` |
| 新增浏览器/管理 API | `server/routes/user.go` 或 `admin.go` | 对应 handler、application service、repository | 路由测试 + handler/service 测试 |
| 修改 API Key 鉴权 | `server/middleware/api_key_auth.go` | `application/service/api_key*`, `infrastructure/repository/api_key*` | middleware + gateway route 测试 |
| 修改 JWT/管理员鉴权 | `server/middleware/jwt_auth.go`, `admin_auth.go` | `handler/auth*`, `application/service/auth*` | auth/middleware 测试 |
| 修改 Claude/Anthropic 网关 | `routes/gateway.go`, `handler/gateway_handler_messages.go` | `application/service/gateway*` | gateway handler + service 测试 |
| 修改 OpenAI/Codex/Responses | `handler/openai_gateway_responses.go` | `application/service/openai*` | responses/chat/WS 的流式与非流式测试 |
| 修改 Gemini/Antigravity/Grok | `routes/gateway.go` | `application/service/gemini*`, `antigravity*`, `grok*` | 平台专项 service/handler 测试 |
| 修改账号调度 | `application/service/gateway_scheduling.go`, `openai_account_scheduler.go` | `infrastructure/repository/scheduler*`, `concurrency*` | scheduler、并发、失败切换测试和 benchmark |
| 修改成本计算/用量记录 | `application/service/gateway_usage_billing.go`, `openai_gateway_usage.go` | `billing_service.go`, `infrastructure/repository/usage_log*` | billing unit + usage repository integration |
| 修改上游额度探测 | `application/service/upstream_quota*`, `upstream_billing*` | `account_repo_quota.go`, `account_repo_upstream_billing*` | 上游解析、持久快照与管理 UI 测试 |
| 修改数据库表 | `backend/ent/schema/` | `backend/migrations/`, repository, DTO | generate + migration/integration tests |
| 修改运行配置 | `platform/config/` | `deploy/config.example.yaml`, setting service/admin UI | config tests + 相关 service/前端测试 |
| 修改 Ops | `handler/admin/ops*`, `application/service/ops*` | `repository/ops*`, 前端 `features/admin-ops/` | query/service + 前端 feature 测试 |
| 修改前端页面 | `frontend/src/core/routes/index.ts`, `features/<domain>/presentation/pages/` | 同 feature 的 `widgets/`, `composables/`, `stores/`, `data/datasources/` 与 `core/i18n/` | 相邻 spec + typecheck |

## 后端功能前缀

`backend/internal/application/service/` 是现阶段最大的兼容包。先按文件名前缀缩小范围，再读取结构体、构造器和相邻测试。

| 前缀 | 主要职责 |
| --- | --- |
| `gateway*` | Anthropic 兼容请求解析、平台选择、转发、响应和用量 |
| `openai*` | OpenAI/Codex/Responses/Images/WS 请求与调度 |
| `gemini*`, `antigravity*`, `grok*`, `bedrock*` | 平台协议、凭据、限额和错误策略 |
| `account*`, `group*`, `channel*` | 上游账号、分组和渠道配置 |
| `scheduler*`, `concurrency*`, `priority_admission*` | 候选选择、槽位、优先级与背压 |
| `billing*`, `usage*`, `pricing*` | 价格解析、成本计算、用量记录和统计 |
| `auth*`, `api_key*`, `oauth*`, `token*`, `totp*`, `passkey*` | 单管理员会话、网关 Key 和各平台凭据 |
| `ops*` | 运维指标、告警和维护任务 |
| `setting*`, `notification*`, `backup*` | 持久设置、通知和维护任务 |
| `image_task*`, `image_storage*` | 异步图片任务和结果存储 |

同一前缀通常按 `request`, `scheduling`, `forward`, `response`, `usage`, `support` 等职责拆分。不要先打开该前缀所有文件；从公开入口函数追调用即可。

## Repository 前缀

`backend/internal/infrastructure/repository/` 保存端口实现：

| 前缀 | 主要存储/资源 |
| --- | --- |
| `account*`, `group*`, `api_key*`, `user*` | 上游账号、路由分组、网关 Key 与唯一管理员 |
| `usage_log*` | 用量写入、幂等批处理和成本统计 |
| `scheduler*`, `concurrency*`, `session_limit*`, `rpm_cache*` | Redis 调度和限流状态 |
| `ops*`, `channel_monitor*` | 运维聚合和探测 |
| `http_upstream*`, `proxy*`, `*_oauth_*` | 外部 HTTP、代理和凭据访问 |

复杂 repository 按 `query`, `command`, `cache`, `batch`, `recovery` 拆分。事务边界应留在同一个公开 repository 方法内。

## HTTP 入口

| 目录/文件 | 说明 |
| --- | --- |
| `transport/http/server/router.go` | 全局中间件、嵌入式前端和路由聚合 |
| `server/routes/common.go` | 健康检查与公共入口 |
| `server/routes/auth.go` | 本地管理员登录与会话 |
| `server/routes/user.go` | 唯一管理员资料、安全设置、API Key 与用量 API |
| `server/routes/admin.go` | 管理 API |
| `server/routes/gateway.go` | API Key 模型网关和平台别名 |
| `transport/http/handler/` | 单管理员、网关和通用 handler |
| `transport/http/handler/admin/` | 管理 handler |
| `transport/http/handler/dto/` | 输入输出 DTO 与实体映射 |

不要依据 README 猜完整端点。需要精确接口时直接在 routes 中搜索 HTTP 方法或路径：

```sh
rg -n '\.(GET|POST|PUT|PATCH|DELETE)\(' backend/internal/transport/http/server/routes
rg -n '"/api/v1|"/v1|"/responses' backend/internal/transport/http/server/routes
```

## 前端地图

| 任务 | 路径 |
| --- | --- |
| 应用启动 | `frontend/src/main.ts`, `App.vue` |
| 路由与访问元数据 | `frontend/src/core/routes/index.ts`, `meta.d.ts` |
| 管理功能 | `frontend/src/features/admin-*/`，各 feature 下分 `data/` 与 `presentation/` |
| 管理员自助功能 | `frontend/src/features/keys/`, `usage/`, `profile/`, `passkeys/` |
| 登录 | `frontend/src/features/auth/presentation/` 与 `data/datasources/authDatasource.ts` |
| 公共页与首次设置 | `frontend/src/common/pages/`, `features/setup/` |
| 领域组件与交互 | `frontend/src/features/<domain>/presentation/widgets/`, `composables/` |
| 跨功能 UI 与交互 | `frontend/src/common/widgets/`, `common/composables/` |
| HTTP/session 客户端 | `frontend/src/core/networks/client.ts`, `tokenStore.ts`, `sessionRefresh.ts` |
| 具体 API | `frontend/src/features/<domain>/data/datasources/` |
| 全局与领域状态 | `frontend/src/core/stores/`, `features/<domain>/presentation/stores/` |
| 类型与协议 | `frontend/src/types/` |
| 文案 | `frontend/src/core/i18n/locales/` |
| 全局与专题样式 | `frontend/src/core/themes/` |

常规追踪顺序是 `core route -> feature page/widget/composable/store -> feature datasource -> core network client -> backend route`。遇到登录失效或统一错误处理，先读 `core/networks/client.ts`、`sessionRefresh.ts` 和 `tokenStore.ts`，不要在单页重复实现拦截逻辑。

`frontend/src/api/index.ts`、`frontend/src/api/admin/index.ts` 和 `frontend/src/stores/index.ts` 是旧导入的过渡兼容 barrel，不是实现事实源。查调用时可以将它们作为迁移线索；新增或修改业务时应继续追到明确的 feature/core owner。

## 数据库与生成代码

- 只在 `backend/ent/schema/` 修改 Ent 模型定义。
- `backend/ent/` 其余大部分是生成代码，不手工编辑。
- 生产升级依赖 `backend/migrations/`；按目录 README 的版本和兼容约定新增迁移。
- Wire 源图在 `backend/cmd/server/wire.go` 和各层 `wire.go`，生成结果是 `wire_gen.go`。
- 前端生产资源由 Vite 生成到 `backend/internal/transport/webassets/dist/`，不要直接修改产物。

生成命令：

```sh
cd backend
make generate
```

## 高效检索方式

先找定义，再找调用和测试：

```sh
rg -n '^func .*TargetName|^type TargetName' backend/internal
rg -n 'TargetName\(' backend/internal
rg -n 'TargetName|expected behavior' backend/internal -g '*_test.go'
```

按文件前缀缩小大型包：

```sh
rg --files backend/internal/application/service | rg '/openai_.*\.go$'
rg --files backend/internal/infrastructure/repository | rg '/usage_log.*\.go$'
```

前端按页面反查 API：

```sh
rg -n "from '@/features|from '@/common|from '@/core" frontend/src/features/admin-accounts/presentation/pages/AccountsPage.vue
rg -n "adminAccountsDatasource|/admin/accounts" frontend/src/features/admin-accounts frontend/src/core/routes
rg -n "from '@/api|from '@/api/admin|from '@/stores" frontend/src -g '*.{ts,vue}'
```

最后一条用于定位尚未迁离兼容 barrel 的调用，不应作为新增导入的示例。

## 常见完整改动集合

| 改动 | 通常需要同步 |
| --- | --- |
| 新 API 字段 | DTO/mapper、service、repository、前端 datasource/type/page、兼容测试 |
| 新管理设置 | 持久设置、运行缓存、admin handler、所属 feature 的 store/page、配置说明 |
| 新数据库字段 | Ent schema、迁移、repository、备份/恢复、DTO、测试 fixture |
| 新网关协议行为 | route/handler、service 转换与上游、流式/非流式错误、计费、审计/日志测试 |
| 新平台/账号类型 | 常量、账号模型、调度过滤、凭据、探测、管理 UI、导入导出 |
| 新前端页面 | core route、feature page/widget、导航可见性、datasource、core i18n、权限和相邻测试 |

需要理解调用时序时，继续阅读 [关键请求链路](REQUEST_LIFECYCLES.md)。
