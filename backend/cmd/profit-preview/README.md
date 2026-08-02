# Profit Preview

`profit-preview` uses a read-only JSON export to evaluate group profit-control admission before enabling it in production. It does not connect to the database or change service state.

Run it from `backend/`:

```sh
go run ./cmd/profit-preview -input dump.json -assume-enabled
go run ./cmd/profit-preview -input dump.json -assume-enabled -json
```

The input root is `{"groups": [...]}`. Each entry contains `group`, `accounts`, `user_overrides`, and `models`. Account `model_mapping` values determine the model-level remaining counts.
