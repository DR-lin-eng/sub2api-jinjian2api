import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { CredentialEnvelope } from '@/core/models/domain/credentialEnvelope'

export class CredentialEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? 'RSA-OAEP-256+A256GCM')
  algorithm!: 'RSA-OAEP-256+A256GCM'

  @Expose({ name: 'key_id' })
  @Transform(({ value }) => value ?? '')
  keyId!: string

  @Expose({ name: 'encrypted_key' })
  @Transform(({ value }) => value ?? '')
  encryptedKey!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  iv!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  ciphertext!: string

  static fromJson(json: unknown): CredentialEnvelopeDto {
    return plainToInstance(CredentialEnvelopeDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CredentialEnvelope {
    const e = new CredentialEnvelope()
    e.algorithm = this.algorithm
    e.keyId = this.keyId
    e.encryptedKey = this.encryptedKey
    e.iv = this.iv
    e.ciphertext = this.ciphertext
    return e
  }
}
