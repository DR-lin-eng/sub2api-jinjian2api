# 前端架构优化计划

> 状态：实施中。阶段 1 的渐进式架构门禁已于 2026-08-03 落地，阶段 2 的 `admin-accounts` 试点已于 2026-08-04 收口；阶段 3 已于 2026-08-06 从 `admin-settings` 启动。
>
> 基线日期：2026-08-03。后续迁移批次开始前必须重新统计代码和依赖，源码与测试始终是最终事实来源。

## 1. 背景

当前前端已经采用 `core`、`common` 和 `features/<domain>` 的 feature-first 垂直切片，主依赖方向为：

```text
main / core routes
  -> feature presentation
  -> feature data datasource
  -> core networks
  -> backend
```

现有方向是正确的，不需要推倒重建。但迁移尚未收口，仍存在以下维护问题：

- 运行时代码仍通过 `@/api`、`@/api/admin` 和 `@/stores` 兼容 barrel 间接访问 owner。
- 部分 datasource 同时包含大量查询、写操作、协议类型和兼容逻辑，职责过宽。
- `src/types/` 保存了不少实际只属于单一 feature 的请求、响应和业务类型。
- 少数 feature 直接依赖其他 feature 的私有 presentation 或 datasource 实现。
- 复杂页面的加载、取消、缓存、刷新、错误和写后刷新语义缺少统一的职责约定。

历史上的大型页面已通过 page、widget、composable 和 datasource 拆分显著缩小，说明继续沿现有 feature owner 渐进治理比全量 Clean Architecture 重写更适合本项目。

## 2. 目标与非目标

### 2.1 目标

- 完成现有 feature-first 架构迁移，消除长期兼容 barrel。
- 让 API DTO、查询、写操作和复杂领域规则具有明确 owner。
- 限制跨 feature 私有依赖，形成可检查的依赖方向。
- 保持请求生命周期、鉴权、缓存、分包和页面行为兼容。
- 让后续二次开发可以从 feature 入口快速定位协议、规则、状态和 UI。

### 2.2 非目标

- 不一次性重写整个前端。
- 不要求每个 feature 都建立 Domain、Repository、UseCase 和 Mapper。
- 不在架构迁移中同时重新设计 UI 或修改后端 API。
- 不为了目录形式机械复制一对一 DTO、Entity 和 ViewModel。
- 不预先引入 TanStack Query 等新运行时框架；先解决 owner 和生命周期问题。
- 不通过全局 Store、动态组件或新 barrel 转移局部复杂度。

## 3. 基线

2026-08-03 的刷新扫描结果如下。数字用于确定优先级，后续批次开始前仍需刷新：

| 指标 | 当前基线 |
| --- | ---: |
| `features/<domain>` 数量 | 35 |
| feature 运行时与测试 TypeScript/Vue 文件 | 637 |
| feature datasource 文件 | 50 |
| feature presentation 文件 | 415 |
| 运行时兼容 barrel 引用 | 120 个文件 / 126 条 import |
| 跨 feature 私有 presentation 引用 | 46 个文件 / 74 条 import |
| 超过 500 有效行的 datasource | 4 |

修改前基线验证发现 `AccountsPage.vue` 为 1568 个物理行，超过专项测试的 1550 行过渡目标。本批已将排序偏好解析提取到同 feature 的 `accountSortState.ts`，恢复该专项门禁且未改变页面请求生命周期。

首批高收益对象：

| Feature | 主要问题 | 优先方向 |
| --- | --- | --- |
| `admin-accounts` | 协议面大，查询、ETag、授权、批量操作和导入导出混合 | DTO owner、Query/Action、纯表单策略 |
| `admin-settings` | datasource 和设置协议体量大，多个设置子域共享保存流程 | 按设置子域拆协议和保存 Action |
| `admin-ops` | 读取接口多，快照、日志、指标和错误详情混合 | 按查询资源拆分，不制造空 Action 层 |
| `admin-usage` | 直接组合其他管理 feature 的私有 UI 和数据实现 | 明确组合边界和共享契约 |
| `admin-orders` / `billing` | 共享支付类型和 presentation formatter | 提取稳定的 payment 契约与展示工具 owner |

## 4. 架构决策

### 4.1 保留 feature-first 主结构

默认结构保持简单：

```text
features/<domain>/
  data/
    datasources/
  presentation/
    pages/
    widgets/
    composables/
    stores/
```

只有满足后续条件时才增加更细层级。

### 4.2 Domain 层按需建立

满足下列任一条件时，可以建立 `domain/`：

- 同一业务规则被两个以上页面、widget 或 composable 使用。
- 存在值得独立单元测试的状态转换、策略、校验或计算。
- 后端 DTO 与编辑草稿、展示模型之间存在明显语义差异。
- 规则必须保持框架无关，不能依赖 Vue、Pinia、Router、Axios 或浏览器状态。

简单 CRUD、只读列表和一次性表单不建立空洞 Domain 层。

### 4.3 DTO 放回 API owner

- 请求和响应类型默认放在所属 feature 的 `data/`。
- DTO 保留后端传输字段和可选字段语义，包括 snake_case 与滚动升级兼容字段。
- 真正跨多个 feature 的稳定协议才保留在 `src/types/` 或明确的共享契约目录。
- 只有 API、domain、编辑草稿或 UI 模型形态不同时才建立 mapper。
- mapper 必须是显式纯函数，并覆盖空值、旧响应和敏感字段测试。

### 4.4 Query/Action 按职责拆分

以下情况需要物理拆分 Query 与 Action：

- 单个 datasource 超过约 500 行且同时包含大量读写接口。
- 查询具有分页、筛选、取消、ETag、缓存或轮询语义。
- 写操作具有幂等键、确认、批量执行、进度或写后失效语义。
- 同一 datasource 已难以确定某次修改影响哪些页面。

约定如下：

