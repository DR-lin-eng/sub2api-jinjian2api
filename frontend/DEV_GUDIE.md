# Sub2API 前端开发规范

本文档用于指导 `frontend/` 下的新功能开发、旧功能迁移和代码审查。目标是让不同开发者产出的代码在目录、依赖、数据模型、状态管理、页面交互和验证方式上保持一致。

## 1. 文档定位与规则优先级

本文档是仓库内可提交、可共享的前端开发规范入口，不依赖任何本地文件或被 Git 忽略的目录。其他开发者只需阅读本文档和仓库内配置即可开展开发。

遇到规则冲突时，按以下顺序判断：

1. `frontend/.eslintrc.cjs`、`frontend/tsconfig.json`、`frontend/vite.config.ts` 中可执行的约束。
2. 本文档中的硬性规则。
3. 现有 feature 的实现方式。

现有代码不一定都是新代码模板。`admin-settings` 是大型 feature 的重要结构参考，但其中仍有迁移期代码，例如 `unknown` 直接透传、Repository 手工解析原始 JSON、`Record<string, any>` 表单以及跨 feature 内部引用。新代码不得因为旧代码存在这些写法而继续复制。

## 2. 技术栈与命令

- Vue 3 Composition API，统一使用 `<script setup lang="ts">`。
- TypeScript strict mode。
- Pinia setup store。
- Vue Router，feature 自己声明路由片段。
- Axios，通过 `@/core/networks/client` 中的 `apiClient` 访问后端。
- `class-transformer` + `reflect-metadata` 完成 DTO 映射。
- Tailwind CSS + `@/core/themes/style.css` 中的公共组件类。
- Vitest + Vue Test Utils。
- 包管理器固定为 pnpm 9.15.9。

所有 pnpm 命令必须使用固定入口：

```powershell
cd frontend
corepack pnpm@9.15.9 install
corepack pnpm@9.15.9 dev
corepack pnpm@9.15.9 typecheck
corepack pnpm@9.15.9 lint:check
corepack pnpm@9.15.9 test:run
corepack pnpm@9.15.9 build
```

禁止直接执行裸 `pnpm`，禁止使用 npm 或 yarn 更新依赖和 lockfile。

## 3. 顶层目录职责

```text
frontend/src/
├── core/       # 应用基础设施、全局契约、全局状态、路由、主题、i18n
├── common/     # 与业务无关的可复用页面、组件和 composable
├── features/   # 按业务能力隔离的功能模块
├── App.vue     # 应用壳
└── main.ts     # 应用装配入口
```

### 3.1 `core/`

`core` 放置应用级、稳定、非具体业务页面拥有的能力：

- `networks/`：HTTP client、响应契约、token/session 处理。
- `routes/`：全局路由聚合、路由守卫、路由元信息。
- `stores/`：真正全局的应用状态。
- `services/`：全局服务和 feature flag 注册表。
- `models/`：确实跨多个业务域共享的全局 Entity/DTO。
- `enums/`：跨 feature 共用的 type alias 或枚举。
- `utils/`、`constants/`、`types/`：纯 TypeScript 工具与契约。
- `i18n/`、`themes/`、`animations/`：自包含叶子模块。

依赖规则：

- `core/**` 不得 import `common/**`。
- 除 `core/routes` 组合 feature barrel 外，`core/**` 不得 import `features/**`。
- `core/routes` 只能 import `@/features/<feature>`，不得穿透 feature 内部路径。
- `core/utils|constants|types` 必须保持纯 TypeScript，不依赖 store、network、router、service 或 Vue。
- `core/networks` 不得依赖 store、router；新增代码也不得依赖 i18n，以免形成基础设施循环。

### 3.2 `common/`

`common` 放置业务无关且可被多个 feature 复用的 UI 和交互能力：

- `widgets/forms/`：输入、选择、开关、日期等表单控件。
- `widgets/feedback/`：Dialog、确认、空状态、加载、Toast 等反馈控件。
- `widgets/data/`：表格、分页、状态展示等通用数据组件。
- `widgets/icons/`：统一图标入口及平台/模型图标。
- `widgets/layout/`：`AppLayout`、`TablePageLayout` 等布局。
- `composables/`：不含具体业务语义的通用组合逻辑。
- `pages/`：Home、404、法律文档等真正公共页面。

