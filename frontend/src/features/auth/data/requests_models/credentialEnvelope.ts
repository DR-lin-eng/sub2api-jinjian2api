export interface CredentialEnvelope {
  algorithm: 'RSA-OAEP-256+A256GCM'
  key_id: string
  encrypted_key: string
  iv: string
  ciphertext: string
}