- Query 只负责读取，接收明确参数和可选 `AbortSignal`，不显示 toast、不跳转路由。
- Action 负责创建、更新、删除、批量操作和命令式探测，不直接操作 presentation state。
- 写后刷新、失效和用户反馈由拥有请求生命周期的 page、composable 或 feature Store 编排。
- 简单 feature 可以继续保留一个小型 datasource，不强制拆成多个单函数文件。

推荐的复杂 feature 结构：

```text
features/<domain>/
  domain/
    models.ts
    policies.ts
  data/
    <domain>Dto.ts
    <domain>Queries.ts
    <domain>Actions.ts
    <domain>Mapper.ts       # 仅在确有转换时存在
  presentation/
    pages/
    widgets/
    composables/
    stores/
```

## 5. 实施阶段

### 阶段 0：刷新基线和保护现场

- [x] 重新统计 feature、旧 barrel 引用、跨 feature import 和大型 datasource。
- [x] 检查工作区已有修改，避免与正在进行的业务功能并行重写同一文件。
- [ ] 记录关键页面的请求数、请求时序、Abort、ETag、轮询和写后刷新行为。
- [x] 为本计划建立分 feature 验收清单，所有架构提交只覆盖一个 owner 或明确子域。

每个 feature 开始迁移前，验收清单至少记录：owner 与消费者、请求/响应 DTO、Query/Action 清单、Abort/ETag/轮询/幂等语义、写后刷新时机、路由 chunk、相邻测试、全量验证结果和独立回滚点。

完成条件：可以准确回答每个迁移对象的 owner、消费者、协议、测试和兼容行为。

### 阶段 1：建立渐进式架构门禁

- [x] 禁止新代码导入 `@/api`、`@/api/admin` 和 `@/stores`。
- [x] 为现有引用建立精确基线；每迁移一个 feature 就缩小基线，不扩大 allowlist。
- [x] 强化 `domain -> data -> presentation` 反向依赖限制。
- [x] 禁止新增跨 feature 的私有 presentation 导入。
- [x] 保持 1500 有效行硬门禁，并检查 datasource、composable 和普通 `.ts` 文件。
- [x] 更新 `frontend/README.md`、`frontend/AGENTS.md` 和 ESLint 规则说明。

实现入口是 `frontend/eslint/architecture-boundaries.cjs`，存量逐条基线是 `frontend/eslint/architecture-debt-baseline.cjs`。基线以“文件 + import source + 次数”为粒度；旧引用减少但未同步删除基线时，lint 同样失败。

完成条件：架构债务数量只能下降，不能被新代码继续扩大。

### 阶段 2：试点 `admin-accounts`

开始前必须先确认当前账号管理功能修改已经稳定，不能覆盖或回退已有改动。

- [x] 盘点账号列表、详情、统计、用量、授权、导入导出和批量接口。
- [x] 将账号专属 DTO 从 `src/types/gateway.ts` 迁回 feature data。
- [x] 拆分账号 Query：列表、ETag、详情、统计、用量和只读探测。
- [x] 拆分账号 Action：创建、更新、删除、授权、批量和导入导出。
- [x] 保留重复操作幂等键、AbortController、ETag 和额度刷新行为。
- [x] 将复杂表单校验、payload 构造和账号类型策略保留为纯函数。
- [x] 替换该 feature 对 `adminAPI.accounts` 的兼容调用。
- [x] 补充 DTO 兼容、Query 参数、Action payload 和页面请求生命周期测试。

已完成第一切片：列表/ETag、详情摘要、今日统计和上游费率快照迁入 Query owner；重复账号、上游计费探测和额度主动查询迁入 Action owner。旧 datasource 继续提供同名导出与 `accountsAPI`，今日统计和上游计费 composable 已移除统一 admin barrel 依赖，并同步缩小精确债务基线。

已完成第二切片：账号页使用的模型/探测设置查询、批量操作、导出和账号状态维护进入对应 owner；页面对账号、代理和分组的请求均改为直接 owner import，页面本身不再依赖 `adminAPI`，兼容 datasource 继续服务尚未迁移的 widgets/composables。

已完成第三切片：账号统计、用量和临时不可调度状态查询进入 Query owner；两个统计弹窗、用量单元格和临时状态弹窗改为直接依赖 Query/Action owner，兼容 datasource 保持同名导出与 `accountsAPI` 函数身份。

已完成第四切片：Grok 额度探测组件直接依赖平台 datasource；Ollama Cloud 状态读取与配置动作分别进入账号 Query/Action owner，编辑 widget 不再经过统一 admin barrel，兼容 datasource 继续提供原有方法。

已完成第五切片：账号连接测试的两个弹窗直接依赖账号 Query 的可用模型查询；SSE 测试请求、Authorization、Abort 和事件解析保持原有实现，兼容 datasource 继续提供原方法。

已完成第六切片：批量编辑对话框直接依赖账号 Action 的混合渠道风险检查和批量更新；筛选目标与所选账号两种 payload、409 确认回退和写后刷新时机保持不变，兼容 datasource 继续提供同名方法。

已完成第七切片：账号额度通知 composable 直接依赖 `admin-settings` 的设置查询 owner；全局开关异步加载、失败关闭和账号 extra 阈值写入语义保持不变，不再通过统一 admin barrel 访问其他 feature。

已完成第八切片：定时测试面板直接依赖 `scheduledTestsDatasource` 的计划与结果接口；打开时加载、创建后刷新、局部启停/编辑、删除和结果展开时序保持不变，不再通过统一 admin barrel 访问同域 owner。

已完成第九切片：通用账号和 OpenAI OAuth 请求进入 `adminAccountOAuthActions`，Gemini、Antigravity 和 Grok OAuth composable 直接依赖各自平台 datasource，创建账号的 OAuth 兑换编排也直接调用新 owner；授权 URL、state/session、代理参数、code exchange、cookie 授权、refresh token 和旧服务器 capabilities fallback 保持原语义。旧 `accountsAPI` 继续导出相同函数身份，5 个 OAuth composable 不再经过统一 admin barrel。