依赖规则：

- `common/**` 可以 import `core/**`。
- `common/**` 不得 import `features/**`。
- `common/composables` 不得 import widget 或 page。
- `common/types` 必须是纯 TypeScript，不依赖 Vue、Pinia、Router、Axios。

一个组件只有在满足以下条件时才提升到 `common`：

1. 至少两个无直接业务关系的 feature 需要它，或它明确属于应用设计系统。
2. Props/Emits 不依赖任何 feature Entity。
3. 名称和行为不包含具体业务语义。

否则先留在所属 feature 的 `presentation/widgets`，不要提前抽象。

### 3.3 `features/`

每个 feature 是独立业务边界。feature 可以依赖 `core` 和 `common`，不得直接依赖其他 feature 的内部文件。

跨 feature 需求优先采用以下方式处理：

1. 将真正稳定、通用的类型或纯函数提升到 `core`。
2. 将业务无关 UI 提升到 `common`。
3. 通过后端聚合接口返回当前 feature 所需的数据。
4. 由应用组合层通过 feature barrel 组合路由。

禁止为了省事从 `features/A` 直接 import `features/B/presentation`、DTO、store 或 Repository Impl。

## 4. 标准 Feature 目录

feature 目录名必须使用 `kebab-case`：

```text
frontend/src/features/<feature>/
├── enums/                              # feature 私有 type alias/枚举
├── data/
│   ├── datasources/
│   │   ├── <feature>QueryDatasource.ts
│   │   └── <feature>ActionDatasource.ts
│   ├── models/                         # DTO，一 DTO 一文件
│   │   └── exampleDto.ts
│   ├── requests_models/                # HTTP Request，一请求一文件
│   │   └── createExampleRequest.ts
│   └── repositories/
│       ├── <feature>QueryRepositoryImpl.ts
│       └── <feature>ActionRepositoryImpl.ts
├── domain/
│   ├── models/                         # Entity，一实体一文件
│   │   └── example.ts
│   └── repositories/
│       ├── <feature>QueryRepository.ts
│       └── <feature>ActionRepository.ts
├── presentation/
│   ├── composables/
│   │   └── use<Feature>.ts
│   ├── pages/
│   │   ├── <Feature>Page.vue
│   │   └── tabs/                       # 大型多标签页面可选
│   ├── stores/
│   │   ├── <feature>QueryStore.ts
│   │   └── <feature>ActionStore.ts
│   ├── utils/                          # 纯展示计算，不访问 HTTP/store
│   └── widgets/
│       └── <Feature>Dialog.vue
├── __tests__/
└── index.ts                            # feature 公开面和路由片段
```

不是每个 feature 都必须创建所有目录。没有写操作时可以只有 Query 链路；没有请求体时可以不创建 `requests_models`。禁止创建无意义空抽象。

### 4.1 大型 Feature 的拆分

`admin-settings` 展示了大型 feature 的推荐组织方式：

- 一个 `SettingsPage.vue` 负责路由级装配、加载、保存和标签页切换。
- `presentation/pages/tabs/SettingsXxxTab.vue` 按设置领域拆分视图。
- `presentation/widgets` 放可独立复用或带完整交互闭环的 Dialog/Editor。
- 同一 feature 内可按子域拆 Repository，例如 settings、system、compliance、TLS profile。
- Query/Action store 可注入多个 Repository，但仍保持读写分离。

拆分判断：

- 只是同一业务页面的一个标签页：留在当前 feature。
- 有独立路由、独立生命周期、独立权限和独立数据契约：优先拆成新 feature。
- 页面文件开始承担大量业务算法时：将纯计算移到 `presentation/utils`，将业务流程移到语义 composable，将独立交互移到 widget。

## 5. 命名规则

