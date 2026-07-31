export class AdminDataImportError {
  kind!: 'proxy' | 'account'
  name!: string
  proxyKey!: string
  message!: string
}