已完成第十切片：`ReAuthAccountDialog.vue` 与 `AdminReAuthAccountDialog.vue` 直接依赖账号 Action/OAuth Action owner；普通重新授权继续按 `update -> clear-error` 顺序写入，管理员流程继续使用 `apply-oauth-credentials` 增量合并 extra、清理错误并失效服务端 token cache。各平台 code exchange、cookie 授权、代理参数、凭据转换、成功事件与关闭时机保持不变，兼容 `accountsAPI` 继续导出相同函数身份。

已完成第十一切片：创建、更新、混合渠道预检、Codex session/PAT 导入、上游模型同步和 CPA 测试进入账号 Action owner，Antigravity 默认映射进入 Query owner；`CreateAccountDialog.vue`、`EditAccountDialog.vue` 及其创建 OAuth/编辑提交编排直接依赖明确 owner。Web Search 全局开关与 TLS 指纹 profile 继续由 `admin-settings` datasource 所有，表单 watcher、风险确认、敏感字段 payload、创建后主动计费探测、事件和关闭时机保持不变，兼容 `accountsAPI` 保持相同函数身份。

已完成第十二切片：CRS 预览进入账号 Query owner，数据导入和 CRS 同步进入账号 Action owner；`ImportDataDialog.vue` 与 `SyncFromCrsDialog.vue` 不再经过统一 admin barrel。多文件合并、逐文件头校验、导入结果统计、默认分组绑定字段、部分成功后的关闭刷新、CRS 自动选择/手动取消、代理同步选项、成功事件和 `180000ms` timeout 保持不变，`admin-accounts` 运行时 `@/api/admin` 引用归零。

已完成第十三切片：`ClaudeModel`、临时不可调度状态、账号创建/更新、混合渠道预检和 Codex session/PAT 导入 DTO 迁入 `admin-accounts/data/dtos/adminAccountDtos.ts`；Query、Action、账号页、创建/编辑编排和连接测试组件直接依赖 feature owner。`src/types/gateway.ts` 不再声明这些账号专属类型，`@/types` 保留兼容转发，未改变 API 字段或请求 payload。

停止条件：如果拆分产生大量一对一包装、测试替身显著膨胀或调用链更难追踪，退回 `presentation -> queries/actions -> network` 三层，不继续增加 Application/Repository 抽象。

### 阶段 3：迁移复杂管理域

- [ ] `admin-settings` 按设置子域拆 DTO、加载 Query 和保存 Action。
- [ ] `admin-ops` 按 snapshot、日志、错误详情和指标拆只读查询。
- [ ] `admin-users` 迁移用户管理专属 DTO 和旧 admin barrel 调用。
- [ ] `admin-groups` 迁移分组、组合路由和倍率协议 owner。
- [ ] `admin-usage` 消除对 `admin-users`、`admin-ops` 私有 presentation 的直接依赖。
- [ ] `admin-orders` 与 `billing` 提取稳定的 payment 共享契约和格式化能力。

已完成阶段 3 的第一个切片：邮件模板列表与详情进入 `adminEmailTemplateQueries.ts`，更新、恢复官方版本和预览进入 `adminEmailTemplateActions.ts`，8 个邮件模板协议类型进入 `data/dtos/adminEmailTemplateDtos.ts`。`EmailTemplateEditor.vue` 直接依赖 Query、Action、DTO 与核心 App Store，不再经过 `@/api` 或 `@/stores`；`adminSettingsDatasource.ts` 继续保留同名导出与 `settingsAPI` 函数身份，兼容旧消费者。

该切片未改变 URL、路径参数编码、请求 payload、首次选择、模板加载、预览刷新、保存/恢复反馈或路由 chunk；精确 legacy barrel 基线从 100 条降至 98 条（`@/api` 20、`@/api/admin` 37、`@/stores` 41）。

已完成阶段 3 的第二个切片：面板限流协议、默认值和旧响应归一化进入 `data/dtos/adminPanelRateLimitDtos.ts`，读取与保存分别进入 `adminPanelRateLimitQueries.ts` 和 `adminPanelRateLimitActions.ts`。`PanelRateLimitSettingsCard.vue` 直接依赖这些 owner 与核心 App Store，不再经过 `@/api` 或 `@/stores`；中央 datasource 继续提供同名导出并保持 `settingsAPI` 函数身份。

该切片保留安全页首次打开时按需挂载、旧后端 404 静默隐藏、null/部分响应默认值、每分钟 0 到 100000 的边界、Enter 局部保存和反馈时序；精确 legacy barrel 基线从 98 条降至 96 条（`@/api` 19、`@/api/admin` 37、`@/stores` 40）。`admin-settings` 其余设置子域仍待迁移，因此本阶段清单保持未完成。

已完成阶段 3 的第三个切片：`adminSettingsStore.ts` 直接组合设置 datasource 与 `admin-orders` 管理支付 datasource；错误透传规则、TLS 指纹 profile 和 OpenAI Fast Policy 用户选择器直接调用既有明确 owner；`AdminComplianceDialog.vue` 直接依赖同域合规 Store 与核心 App Store，认证状态和登出跳转由 `App.vue` 组合。至此 `admin-settings` 运行时代码不再引用 `@/api`、`@/api/admin` 或 `@/stores` 兼容 barrel。

该切片保留 Store 的并发加载去重、`force` 刷新、`Promise.all` 请求顺序、localStorage 键与失败缓存回退；保留规则/TLS CRUD 与写后刷新、用户搜索 300ms 防抖和过期结果屏蔽、已删除用户回填，以及合规阻断、确认和登出跳转。精确 legacy barrel 基线从 96 条降至 91 条（`@/api` 18、`@/api/admin` 34、`@/stores` 39）。主设置 DTO、Query、Action 及其他设置子域仍待收口，因此阶段 3 清单保持未完成。

