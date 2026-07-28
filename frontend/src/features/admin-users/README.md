# Admin Users

管理员用户 feature 负责用户列表、属性、分组、余额、平台额度和批量限制。

- `data/datasources/`: 用户管理、属性及批量查询协议。
- `presentation/pages/`: 主列表请求、选择状态、二级数据加载和对话框编排。
- `presentation/widgets/`: 表格工具栏及各领域编辑对话框。

`UsersPage.vue` 继续持有 AbortController、300ms 搜索防抖、50ms 二级数据延迟、localStorage 偏好和所有 API 调用。工具栏通过 props/emits 同步筛选与列设置，不自行发请求。新增列表字段时同时检查列可见性、批量 secondary-data 条件和旧偏好迁移。

验证入口：

```sh
pnpm exec vitest run src/features/admin-users
pnpm run typecheck
```
