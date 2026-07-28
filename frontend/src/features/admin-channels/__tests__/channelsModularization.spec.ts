import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))
const readFeatureSource = (relativePath: string) =>
  readFileSync(resolve(currentDir, relativePath), 'utf8')

const pageSource = readFeatureSource('../presentation/pages/ChannelsPage.vue')
const codecSource = readFeatureSource('../presentation/channelFormCodec.ts')

describe('admin channels modularization', () => {
  it('keeps the page and codec below their maintenance targets', () => {
    expect(pageSource.split('\n').length).toBeLessThanOrEqual(1450)
    expect(codecSource.split('\n').length).toBeLessThanOrEqual(400)
  })

  it('keeps the codec as a static feature-local dependency', () => {
    expect(pageSource).toContain(
      "from '@/features/admin-channels/presentation/channelFormCodec'",
    )
    expect(pageSource).not.toContain('import(')
    expect(codecSource).not.toContain('import(')
  })

  it('keeps requests and lifecycle ownership in the route page', () => {
    expect(pageSource).toContain('await adminAPI.channels.update')
    expect(pageSource).toContain('await adminAPI.channels.create')
    expect(pageSource).toContain('onMounted(() => {')
    expect(pageSource).toContain("document.addEventListener('click', handleRuleAccountClickOutside)")
    expect(codecSource).not.toContain('adminAPI')
    expect(codecSource).not.toContain('watch(')
    expect(codecSource).not.toContain('setTimeout')
    expect(codecSource).not.toContain('onMounted')
  })
})
