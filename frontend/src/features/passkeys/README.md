# Passkeys

This feature owns browser WebAuthn ceremony conversion and the profile credential-management UI.

- `data/datasources/passkeyDatasource.ts`: passkey login and credential-management requests.
- `presentation/widgets/ProfilePasskeyCard.vue`: user enrollment, rename, and revocation UI.
- `__tests__/`: browser payload conversion and API contract coverage.

Authentication session state remains owned by `features/auth`; profile page composition remains owned by `features/profile`.
