#!/usr/bin/env node
// For each feature that has data/repositories/*.ts, generate:
//   presentation/stores/<name>QueryStore.ts
//   presentation/stores/<name>ActionStore.ts
// where methods are split by heuristic:
//   Query = get* | list* | fetch* | query* | preview* | is* | has* | can* | probe*
//   (preview/probe often return read data even though POST-ed)
//   Action = the rest
//
// The store is a thin wrapper: each method becomes an action that sets
// loading[name] = true, calls repo.method(...args), captures the result
// or error, and returns the value. This gives Pages a store surface to
// consume without changing the underlying semantics.
//
// The store is exported via the double-export pattern (§5.4 R5.1):
//   createXxxStore(repo)  — factory, for tests
//   useXxxStore           — default singleton wired to Repository singleton

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

const featuresDir = resolve('src/features')
const features = readdirSync(featuresDir).filter(f =>
  statSync(join(featuresDir, f)).isDirectory()
)

function extractFunctions(src) {
  // Only collect ASYNC exported functions. Sync helpers, type guards, and
  // pure predicates don't belong in a store — they stay as datasource
  // exports and are consumed directly (bridge already re-exports them).
  const re = /export\s+async\s+function\s+([A-Za-z_$][\w$]*)/g
  const names = new Set()
  let m
  while ((m = re.exec(src)) !== null) names.add(m[1])
  return [...names]
}

function isQueryMethod(name) {
  return /^(get|list|fetch|query|preview|is|has|can|probe|search|find|check|resolve|export|load|read)([A-Z_]|$)/.test(name)
}

