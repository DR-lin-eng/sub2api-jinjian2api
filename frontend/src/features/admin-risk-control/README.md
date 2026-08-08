# Admin Risk Control

风险控制 feature 负责网关审核配置、运行状态和命中记录。

- `data/datasources/`: 风控配置、状态、日志和管理动作协议。
- `presentation/pages/`: 路由级加载、保存、日志刷新和轮询生命周期。
- `presentation/widgets/`: 运行概览、记录表格和输入详情展示。
- `presentation/composables/`: 轮询、表单归一化和选项解析。

页面是请求和状态 owner。记录 widget 只展示并上抛筛选和分页动作；resolver 必须保持旧配置缺失字段的默认值。扩展配置时同步检查 load/save 双向转换，并保持唯一的 15 秒状态轮询及卸载清理。

验证入口：

```sh
pnpm exec vitest run src/features/admin-risk-control
pnpm run typecheck
```
