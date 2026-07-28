# Admin Accounts

管理账号 feature 负责账号列表、创建/编辑、批量更新、授权和用量展示。

- `data/datasources/`: 账号管理 API 与协议映射。
- `presentation/pages/`: 列表查询、筛选、刷新和对话框编排。
- `presentation/widgets/create/`: 创建表单的领域字段。
- `presentation/widgets/edit/`: 编辑表单的领域字段。
- `presentation/composables/`: 有界的表单策略、OAuth 与提交编排。

账号列表页保留路由、请求和弹窗编排，表格 DOM 由 `AccountsTableView.vue` 静态承载。列表列偏好、展示映射、今日统计和上游额度分别由同域 composable 管理；表格只消费 `accountTableViewContext.ts` 的 typed context，不直接请求 API 或创建 watcher、timer。

创建和编辑对话框拥有各自的 reactive form，并在 setup 中同步装配 watcher、授权和提交 composable。字段组件只通过明确的 typed context 读写表单与触发动作，不持有 API 或 Store。

- `accountEditorContext.ts`: 字段组件的最小类型契约。
- `accountFormPolicy.ts`: 创建和编辑共用的纯表单转换。
- `useCreateAccountEditorPolicy.ts`: 创建表单 watcher 与字段动作。
- `useCreateAccountOAuthActions.ts`: 创建账号的 OAuth exchange/import/batch 流程。
- `accountEditUpdatePayload.ts`: 按账号类型和平台构造编辑 payload。
- `useEditAccountSubmission.ts`: 编辑校验、风险确认与更新请求编排。
- `useAccountsUpstreamBilling.ts`: 上游计费探测、额度缓存、批量查询和定时刷新。
- `useAccountColumnPreferences.ts`: 列可见性迁移与服务端派生查询参数。
- `useAccountTodayStats.ts`: 当前页今日统计的请求并发保护。
- `useAccountTablePresentation.ts`: 纯列定义、徽标和单元格格式化。

新增平台字段时同步检查创建、编辑和批量更新 payload。不要复制无边界表单、把完整 Pinia Store 传入字段组件，或把控制器重新堆回单一 SFC。运行时代码保持在 1500 行以内，新增职责应进入现有有界组件或 composable。

验证入口：

```sh
pnpm exec vitest run src/features/admin-accounts
pnpm run typecheck
```
