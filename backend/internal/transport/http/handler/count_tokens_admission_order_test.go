package handler

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestCountTokensAdmissionPrecedesSelectionAndForwardWithoutDownstreamBilling(t *testing.T) {
	tests := []struct {
		name string
		file string
	}{
		{name: "anthropic gateway", file: "gateway_handler_count_tokens.go"},
		{name: "openai bridge", file: "openai_gateway_count_tokens.go"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			source := stripGoComments(goFunctionSource(t, tt.file, "CountTokens"))
			pendingIndex := strings.Index(source, "SetPriorityAdmissionPendingBytes")
			userIndex := strings.Index(source, "AcquireUserSlotWithWait")
			selectionIndex := strings.Index(source, "SelectAccountWith")
			accountIndex := strings.Index(source, "acquireAccountSelectionSlot")
			forwardIndex := strings.Index(source, ".Forward")

			require.NotEqual(t, -1, pendingIndex, "request body bytes must be registered")
			require.NotEqual(t, -1, userIndex, "user admission must be enforced")
			require.NotEqual(t, -1, selectionIndex, "load-aware account selection must remain present")
			require.NotEqual(t, -1, accountIndex, "account admission must consume the selection result")
			require.NotEqual(t, -1, forwardIndex, "upstream forwarding must remain present")
			require.NotContains(t, source, "CheckBillingEligibility", "count_tokens must not enforce downstream balance or subscription billing")
			require.NotContains(t, source, "billingCacheService", "count_tokens must not depend on downstream billing services")
			require.NotContains(t, source, "GetSubscriptionFromContext", "count_tokens must not read downstream subscriptions")
			require.Less(t, pendingIndex, userIndex)
			require.Less(t, userIndex, selectionIndex)
			require.Less(t, selectionIndex, accountIndex)
			require.Less(t, accountIndex, forwardIndex)
		})
	}
}

func TestGrokCountTokensRegistersBytesAndAcquiresOnlyUserSlot(t *testing.T) {
	source := stripGoComments(goFunctionSource(t, "openai_gateway_count_tokens.go", "GrokCountTokens"))
	pendingIndex := strings.Index(source, "SetPriorityAdmissionPendingBytes")
	userIndex := strings.Index(source, "AcquireUserSlotWithWait")
	estimateIndex := strings.Index(source, "EstimateGrokCountTokens")

	require.NotEqual(t, -1, pendingIndex)
	require.NotEqual(t, -1, userIndex)
	require.NotEqual(t, -1, estimateIndex)
	require.Less(t, pendingIndex, userIndex)
	require.Less(t, userIndex, estimateIndex)
	require.NotContains(t, source, "acquireAccountSelectionSlot")
	require.NotContains(t, source, "SelectAccount")
}
