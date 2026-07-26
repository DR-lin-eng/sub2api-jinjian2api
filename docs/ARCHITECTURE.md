# Sub2API 架构总览

本文描述当前源码中的稳定架构边界，帮助二次开发者先判断“改动应该落在哪一层”。具体接口、字段和分支以源码与测试为准。

## 系统上下文

Sub2API 是一个 Go 模块化单体：同一后端进程同时提供浏览器管理 API、面向客户端的模型网关、后台任务和嵌入式前端资源。PostgreSQL 保存业务事实，Redis 承担缓存、并发协调、队列和短期运行状态。

```mermaid
flowchart LR
    Browser["浏览器 / 管理端"] --> Frontend["Vue 3 前端"]
    SDK["Claude / OpenAI / Gemini 客户端"] --> HTTP["Gin HTTP / SSE / WebSocket"]
    Frontend --> HTTP
    HTTP --> Transport["transport: 路由、鉴权、协议映射"]
    Transport --> Application["application: 用例、网关、调度、计费"]
    Application --> Domain["domain / modules: 领域规则"]
    Application --> Ports["application ports"]
    Ports --> Infrastructure["infrastructure: 端口实现"]
    Infrastructure --> PostgreSQL[(PostgreSQL)]
    Infrastructure --> Redis[(Redis)]
    Infrastructure --> Upstream["模型、支付、邮件等上游"]
```

前端生产构建输出到 `backend/internal/transport/webassets/dist/`，随后嵌入后端二进制。开发模式下，Vite 和 Go 服务可分别运行。

## 后端层级

| 层级 | 路径 | 负责 | 不负责 |
| --- | --- | --- | --- |
| 启动与装配 | `backend/cmd/server/` | 启动模式、Wire 图、生命周期、优雅退出 | 业务规则 |
| Transport | `backend/internal/transport/` | 路由、中间件、DTO、HTTP/SSE/WS 响应 | SQL、Redis 细节 |
| Application | `backend/internal/application/` | 用例编排、网关流程、调度、计费、端口接口 | Gin 路由、具体存储客户端 |
| Domain | `backend/internal/domain/` | 纯领域值与规则 | 网络、数据库、运行配置读取 |
| Modules | `backend/internal/modules/` | 可独立演进的垂直领域 | 无边界的通用 helper |
| Infrastructure | `backend/internal/infrastructure/` | PostgreSQL、Redis、缓存和外部资源端口实现 | HTTP 响应格式 |
| Platform | `backend/internal/platform/` | 配置、安全、限流等运行平台能力 | 产品业务流程 |
| Shared | `backend/internal/shared/` | 低层协议适配和无业务状态工具 | 对上层业务的反向依赖 |
| Bootstrap | `backend/internal/bootstrap/` | 首次启动和升级引导 | 常驻请求逻辑 |

推荐依赖方向：

```text
transport -> application -> domain
                    ^
                    |
infrastructure implements application ports
```

具体实现只应在 `backend/cmd/server/wire.go`、各层 `wire.go` 和生成的 `wire_gen.go` 中完成绑定。`wire_gen.go` 是生成文件，不手工编辑。

## 启动链路

1. `backend/cmd/server/main.go` 判断首次安装、CLI setup 或正常服务模式。
2. `config.LoadForBootstrap` 读取运行配置，初始化日志。
3. `initializeApplication` 使用 Wire provider set 构造 repository、service、handler 和 HTTP server。
4. `backend/internal/transport/http/server/router.go` 安装全局中间件、嵌入式前端和各路由域。
5. 后台 worker 与缓存同步器由 provider/cleanup 生命周期管理；退出时先停止应用任务，再关闭 Redis、数据库等基础设施。

查启动失败时按 `main.go -> wire.go/wire_gen.go -> provider set -> 具体构造器` 追踪。

## HTTP 边界

浏览器管理面和 API Key 网关是两类不同入口：