已完成阶段 3 的第四个切片：`SystemSettings`、`UpdateSettingsRequest` 及其 17 个基础协议类型进入 `data/dtos/adminSystemSettingsDtos.ts`，主设置读取与统一保存分别进入 `adminSystemSettingsQueries.ts` 和 `adminSystemSettingsActions.ts`。页面、同域 Store 与账号额度通知 composable 直接调用明确 Query/Action owner，表单与保存模块直接依赖 DTO owner；中央 datasource 从 1625 行降至 861 行，并继续兼容导出同名函数、类型与 `settingsAPI` 函数身份。

该切片保留 `/admin/settings` URL、部分更新 payload、应用后的完整响应、单次主设置加载、敏感保存 step-up、写响应回填、Web Search 保存、公开设置强制刷新、管理设置强制刷新和成功通知顺序；全部使用静态 import，未改变 Settings 路由 chunk。迁移未涉及 legacy barrel，精确基线保持 91 条；管理 API Key、网关策略和 Web Search 等独立设置子域仍待收口，因此阶段 3 清单保持未完成。

已完成阶段 3 的第五个切片：管理 API Key 的状态、权限、元数据和创建/更新请求等 5 个协议声明进入 `data/dtos/adminApiKeyDtos.ts`，scoped 列表与 legacy 状态读取进入 `adminApiKeyQueries.ts`，scoped 创建、更新、轮换、撤销与 legacy 重新生成、删除进入 `adminApiKeyActions.ts`。`useSettingsAdminApiKeys.ts` 直接依赖 Query、Action、DTO owner；中央 datasource 从 861 行降至 761 行，并继续兼容导出 8 个同名函数、5 个类型与原 `settingsAPI` 函数身份。

该切片保留全部 URL、路径参数编码、请求 payload 和响应；保留 scoped 列表失败时继续展示 legacy 卡片、创建与更新分支、空权限默认 `admin.read`、到期时间 ISO 转换、轮换/撤销确认、写后列表刷新、legacy 掩码、反馈与复制时序。全部使用静态 import，未改变 Settings 路由 chunk；迁移未涉及 legacy barrel，精确基线保持 91 条，网关策略和 Web Search 等独立设置子域仍待收口。

已完成阶段 3 的第六个切片：Web Search provider、模拟配置、搜索/测试结果与用量重置请求等 5 个协议声明进入 `data/dtos/adminWebSearchDtos.ts`，模拟配置读取进入 `adminWebSearchQueries.ts`，配置保存、连通性测试和用量重置进入 `adminWebSearchActions.ts`。`useSettingsWebSearch.ts`、账号创建/编辑对话框和渠道页直接依赖明确 owner；中央 datasource 从 761 行降至 720 行，并继续兼容导出同名函数、类型与原 `settingsAPI` 函数身份。

该切片保留全部 URL、GET/PUT/POST payload、响应与 reset 的 `void` 语义；保留设置和代理并行加载、代理失败回退、旧后端 404 静默隐藏、配额校验/归一化、UTC 订阅日期转换、默认测试查询、重置确认与本地配额回填，以及复制和反馈时序。主设置保存顺序与 Settings 静态路由 chunk 不变；迁移未涉及 legacy barrel，精确基线保持 91 条，网关策略等独立设置子域仍待收口。

已完成阶段 3 的第七个切片：529 过载冷却、429 限流冷却和全局临时不可调度等 3 个协议声明进入 `data/dtos/adminSchedulerResilienceDtos.ts`，对应读取进入 `adminSchedulerResilienceQueries.ts`，保存进入 `adminSchedulerResilienceActions.ts`。`useSettingsGatewayPolicies.ts` 对这 6 个请求直接依赖明确 owner；中央 datasource 从 720 行降至 671 行，并继续兼容导出同名函数、类型与原 `settingsAPI` 函数身份。

该切片保留 3 组 URL、完整 PUT payload 与响应、表单默认值、加载失败静默回退、保存 loading 状态、响应回填和成功/失败反馈时序；全局临时不可调度开关的页面加载/保存行为及 Settings 静态路由 chunk 不变。迁移未涉及 legacy barrel，精确基线保持 91 条；Stream Timeout、Rectifier 和 Beta Policy 仍按独立协议后续收口。

已完成阶段 3 的第八个切片：Stream Timeout 的响应头超时降级、检测阈值和处置动作等 7 个协议字段进入 `data/dtos/adminStreamTimeoutDtos.ts`，读取与保存分别进入 `adminStreamTimeoutQueries.ts` 和 `adminStreamTimeoutActions.ts`。`useSettingsGatewayPolicies.ts` 直接依赖明确 Query/Action owner；中央 datasource 从 671 行降至 635 行，并继续兼容导出同名函数、类型与原 `settingsAPI` 函数身份。

该切片保留 `/admin/settings/stream-timeout` GET/PUT、完整七字段 payload 与响应、响应头超时降级独立开关、加载失败静默回退、加载/保存状态、响应回填和成功/失败反馈时序。全部使用静态 import，未改变 Settings 路由 chunk；迁移未涉及 legacy barrel，精确基线保持 91 条，Rectifier 和 Beta Policy 仍按独立协议后续收口。

已完成阶段 3 的第九个切片：Rectifier 的总开关、思考签名、思考预算、显示模式、API Key 签名与自定义模式等 6 个协议字段进入 `data/dtos/adminRectifierDtos.ts`，读取与保存分别进入 `adminRectifierQueries.ts` 和 `adminRectifierActions.ts`。`useSettingsGatewayPolicies.ts` 直接依赖明确 Query/Action owner，中央 datasource 在上一轮可复现隔离基线上从 635 行降至 594 行；当前并行后端模式精简组合态中的同一拆分从 327 行降至 286 行，并继续兼容导出同名函数、类型与原 `settingsAPI` 函数身份。

