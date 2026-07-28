import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(resolve(currentDir, '../HomePage.vue'), 'utf8')

describe('HomePage responsive terminal', () => {
  it('lets the terminal shrink to the mobile content width', () => {
    expect(source).toContain('class="flex w-full min-w-0 flex-1 justify-center lg:justify-end"')
    expect(source).toMatch(/\.terminal-container\s*\{[\s\S]*?width:\s*100%;[\s\S]*?max-width:\s*420px;/)
    expect(source).toMatch(/\.terminal-window\s*\{[\s\S]*?width:\s*100%;/)
  })
})
