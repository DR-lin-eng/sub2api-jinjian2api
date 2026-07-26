# Backend Agent Guide

本文件补充根目录 `AGENTS.md`，适用于 `backend/` 子树。开始修改前先读 `README.md`，进入具体目录后再读最近的 `README.md`。

## 运行事实

- Go 版本以 `go.mod` 为准。
- 进程入口和生命周期：`cmd/server/main.go`。
- 依赖注入源图：`cmd/server/wire.go` 与各层 `wire.go`。
- HTTP 聚合：`internal/transport/http/server/router.go`。
- 路由事实源：`internal/transport/http/server/routes/`。
- Ent 模型源：`ent/schema/`；生产升级源：`migrations/`。
- 配置字段源：`internal/platform/config/`；部署示例：`../deploy/config.example.yaml`。

## 层级边界

- `transport` 只做协议、鉴权接入和响应映射，不直接访问 repository。
- `application` 编排用例并定义端口，不导入 infrastructure。
- `domain` 保存不依赖网络、数据库或运行配置的规则。
- `infrastructure` 实现 application 端口，持有 Ent、SQL、Redis 和外部客户端。
- `modules` 保存边界清晰的垂直业务；新独立功能优先进入这里。
- `platform` 是运行平台能力，`shared` 是无业务流程的低层复用包。

推荐依赖方向是 `transport -> application -> domain`，具体实现只在 Wire 装配处绑定。

## 网关修改

从真实路径按以下顺序追踪：

```text
server/routes/gateway.go
  -> server/middleware/api_key_auth.go
  -> transport/http/handler/gateway* or openai*
  -> application/service/gateway* or openai*
  -> application ports
  -> infrastructure/repository implementations
```

同时验证 API Key/分组 context、计费资格复查、用户/账号槽位释放、粘性会话、失败账号排除、最大 failover 次数、流式错误格式和用量结算。

## 生成与迁移

- 不手改 `ent/` 生成代码或 `cmd/server/wire_gen.go`。
- 修改 Ent schema 后运行 `go generate ./ent`，并新增向前迁移。
- 修改 provider/构造器后运行 `go generate ./cmd/server`。
- 一次性更新使用 `make generate`。
- 生成差异必须和源定义一起审查；不要提交本地二进制和 Go 缓存。

## 验证

以下命令从 `backend/` 执行：

```sh
make check-layout
make test-unit
make test-integration
go test ./internal/application/service/...
go test ./internal/transport/http/...
golangci-lint run ./...
```

按改动选择最小相关测试，但共享协议、调度、并发、计费、缓存或 repository 变更必须扩大验证。涉及 PostgreSQL/Redis 行为时运行 integration/Testcontainers；涉及性能时保留并运行相邻 benchmark；涉及发布行为时回到仓库根目录做 Docker 源码构建。

宿主机默认缓存不可写时，把 `GOCACHE` 指向可写临时目录或使用 Docker，不要把缓存放进版本控制。

## 文档同步

- 目录职责或文件前缀变化：更新最近的 `README.md`。
- 跨层入口或运行链路变化：更新 `../docs/ARCHITECTURE.md`、`CODE_MAP.md` 或 `REQUEST_LIFECYCLES.md`。
- 配置变化：同步 defaults、环境映射、validation、部署示例和相关运维文档。
