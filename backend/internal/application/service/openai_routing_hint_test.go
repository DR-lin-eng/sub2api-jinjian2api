package service

import (
	"context"
	"net/http"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestSetOpenAICodexRoutingHintOnlyForOAuth(t *testing.T) {
	oauth := &Account{Platform: PlatformOpenAI, Type: AccountTypeOAuth}
	apiKey := &Account{Platform: PlatformOpenAI, Type: AccountTypeAPIKey}

	h := make(http.Header)
	setOpenAICodexRoutingHint(h, oauth, "gpt-5.6", "fast")
	require.Equal(t, "model=gpt-5.6;tier=priority", h.Get(openAICodexRoutingHintHeader))

	h = http.Header{openAICodexRoutingHintHeader: {"caller-supplied"}}
	setOpenAICodexRoutingHint(h, apiKey, "gpt-5.6", "flex")
	require.Empty(t, h.Get(openAICodexRoutingHintHeader))
}

func TestSetOpenAICodexRoutingHintRejectsHeaderInjection(t *testing.T) {
	h := make(http.Header)
	setOpenAICodexRoutingHint(h, &Account{Platform: PlatformOpenAI, Type: AccountTypeOAuth}, "gpt-5.6\ninvalid", "priority")
	require.Empty(t, h.Get(openAICodexRoutingHintHeader))
}

func TestApplyCodexCanonicalAuthIdentityOmitsInferenceVersion(t *testing.T) {
	h := make(http.Header)
	ApplyCodexCanonicalAuthIdentity(h)
	require.Equal(t, "codex_cli_rs", h.Get("originator"))
	require.Contains(t, h.Get("user-agent"), "codex_cli_rs/")
	require.Empty(t, h.Get("version"))
}

func TestCodexRoutingHintDiagnosticsDoNotRequireCredentials(t *testing.T) {
	logOpenAIRoutingDiagnostics(context.Background(), &Account{ID: 1, Platform: PlatformOpenAI, Type: AccountTypeOAuth}, "http", "gpt-5.6", "flex", true, "not_applicable")
}