- feature 目录：`kebab-case`，例如 `admin-settings`、`model-square`。
- TypeScript 文件：`camelCase.ts`。
- Vue 文件：`PascalCase.vue`。
- 路由页面：`XxxPage.vue`。
- 对话框：`XxxDialog.vue`，禁止使用 `Modal` 后缀。
- Entity：`domain/models/example.ts`，导出 `class Example`。
- DTO：`data/models/exampleDto.ts`，导出 `class ExampleDto`。
- Request：`data/requests_models/createExampleRequest.ts`，导出 `interface CreateExampleRequest`。
- Query/Action 文件按 `<feature>Query...`、`<feature>Action...` 成对命名。
- feature 私有 union/type alias 放 `enums/`，跨 feature 的放 `core/enums/`。
- 布尔字段以 `is`、`has`、`can` 或 `enabled` 表达明确语义。
- 事件使用动词：`save`、`close`、`refresh`、`update:modelValue`。

## 6. 数据模型硬规则

项目使用三种不同用途的数据结构，禁止混用：

| 类型 | 目录 | 形式 | 字段命名 | 用途 |
|---|---|---|---|---|
| Entity | `domain/models` | `class` | camelCase | 业务层和展示层数据 |
| DTO | `data/models` | `class` | class 字段 camelCase，`@Expose` 映射 snake_case | 后端响应解析 |
| Request | `data/requests_models` | `interface` | snake_case | 发给后端的 HTTP payload |

### 6.1 Entity

- Entity 必须是 `class`，不能是 interface。
- 一实体一文件，禁止在一个文件堆放多个 Entity。
- 字段使用 `!:`，不在 Entity 中设置默认值。
- 普通字段使用原始非空类型，禁止随意添加 `null`、`undefined`。
- 后端空值由 DTO 转为明确默认值，例如 `''`、`0`、`false`、`[]`。
- 嵌套 Entity 确实可能不存在时允许 optional。
- Entity 保持纯数据容器，不放 HTTP、Vue 响应式或视图方法。

```ts
export class Example {
  id!: number
  name!: string
  enabled!: boolean
  tags!: string[]
}
```

### 6.2 DTO

DTO 只承担以下职责：

1. 使用 `@Expose` 映射后端字段。
2. 使用 `@Transform` 填充默认值。
3. 使用 `fromJson()` 创建 DTO 实例，并通过实例方法 `toEntity()` 转成 Entity。

DTO 必须遵守：

- 顶部 `import 'reflect-metadata'`。
- 使用 `plainToInstance(..., { excludeExtraneousValues: true })`。
- 每个响应字段都写 `@Expose`，字段同名时也不能省略。
- 嵌套 DTO 使用 `@Type(() => NestedDto)`。
- `toEntity()` 必须 `new Entity()` 后逐字段赋值。
- 禁止返回 object literal 代替 Entity 实例。
- 禁止 `toJson`、`toDto`、`toSnake` 等反向转换。
- DTO 只能存在于 datasource 与 Repository Impl 之间。

```ts
import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { Example } from '@/features/example/domain/models/example'

export class ExampleDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'display_name' })
  @Transform(({ value }) => value ?? '')
  displayName!: string

  @Expose()
  @Transform(({ value }) => value ?? false)
  enabled!: boolean

  @Expose()
  @Transform(({ value }) => value ?? [])
  tags!: string[]

  static fromJson(json: unknown): ExampleDto {
    return plainToInstance(ExampleDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): Example {
    const entity = new Example()
    entity.id = this.id
    entity.name = this.displayName
    entity.enabled = this.enabled
    entity.tags = [...this.tags]
    return entity
  }
}
```

### 6.3 Request

- Request 必须是 interface，不是 class。
- 字段必须使用后端契约的 snake_case。
- 无装饰器、无方法、无转换函数。
- 只放在 `data/requests_models/`。
- datasource 原样把 Request 交给 `apiClient`。
- 页面或 composable 可以构造 Request；不得先构造 camelCase payload 再让 datasource 转换。

```ts
export interface UpdateExampleRequest {
  display_name?: string
  enabled?: boolean
  tag_ids?: number[]
}
```

UI 表单状态可以使用 camelCase，但提交边界必须一次性构造强类型 Request：

```ts
const request: UpdateExampleRequest = {
  display_name: form.displayName.trim(),
  enabled: form.enabled,
  tag_ids: [...form.tagIds],
}
await actions.update(example.id, request)
```

