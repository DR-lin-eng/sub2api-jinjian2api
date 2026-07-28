import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(resolve(currentDir, '../onboarding.css'), 'utf8')

describe('onboarding responsive footer', () => {
  it('preserves the tour actions on narrow viewports', () => {
    const mobileRules = source.slice(source.indexOf('@media (max-width: 639px)'))

    expect(mobileRules).toContain('.footer-shortcuts')
    expect(mobileRules).toContain('display: none !important')
    expect(mobileRules).toContain('.footer-right')
    expect(mobileRules).toContain('flex-shrink: 0 !important')
  })
})