该切片保留 `/admin/settings/rectifier` GET/PUT、完整六字段 payload 与响应、`display_only` 安全默认值、旧数据 `apikey_signature_patterns: null` 的空数组回退、保存时仅过滤空白模式、加载失败静默回退、加载/保存状态、响应回填和成功/失败反馈时序。全部使用静态 import，未改变 Settings 路由 chunk；迁移本身未涉及 legacy barrel，当前精确基线的下降来自并行后端模式精简，Beta Policy 仍按独立协议后续收口。

已完成阶段 3 的第十个切片：Beta Policy 的规则动作、作用域、模型白名单和回退行为进入 `data/dtos/adminBetaPolicyDtos.ts`，读取与保存分别进入 `adminBetaPolicyQueries.ts` 和 `adminBetaPolicyActions.ts`。`useSettingsGatewayPolicies.ts` 直接依赖明确 Query/Action owner，中央 datasource 从 286 行降至 248 行，并继续兼容导出同名函数、类型与原 `settingsAPI` 函数身份。

该切片保留 `/admin/settings/beta-policy` GET/PUT、完整规则响应、加载失败静默回退、加载/保存状态、响应回填和成功/失败反馈时序；保存时过滤空白模型规则，无有效白名单时省略白名单及回退字段，有白名单时默认回退为 `pass`，仅在回退动作为 `block` 时保留回退错误。全部使用静态 import，未改变 Settings 路由 chunk；迁移未涉及 legacy barrel，当前精确基线保持 35 条，中央 datasource 仅剩 SMTP 测试和测试邮件发送 helper 待收口。

完成条件：管理端复杂域不再依赖统一 `adminAPI` 对象，跨域依赖具有明确公开 owner。

### 阶段 4：迁移用户域

- [ ] 迁移 `auth` 与 `profile`，保持内存 access token 和 HttpOnly refresh cookie 不变量。
- [ ] 迁移 `billing` 与 `subscriptions`，保持支付 SDK 延迟加载和回调恢复行为。
- [ ] 迁移 `keys` 与 `usage`，保持筛选、分页、统计和路由查询语义。
- [ ] 迁移 `channels-user`、`model-plaza` 和 channel monitor 类型依赖。
- [ ] 对剩余简单 feature 仅执行 owner 收口，不机械添加 Domain/Mapper。

完成条件：用户域不再通过顶层兼容 barrel 访问 API 或 Store。

### 阶段 5：清理中央类型和兼容层

- [ ] 将 `src/types/` 中单一 feature 专属类型迁回 owner。
- [ ] 为真正共享的协议建立小而稳定的公共契约。
- [ ] 确认运行时代码对 `src/api/` 和 `src/stores/` 的引用为零。
- [ ] 删除 `src/api/index.ts`、`src/api/admin/index.ts` 和 `src/stores/index.ts`。
- [ ] 移除迁移基线并将架构规则提升为全量硬门禁。
- [ ] 更新前端索引、代码地图和请求链路文档。

完成条件：兼容层删除后，全量测试和生产构建仍通过。

## 6. 兼容性约束

架构迁移不得破坏以下行为：

- 后端 URL、HTTP 方法、JSON 字段、SSE 和错误格式保持不变。
- 可选字段、旧响应和滚动升级兼容语义保持不变。
- access token 仅保存在内存，refresh credential 继续使用 HttpOnly cookie。
- 页面 loading、empty、error、分页、筛选和选择状态保持不变。
- AbortController、搜索防抖、ETag、轮询和写后刷新时机保持不变。
- 静态 import 和现有路由懒加载边界保持不变，不意外扩大首屏 chunk。
- 前端权限只负责体验，不能替代后端鉴权。
- 不修改 `backend/internal/transport/webassets/dist/` 生成产物。

## 7. 验证策略

单个 feature 迁移至少执行：

```sh
cd frontend
pnpm exec vitest run src/features/<domain>
pnpm exec eslint src/features/<domain> --ext .ts,.vue
pnpm run typecheck
```

每个迁移批次执行：

```sh
cd frontend
pnpm run lint:check
pnpm run test:run
pnpm run build
```

文档和最终收口执行：

```sh
make check-docs
make test-frontend
```

最终批次还应使用生产 Docker 构建验证嵌入式前端，并在实际浏览器检查桌面和移动端关键路径：登录、账号管理、设置保存、用量查询、订阅与支付。

## 8. 验收指标

| 指标 | 目标 |
| --- | ---: |
| 运行时 `@/api`、`@/api/admin` 引用 | 0 |
| 运行时 `@/stores` 引用 | 0 |
| 未声明的跨 feature 私有 presentation 依赖 | 0 |
| Domain 对 Vue、Pinia、Router、Axios 的依赖 | 0 |
| 超过 1500 有效行的运行时 TypeScript/Vue 模块 | 0 |
| 新增无归属 barrel | 0 |
| 因架构迁移产生的后端协议变化 | 0 |
| 新增前端运行时依赖 | 默认 0，专项评审后例外 |
| lint、typecheck、相关测试和生产 build | 全部通过 |

不以目录数量、Domain 文件数量或 Mapper 数量作为成功指标。成功标准是 owner 清晰、依赖可检查、请求生命周期可追踪，并且行为没有回归。

## 9. 提交与回滚

- 一个提交只迁移一个 feature 或一个明确子域。
- 兼容 barrel 保留到消费者归零并完成回归验证后再删除。
- 不在同一提交中混入 UI 重设计、后端协议变化或无关格式化。
- 每批迁移前记录请求与交互基线，失败时可以按 feature 单独回滚。
- 不使用全仓库自动搬迁替代逐 owner 审查。
- 工作区存在其他修改时，必须与其协作，不得覆盖、还原或重新格式化无关文件。

## 10. 当前进度与接手位置

`admin-accounts` 的页面列表、统计、用量、模型、上游计费、批量编辑、额度通知、定时测试、OAuth、重新授权、创建/编辑、数据导入、CRS 预览/同步和账号专属 DTO 已经进入明确 owner。阶段 3 已开始迁移 `admin-settings`；邮件模板、面板限流、主设置文档、管理 API Key、Web Search、调度韧性、Stream Timeout、Rectifier 和 Beta Policy 设置已完成 DTO、Query、Action 收口，该 feature 的剩余运行时 legacy barrel 引用也已清零。并行后端模式精简同步移除了其他 feature 的旧入口，当前精确 legacy barrel 基线为 35 条。