| 流量 | 典型路径 | 鉴权 | 路由事实源 |
| --- | --- | --- | --- |
| 公共/登录/用户/管理 API | `/api/v1/...` | 公共、JWT、Admin、step-up 等 | `routes/auth.go`, `user.go`, `admin.go`, `payment.go` |
| 模型网关 | `/v1/...`, `/responses`, `/v1beta/...`, 专用平台前缀 | API Key + 分组/订阅约束 | `routes/gateway.go` |
| 健康与首次设置 | `/health`, `/setup/...` | 依端点而定 | `routes/common.go` 与 bootstrap setup |

路由文件只组合路径、中间件和 handler。handler 负责协议边界；业务选择、调度、上游访问编排和计费进入 application service。

## 数据与状态边界

| 数据 | 事实源 | 说明 |
| --- | --- | --- |
| 用户、账号、分组、订阅、订单、用量 | PostgreSQL | Ent schema 在 `backend/ent/schema/`，版本迁移在 `backend/migrations/` |
| 余额、订阅和 API Key 鉴权投影 | PostgreSQL + Redis 缓存 | 数据库是持久事实，缓存更新必须防止旧快照覆盖新写入 |
| 并发槽位、限流、粘性会话、调度快照 | Redis/进程内短期状态 | 必须有过期、释放、容量上限和故障降级策略 |
| 用量结算队列 | Redis Stream + PostgreSQL 幂等落库 | 关键计费任务不能静默丢弃；Redis 故障时使用受限 fallback |
| 前端运行设置 | 后端注入 + 管理 API | 浏览器状态不是权限或计费事实源 |

数据库变更必须同时考虑 Ent schema、迁移、repository、DTO/API 兼容和测试 fixture。只改 schema 或只写迁移都不完整。

## 前端结构

前端入口是 `frontend/src/main.ts`。它依次初始化主题、Pinia、后端注入设置、i18n 和 Router，再挂载应用。

| 路径 | 职责 |
| --- | --- |
| `frontend/src/views/` | 路由级页面；按 `admin/`, `user/`, `auth/`, `public/`, `setup/` 分域 |
| `frontend/src/components/` | 可复用或领域组件 |
| `frontend/src/features/` | 自包含、可独立演进的前端功能 |
| `frontend/src/api/` | API 封装；共享 Axios 行为集中在 `client.ts` |
| `frontend/src/stores/` | 跨页面 Pinia 状态和生命周期 |
| `frontend/src/composables/` | 可组合交互逻辑 |
| `frontend/src/router/` | 路由定义、守卫、标题和 setup 重定向 |
| `frontend/src/i18n/locales/` | 用户可见文案 |

页面只保留展示和页面级编排。可复用交互下沉到 component/composable；跨页面状态才进入 store；HTTP 细节进入 api 模块。

## 关键不变量

- 鉴权、余额、订阅和并发准入必须在后端执行；前端只做体验层提示。
- 等待并发槽位后要重新检查计费资格，避免排队期间状态变化造成越权请求。
- 所有已获取的用户/账号/图片并发槽位必须在成功、错误和客户端取消路径释放。
- 流式响应一旦写出状态或事件，错误必须使用对应协议格式，不能退回普通 JSON 状态码。
- 调度失败处理必须维护失败账号集合和最大切换次数，避免在坏账号上无限重试。
- 用量记录以 request ID/指纹保证幂等，结算成功后再更新相关缓存投影。
- 生产前端必须通过统一构建路径嵌入，不能手改 `webassets/dist/`。

## 扩展决策

新增功能前按以下顺序判断：

1. 只是新协议入口：在 routes/handler 增加适配，复用已有 application 用例。
2. 是现有业务的新用例：在对应 application service 前缀下按职责拆文件。
3. 有独立状态、策略和外部接口：建立 `internal/modules/<domain>`，通过小端口接入。
4. 是多个领域都需要的无状态协议工具：放入 `internal/shared/<topic>`。
5. 是存储或外部调用实现：在 infrastructure 实现 application 端口。

更具体的文件定位见 [代码地图](CODE_MAP.md)，运行顺序见 [关键请求链路](REQUEST_LIFECYCLES.md)。
