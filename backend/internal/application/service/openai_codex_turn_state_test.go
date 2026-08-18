package service

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func newTurnStateTestContext() *gin.Context {
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodPost, "/v1/responses", nil)
	c.Request.Header.Set("session-id", "client-session-1")
	return c
}

func TestOpenAICodexTurnStateRelayAndCrossAccountGuard(t *testing.T) {
	svc := &OpenAIGatewayService{}
	c := newTurnStateTestContext()
	first := &Account{ID: 101, Platform: PlatformOpenAI, Type: AccountTypeOAuth}
	second := &Account{ID: 202, Platform: PlatformOpenAI, Type: AccountTypeOAuth}

	svc.relayOpenAICodexTurnState(c, first, http.Header{"X-Codex-Turn-State": []string{"state-1"}})
	require.Equal(t, "state-1", c.Writer.Header().Get(openAICodexTurnStateHeader))

	headers := http.Header{openAICodexTurnStateHeader: []string{"state-1"}}
	svc.guardOpenAICodexTurnStateEcho(c, second, headers)
	require.Empty(t, headers.Get(openAICodexTurnStateHeader))

	headers = http.Header{openAICodexTurnStateHeader: []string{"state-1"}}
	svc.guardOpenAICodexTurnStateEcho(c, first, headers)
	require.Equal(t, "state-1", extractOpenAICodexTurnState(headers))
}

func TestOpenAICodexTurnStateUnknownOriginIsPreserved(t *testing.T) {
	svc := &OpenAIGatewayService{}
	c := newTurnStateTestContext()
	headers := http.Header{openAICodexTurnStateHeader: []string{"external-state"}}
	svc.guardOpenAICodexTurnStateEcho(c, &Account{ID: 303, Platform: PlatformOpenAI, Type: AccountTypeOAuth}, headers)
	require.Equal(t, "external-state", extractOpenAICodexTurnState(headers))
}
