export class CredentialEnvelope {
  algorithm!: 'RSA-OAEP-256+A256GCM'
  keyId!: string
  encryptedKey!: string
  iv!: string
  ciphertext!: string
}
