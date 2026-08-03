package openai

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestIsCodexLoadShedOriginator(t *testing.T) {
	require.True(t, IsCodexLoadShedOriginator("codex-tui"))
	require.True(t, IsCodexLoadShedOriginator("  CODEX-TUI  "))
	require.False(t, IsCodexLoadShedOriginator("codex_cli_rs"))
	require.False(t, IsCodexLoadShedOriginator("codex_vscode"))
}

func TestNormalizeCodexClientIdentityToCLI(t *testing.T) {
	tests := []struct {
		name           string
		originator     string
		userAgent      string
		wantOriginator string
		wantUserAgent  string
		wantChanged    bool
	}{
		{
			name:           "tui identity preserves fingerprint",
			originator:     "codex-tui",
			userAgent:      "codex-tui/0.144.1 (Ubuntu 22.4.0; x86_64) xterm-256color (codex-tui; 0.144.1)",
			wantOriginator: CodexCLIOriginator,
			wantUserAgent:  "codex_cli_rs/0.144.1 (Ubuntu 22.4.0; x86_64) xterm-256color",
			wantChanged:    true,
		},
		{
			name:           "os group is not removed",
			originator:     "codex-tui",
			userAgent:      "codex-tui/0.144.1 (Mac OS X 14.0; arm64)",
			wantOriginator: CodexCLIOriginator,
			wantUserAgent:  "codex_cli_rs/0.144.1 (Mac OS X 14.0; arm64)",
			wantChanged:    true,
		},
		{
			name:           "healthy identity remains unchanged",
			originator:     "codex_vscode",
			userAgent:      "codex_vscode/1.0.0 (Ubuntu 22.4.0; x86_64)",
			wantOriginator: "codex_vscode",
			wantUserAgent:  "codex_vscode/1.0.0 (Ubuntu 22.4.0; x86_64)",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			originator, userAgent, changed := NormalizeCodexClientIdentityToCLI(tt.originator, tt.userAgent)
			require.Equal(t, tt.wantOriginator, originator)
			require.Equal(t, tt.wantUserAgent, userAgent)
			require.Equal(t, tt.wantChanged, changed)
		})
	}
}

func TestNormalizeCodexClientIdentityToCLIStaysPairedAndIdempotent(t *testing.T) {
	originator, userAgent, changed := NormalizeCodexClientIdentityToCLI(
		"codex-tui",
		"codex-tui/0.144.1 (Ubuntu 22.4.0; x86_64) xterm-256color (codex-tui; 0.144.1)",
	)
	require.True(t, changed)

	pairedOriginator, pairedUserAgent, ok := PairCodexClientIdentity(userAgent)
	require.True(t, ok)
	require.Equal(t, originator, pairedOriginator)
	require.Equal(t, userAgent, pairedUserAgent)

	againOriginator, againUserAgent, againChanged := NormalizeCodexClientIdentityToCLI(originator, userAgent)
	require.False(t, againChanged)
	require.Equal(t, originator, againOriginator)
	require.Equal(t, userAgent, againUserAgent)
}

func BenchmarkNormalizeCodexClientIdentityToCLIHealthy(b *testing.B) {
	for b.Loop() {
		NormalizeCodexClientIdentityToCLI(
			"codex_cli_rs",
			"codex_cli_rs/0.144.1 (Ubuntu 22.4.0; x86_64) xterm-256color",
		)
	}
}
