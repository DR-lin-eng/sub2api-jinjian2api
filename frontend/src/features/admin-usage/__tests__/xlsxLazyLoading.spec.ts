import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const frontendRoot = resolve(__dirname, '../../../..')

function readFrontendFile(path: string): string {
  return readFileSync(resolve(frontendRoot, path), 'utf8')
}

describe('XLSX lazy-loading contract', () => {
  it('loads XLSX only when the usage export runs', () => {
    const source = readFrontendFile(
      'src/features/admin-usage/presentation/pages/UsagePage.vue',
    )

    expect(source).toContain("await import('xlsx')")
    expect(source).not.toMatch(/from\s+['"]xlsx['"]|import\s+['"]xlsx['"]/)
  })

  it('keeps XLSX out of the VueUse vendor chunk', () => {
    const viteConfig = readFrontendFile('vite.config.ts')
    const vueUseRule = viteConfig.indexOf("id.includes('/@vueuse/')")
    const xlsxRule = viteConfig.indexOf("id.includes('/xlsx/')")
    const chartRule = viteConfig.indexOf("id.includes('/chart.js/')")

    expect(vueUseRule).toBeGreaterThan(-1)
    expect(xlsxRule).toBeGreaterThan(vueUseRule)
    expect(chartRule).toBeGreaterThan(xlsxRule)
    expect(viteConfig.slice(vueUseRule, xlsxRule)).toContain("return 'vendor-vueuse'")
    expect(viteConfig.slice(xlsxRule, chartRule)).toContain("return 'vendor-xlsx'")
  })

  it('uses the canonical TypeScript config even when compiler output exists', () => {
    const packageJson = JSON.parse(readFrontendFile('package.json')) as {
      scripts?: Record<string, string>
    }

    expect(packageJson.scripts?.dev).toContain('--config vite.config.ts')
    expect(packageJson.scripts?.build).toContain('--config vite.config.ts')
    expect(packageJson.scripts?.preview).toContain('--config vite.config.ts')
  })
})
