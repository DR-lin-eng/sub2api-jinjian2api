# Admin Operations

运维仪表盘 feature 负责系统健康、实时流量、告警、并发和运行设置。

- `data/datasources/`: 运维快照、实时指标和管理动作协议。
- `presentation/pages/`: 路由级快照加载与卡片编排。
- `presentation/widgets/`: 工具栏、健康概览、指标网格和设置面板。
- `presentation/composables/`: 页面局部实时流量生命周期。

页面内 widget 使用静态 import，并继续归入原运维路由 chunk。新增指标优先扩展现有 snapshot 与对应 widget，保留混合版本部署所需的兼容回退，避免重新引入逐卡请求。

验证入口：

```sh
pnpm exec vitest run src/features/admin-ops
pnpm run typecheck
```
