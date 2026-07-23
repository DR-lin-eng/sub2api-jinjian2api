export interface TlsFingerprintProfile {
  id: number
  name: string
  description: string | null
  enableGrease: boolean
  cipherSuites: number[]
  curves: number[]
  pointFormats: number[]
  signatureAlgorithms: number[]
  alpnProtocols: string[]
  supportedVersions: number[]
  keyShareGroups: number[]
  pskModes: number[]
  extensions: number[]
  createdAt: string
  updatedAt: string
}
