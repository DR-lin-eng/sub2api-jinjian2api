import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const readFeatureSource = (relativePath: string) =>
  readFileSync(resolve(currentDir, relativePath), 'utf8')

const pageSource = readFeatureSource('../presentation/pages/UsersPage.vue')
const toolbarSource = readFeatureSource('../presentation/widgets/UsersTableToolbar.vue')

describe('admin users page modularization', () => {
  it('keeps the table toolbar statically owned by the users route chunk', () => {
    expect(pageSource).toContain(
      "import UsersTableToolbar from '@/features/admin-users/presentation/widgets/UsersTableToolbar.vue'"
    )
    expect(pageSource).toContain('<UsersTableToolbar')
    expect(toolbarSource).not.toContain('import(')
  })

  it('keeps request timing and dialog orchestration in the page owner', () => {
    expect(pageSource).toContain('new AbortController()')
    expect(pageSource).toContain('}, 50)')
    expect(pageSource).toContain('}, 300)')
    expect(pageSource).toContain('<UserCreateModal :show="showCreateModal"')
    expect(pageSource).toContain('<UserEditModal :show="showEditModal"')
    expect(pageSource).toContain('<BulkEditUserModal')
    expect(toolbarSource).not.toContain('adminAPI')
    expect(toolbarSource).not.toContain('localStorage')
    expect(toolbarSource).not.toContain('setTimeout')
  })
})
