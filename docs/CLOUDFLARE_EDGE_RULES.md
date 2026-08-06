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
| 前端页面路由：`/login`, `/register`, `/setup`, `/model-plaza`, `/payment/*`, `/admin/*`, `/dashboard`, `/keys`, `/usage`, `/profile`, `/subscriptions`, `/support`, `/orders`, `/purchase`, `/legal/*` | SPA 导航页 | 只对 HTML 页做挑战，别打后面的 API |
| `GET /api/v1/auth/credential-key` | 注册/登录前置的浏览器加密钥发放 | 可放行或低强度限流 |
| `POST /api/v1/auth/login`, `POST /api/v1/auth/register` | 明确要求 browser flow | 可叠加验证码 / Turnstile |
| `GET/POST /api/v1/auth/oauth/*/start`, `GET /api/v1/auth/oauth/*/callback`, `POST /api/v1/auth/oauth/*/complete-registration`, `POST /api/v1/auth/oauth/pending/*`, `POST /api/v1/auth/passkey/login/begin`, `POST /api/v1/auth/passkey/login/finish`, `POST /api/v1/user/passkeys/register/begin`, `POST /api/v1/user/passkeys/register/finish` | 浏览器重定向 / WebAuthn 依赖 | 不要 challenge callback；start 只做轻限流 |
| `GET /api/v1/pages/:slug`, `GET /api/v1/pages/:slug/images/*filename`, `GET /generated/:filename` | 页面内容 / 静态资源 | 一般不 challenge，避免破坏渲染 |

## 可以被自动化调用，人也能用

| 路径前缀 | 说明 | CF建议 |
| --- | --- | --- |
| `/api/v1/auth/me`, `/api/v1/auth/revoke-all-sessions`, `/api/v1/auth/oauth/bind-token`, `/api/v1/auth/login/2fa`, `/api/v1/auth/send-verify-code`, `/api/v1/auth/refresh`, `/api/v1/auth/logout`, `/api/v1/auth/validate-promo-code`, `/api/v1/auth/validate-invitation-code`, `/api/v1/auth/forgot-password`, `/api/v1/auth/reset-password` | 登录态 / 找回密码 / 会话管理 | 以后端鉴权和限流为主 |
| `/api/v1/user/*`, `/api/v1/keys/*`, `/api/v1/groups/available`, `/api/v1/groups/rates`, `/api/v1/channels/available`, `/api/v1/usage/*`, `/api/v1/announcements`, `/api/v1/redeem`, `/api/v1/subscriptions`, `/api/v1/channel-monitors`, `/api/v1/chat/*` | 用户面 JSON API | 适合按登录态、路径、频率做限流 |
| `/api/v1/payment/*`（除 webhook 与 public 子路径） | 支付页面 / 订单 API | 只做鉴权 + 限流，不做人机墙 |
| `/api/v1/admin/*` | 管理端 JSON API | 只做管理员鉴权、step-up、审计 |
| `/api/v1/model-plaza` | 公开广场数据，匿名可读 | 可做轻限流，不做 challenge |
| `/api/v1/pages/*` | 页面内容元数据 | 可做轻限流 |
| `/api/v1/settings/public`, `/setup/status`, `/setup/test-db`, `/setup/test-redis`, `/setup/install` | 公共设置与首次安装流程 | 仅安装期放行，平时不应做常驻 challenge |
| `/api/v1/payment/public/orders/verify`, `/api/v1/payment/public/orders/resolve` | 公开支付查询 | 只做状态校验，不要 challenge |

## 纯 API

| 路径 | 说明 | CF建议 |
| --- | --- | --- |
| `/v1/*`, `/v1beta/*`, `/antigravity/*`, `/backend-api/codex/*` | API Key 网关 | 禁 challenge，用 API key / 配额 / 来源控制 |
| `/api/v1/payment/webhook/*` | 第三方支付回调 | 必须放行 challenge，靠签名校验 |
| `/api/event_logging/batch` | 遥测批量上报 | 放行 |
| `/health` | 健康检查 | 放行 |
| `/generated/*` | 公开生成资源 | 放行 |

## 适合强人机验证

| 路径 | 建议 | 备注 |
| --- | --- | --- |
| `POST /api/v1/auth/register`, `POST /api/v1/auth/login` | 强人机验证 | 配合 `RequireBrowserFlow` |
| `POST /api/v1/auth/send-verify-code`, `POST /api/v1/auth/forgot-password` | 强人机验证 | 高频匿名滥用入口 |
| `POST /api/v1/auth/login/2fa` | 强限流 / 可选验证 | 登录后敏感步骤 |
| `POST /api/v1/auth/oauth/pending/send-verify-code`, `POST /api/v1/auth/oauth/pending/create-account` | 强人机验证 | pending 续接 |
| `POST /api/v1/auth/oauth/*/create-account` | 强人机验证 | OAuth 未注册转注册 |
| `POST /api/v1/auth/validate-invitation-code`, `POST /api/v1/auth/validate-promo-code` | 视滥用情况加验证 | 通常先限流 |

## 不要挑战

- `POST /api/v1/payment/webhook/*`
- `/v1/*`、`/v1beta/*`、`/antigravity/*`、`/backend-api/codex/*`
- `/health`
- `/api/event_logging/batch`
- `/generated/*`
- `/api/v1/auth/oauth/*/callback`

## 事实源

- `backend/internal/transport/http/server/router.go`
- `backend/internal/transport/http/server/routes/auth.go`
- `backend/internal/transport/http/server/routes/user.go`
- `backend/internal/transport/http/server/routes/payment.go`
- `backend/internal/transport/http/server/routes/gateway.go`
- `backend/internal/transport/http/handler/page_handler.go`
- `backend/internal/platform/middleware/credential_cipher.go`
- `frontend/src/core/routes/index.ts`
- `frontend/src/core/networks/client.ts`
