# Frontend

本目录是 Sub2API 的 Vue 3 管理与用户界面，使用 TypeScript、Vite、Pinia、Vue Router、Tailwind CSS 和 Vitest。依赖统一由 pnpm 管理。

## 启动与构建

```sh
cd frontend
pnpm install --frozen-lockfile
pnpm run dev
```

Vite 默认监听 `3000`，后端代理默认指向 `http://localhost:8080`。可通过 `VITE_DEV_PORT` 和 `VITE_DEV_PROXY_TARGET` 覆盖。

```sh
pnpm run lint:check
pnpm run typecheck
pnpm run test:run
pnpm run build
```

生产构建输出到 `../backend/internal/transport/webassets/dist/`，由后端嵌入。不要直接编辑该生成目录。

## 源码索引

| 路径 | 作用 |
| --- | --- |
| `src/main.ts` | 应用启动、Pinia、公开设置、i18n 和 Router 初始化 |
| `src/App.vue` | 全局壳层和应用生命周期 |
| `src/router/` | 路由定义、守卫、标题和 setup 重定向 |
| `src/views/` | 路由级页面，按 `admin`, `user`, `auth`, `public`, `setup` 分域 |
| `src/components/` | 复用 UI 和领域组件 |
| `src/features/` | 自包含、可独立演进的前端功能 |
| `src/api/` | 共享 HTTP 客户端和领域 API |
| `src/stores/` | 跨页面 Pinia 状态 |
| `src/composables/` | 可复用交互与生命周期逻辑 |
| `src/types/` | API 与 UI TypeScript 类型 |
| `src/utils/` | 无 UI 状态的纯工具或格式化逻辑 |
| `src/i18n/locales/` | 多语言文案 |
| `src/styles/`, `src/style.css` | 全局样式和专题样式 |

## 页面分层

推荐依赖方向：

```text
router -> view -> component/composable/store -> api -> backend
```

- View 负责页面数据编排和页面级状态，不沉积大型可复用组件。
- Component 通过 props/events 暴露清晰边界；领域组件放入对应子目录。
- Composable 管理可复用交互、订阅和清理逻辑。
- Store 只保存跨页面共享、需要缓存或具备明确启动/停止生命周期的状态。
- API 模块负责请求与响应类型；token、刷新和统一错误处理集中在 `src/api/client.ts`。
- Utils 应尽量是纯函数，不读取 Pinia 或操作路由。

## 认证和权限

短期 access token 保存在内存中，刷新凭据由后端 HttpOnly cookie 管理。`src/api/client.ts` 会合并并发 401 刷新并重试请求。

Router guard 提供页面跳转和功能开关体验，但不是安全边界。管理员、step-up、用户身份和功能权限必须由后端再次验证。

修改登录/刷新流程时同时检查：

- `src/stores/auth.ts`
- `src/api/auth.ts`, `tokenStore.ts`, `sessionRefresh.ts`, `client.ts`
- `src/router/index.ts`
- `src/views/auth/`

## 添加页面

1. 在 `src/views/<domain>/` 创建页面，复杂 UI 拆入 `components/<domain>/`。
2. 在 `src/router/index.ts` 添加懒加载路由和准确 meta。
3. 在 `src/api/` 增加领域 API，必要时补充 `src/types/`。
4. 新增用户可见文案到所有受支持 locale。
5. 更新导航可见性和后端权限。
6. 添加相邻 Vitest，并运行 lint/typecheck。

路由约定见 [src/router/README.md](src/router/README.md)。

## 状态选择

使用以下判断避免 store 膨胀：

| 状态范围 | 放置位置 |
| --- | --- |
| 单个组件内部 | 组件 `ref` / `computed` |
| 同一页面多个组件 | 页面或页面 composable |
| 多页面共享、需要缓存 | Pinia store |
| URL 可表达的筛选/分页 | route query |
| 后端持久事实 | API + 后端数据库，不以 localStorage 作为事实源 |

Store 索引见 [src/stores/README.md](src/stores/README.md)。

## 测试

测试与源码相邻或放在同域 `__tests__/`。共享模块的风险高于单页面，应扩大测试范围。

```sh
# 单文件
pnpm exec vitest run src/views/admin/__tests__/SettingsView.spec.ts

# 全部前端测试
pnpm run test:run

# 静态检查
pnpm run lint:check
pnpm run typecheck
```

涉及路由、认证、API client、共享 store 或构建分包时，至少运行相关 spec、lint 和 typecheck。支付、图片、表格等交互页面还应验证 loading、empty、error 和权限受限状态。

## 维护规则

- 使用 `@/` 别名导入 `src/` 内容。
- 不混用 npm/yarn，不提交 `node_modules/` 和构建缓存。
- 不在页面中创建第二套 Axios client 或 token 刷新逻辑。
- 不把后端实体直接当作 UI 状态；通过类型和映射隔离可选字段与兼容字段。
- 大页面按展示区、表单、数据加载和交互行为拆分，避免继续扩大单文件。
- 目录或公共约定变化时更新本 README 和最近的子目录 README。