### 6.4 Type Alias 不是 Entity

```ts
export type ExampleStatus = 'active' | 'disabled'
```

这类 union/type alias 不需要 DTO、`fromJson` 或 `toEntity`。DTO 字段可以直接引用该类型。

## 7. 标准数据流

```text
HTTP JSON (snake_case)
  -> Datasource
  -> DTO.fromJson()
  -> Repository Impl
  -> dto.toEntity()
  -> Domain Entity
  -> Pinia Store
  -> Composable
  -> Page / Widget
```

写操作方向：

```text
Page / Widget form
  -> typed Request (snake_case)
  -> Action Store
  -> Action Repository
  -> Action Datasource
  -> apiClient
```

禁止跳层：

- Page/Widget 不得 import DTO、Datasource、Repository Impl、Axios。
- Store/Composable 不得直接 import `apiClient` 或运行时 Datasource。
- Data 层不得 import Vue、Pinia 或 presentation。
- Domain 层必须是纯 TypeScript。

## 8. Datasource 规范

Query datasource 只包含 GET，Action datasource 只包含 POST、PUT、PATCH、DELETE。

```ts
export class ExampleQueryDatasource {
  async list(options?: { signal?: AbortSignal }): Promise<ExampleDto[]> {
    const { data } = await apiClient.get<unknown[]>('/examples', {
      signal: options?.signal,
    })
    return (data ?? []).map(item => ExampleDto.fromJson(item))
  }
}

export const exampleQueryDatasource = new ExampleQueryDatasource()
```

注意：

- `apiClient` 已将标准 `{ code, message, data }` 解包，业务代码直接读取 Axios response 的 `data`，不得再写 `data.data`。
- HTTP 泛型优先使用 `unknown`，随后通过 DTO 验证和默认值归一化。
- Datasource 返回 DTO 实例，不能返回 Entity。
- POST/PUT 入参必须是 Request interface，并原样透传。
- 查询请求应支持 `AbortSignal`，避免快速切换筛选条件时旧响应覆盖新响应。
- URL 动态段必须使用 `encodeURIComponent`。
- 分页响应在 data 边界归一化为 `PaginatedResponse<Dto>`；不得把后端 snake_case 分页结构泄漏到 presentation。
- 不要在 datasource 内弹 Toast、跳路由或修改 Pinia 状态。

## 9. Repository 规范

Domain Repository 接口只暴露 Entity、Request 和稳定返回契约：

```ts
export interface ExampleQueryRepository {
  list(options?: { signal?: AbortSignal }): Promise<Example[]>
}
```

Repository Impl 负责 DTO 到 Entity 的转换：

```ts
export class ExampleQueryRepositoryImpl implements ExampleQueryRepository {
  private readonly datasource = exampleQueryDatasource

  async list(options?: { signal?: AbortSignal }): Promise<Example[]> {
    const items = await this.datasource.list(options)
    return items.map(item => item.toEntity())
  }
}

export const exampleQueryRepository: ExampleQueryRepository =
  new ExampleQueryRepositoryImpl()
```

硬性要求：

- Impl 文件末尾导出符合 Domain Repository 接口的默认单例。
- Impl 不能把 DTO 返回到上层。
- Impl 不能重复实现 Request 的 camelCase/snake_case 转换。
- 后端对象响应必须建立 DTO；禁止长期使用 `as Promise<Entity>` 绕过映射。
- 简单 `{ message: string }` 或 `void` 响应可以直接透传。

## 10. Store 与 Composable

### 10.1 Store

- 使用 Pinia setup store。
- Query 和 Action 分离。
- 必须提供可注入 Repository 的工厂函数，便于测试。
- store id 使用 `<feature>/query`、`<feature>/action`。
- `loading`、`errors` 使用任务名索引对象。
- 错误写入 `errors[key]` 后继续抛出，交给 UI 决定反馈。
- Store 不弹 Toast、不操作 Dialog DOM、不直接做路由跳转。

