# Layout Components

Shared shells for the single-administrator frontend. Business data, route guards, and API calls remain in their owning feature or core module.

## Components

| Component | Responsibility |
| --- | --- |
| `AppLayout.vue` | Composes the authenticated header, sidebar, and page content. |
| `AppSidebar.vue` | Renders the administrator navigation and responsive collapse state. |
| `AppHeader.vue` | Renders the page title, documentation link, locale switcher, administrator menu, and logout action. |
| `TablePageLayout.vue` | Provides a consistent shell for dense list and table pages. |

`index.ts` exports `AppLayout`, `AppSidebar`, and `AppHeader`. Import `TablePageLayout.vue` directly from this directory.

## Boundaries

- The sidebar only links to routes declared in `src/core/routes/index.ts`.
- Layout components may own responsive navigation and shell state, but not feature API calls.
- The authenticated identity is always the local administrator; there are no registration, redeem, balance, payment, or ordinary-user navigation surfaces.
- Menu visibility and router guards are presentation controls. Backend middleware remains the authorization boundary.

## Verification

From `frontend/` run:

```sh
pnpm exec vitest run src/common/widgets/layout/__tests__
pnpm run lint:check
pnpm run typecheck
```