2026-08-03 收口验证记录：

- 定向测试通过，共 3 个测试文件、16 个测试；`admin-accounts` 回归通过，共 43 个测试文件、361 个测试。
- 宿主机全局 lint 和 typecheck 通过；Docker 全量前端 lint、typecheck 和测试通过，共 257 个测试文件、1652 个测试。
- 文档检查通过；生产镜像 `sub2api-frontend-arch-runtime:20260803` 构建成功，并在隔离 PostgreSQL、Redis 环境中完成迁移和自动初始化，`/health` 返回正常状态。
- 实际浏览器完成首页、登录页、管理员登录、仪表盘和账号管理页冒烟验证；账号管理页正常显示筛选、操作栏与空数据表格，新的已认证页面没有控制台错误。

2026-08-04 OAuth Action 切片验证记录：

- OAuth owner 定向验证通过，共 5 个测试文件、20 个测试；`admin-accounts` 回归通过，共 44 个测试文件、365 个测试。
- 宿主机全局 lint 和 typecheck 通过；Docker 全量前端 lint、typecheck、测试和生产 build 通过，共 261 个测试文件、1672 个测试。
- 正式多阶段镜像 `sub2api-frontend-arch-runtime:20260804-oauth` 构建成功，确认生产前端可嵌入 Go 后端二进制。

2026-08-04 重新授权切片验证记录：

- 定向验证通过，共 6 个测试文件、26 个测试；`admin-accounts` 回归通过，共 44 个测试文件、367 个测试。
- 宿主机 lint 和 typecheck 通过；Docker 全量前端 lint、typecheck、测试和生产 build 通过，共 261 个测试文件、1674 个测试。
- Docker 隔离验证镜像为 `sub2api-frontend-reauth-test:20260804-final`；正式多阶段运行时镜像 `sub2api-frontend-arch-runtime:20260804-reauth` 构建成功（`linux/arm64`，manifest `sha256:00981ff088f191239a358f87ee359af7bf2aa62c5b885fc8b7de5377f31aa20e`）。

2026-08-04 创建/编辑切片验证记录：

- 定向验证通过，共 9 个测试文件、115 个测试；`admin-accounts` 回归通过，共 44 个测试文件、371 个测试。
- 宿主机全局 lint 和 typecheck 通过；Docker 全量验证和正式多阶段运行时镜像已在本切片最终收口后补充。
- Docker 全量验证镜像为 `sub2api-frontend-create-edit-test:20260804`（261 个文件、1678 项测试、lint/typecheck/build 通过）；正式多阶段运行时镜像为 `sub2api-frontend-arch-runtime:20260804-create-edit`（`linux/arm64`，约 41.2 MB，manifest `sha256:1f8d8107b16864d15722d5814441186f30433c169f084784a905c71c23910dec`）。

2026-08-04 导入/CRS 同步切片验证记录：

- `adminAccountQueries.ts` 新增 CRS 预览 owner；`adminAccountActions.ts` 收口数据导入与 CRS 同步，保留默认分组绑定字段、结果统计、预览选择和 `180000ms` 同步 timeout。
- `ImportDataDialog.vue` 和 `SyncFromCrsDialog.vue` 不再依赖 `@/api/admin`；兼容 `accountsAPI` 继续保持原函数身份。
- 定向验证通过，共 5 个测试文件、38 个测试；`admin-accounts` 回归通过，共 45 个测试文件、377 个测试；宿主机全局 lint 和 typecheck 通过。
- 当前精确 legacy barrel 基线为 100 条，`admin-accounts` 的 `@/api/admin` 运行时入口为 0 条。
- Docker 隔离验证镜像 `sub2api-frontend-import-sync-test-suite:20260804` 内的全局 lint、typecheck、262 个测试文件/1684 项测试和 production build 全部通过（`linux/arm64`，manifest `sha256:11ae3358c91f117bbbeb2a29b17b5de3fd34cfaeea057c20ece66a5c76a4835a`）。
- 正式多阶段运行时镜像 `sub2api-frontend-arch-runtime:20260804-import-sync` 构建成功（`linux/arm64`，约 41.2 MB，manifest `sha256:404d3ec65cfa9d848827e90541bdfea7f7a6ab81e7f9244d3e4f9867850e8f32`）。

2026-08-04 账号 DTO 切片验证记录：

- `adminAccountDtos.ts` 收口 14 个账号专属协议类型；`gateway.ts` 删除对应声明，`@/types` 保留兼容转发，架构测试锁定 owner 和声明边界。
- 定向验证通过，共 3 个测试文件、30 个测试；`admin-accounts` 回归通过，共 45 个测试文件、378 个测试；宿主机全局 lint、typecheck、全量测试（262 个测试文件/1685 项）和 production build 全部通过。
- Docker 隔离验证镜像 `sub2api-frontend-dto-test-suite:20260804` 内的全局 lint、typecheck、262 个测试文件/1685 项测试和 production build 全部通过（`linux/arm64`，manifest `sha256:7291373296e2eb92aa7a5cc67348a98ce30462b0763f472749dbc9523def2c4f`）。
- 正式多阶段运行时镜像 `sub2api-frontend-arch-runtime:20260804-dto` 构建成功（`linux/arm64`，40,262,958 bytes，manifest `sha256:c08b9edf650e65616a51f7e8eb7d60b021911ec1c1875a195ace04541bdbd9e2`）；容器内 `sub2api --version` 正常返回 `Sub2API 0.1.173`。

2026-08-06 `admin-settings` 邮件模板切片验证记录：