```ts
export function createExampleQueryStore(
  repository: ExampleQueryRepository = exampleQueryRepository,
) {
  return defineStore('example/query', () => {
    const loading = reactive<Record<string, boolean>>({})
    const errors = reactive<Record<string, unknown>>({})

    function wrap<T>(key: string, task: () => Promise<T>): Promise<T> {
      loading[key] = true
      errors[key] = null
      return Promise.resolve()
        .then(task)
        .catch((error: unknown) => {
          errors[key] = error
          throw error
        })
        .finally(() => {
          loading[key] = false
        })
    }

    const list = (options?: { signal?: AbortSignal }) =>
      wrap('list', () => repository.list(options))

    return { loading, errors, list }
  })
}

export const useExampleQueryStore = createExampleQueryStore()
```

大型 feature 可以像 `admin-settings` 一样给一个 Store 工厂注入多个同域 Repository。方法较多时统一使用 `wrap()`，避免每个 action 重复 loading/error 模板。

### 10.2 Composable

基础 composable 只聚合 Store：

```ts
export function useExample() {
  const query = useExampleQueryStore()
  const action = useExampleActionStore()
  return { ...query, ...action }
}
```

复杂流程按用户意图拆分，例如：

- `useExampleList()`：筛选、分页、取消旧请求。
- `useExampleForm()`：表单状态、校验、Request 构造。
- `useExampleSelection()`：批量选择。

Composable 不能绕开 Store 访问 Datasource/DTO/apiClient。

## 11. Page、Tab 与 Widget

### 11.1 Page

Page 是路由级协调器，负责：

- 使用 `AppLayout` 或适合的公共布局。
- 调用 feature composable/store。
- 管理页面级筛选、分页、加载、错误和空状态。
- 管理路由 query 与页面状态同步。
- 组装 widgets/tabs。
- 在用户操作成功或失败时调用 `appStore.showSuccess/showError`。

Page 不应负责：

- 解析原始后端 JSON。
- 直接调用 Axios。
- 实现大段可独立测试的业务算法。
- 包含多个可以独立维护的复杂 Dialog。

### 11.2 多标签页面

参考 `admin-settings` 的页面壳模式：

- Page 持有 `activeTab` 和标签定义。
- Tab 组件放在 `presentation/pages/tabs/`。
- Tab 通过强类型 Props/Emits 与 Page 通信。
- 需要保留未激活标签表单状态时使用 `v-show`。
- 数据量大且无需保留状态时使用 `v-if` 或路由级子页面，避免一次挂载全部重组件。
- 标签导航使用 `role="tablist"`、`role="tab"`、`aria-selected`，并支持方向键、Home、End。

禁止新代码使用 `Record<string, any>` 作为整个表单的 Tab Props。应定义明确的表单类型，或按 Tab 传递最小字段集。

### 11.3 Widget

- feature 私有组件放 `presentation/widgets`。
- Dialog 必须优先复用 `BaseDialog` 或 `ConfirmDialog`。
- 表格优先复用 `DataTable`、`Pagination`、`TablePageLayout`。
- 表单优先复用 `Input`、`Select`、`Toggle`、`DateRangePicker` 等公共控件。
- 图标优先复用 `Icon.vue`、`ModelIcon.vue`、`PlatformIcon.vue`，不要重复绘制已有图标。
- Widget 只接收 Entity 或明确的展示 Props，不接收 DTO。
- Props/Emits 必须有 TypeScript 类型。

## 12. 路由、Sidebar 与 Feature Barrel

feature 根 `index.ts` 是该 feature 唯一公共入口。只允许导出页面、必要的 domain type 和路由片段；禁止导出 Store、Composable、Repository、Datasource、Widget。

```ts
import type { RouteRecordRaw } from 'vue-router'

export const exampleRoutes: RouteRecordRaw[] = [
  {
    path: '/examples',
    name: 'Examples',
    component: () => import('@/features/example/presentation/pages/ExamplesPage.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
      title: 'Examples',
      titleKey: 'examples.title',
      descriptionKey: 'examples.description',
    },
  },
]
```

接入流程：

