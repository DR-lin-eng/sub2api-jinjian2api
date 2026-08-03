const fs = require('node:fs')
const path = require('node:path')

const {
  crossFeaturePresentationImports,
  legacyBarrelImports,
} = require('./architecture-debt-baseline.cjs')

const frontendRoot = path.resolve(__dirname, '..')

const normalizePath = (value) => value.split(path.sep).join('/')

const addAllowance = (allowances, file, source, kind) => {
  const fileAllowances = allowances.get(file) ?? new Map()
  const key = `${kind}\0${source}`
  fileAllowances.set(key, (fileAllowances.get(key) ?? 0) + 1)
  allowances.set(file, fileAllowances)
}

const buildAllowances = () => {
  const allowances = new Map()

  for (const [source, files] of Object.entries(legacyBarrelImports)) {
    for (const file of files) addAllowance(allowances, file, source, 'legacy')
  }

  for (const [file, sources] of Object.entries(crossFeaturePresentationImports)) {
    for (const source of sources) addAllowance(allowances, file, source, 'cross-feature')
  }

  for (const file of allowances.keys()) {
    if (!fs.existsSync(path.join(frontendRoot, file))) {
      throw new Error(`Architecture debt baseline references missing file: ${file}`)
    }
  }

  return allowances
}

const baselineAllowances = buildAllowances()

const getFeatureLocation = (filename, source) => {
  let relativeTarget

  if (source.startsWith('@/')) {
    relativeTarget = `src/${source.slice(2)}`
  } else if (source.startsWith('.')) {
    const absoluteTarget = path.resolve(path.dirname(filename), source)
    relativeTarget = normalizePath(path.relative(frontendRoot, absoluteTarget))
  } else {
    return null
  }

  const match = relativeTarget.match(/^src\/features\/([^/]+)\/(domain|data|presentation)(?:\/|$)/)
  return match ? { feature: match[1], layer: match[2] } : null
}

const architectureBoundariesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent frontend architecture debt from increasing during feature migration.',
    },
    schema: [],
    messages: {
      crossFeature: 'Do not add imports from another feature\'s private presentation layer. Expose a stable owner contract instead.',
      legacy: 'Do not add imports from the transitional {{source}} barrel. Import the owning feature or core module directly.',
      reverseLayer: '{{sourceLayer}} code must not import the {{targetLayer}} layer, including through relative paths.',
      staleBaseline: 'Remove the stale {{kind}} baseline entry for {{source}} after migrating this import.',
    },
  },
  create(context) {
    const filename = path.resolve(context.filename)
    const relativeFile = normalizePath(path.relative(frontendRoot, filename))
    const fileAllowances = new Map(baselineAllowances.get(relativeFile) ?? [])
    const sourceLocation = relativeFile.match(/^src\/features\/([^/]+)\/(domain|data|presentation)(?:\/|$)/)

    const consumeAllowance = (kind, source) => {
      const key = `${kind}\0${source}`
      const remaining = fileAllowances.get(key) ?? 0
      if (remaining === 0) return false
      fileAllowances.set(key, remaining - 1)
      return true
    }

    const inspectImport = (node, source) => {
      if (/^@\/(?:api(?:\/|$)|stores(?:\/|$))/.test(source)) {
        if (!consumeAllowance('legacy', source)) {
          context.report({ node, messageId: 'legacy', data: { source } })
        }
      }

      const targetLocation = getFeatureLocation(filename, source)
      if (!sourceLocation || !targetLocation) return

      if (source.startsWith('.')) {
        const sourceLayer = sourceLocation[2]
        const targetLayer = targetLocation.layer
        const isReverseLayer =
          (sourceLayer === 'domain' && (targetLayer === 'data' || targetLayer === 'presentation')) ||
          (sourceLayer === 'data' && targetLayer === 'presentation')

        if (isReverseLayer) {
          context.report({
            node,
            messageId: 'reverseLayer',
            data: { sourceLayer, targetLayer },
          })
          return
        }
      }

      if (targetLocation.layer === 'presentation' && targetLocation.feature !== sourceLocation[1]) {
        if (!consumeAllowance('cross-feature', source)) {
          context.report({ node, messageId: 'crossFeature' })
        }
      }
    }

    const inspectSourceNode = (node) => {
      if (node.source?.type === 'Literal' && typeof node.source.value === 'string') {
        inspectImport(node, node.source.value)
      }
    }

    return {
      ExportAllDeclaration: inspectSourceNode,
      ExportNamedDeclaration: inspectSourceNode,
      ImportDeclaration: inspectSourceNode,
      ImportExpression(node) {
        if (node.source.type === 'Literal' && typeof node.source.value === 'string') {
          inspectImport(node, node.source.value)
        }
      },
      'Program:exit'(node) {
        for (const [key, count] of fileAllowances) {
          if (count === 0) continue
          const [kind, source] = key.split('\0')
          for (let index = 0; index < count; index += 1) {
            context.report({
              node,
              messageId: 'staleBaseline',
              data: { kind, source },
            })
          }
        }
      },
    }
  },
}

module.exports = {
  rules: {
    'no-new-debt': architectureBoundariesRule,
  },
}
