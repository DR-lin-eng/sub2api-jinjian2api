# Passkeys

This feature owns browser WebAuthn ceremony conversion and the profile credential-management UI.

- `data/datasources/`: passkey login and credential-management request adapters.
- `data/models/`: backend snake_case DTO mapping.
- `domain/`: passkey entities and repository ports.
- `presentation/widgets/`: user enrollment, rename, and revocation UI.
- `__tests__/`: browser payload conversion and UI regression coverage.

Authentication session state remains owned by `features/auth`; profile page composition remains owned by `features/profile`.
