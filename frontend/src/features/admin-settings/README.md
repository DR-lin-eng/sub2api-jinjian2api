# Admin Settings

系统设置 feature 负责设置读取、编辑、敏感保存与后台配置对话框。

- `data/dtos/adminEmailTemplateDtos.ts`: 邮件模板列表、详情、更新和预览协议 owner。
- `data/datasources/adminEmailTemplateQueries.ts`: 邮件模板列表与详情只读请求。
- `data/datasources/adminEmailTemplateActions.ts`: 邮件模板更新、恢复官方版本和预览动作。
- `data/dtos/adminPanelRateLimitDtos.ts`: 面板限流协议、默认值与滚动升级响应归一化。
- `data/datasources/adminPanelRateLimitQueries.ts`: 面板限流设置只读请求。
- `data/datasources/adminPanelRateLimitActions.ts`: 面板限流设置保存动作。
- `data/dtos/adminSystemSettingsDtos.ts`: 主设置读取、统一更新及其客户端 IP、注册默认值、平台限额和 Fast Policy 基础协议 owner。
- `data/datasources/adminSystemSettingsQueries.ts`: 主设置文档只读请求。
- `data/datasources/adminSystemSettingsActions.ts`: 主设置统一保存动作。
- `data/dtos/adminApiKeyDtos.ts`: scoped 与 legacy 管理 API Key 状态、权限和写请求协议 owner。
- `data/datasources/adminApiKeyQueries.ts`: 管理 API Key 列表与 legacy 状态只读请求。
- `data/datasources/adminApiKeyActions.ts`: scoped 管理 API Key 创建、更新、轮换、撤销，以及 legacy 重新生成和删除动作。
- `data/dtos/adminWebSearchDtos.ts`: Web Search provider、模拟配置、搜索/测试结果与用量重置请求协议 owner。
- `data/datasources/adminWebSearchQueries.ts`: Web Search 模拟配置只读请求。
- `data/datasources/adminWebSearchActions.ts`: Web Search 模拟配置保存、连通性测试与用量重置动作。
- `data/dtos/adminSchedulerResilienceDtos.ts`: 529/429 冷却与全局临时不可调度协议 owner。
- `data/datasources/adminSchedulerResilienceQueries.ts`: 调度韧性设置只读请求。
- `data/datasources/adminSchedulerResilienceActions.ts`: 调度韧性设置保存动作。
- `data/dtos/adminStreamTimeoutDtos.ts`: Stream Timeout 响应头降级、检测阈值与处置协议 owner。
- `data/datasources/adminStreamTimeoutQueries.ts`: Stream Timeout 设置只读请求。
- `data/datasources/adminStreamTimeoutActions.ts`: Stream Timeout 设置保存动作。
- `data/dtos/adminRectifierDtos.ts`: Rectifier 总开关、思考整流、显示模式与 API Key 签名协议 owner。
- `data/datasources/adminRectifierQueries.ts`: Rectifier 设置只读请求。
- `data/datasources/adminRectifierActions.ts`: Rectifier 设置保存动作。
- `data/dtos/adminBetaPolicyDtos.ts`: Beta Policy 规则动作、作用域、模型白名单与回退协议 owner。
- `data/datasources/adminBetaPolicyQueries.ts`: Beta Policy 设置只读请求。
- `data/datasources/adminBetaPolicyActions.ts`: Beta Policy 设置保存动作。
- `data/datasources/adminSettingsDatasource.ts`: 尚未迁移的独立设置子域与纯 helper，并为已迁移调用保留兼容导出和 `settingsAPI` 函数身份。
- `data/datasources/`: 其他独立设置子域的管理端 API。
- `presentation/stores/adminSettingsStore.ts`: 缓存 Ops 与自定义菜单；直接依赖主设置 Query owner，并保留并发去重和失败时缓存回退。
- `presentation/pages/`: 路由级加载、保存、step-up 与对话框编排。
- `presentation/widgets/`: 规则、TLS 指纹、用户检索等组件直接依赖各自 datasource；合规对话框只依赖同域 Store 和核心 App Store，认证状态与登出由 `App.vue` 组合。
- `presentation/widgets/settings-tabs/`: 按设置领域拆分的 tab 和 panel。
- `presentation/widgets/settings-tabs/gateway-resilience/`: 临时不可调度、冷却、流超时、请求修正与策略设置卡片；直接复用页面 context，由网关韧性 panel 按原顺序装配。
- `presentation/widgets/settings-tabs/identity-providers/`: LinuxDo、邮箱 OAuth、微信、钉钉与 OIDC 静态设置卡片；直接复用页面 context，由身份源 panel 按原顺序装配。
- `presentation/composables/`: 页面局部控制器、表单初始化和纯转换；主设置、管理 API Key、Web Search、调度韧性、Stream Timeout、Rectifier 与 Beta Policy 设置直接依赖各自 Query/Action owner。
- `presentation/composables/settingsSavePreparation.ts`: 按页面既有顺序完成统一保存前的归一化与校验。
- `presentation/composables/settingsSavePayload.ts`: 按设置领域组装兼容 payload；新增字段放入所属 builder，不改变统一保存请求。
- `presentation/composables/settingsSaveResponse.ts`: 回填保存响应并清理敏感输入，保持后续缓存刷新与通知顺序。

新增设置项时，先确定所属 tab 和 datasource 字段，再把交互放入对应 controller。feature 内组件使用静态 import；不要把页面 context 提升为全局 Store，也不要通过 `@/api`、`@/api/admin` 或 `@/stores` 兼容 barrel 新增依赖。保留单次设置加载、统一保存、敏感操作 step-up 和按需挂载语义。

验证入口：

```sh
pnpm exec vitest run src/features/admin-settings
pnpm run typecheck
```
