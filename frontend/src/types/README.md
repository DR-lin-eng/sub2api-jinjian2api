# Shared Frontend Types

`@/types` is the stable compatibility entrypoint for shared protocol and UI types.

- `common.ts`: common UI, local administrator authentication and public settings.
- `gateway.ts`: groups, API keys, accounts, proxies and gateway import/export contracts.
- `usage.ts`: usage logs, cost statistics, administrator security and scheduled tests.
- `global.d.ts`: browser globals supplied by the application shell.

New feature-private contracts should stay with their owning feature. Add a shared type here only when multiple features genuinely consume the same protocol, and keep `index.ts` as re-exports rather than rebuilding a monolithic declaration file.
