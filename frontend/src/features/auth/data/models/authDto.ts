/* DTO — mirrors backend JSON contract (snake_case). Per spec §5.3. */
export type {
  UserAuthProvider,
  UserAuthBindingStatus,
  UserProfileSourceContext,
  User,
  LoginRequest,
  CredentialEnvelope,
  RegisterRequest,
  EncryptedRegisterRequest,
  AuthResponse,
  CurrentUserResponse,
  LoginAgreementDocument,
  PublicSettings,
  SendVerifyCodeRequest,
  SendVerifyCodeResponse,
  NotifyEmailEntry,
  ChangePasswordRequest,
} from '@/types'
