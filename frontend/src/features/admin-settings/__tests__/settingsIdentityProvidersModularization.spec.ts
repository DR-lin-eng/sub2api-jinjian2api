import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const tabsDir = resolve(currentDir, '../presentation/widgets/settings-tabs')
const readTabSource = (relativePath: string) =>
  readFileSync(resolve(tabsDir, relativePath), 'utf8')
const sha256 = (source: string) =>
  createHash('sha256').update(source).digest('hex')

const cards = [
  {
    component: 'SettingsIdentityLinuxDoCard',
    file: 'SettingsIdentityLinuxDoCard.vue',
    templateHash: '9d97bb0a319e187d044e7d617ed4b28ca8b421f077995af8183537ad7bbf5ceb',
  },
  {
    component: 'SettingsIdentityEmailOAuthCard',
    file: 'SettingsIdentityEmailOAuthCard.vue',
    templateHash: '877c4a6ca91631cb78e63c64b6db05079d7c2b0d1b80ed9b0376e944ef1ff4ec',
  },
  {
    component: 'SettingsIdentityWeChatCard',
    file: 'SettingsIdentityWeChatCard.vue',
    templateHash: 'f901cc4ae825c8f19ecd2916099fa3da5b4b478a58e016de8365853ceed7ae22',
  },
  {
    component: 'SettingsIdentityDingTalkCard',
    file: 'SettingsIdentityDingTalkCard.vue',
    templateHash: 'f4e65a27ba053eae2d77e56820b7cf85d0d15b8ae0f89aaefcedfc499aef3972',
  },
  {
    component: 'SettingsIdentityOIDCCard',
    file: 'SettingsIdentityOIDCCard.vue',
    templateHash: '39451fccefa1b9681f34ace3307461e771af1580cd60df7e010cc257a651ea0a',
  },
] as const

const panelSource = readTabSource('SettingsSecurityIdentityProvidersPanel.vue')

function templateSource(source: string) {
  return source.slice(0, source.indexOf('<script'))
}

function templateBody(source: string) {
  return source.slice('<template>\n'.length, source.indexOf('\n</template>'))
}

describe('settings identity providers modularization', () => {
  it('keeps the parent as a static identity-provider card composition', () => {
    let previousPosition = -1
    for (const card of cards) {
      expect(panelSource).toContain(
        `import ${card.component} from './identity-providers/${card.file}'`,
      )
      const position = panelSource.indexOf(`<${card.component} />`)
      expect(position).toBeGreaterThan(previousPosition)
      previousPosition = position
    }

    expect(panelSource).not.toContain('useSettingsPageContext')
    expect(panelSource).not.toContain('v-model')
    expect(panelSource).not.toContain('import(')
  })

  it('keeps every card on the shared context without local reactive or request ownership', () => {
    for (const card of cards) {
      const source = readTabSource(`identity-providers/${card.file}`)
      expect(source).toContain('useSettingsPageContext()')
      expect(source).toContain("import Toggle from '@/common/widgets/forms/Toggle.vue'")
      expect(source).not.toMatch(/\b(?:ref|reactive|computed|watch)\s*\(/)
      expect(source).not.toMatch(/defineProps|defineEmits|data\/datasources|@\/api|\bfetch\s*\(|\baxios\b/)
      expect(source).not.toContain('import(')
      expect(sha256(templateSource(source))).toBe(card.templateHash)
    }
  })

  it('reconstructs the exact pre-split template including bindings and card order', () => {
    let reconstructed = templateSource(panelSource)
    for (const card of cards) {
      const source = readTabSource(`identity-providers/${card.file}`)
      reconstructed = reconstructed.replace(
        `  <${card.component} />`,
        templateBody(source),
      )
    }

    expect(Buffer.byteLength(reconstructed)).toBe(56625)
    expect(sha256(reconstructed)).toBe(
      '64ed3ae19fe352325d6bbfa9be742bf24bed3b1d9ee40a15291f8129e5fbfd02',
    )
  })
})
