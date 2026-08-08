# Layout Integration

The shared application shells live in `src/common/widgets/layout/`. Business pages remain owned by their feature and compose these shells instead of adding route or store behavior here.

## Imports

```ts
import { AppLayout } from '@/common/widgets/layout'
import TablePageLayout from '@/common/widgets/layout/TablePageLayout.vue'
```

Use `AppLayout` for authenticated administrator pages and `TablePageLayout` for dense list pages inside `AppLayout`. The login page owns its unauthenticated shell inside the auth feature.

## Routing

`src/core/routes/index.ts` is the only router source. Routes should lazy-load the page from its feature owner:

```ts
{
  path: '/admin/accounts',
  name: 'AdminAccounts',
  component: () => import('@/features/admin-accounts/presentation/pages/AccountsPage.vue'),
  meta: { requiresAuth: true, requiresAdmin: true },
}
```

Do not create another router or duplicate the global guards in a layout. Authentication, setup redirects, feature access, titles, loading state, and chunk recovery stay in `src/core/routes/`.

## Feature Page

```vue
<template>
  <AppLayout>
    <TablePageLayout>
      <template #header>
        <h1>{{ t('admin.accounts.title') }}</h1>
      </template>

      <!-- Feature-owned filters, table, and dialogs -->
    </TablePageLayout>
  </AppLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AppLayout, TablePageLayout } from '@/common/widgets/layout'

const { t } = useI18n()
</script>
```

Page data and actions belong in the feature's `data/datasources/`, `presentation/composables/`, or `presentation/stores/`. Layout components may own shell behavior such as navigation collapse, responsive menus, and global headers, but not feature API calls.

## Application Startup

`src/main.ts` installs Pinia, loads public settings, initializes `src/core/i18n/` and `src/core/routes/`, and imports `src/core/themes/style.css`. Layout components must assume those application services already exist and must not initialize them again.

## Navigation Changes

When adding a page, update all of the following owners where applicable:

1. The feature page and adjacent test.
2. The lazy route and route metadata in `src/core/routes/index.ts`.
3. Navigation visibility in `AppSidebar.vue` or `AppHeader.vue`.
4. Locale messages in both `src/core/i18n/locales/en/` and `zh/`.
5. Backend authorization for the corresponding operation.

Menu visibility and router guards are presentation controls, not authorization boundaries.

## Verification

Run the layout tests after shared shell changes, then run the complete static checks:

```sh
pnpm exec vitest run src/common/widgets/layout/__tests__
pnpm run lint:check
pnpm run typecheck
```
