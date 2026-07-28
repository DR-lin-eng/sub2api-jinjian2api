# Admin Settings

系统设置 feature 负责设置读取、编辑、敏感保存与后台配置对话框。

- `data/datasources/`: 设置协议、归一化规则和管理端 API。
- `presentation/pages/`: 路由级加载、保存、step-up 与对话框编排。
- `presentation/widgets/settings-tabs/`: 按设置领域拆分的 tab 和 panel。
- `presentation/composables/`: 页面局部控制器、表单初始化和纯转换。

新增设置项时，先确定所属 tab 和 datasource 字段，再把交互放入对应 controller。feature 内组件使用静态 import；不要把页面 context 提升为全局 Store，也不要通过 `@/api` 或 `@/stores` 兼容 barrel 新增依赖。保留单次设置加载、统一保存、敏感操作 step-up 和按需挂载语义。

验证入口：

```sh
pnpm exec vitest run src/features/admin-settings
pnpm run typecheck
```
