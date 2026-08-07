# Integration Tests

跨 application、infrastructure 和外部依赖边界的集成测试。测试通过 build tag 控制，不包含生产实现。

运行：`go test -tags=integration ./internal/integration/...`。需要 PostgreSQL/Redis 的用例应使用 Testcontainers 并确保清理资源。

网关外部链路验证使用 `e2e` tag：`go test -tags=e2e ./internal/integration/...`。通过 `CLAUDE_API_KEY` 或 `GEMINI_API_KEY` 注入本地管理员创建的 API Key；测试不再创建或注册普通用户。
