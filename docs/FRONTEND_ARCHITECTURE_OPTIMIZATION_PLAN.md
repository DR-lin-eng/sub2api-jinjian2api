# 前端架构优化计划

> 状态：实施中。阶段 1 的渐进式架构门禁已于 2026-08-03 落地；后续 feature 迁移仍按本路线逐批实施。
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
- [ ] 将账号专属 DTO 从 `src/types/gateway.ts` 迁回 feature data。
- [ ] 拆分账号 Query：列表、ETag、详情、统计、用量和只读探测。
- [ ] 拆分账号 Action：创建、更新、删除、授权、批量和导入导出。
- [ ] 保留重复操作幂等键、AbortController、ETag 和额度刷新行为。
- [ ] 将复杂表单校验、payload 构造和账号类型策略保留为纯函数。
- [ ] 替换该 feature 对 `adminAPI.accounts` 的兼容调用。
- [ ] 补充 DTO 兼容、Query 参数、Action payload 和页面请求生命周期测试。

已完成第一切片：列表/ETag、详情摘要、今日统计和上游费率快照迁入 Query owner；重复账号、上游计费探测和额度主动查询迁入 Action owner。旧 datasource 继续提供同名导出与 `accountsAPI`，今日统计和上游计费 composable 已移除统一 admin barrel 依赖，并同步缩小精确债务基线。

已完成第二切片：账号页使用的模型/探测设置查询、批量操作、导出和账号状态维护进入对应 owner；页面对账号、代理和分组的请求均改为直接 owner import，页面本身不再依赖 `adminAPI`，兼容 datasource 继续服务尚未迁移的 widgets/composables。

已完成第三切片：账号统计、用量和临时不可调度状态查询进入 Query owner；两个统计弹窗、用量单元格和临时状态弹窗改为直接依赖 Query/Action owner，兼容 datasource 保持同名导出与 `accountsAPI` 函数身份。

已完成第四切片：Grok 额度探测组件直接依赖平台 datasource；Ollama Cloud 状态读取与配置动作分别进入账号 Query/Action owner，编辑 widget 不再经过统一 admin barrel，兼容 datasource 继续提供原有方法。

已完成第五切片：账号连接测试的两个弹窗直接依赖账号 Query 的可用模型查询；SSE 测试请求、Authorization、Abort 和事件解析保持原有实现，兼容 datasource 继续提供原方法。

已完成第六切片：批量编辑对话框直接依赖账号 Action 的混合渠道风险检查和批量更新；筛选目标与所选账号两种 payload、409 确认回退和写后刷新时机保持不变，兼容 datasource 继续提供同名方法。

已完成第七切片：账号额度通知 composable 直接依赖 `admin-settings` 的设置查询 owner；全局开关异步加载、失败关闭和账号 extra 阈值写入语义保持不变，不再通过统一 admin barrel 访问其他 feature。

已完成第八切片：定时测试面板直接依赖 `scheduledTestsDatasource` 的计划与结果接口；打开时加载、创建后刷新、局部启停/编辑、删除和结果展开时序保持不变，不再通过统一 admin barrel 访问同域 owner。

停止条件：如果拆分产生大量一对一包装、测试替身显著膨胀或调用链更难追踪，退回 `presentation -> queries/actions -> network` 三层，不继续增加 Application/Repository 抽象。

### 阶段 3：迁移复杂管理域

- [ ] `admin-settings` 按设置子域拆 DTO、加载 Query 和保存 Action。
- [ ] `admin-ops` 按 snapshot、日志、错误详情和指标拆只读查询。
- [ ] `admin-users` 迁移用户管理专属 DTO 和旧 admin barrel 调用。
- [ ] `admin-groups` 迁移分组、组合路由和倍率协议 owner。
- [ ] `admin-usage` 消除对 `admin-users`、`admin-ops` 私有 presentation 的直接依赖。
- [ ] `admin-orders` 与 `billing` 提取稳定的 payment 共享契约和格式化能力。

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

截至第八切片，`admin-accounts` 的页面列表、统计、用量、模型、上游计费、批量编辑、额度通知和定时测试链路已经进入明确 owner。架构测试确认精确 legacy barrel 基线为 112 条，其中该 feature 的 `@/api/admin` 运行时入口剩 11 条。

2026-08-03 收口验证记录：

- 定向测试通过，共 3 个测试文件、16 个测试；`admin-accounts` 回归通过，共 43 个测试文件、361 个测试。
- 宿主机全局 lint 和 typecheck 通过；Docker 全量前端 lint、typecheck 和测试通过，共 257 个测试文件、1652 个测试。
- 文档检查通过；生产镜像 `sub2api-frontend-arch-runtime:20260803` 构建成功，并在隔离 PostgreSQL、Redis 环境中完成迁移和自动初始化，`/health` 返回正常状态。
- 实际浏览器完成首页、登录页、管理员登录、仪表盘和账号管理页冒烟验证；账号管理页正常显示筛选、操作栏与空数据表格，新的已认证页面没有控制台错误。

剩余账号 feature 入口按职责分为三组：

1. OAuth composable：`useAccountOAuth.ts`、`useOpenAIOAuth.ts`、`useAntigravityOAuth.ts`、`useGeminiOAuth.ts`、`useGrokOAuth.ts`。
2. 创建、编辑和重新授权：`CreateAccountDialog.vue`、`EditAccountDialog.vue`、`ReAuthAccountDialog.vue`、`AdminReAuthAccountDialog.vue`。
3. 导入同步：`ImportDataDialog.vue`、`SyncFromCrsDialog.vue`。

下一次应先处理 OAuth Action owner，再迁移重新授权流程；这些链路共享授权 URL、code exchange、token refresh 和 credentials 更新语义，必须同时保留代理参数、错误结构、敏感字段处理和写后刷新。之后再迁移导入同步，最后评估 `src/types/gateway.ts` 中账号专属 DTO。每移除一条入口仍需同步缩小精确基线并执行 Docker 全量验证。
