# Vue Router

本目录定义前端路由、访问元数据、导航守卫、页面标题和首次设置重定向。完整路由列表以 `index.ts` 为唯一事实源，不在 README 复制一份容易过期的清单。

## 文件索引

| 文件 | 作用 |
| --- | --- |
| `index.ts` | 路由记录、全局 guard、滚动恢复、预加载和 chunk 错误恢复 |
| `meta.d.ts` | `RouteMeta` 类型扩展 |
| `title.ts` | 站点名、i18n 和自定义菜单标题解析 |
| `__tests__/` | guard 辅助、标题和 setup 重定向测试 |

## 路由域

- `/setup`: 首次安装。
- 公共/认证：`/setup`、`/login` 与本地管理员会话恢复。
- 管理员自助：API Key、用量、资料、TOTP 与 Passkey。
- 管理：Ops、上游账号/分组/渠道/代理、设置和 Prompt Audit。
- `/:pathMatch(.*)*`: 404。

查精确路径或组件时：

```sh
rg -n 'path:|name:|component:' frontend/src/core/routes/index.ts
```

## Route Meta

`meta.d.ts` 当前定义：

| 字段 | 含义 |
| --- | --- |
| `requiresAuth` | 是否登录；未设置时默认为 `true` |
| `requiresAdmin` | 是否要求管理员 |
| `title`, `titleKey`, `descriptionKey` | 页面标题和 i18n 元数据 |
| `breadcrumbs`, `icon`, `hideInMenu` | 导航展示元数据 |

新增字段时同时修改 `meta.d.ts`、guard/标题消费者和测试。

## Guard 顺序

`beforeEach` 的主要顺序是：

1. 启动导航 loading，并首次恢复内存 access token。
2. 根据站点设置和路由元数据生成标题。
3. 处理 `/setup` 已完成重定向。
4. 验证登录和管理员角色。
5. 加载并执行管理员合规确认门禁。
6. 导航完成后停止 loading 并触发空闲预加载。

动态 import 在部署更新后可能失效。`router.onError` 对 chunk load error 做一次受控刷新；修改时必须保留防循环机制。

## 添加路由

1. 页面放入所属 `features/<domain>/presentation/pages/`；真正跨业务的公共页面才放入 `common/pages/`。
2. 使用 `() => import(...)` 懒加载。
3. 显式填写 `requiresAuth`、`requiresAdmin` 和功能开关 meta。
4. 添加 `titleKey`，并同步 locale。
5. 更新菜单可见性，但不要把菜单隐藏当作权限校验。
6. 为 guard 分支、setup/功能开关或复杂重定向添加测试。

后端仍必须执行对应 JWT、Admin 或 step-up 校验。前端 Router 只负责导航体验。