- 邮件模板请求契约与架构边界定向测试通过，共 1 个测试文件、5 个测试；`admin-settings` 回归通过，共 12 个测试文件、91 个测试。
- 在与当前 `package.json`、`pnpm-lock.yaml` 哈希一致的 Node 24 / pnpm 11.17 Docker 环境中，全局 lint、typecheck、266 个测试文件/1732 项测试和 production build 全部通过。
- production build 继续报告既有的动态/静态导入和大 chunk 警告，但路由构建成功；本切片使用静态 import，未新增运行时依赖或改变 Settings 路由 chunk 边界。
- 文档检查和 `git diff --check` 通过，工作区未生成或修改嵌入式前端产物。

2026-08-06 `admin-settings` 面板限流切片验证记录：

- Query/Action 契约、归一化边界、组件行为和 Settings 页面挂载定向验证通过，共 3 个测试文件、52 个测试；`admin-settings` 回归通过，共 13 个测试文件、96 个测试。
- 在与当前锁文件一致的 Node 24 / pnpm 11.17 Docker 环境中，全局 lint、typecheck、267 个测试文件/1737 项测试和 production build 全部通过。
- production build 仅报告既有的动态/静态导入和大 chunk 警告；本切片使用静态 import，未新增运行时依赖或改变 Settings 路由 chunk 边界。
- 文档检查和 `git diff --check` 通过，工作区未生成或修改嵌入式前端产物。

2026-08-06 `admin-settings` legacy owner 切片验证记录：

- Store 缓存/并发/失败回退、用户选择器、合规对话框和 owner 边界定向验证通过，共 4 个测试文件、11 个测试；`SettingsPage.spec.ts` 增加底层请求哨兵后 41 个测试无真实网络请求。
- `admin-settings` 回归通过，共 16 个测试文件、104 个测试；定向 ESLint 和全量 typecheck 在 Node 24 / pnpm 11.17 Docker 环境中通过。
- Vitest 文件系统白名单覆盖仓库内 `docs/legal`，使合规对话框读取的生产法律文档可以被真实挂载测试，不再只依赖源码断言。
- 以 `HEAD + admin-settings` 三个切片文件组成的隔离快照完成 Docker 全量验证：全局 lint、typecheck、270 个测试文件/1745 项测试和 production build 全部通过；build 转换 1218 个模块，耗时 1 分 37 秒，仅保留既有动态/静态导入重叠和大 chunk 警告。
- 实时工作区同时存在未纳入本切片的侧栏与登录页重构；组合态全局 lint/typecheck 当前由 `AppSidebar.vue` 未使用图标和 `LoginPage.vue` 陈旧债务基线阻断，待并行改动收口后重新执行，不能用隔离快照结果替代组合态验收。

2026-08-06 `admin-settings` 主设置 DTO/Query/Action 切片验证记录：

- 主设置 URL、payload、响应、兼容函数身份和 owner 边界，以及默认值 helper、保存模块和跨 feature 额度开关的 Docker 定向验证通过，共 4 个测试文件、29 个测试；Settings 页面单独验证一次主设置加载及 `主设置保存 -> Web Search 保存 -> 公开设置刷新 -> 管理设置刷新 -> 成功通知` 顺序。
- 以 `HEAD + admin-settings` 四个 owner 切片组成的隔离快照完成 Docker 全量验证：全局 lint、typecheck、271 个测试文件/1751 项测试和 production build 全部通过；build 转换 1220 个模块，耗时 1 分 23 秒，仅保留既有动态/静态 import 重叠和大 chunk 警告。
- 实时组合工作区还包含未纳入本切片的后端模式精简：`SettingsPage.vue` 已移除 agreement、features、users、payment 四个 tab，`adminSettingsStore.ts` 已移除支付配置状态，但相邻测试和架构基线尚未同步；当前 Docker `admin-settings` 回归为 17 个文件中 14 个通过、110 项中 87 项通过，23 项失败。
- 实时组合工作区全局 lint 当前为 2 个错误和 11 个未使用告警，typecheck 为 12 个错误，集中在 `AppSidebar.vue`、`LoginPage.vue`、精简后的 `SettingsPage.vue` 和 `useSettingsPage.ts`；这些并行变更收口前不能把隔离快照结果表述为组合态全局通过。

2026-08-06 `admin-settings` 管理 API Key DTO/Query/Action 切片验证记录：

- scoped 与 legacy 请求契约、路径编码、响应、兼容函数身份和 owner 边界的 Docker 定向验证通过，共 2 个测试文件、12 个测试；隔离 `admin-settings` 回归通过，共 18 个测试文件、116 个测试，Settings 页面底层请求哨兵未发现真实网络漏出。
- 以 `HEAD + admin-settings` 五个 owner 切片组成的隔离快照完成 Docker 全量验证：全局 lint、typecheck、272 个测试文件/1757 项测试和 production build 全部通过；build 转换 1222 个模块，耗时 1 分 37 秒，仅保留既有动态/静态 import 重叠和大 chunk 警告。
- 实时组合工作区 Docker `admin-settings` 回归为 18 个文件中 14 个通过、114 项中 91 项通过，23 项失败；全局 lint 仍为 2 个错误和 11 个未使用告警，typecheck 仍为 12 个错误。阻断仍来自后端模式精简后的 tab、支付 Store、侧栏和登录页，不涉及本切片的新 owner。

2026-08-06 `admin-settings` Web Search DTO/Query/Action 切片验证记录：

- 请求契约、兼容函数身份、直接消费者和保存顺序的 Docker 定向验证通过，共 7 个测试文件、90 个测试，并单独通过 Settings 保存顺序哨兵；隔离 `admin-settings` 回归通过，共 19 个测试文件、123 个测试。
- 以 `HEAD + admin-settings` 六个 owner 切片组成的隔离快照完成 Docker 全量验证：全局 lint、`vue-tsc --noEmit`、`vue-tsc -b`、273 个测试文件/1764 项测试和 Vite production build 全部通过；build 转换 1224 个模块，耗时 48 秒，仅保留既有动态/静态 import 重叠和大 chunk 警告。
- 实时组合工作区 Docker `admin-settings` 回归仍为 19 个文件中 100 项通过、23 项失败；全局 lint 为 2 个错误和 11 个未使用告警，typecheck 为 12 个错误。阻断仍来自后端模式精简后的 tab、支付 Store、侧栏、登录页和订阅加载变量，不涉及本切片的新 owner。

