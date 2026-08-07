# Pinia Stores

本目录保存跨页面共享、需要缓存或具有明确生命周期的状态。组件/页面局部状态不要放入 store；后端持久数据也不能把 localStorage 当作事实源。

## Store 索引

| 文件 | Store ID | 职责 |
| --- | --- | --- |
| `appStore.ts` | `app` | 公开站点设置、主题/壳层状态、全局 toast 和运行模式 |

领域 Store 跟随业务 owner，例如认证与管理设置位于对应 feature 的 `presentation/stores/`。`frontend/src/stores/index.ts` 只提供旧导入兼容，不是 Store owner。

状态字段和 action 的最终事实以各 store 源码为准。本表只维护 owner，避免复制每个响应字段。

## 使用边界

| 需要 | 建议位置 |
| --- | --- |
| 单组件状态 | 组件内 `ref` / `computed` |
| 单页面共享状态 | 页面级 composable |
| 多页面共享、需要缓存 | Pinia store |
| 分页、筛选、可分享状态 | route query |
| 长期业务事实 | 后端 API/数据库 |

Store 调用所属 feature 的 datasource，但不应绕过 `src/core/networks/client.ts`。Store 不直接操作 DOM；复杂 UI 行为使用 composable。

## 生命周期

- 轮询、订阅和监听必须提供成对的 start/stop 或在 scope dispose 时清理。
- 用户登出时清除用户隔离的数据，避免下一个会话看到旧缓存。
- 缓存应有 `loaded/loading/lastFetchedAt` 或等价状态，避免重复请求和永久脏缓存。
- localStorage 只用于主题、提示状态等非敏感偏好；token 刷新凭据由 HttpOnly cookie 管理。
- 并发请求去重应在 owner store/API 中集中实现，不在多个页面各建锁。

## 新增 Store

1. 先确认状态确实跨页面或需要独立生命周期。
2. 使用 setup store 风格，与现有实现保持一致。
3. 明确 state、computed、actions 和 cleanup/invalidate 入口。
4. 由使用方直接导入 owner 文件；不要扩充 `src/stores/index.ts` 兼容 barrel。
5. 添加测试，覆盖首次加载、并发加载、失败、刷新、清理和用户切换。

认证或 API 统一行为应优先修改 `src/core/networks/client.ts`、`tokenStore.ts` 或 `sessionRefresh.ts`，不要为其新建平行 store。