1. 在 feature `index.ts` 声明懒加载路由。
2. 在 `core/routes/index.ts` 从 `@/features/<feature>` 导入路由数组并展开。
3. 需要一级导航时，在 `common/widgets/layout/AppSidebar.vue` 添加 path/label/icon。
4. 同时补齐中英文 `nav`、`titleKey`、`descriptionKey`。
5. 管理页面设置 `requiresAdmin: true`。

不要在 `core/routes` 直接 import `presentation/pages` 或 Store。

### 12.1 Feature Flag

需要后台开关控制的用户功能：

1. 在 public settings Entity/DTO 中加入字段并设置安全默认值。
2. 在 `core/services/featureFlags.ts` 注册定义，明确 opt-in 或 opt-out。
3. Sidebar 使用 `makeSidebarFlag()`，不要散落自定义回退逻辑。
4. 路由和后端接口仍需独立校验开关；隐藏 Sidebar 不是权限控制。

## 13. i18n

- 所有用户可见文案必须进入 i18n，禁止只写中文或英文硬编码。
- 中文放 `core/i18n/locales/zh/`，英文放 `core/i18n/locales/en/`。
- 两种语言保持完全相同的 key 结构。
- feature 文案按业务域组织，不要全部堆入 `common.ts`。
- `nav.*` 放 common locale；复杂页面文案放对应业务 locale。
- 路由必须提供可解析的 `titleKey`，需要页面描述时提供 `descriptionKey`。
- API 错误展示使用 `extractApiErrorMessage` 等现有错误工具，不直接假设 Axios error 结构。

## 14. 样式、布局与交互

### 14.1 优先复用

开发前先检查：

- `common/widgets/forms`
- `common/widgets/feedback`
- `common/widgets/data`
- `common/widgets/icons`
- `common/widgets/layout`
- `core/themes/style.css`

常用全局类包括：

- 按钮：`btn`、`btn-primary`、`btn-secondary`、`btn-danger`、`btn-icon`。
- 表单：`input`、`input-label`、`input-hint`、`input-error`。
- 容器：`card`、`card-header`、`card-body`、`card-footer`。
- 表格滚动挂载点：`table-wrapper`。

禁止在 feature 中复制一套仅颜色或间距不同的基础 Button/Input/Dialog。

### 14.2 页面要求

- 页面必须支持 light/dark 两套颜色。
- 桌面和移动视口都要保证内容不重叠、不横向溢出。
- 固定格式元素使用稳定尺寸、grid track、`min-width` 或 `aspect-ratio`，避免动态内容引起布局跳动。
- 工具栏使用图标按钮时提供 `title` 或 tooltip。
- 二元设置使用 `Toggle`/checkbox，模式选择使用 tabs/segmented control，数值使用 input/stepper。
- 不嵌套装饰性 card；card 只用于真实分组、重复项目或工具面板。
- 长页面拆成清晰 section，不使用营销页式 hero 代替实际工作界面。
- Loading、Error、Empty、Disabled、Submitting 状态必须完整。

### 14.3 可访问性

- Dialog 使用 `BaseDialog`，保留焦点管理、Escape 和 `aria-modal`。
- 纯图标按钮必须有可访问名称。
- 表单 label 与 input 建立明确关系。
- Tabs、菜单和可交互列表支持键盘操作和可见焦点。
- 不用仅靠颜色表达状态，同时提供文字或图标。

## 15. 安全与可靠性

- URL 展示或跳转前使用 `core/utils/url` 中的安全处理函数。
- 自定义 SVG 使用 `sanitizeSvg`，富文本使用项目认可的 DOMPurify 封装；禁止直接渲染不可信 `v-html`。
- 动态 URL path 参数使用 `encodeURIComponent`。
- 不在日志、Toast、localStorage 中记录 token、密钥、密码或完整敏感响应。
- 密码/密钥编辑表单区分“未修改”和“清空”，不要把掩码值重新提交。
- 权限、feature flag、数据隔离最终由后端校验；前端隐藏控件只改善体验。
- 并发查询应取消旧请求或使用请求序号，避免陈旧响应覆盖当前状态。
- 组件卸载时清理 timer、listener、AbortController。

## 16. 测试规范

测试放在 feature 的 `__tests__` 或源文件旁的 `__tests__`，使用 `.spec.ts`。

