# Batch Image

批量图片 feature 负责批任务创建、列表、重试、下载、详情预览和本地缩略图缓存。

- `data/datasources/`: 批任务、条目、模型和下载协议。
- `presentation/pages/`: 路由入口，仅装配 controller 与 workspace。
- `presentation/composables/useBatchImageGuideController.ts`: 请求、权限、8 秒轮询、表单和卸载清理 owner。
- `presentation/composables/batchImageAsyncLifecycle.ts`: 详情 generation、轮询单飞和 object URL 提交/释放原语。
- `presentation/widgets/`: 原工作区 DOM 与交互绑定，不直接发请求。
- `presentation/preview/`: IndexedDB 缩略图缓存及 object URL 生命周期。
- `presentation/resolvers/`: 错误、用户可见消息与 Agent 指令构建。

扩展任务状态或详情字段时同步检查 controller 的轮询终止条件、批量动作和 workspace 展示。预览缓存必须继续保持有界容量、过期清理和 object URL revoke；feature 内模块保持静态 import。

验证入口：

```sh
pnpm exec vitest run src/features/batch-image
pnpm run typecheck
```
