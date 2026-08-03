# Admin Accounts

管理账号 feature 负责账号列表、创建/编辑、批量更新、授权和用量展示。

- `data/datasources/adminAccountQueries.ts`: 列表、ETag、详情、摘要、统计、用量、临时不可调度状态、Ollama Cloud 状态、模型和上游计费设置/快照查询。
- `data/datasources/adminAccountActions.ts`: 页面批量操作、导出、账号状态维护、重复账号、上游计费探测、额度查询和 Ollama Cloud 配置动作。
- `data/datasources/adminAccountsDatasource.ts`: 旧 `accountsAPI` 兼容聚合与尚未迁移的账号操作。
- `data/datasources/scheduledTestsDatasource.ts`: 账号定时测试计划、启停、删除和结果查询。
- `presentation/pages/`: 列表查询、筛选、刷新和对话框编排。
- `presentation/widgets/create/`: 创建表单的领域字段。
- `presentation/widgets/edit/`: 编辑表单的领域字段。
- `presentation/composables/`: 有界的表单策略、OAuth 与提交编排。

账号列表页保留路由、请求和弹窗编排，表格 DOM 由 `AccountsTableView.vue` 静态承载。列表列偏好、展示映射、今日统计和上游额度分别由同域 composable 管理；表格只消费 `accountTableViewContext.ts` 的 typed context，不直接请求 API 或创建 watcher、timer。

请求生命周期由 presentation 明确持有：账号页负责列表 AbortController、ETag、筛选和写后刷新；今日统计 composable 用请求序号忽略过期响应；上游计费 composable 负责费率 ETag、轮询暂停条件、探测后的列表刷新和额度缓存失效。重复账号 Action 在请求成功前将幂等键同时保存在内存与 `sessionStorage`，失败重试和页面重载继续复用同一个键。

当前接口 owner 盘点：列表、详情、摘要、统计、用量和只读快照属于 Query；创建、更新、删除、授权、批量操作、导入导出与主动探测属于 Action。迁移按调用链分片推进，兼容 `accountsAPI` 在所有旧消费者迁完前保持相同方法和响应形状。账号页和批量编辑对话框直接依赖 Query/Action owner，不再经过统一 admin barrel。

账号额度通知的账号级阈值仍由 `useQuotaNotifyState.ts` 管理；其中全局启用状态直接读取 `admin-settings` datasource，失败时保持关闭，不再通过统一 admin barrel 跨域访问。

定时测试面板直接依赖 `scheduledTestsDatasource.ts`，由面板继续持有打开时加载、创建后刷新、局部更新、删除和结果展开状态。

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
