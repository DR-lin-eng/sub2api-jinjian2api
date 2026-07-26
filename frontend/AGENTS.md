# Frontend Agent Guide

本文件补充根目录 `AGENTS.md`，适用于 `frontend/` 子树。开始修改前先读 `README.md`，路由或 Store 任务再读对应子目录 README。

## 运行事实

- 依赖管理只使用 pnpm，脚本以 `package.json` 为准。
- 应用入口是 `src/main.ts`；路由事实源是 `src/router/index.ts`。
- 共享 HTTP 行为集中在 `src/api/client.ts`。
- access token 仅存内存，refresh credential 由后端 HttpOnly cookie 管理。
- 生产构建输出到 `../backend/internal/transport/webassets/dist/`，该目录不手改。

## 代码归属

```text
router -> view -> component/composable/store -> api -> backend
```

- 路由页放 `src/views/<domain>/`，只保留页面级编排。
- 可复用 UI 放 `src/components/<domain>/`。
- 可复用交互和生命周期放 `src/composables/`。
- 跨页面共享、需要缓存或轮询的状态才进入 `src/stores/`。
- HTTP 调用和协议类型进入 `src/api/`、`src/types/`。
- 无 UI 状态的纯函数进入 `src/utils/`。
- 用户可见文案进入 `src/i18n/locales/`，同步所有受支持语言。

不要在页面中创建新的 Axios client、token 刷新队列或权限事实源。前端 guard 和菜单隐藏只负责体验，后端必须执行真实权限校验。

## 修改检查

- 新页面：route、lazy import、meta、导航、API/type、i18n、权限和 view test。
- 新 API 字段：后端 DTO 兼容、前端 type/mapper、空值和旧响应测试。
- Store：并发加载去重、失败恢复、invalidate、logout/user switch 清理。
- 表格/筛选：loading、empty、error、分页、查询取消和 URL/偏好持久化。
- 支付/认证：不要提前加载第三方 SDK；验证回调、刷新竞争和失败跳转。
- 大页面：按数据加载、展示区、表单和交互拆分，避免继续扩大单文件。

## 验证

以下命令从 `frontend/` 执行：

```sh
pnpm run lint:check
pnpm run typecheck
pnpm run test:run
pnpm exec vitest run src/path/to/example.spec.ts
pnpm run build
```

单页面改动先跑相邻 spec 和 typecheck。Router、API client、认证、共享 Store、i18n 或构建配置属于共享面，需要运行所有相关 spec、lint 和 typecheck。视觉/响应式改动还要在实际浏览器验证桌面和移动宽度。

## 文档同步

- 顶层目录或通用约定变化：更新 `README.md`。
- Router meta/guard 变化：更新 `src/router/README.md`。
- Store owner/生命周期变化：更新 `src/stores/README.md`。
- 跨前后端调用链变化：更新 `../docs/CODE_MAP.md` 或 `REQUEST_LIFECYCLES.md`。
