package service

import "testing"

var benchmarkCodexPrewarmContinuationEnabled bool

func TestAccount_IsCodexPrewarmContinuationEnabled(t *testing.T) {
	tests := []struct {
		name    string
		account *Account
		want    bool
	}{
		{
			name: "enabled for OpenAI OAuth",
			account: &Account{
				Platform: PlatformOpenAI,
				Type:     AccountTypeOAuth,
				Extra:    map[string]any{CodexPrewarmContinuationExtraKey: true},
			},
			want: true,
		},
		{
			name: "disabled for OpenAI API key",
			account: &Account{
				Platform: PlatformOpenAI,
				Type:     AccountTypeAPIKey,
				Extra:    map[string]any{CodexPrewarmContinuationExtraKey: true},
			},
		},
		{
			name: "disabled for non OpenAI OAuth",
			account: &Account{
				Platform: PlatformAnthropic,
				Type:     AccountTypeOAuth,
				Extra:    map[string]any{CodexPrewarmContinuationExtraKey: true},
			},
		},
		{
			name: "disabled for malformed value",
			account: &Account{
				Platform: PlatformOpenAI,
				Type:     AccountTypeOAuth,
				Extra:    map[string]any{CodexPrewarmContinuationExtraKey: "true"},
			},
		},
		{name: "disabled for nil account", account: nil},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			if got := tc.account.IsCodexPrewarmContinuationEnabled(); got != tc.want {
				t.Fatalf("IsCodexPrewarmContinuationEnabled() = %v, want %v", got, tc.want)
			}
		})
	}
}

func BenchmarkAccount_IsCodexPrewarmContinuationEnabled(b *testing.B) {
	accounts := map[string]*Account{
		"disabled": {
			Platform: PlatformOpenAI,
			Type:     AccountTypeOAuth,
			Extra:    map[string]any{"other_setting": true},
		},
		"enabled": {
			Platform: PlatformOpenAI,
			Type:     AccountTypeOAuth,
			Extra:    map[string]any{CodexPrewarmContinuationExtraKey: true},
		},
	}

	for name, account := range accounts {
		b.Run(name, func(b *testing.B) {
			b.ReportAllocs()
			for range b.N {
				benchmarkCodexPrewarmContinuationEnabled = account.IsCodexPrewarmContinuationEnabled()
			}
		})
	}
}