2026-08-06 `admin-settings` 调度韧性 DTO/Query/Action 切片验证记录：

- 3 组 GET/PUT 契约、兼容函数身份和直接消费者的 Docker 定向验证通过；新增 datasource 与 Settings 页面共 2 个测试文件、49 个测试，隔离 `admin-settings` 回归通过，共 20 个测试文件、131 个测试。
- 以 `HEAD + admin-settings` 七个 owner 切片组成的隔离快照完成 Docker 全量验证：全局 lint、`vue-tsc --noEmit`、`vue-tsc -b`、274 个测试文件/1772 项测试和 Vite production build 全部通过；build 转换 1226 个模块，耗时 49.32 秒，仅保留既有动态/静态 import 重叠和大 chunk 警告。
- 实时组合工作区 Docker `admin-settings` 回归为 20 个文件中 17 个通过、131 项中 108 项通过，23 项失败；全局 lint 仍为 2 个错误和 11 个未使用告警，typecheck 仍为 12 个错误。阻断仍来自后端模式精简后的 tab、支付 Store、侧栏、登录页和订阅加载变量，不涉及本切片的新 owner。

2026-08-07 `admin-settings` Stream Timeout DTO/Query/Action 切片验证记录：

- GET/PUT 契约、完整七字段 payload、兼容函数身份和直接消费者的 Docker 定向验证通过；新增 datasource 与 Settings 页面共 2 个测试文件、45 个测试，隔离 `admin-settings` 回归通过，共 21 个测试文件、135 个测试。
- 以 `HEAD + admin-settings` 八个 owner 切片组成的隔离快照完成 Docker 全量验证：全局 lint、`vue-tsc --noEmit`、`vue-tsc -b`、275 个测试文件/1776 项测试和 Vite production build 全部通过；build 转换 1228 个模块，耗时 1 分 16 秒，仅保留既有动态/静态 import 重叠和大 chunk 警告。
- 实时组合工作区 Docker `admin-settings` 回归为 21 个文件中 18 个通过、135 项中 112 项通过，23 项失败；全局 lint 仍为 2 个错误和 11 个未使用告警，typecheck 仍为 12 个错误。阻断仍来自后端模式精简后的 tab、支付 Store、侧栏、登录页和订阅加载变量，不涉及本切片的新 owner。
- 文档检查、`git diff --check` 和新增文件尾随空白扫描通过；精确 legacy barrel 基线仍为 91 条，`admin-settings` 运行时引用为 0，工作区未生成或修改嵌入式前端产物。

2026-08-07 `admin-settings` Rectifier DTO/Query/Action 切片验证记录：

- GET/PUT 契约、完整六字段 payload、兼容函数身份、空模式过滤、旧 null 模式归一化、静默加载回退和反馈时序的 Docker 定向验证通过；新增 datasource 测试 1 个文件/7 项，与 Settings 页面合并为 2 个文件/48 项，隔离 `admin-settings` 回归通过，共 22 个测试文件/142 项测试。
- 以上一轮八个 owner 切片的全绿快照为基线，只叠加 Rectifier owner 和相邻测试后完成 Docker 全量验证：全局 lint、`vue-tsc --noEmit`、`vue-tsc -b`、276 个测试文件/1783 项测试和 Vite production build 全部通过；build 转换 1230 个模块，耗时 18.73 秒，仅保留既有动态/静态 import 重叠和大 chunk 警告。
- 当前并行精简组合态的 Docker `admin-settings` 回归为 17 个文件/79 项测试全部通过，全局 lint、`vue-tsc --noEmit`、`vue-tsc -b` 和 production build 通过；build 转换 831 个模块，耗时 12.02 秒。组合态全量测试为 196 个文件中 187 个通过、1189 项中 1177 项通过，剩余 9 个文件/12 项失败来自已删除页面的陈旧源码断言、支付请求标记、分组字段、Prompt Audit 路由和用户用量可见性测试，不涉及本切片。
- 文档检查、`git diff --check` 和新增文件尾随空白扫描通过；当前精确 legacy barrel 基线为 35 条，`admin-settings` 运行时引用为 0，宿主机工作区未生成或修改嵌入式前端产物。

2026-08-07 `admin-settings` Beta Policy DTO/Query/Action 切片验证记录：

- GET/PUT 契约、全部规则字段、兼容函数身份、加载/保存状态、静默加载回退、响应回填、空模型规则过滤、空白名单省略、默认 `pass` 回退、仅 `block` 保留回退错误和反馈时序的 Docker 定向验证通过，共 1 个测试文件/8 项；组合态 `admin-settings` 回归通过，共 18 个测试文件/87 项。
- 使用与当前锁文件一致的 Node 24 / pnpm 11.17 Docker 环境完成组合态全量验证：全局 ESLint、`vue-tsc --noEmit`、`vue-tsc -b`、189 个测试文件/1173 项测试和 Vite production build 全部通过；build 转换 817 个模块，耗时 19.80 秒，仅报告既有动态/静态 import 重叠和大 chunk 警告。
- Docker 提供生产 bundle 和固定本地 API fixture 后完成实际浏览器验证：桌面 1280x720 下六个设置页签均可切换、页面无水平溢出，Beta 规则新增/填写与两次 PUT 保存成功，服务端响应正常回填且成功反馈出现；移动端 390x844 下无文档溢出或卡片越界，可横向滚动页签，侧栏可正常打开和关闭。目标设置页在两种视口下均无控制台 warning/error，测试未接触数据库或真实应用数据。

下一步收口中央 datasource 中剩余的 SMTP 连接测试和测试邮件发送 helper。
