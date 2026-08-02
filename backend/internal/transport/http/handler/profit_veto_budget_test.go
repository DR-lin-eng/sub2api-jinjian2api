package handler

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestRecordOpenAIProfitVetoIsBounded(t *testing.T) {
	failed := make(map[int64]struct{})
	count := 0

	for accountID := int64(1); accountID < int64(maxProfitVetoAttempts); accountID++ {
		require.True(t, recordOpenAIProfitVeto(&failed, accountID, &count))
		require.Contains(t, failed, accountID)
	}

	require.False(t, recordOpenAIProfitVeto(&failed, int64(maxProfitVetoAttempts), &count))
	require.Equal(t, maxProfitVetoAttempts, count)
	require.Len(t, failed, maxProfitVetoAttempts)
}

func TestProfitVetoBudgetsShareOneLimit(t *testing.T) {
	state := NewFailoverState(10, false)
	failed := make(map[int64]struct{})
	count := 0
	stateStoppedAt := 0
	openAIStoppedAt := 0

	for accountID := int64(1); accountID <= int64(maxProfitVetoAttempts)+5; accountID++ {
		if stateStoppedAt == 0 && state.RecordProfitVeto(accountID) == FailoverExhausted {
			stateStoppedAt = state.ProfitVetoCount()
		}
		if openAIStoppedAt == 0 && !recordOpenAIProfitVeto(&failed, accountID, &count) {
			openAIStoppedAt = count
		}
	}

	require.Equal(t, maxProfitVetoAttempts, stateStoppedAt)
	require.Equal(t, stateStoppedAt, openAIStoppedAt)
}

func TestProfitVetoAfter503DoesNotLivelock(t *testing.T) {
	state := NewFailoverState(10, false)
	state.LastFailoverErr = newTestFailoverErr(503, false, false)
	state.SwitchCount = 1
	state.ExcludeAccount(1)

	require.Equal(t, FailoverContinue, state.HandleSelectionExhausted(context.Background()))
	require.Empty(t, state.FailedAccountIDs)
	require.Equal(t, FailoverContinue, state.RecordProfitVeto(1))
	require.Equal(t, FailoverExhausted, state.HandleSelectionExhausted(context.Background()))
	require.Contains(t, state.FailedAccountIDs, int64(1))
}
