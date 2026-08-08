# Cloudflare 接口分类与规则建议

本文基于当前源码做只读审查，目的是帮你写 Cloudflare WAF / Challenge / Rate Limit 规则。它不复制完整路由表，只保留适合写规则的分类结果。

## 口径

- 一定是浏览器访问：HTML 页面导航、OAuth / Passkey / 安装向导这类强浏览器依赖流。
- 可以被自动化调用，人也能用：前端实际调用的 JSON API，脚本、CLI、集成测试也能调。
- 纯 API：API Key 网关、Webhook、机器到机器回调。
- 适合强人机验证：匿名高风险入口，优先 Turnstile / 验证码 / 登录态限流。

## 一定是浏览器访问

| 路径 | 说明 | CF建议 |
| --- | --- | --- |
| 前端页面路由：`/login`, `/setup`, `/admin/*`, `/keys`, `/usage`, `/profile` | SPA 导航页 | 只对 HTML 页做挑战，别打后面的 API |
| `GET /api/v1/auth/credential-key` | 登录前置的浏览器加密钥发放 | 放行或低强度限流；服务端已有本地入口限流 |
| `POST /api/v1/auth/login` | 本地管理员登录，明确要求 browser flow | 可叠加 Turnstile / Managed Challenge |
| `POST /api/v1/auth/passkey/login/begin`, `POST /api/v1/auth/passkey/login/finish`, `POST /api/v1/user/passkeys/register/begin`, `POST /api/v1/user/passkeys/register/finish` | WebAuthn 浏览器依赖 | 只做限流，避免中途 challenge 破坏 ceremony |
| `GET /generated/:filename` | 生成结果静态资源 | 一般不 challenge，避免破坏客户端取图 |

## 可以被自动化调用，人也能用

| 路径前缀 | 说明 | CF建议 |
| --- | --- | --- |
| `/api/v1/auth/me`, `/api/v1/auth/revoke-all-sessions`, `/api/v1/auth/login/2fa`, `/api/v1/auth/refresh`, `/api/v1/auth/logout` | 本地管理员会话 | 以后端鉴权和限流为主 |
| `/api/v1/user/*`, `/api/v1/keys/*`, `/api/v1/groups/available`, `/api/v1/usage/*` | 唯一管理员自助 JSON API | 适合按登录态、路径和频率限流 |
| `/api/v1/admin/*` | 管理端 JSON API | 只做管理员鉴权、step-up、审计 |
| `/api/v1/settings/public`, `/setup/status`, `/setup/test-db`, `/setup/test-redis`, `/setup/install` | 公共设置与首次安装流程 | 安装接口只在 setup 模式存在；可按源 IP 限制 |

## 纯 API

| 路径 | 说明 | CF建议 |
| --- | --- | --- |
| `/v1/*`, `/v1beta/*`, `/antigravity/*`, `/backend-api/codex/*` | API Key 网关 | 禁 challenge，用 API Key、来源和速率控制 |
| `/api/event_logging/batch` | 遥测批量上报 | 放行 |
| `/health` | 健康检查 | 放行 |
| `/generated/*` | 公开生成资源 | 放行 |

## 适合强人机验证

| 路径 | 建议 | 备注 |
| --- | --- | --- |
| `POST /api/v1/auth/login` | 强人机验证 | 配合 `RequireBrowserFlow` 和服务端限流 |
| `POST /api/v1/auth/login/2fa` | 强限流 / 可选验证 | 登录后敏感步骤 |

## 不要挑战

- `/v1/*`、`/v1beta/*`、`/antigravity/*`、`/backend-api/codex/*`
- `/health`
- `/api/event_logging/batch`
- `/generated/*`

## 事实源

- `backend/internal/transport/http/server/router.go`
- `backend/internal/transport/http/server/routes/auth.go`
- `backend/internal/transport/http/server/routes/user.go`
- `backend/internal/transport/http/server/routes/gateway.go`
- `backend/internal/platform/middleware/credential_cipher.go`
- `frontend/src/core/routes/index.ts`
- `frontend/src/core/networks/client.ts`
