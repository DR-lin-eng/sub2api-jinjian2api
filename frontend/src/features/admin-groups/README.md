# Admin Groups

管理分组 feature 负责分组列表、创建/编辑、排序及定价和路由辅助对话框。

- `data/datasources/`: 分组协议、CRUD 和辅助配置 API。
- `presentation/pages/`: 列表查询、分页、筛选和对话框编排。
- `presentation/widgets/`: 共享编辑器、领域字段和辅助对话框。
- `presentation/composables/`: 可复用交互状态与纯转换。

创建与编辑使用共享的静态编辑器，但继续保留独立 form、watcher 和提交 payload；模式差异通过 typed context 或显式 props/actions 表达。不要复制整套编辑模板，不要用动态组件改变路由 chunk、挂载时机或表单状态。

验证入口：

```sh
pnpm exec vitest run src/features/admin-groups
pnpm run typecheck
```
