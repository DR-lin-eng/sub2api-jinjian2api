import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { LoginAgreementDocument } from '@/features/auth/domain/models/loginAgreementDocument'

export class LoginAgreementDocumentDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  id!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  title!: string

  @Expose({ name: 'content_md' })
  @Transform(({ value }) => value ?? '')
  contentMd!: string

  static fromJson(json: unknown): LoginAgreementDocumentDto {
    return plainToInstance(LoginAgreementDocumentDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): LoginAgreementDocument {
    const e = new LoginAgreementDocument()
    e.id = this.id
    e.title = this.title
    e.contentMd = this.contentMd
    return e
  }
}
