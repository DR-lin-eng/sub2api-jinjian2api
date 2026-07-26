#!/bin/sh

set -eu

repo_root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
cd "$repo_root"

required_files='AGENTS.md
backend/AGENTS.md
frontend/AGENTS.md
DEV_GUIDE.md
docs/README.md
docs/ARCHITECTURE.md
docs/CODE_MAP.md
docs/REQUEST_LIFECYCLES.md
backend/README.md
frontend/README.md
deploy/README.md'

maintained_docs='AGENTS.md
backend/AGENTS.md
frontend/AGENTS.md
DEV_GUIDE.md
README.md
README_CN.md
README_JA.md
docs/README.md
docs/ARCHITECTURE.md
docs/CODE_MAP.md
docs/REQUEST_LIFECYCLES.md
backend/README.md
frontend/README.md
frontend/src/router/README.md
frontend/src/stores/README.md'

required_paths='backend/cmd/server/main.go
backend/cmd/server/wire.go
backend/ent/schema
backend/internal/application/service
backend/internal/infrastructure/repository
backend/internal/platform/config
backend/internal/transport/http/server/router.go
backend/internal/transport/http/server/routes/gateway.go
backend/internal/transport/http/server/middleware/api_key_auth.go
backend/migrations
deploy/config.example.yaml
frontend/src/api/client.ts
frontend/src/i18n/locales
frontend/src/main.ts
frontend/src/router/index.ts
frontend/src/stores
frontend/src/views'

status=0

printf '%s\n' "$required_files" | while IFS= read -r path; do
	[ -n "$path" ] || continue
	if [ ! -f "$path" ]; then
		echo "docs error: required file is missing: $path" >&2
		exit 1
	fi
done || status=1

printf '%s\n' "$required_paths" | while IFS= read -r path; do
	[ -n "$path" ] || continue
	if [ ! -e "$path" ]; then
		echo "docs error: documented source path is missing: $path" >&2
		exit 1
	fi
done || status=1

printf '%s\n' "$maintained_docs" | while IFS= read -r doc; do
	[ -n "$doc" ] || continue
	doc_dir=$(dirname "$doc")
	links=$(grep -Eo '\]\([^)]*\)' "$doc" 2>/dev/null | sed -E 's/^\]\((.*)\)$/\1/' || true)
	[ -n "$links" ] || continue

	printf '%s\n' "$links" | while IFS= read -r target; do
		case "$target" in
			''|'#'*|http://*|https://*|mailto:*|tel:*) continue ;;
		esac

		target=${target%%#*}
		case "$target" in
			*' '*|'<'*|'>'*)
				echo "docs error: unsupported local link syntax in $doc: $target" >&2
				exit 1
				;;
		esac

		if [ ! -e "$repo_root/$doc_dir/$target" ]; then
			echo "docs error: broken local link in $doc: $target" >&2
			exit 1
		fi
	done
done || status=1

stale_output=$(mktemp "${TMPDIR:-/tmp}/sub2api-docs-stale.XXXXXX")
trap 'rm -f "$stale_output"' EXIT HUP INT TERM

for readme in README.md README_CN.md README_JA.md; do
	if grep -nE 'internal/(config|model|service|handler|gateway)/' "$readme" >"$stale_output" 2>/dev/null; then
		echo "docs error: $readme still contains a legacy backend layout path:" >&2
		cat "$stale_output" >&2
		status=1
	fi
done

go_version=$(awk '$1 == "go" { print $2; exit }' backend/go.mod)
for readme in README.md README_CN.md README_JA.md; do
	if ! grep -Fq "Go-$go_version-" "$readme"; then
		echo "docs error: $readme Go badge does not match backend/go.mod ($go_version)" >&2
		status=1
	fi
	if ! grep -Fq "Go $go_version, Gin, Ent" "$readme"; then
		echo "docs error: $readme tech stack does not match backend/go.mod ($go_version)" >&2
		status=1
	fi
done

if [ "$status" -ne 0 ]; then
	exit "$status"
fi

echo "Documentation checks passed."