function pascal(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

const skipFeatures = new Set(['prompt-audit']) // already hand-crafted
let generated = 0
const skipped = []

for (const feature of features) {
  if (skipFeatures.has(feature)) continue

  const reposDir = join(featuresDir, feature, 'data', 'repositories')
  if (!existsSync(reposDir)) continue
  const dsDir = join(featuresDir, feature, 'data', 'datasources')
  if (!existsSync(dsDir)) continue

  const implFiles = readdirSync(reposDir).filter(f => f.endsWith('Impl.ts'))
  if (implFiles.length === 0) continue

  // Group methods by Query/Action across ALL datasources of this feature.
  // On name conflicts across datasources, prefix with the repo baseName.
  const query = [] // [{ storeMethod, method, repoName, repoSingleton, baseName }, ...]
  const action = []

  const seenQueryName = new Set()
  const seenActionName = new Set()

  for (const impl of implFiles) {
    const baseName = impl.replace(/RepositoryImpl\.ts$/, '')
    const repoSingleton = `${baseName}Repository`
    const RepoType = `${pascal(baseName)}Repository`
    const dsFile = `${baseName}Datasource.ts`
    const dsPath = join(dsDir, dsFile)
    if (!existsSync(dsPath)) continue
    const fns = extractFunctions(readFileSync(dsPath, 'utf8'))
    for (const fn of fns) {
      const isQuery = isQueryMethod(fn)
      const target = isQuery ? query : action
      const seen = isQuery ? seenQueryName : seenActionName
      let storeMethod = fn
      if (seen.has(fn)) storeMethod = `${baseName}_${fn}`
      seen.add(storeMethod)
      target.push({ storeMethod, method: fn, repoName: RepoType, repoSingleton, baseName, dsFile: dsFile.replace(/\.ts$/, '') })
    }
  }

  if (query.length === 0 && action.length === 0) {
    skipped.push({ feature, reason: 'no exported functions' })
    continue
  }

  const featurePascal = feature.split('-').map(pascal).join('')

  function emitStore(kind, methods) {
    if (methods.length === 0) return null
    const storeName = `${featurePascal}${kind}Store`
    const storeId = `${feature.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}/${kind.toLowerCase()}`
    const factoryName = `create${storeName}`
    const hookName = `use${storeName}`

    // Deduplicate repos so we import each singleton once.
    const uniqRepos = [...new Map(methods.map(m => [m.baseName, m])).values()]
    const repoImports = uniqRepos
      .map(m => `import { ${m.repoSingleton} as default_${m.baseName}_repo } from '@/features/${feature}/data/repositories/${m.baseName}RepositoryImpl'`)
      .join('\n')
    const repoTypeImports = uniqRepos
      .map(m => `import type { ${m.repoName} } from '@/features/${feature}/domain/repositories/${m.baseName}Repository'`)
      .join('\n')

    const repoParams = uniqRepos.map(m => `${m.baseName}Repo: ${m.repoName} = default_${m.baseName}_repo`).join(', ')

    // Build action bodies. Each method wraps repo call in try/finally
    // that toggles a per-method loading flag.
    const loadingKeys = methods.map(m => `${m.storeMethod}: false`).join(', ')
    const errorKeys = methods.map(m => `${m.storeMethod}: null as unknown`).join(', ')

    const methodBodies = methods.map(m => {
      const repoVar = `${m.baseName}Repo`
      const storeFn = m.storeMethod
      const repoFn = m.method
      return `  const ${storeFn}: ${m.repoName}['${repoFn}'] = ((...args: unknown[]) => {
    loading.${storeFn} = true
    errors.${storeFn} = null
    return Promise.resolve()
      .then(() => (${repoVar}.${repoFn} as (...a: unknown[]) => unknown)(...args))
      .catch((error: unknown) => { errors.${storeFn} = error; throw error })
      .finally(() => { loading.${storeFn} = false })
  }) as ${m.repoName}['${repoFn}']`
    }).join('\n\n')

    const returnKeys = ['loading', 'errors', ...methods.map(m => m.storeMethod)].join(', ')

    return `/**
 * ${storeName} — auto-generated by .tmp_gen_stores.mjs.
 *
 * Thin store wrapping the ${kind}-side Repository singletons for this feature.
 * Every action delegates to \`repo.<method>(...)\` inside a try/finally that
 * toggles per-method loading/error state. Follows the §5.4 R5.1 double-export
 * pattern so tests can inject a mock repo via \`${factoryName}(mock)\`.
 *
 * When a feature needs custom orchestration (multi-repo transactions,
 * derived state, cache invalidation) — replace this generated file with a
 * hand-written store; the generator will skip files it did not create.
 */

import { defineStore } from 'pinia'
import { reactive } from 'vue'
${repoTypeImports}
${repoImports}

export function ${factoryName}(${repoParams}) {
  return defineStore('${storeId}', () => {
    const loading = reactive<Record<string, boolean>>({ ${loadingKeys} })
    const errors = reactive<Record<string, unknown>>({ ${errorKeys} })

${methodBodies}

    return { ${returnKeys} }
  })
}

export const ${hookName} = ${factoryName}()
`
  }

  const queryStoreSrc = emitStore('Query', query)
  const actionStoreSrc = emitStore('Action', action)

  const outDir = join(featuresDir, feature, 'presentation', 'stores')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const AUTO_MARK = 'auto-generated by .tmp_gen_stores.mjs'

  if (queryStoreSrc) {
    const path = join(outDir, `${featurePascal.charAt(0).toLowerCase() + featurePascal.slice(1)}QueryStore.ts`)
    // Only touch files we generated ourselves (identified by the marker in
    // the file header). Hand-written stores keep their content.
    if (!existsSync(path) || readFileSync(path, 'utf8').includes(AUTO_MARK)) {
      writeFileSync(path, queryStoreSrc)
      generated++
    }
  }
  if (actionStoreSrc) {
    const path = join(outDir, `${featurePascal.charAt(0).toLowerCase() + featurePascal.slice(1)}ActionStore.ts`)
    if (!existsSync(path) || readFileSync(path, 'utf8').includes(AUTO_MARK)) {
      writeFileSync(path, actionStoreSrc)
      generated++
    }
  }
}

console.log(`Generated ${generated} store files.`)
if (skipped.length) console.log('Skipped:', skipped)