最低覆盖建议：

### DTO

- snake_case 到 camelCase 映射。
- 缺失/null 字段默认值。
- 嵌套 DTO 是否真正实例化。
- `toEntity()` 返回 class 实例而不是普通 object。

### Repository

- DTO 是否全部转换为 Entity。
- Request 是否原样传给 datasource。
- 分页结构是否正确转换。

### Store

- 通过工厂函数注入 mock Repository。
- 成功时 loading 恢复。
- 失败时 errors 写入并 rethrow。
- 不同 task key 不互相污染。

### Utils/Composable

- 边界值、空数组、重复项、排序、筛选。
- 取消请求和竞态处理。

### Page/Widget

- Loading、Error、Empty、Success 状态。
- Props/Emits 和用户操作。
- Dialog 打开、关闭、确认。
- 权限/feature flag 控件可见性。
- 关键移动端布局信号。

验证命令：

```powershell
cd frontend
corepack pnpm@9.15.9 exec eslint src/features/<feature> --ext .vue,.ts
corepack pnpm@9.15.9 typecheck
corepack pnpm@9.15.9 test:run
corepack pnpm@9.15.9 build
```

`vite build` 输出到后端嵌入目录，禁止手工修改构建产物。

## 17. 新 Feature 开发流程

1. 明确业务边界、路由、权限、是否需要 feature flag。
2. 先确定后端请求和响应契约。
3. 创建 Entity、DTO、Request；确保一实体一文件。
4. 创建 Query/Action Datasource。
5. 创建 Domain Repository 接口和 Impl。
6. 创建可注入 Repository 的 Query/Action Store。
7. 创建基础 composable，再实现 Page/Widget。
8. 在 feature `index.ts` 声明路由片段。
9. 从 `core/routes` 只通过 feature barrel 接入。
10. 添加 Sidebar 时同步中英文 i18n。
11. 添加 DTO、Repository、Store、关键页面测试。
12. 运行 ESLint、typecheck、测试和 build。

## 18. `admin-settings` 的参考边界

可以复用的结构经验：

- 一个 feature barrel 暴露一组管理端路由。
- Query/Action Datasource、Repository、Store 明确分离。
- Store 工厂支持多个同 feature 子域 Repository 注入。
- 页面壳集中处理首次加载、整体保存和标签导航。
- 标签页拆到 `pages/tabs`，独立 Dialog/Editor 放 `widgets`。
- 纯格式化、归一化和 resolver 放 `presentation/utils`。

不得复制的迁移期模式：

- Datasource 返回 `unknown` 后在 Repository 手工读 snake_case。
- Repository 使用类型断言把原始对象直接当 Entity。
- Page/Tab 使用 `Record<string, any>` 代替明确类型。
- Page 直接 import 其他 feature 的 store、widget 或 presentation util。
- 一个超大 Entity/Request 无限追加互不相关字段。
- 在 Page 中散落多处 camelCase 到 snake_case 转换。

新增或修改 `admin-settings` 时，应逐步把相关子域迁移为完整的 Entity/DTO/Request 链路，而不是扩大旧模式。

## 19. 提交前检查清单

- [ ] feature 边界清晰，没有跨 feature 内部 import。
- [ ] Entity 和 DTO 都是 class，Request 是 snake_case interface。
- [ ] 一实体一文件，没有聚合 DTO/Entity。
- [ ] DTO 有 `@Expose`、默认值、`fromJson()`、`toEntity()`。
- [ ] Datasource 不返回 Entity，Presentation 不接触 DTO。
- [ ] Query/Action 已拆分，Store 可注入 mock Repository。
- [ ] Store 不直接弹 Toast。
- [ ] 路由只通过 feature barrel 接入。
- [ ] Sidebar、路由标题和中英文 i18n 同步。
- [ ] 优先复用了 common 组件和 core 工具。
- [ ] Loading/Error/Empty/Disabled/Submitting 状态完整。
- [ ] 动态 URL、HTML、SVG 和敏感字段已按安全规范处理。
- [ ] 新行为有对应测试。
- [ ] 使用 `corepack pnpm@9.15.9` 完成 lint、typecheck、test、build。
