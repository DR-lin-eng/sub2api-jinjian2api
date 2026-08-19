package securityaudit

import (
	"context"
	"errors"
	"sync/atomic"
	"testing"

	"github.com/stretchr/testify/require"
)

type fakePromptEngine struct {
	mode      Mode
	decision  *PromptDecision
	err       error
	enqueues  atomic.Int64
	evaluates atomic.Int64
}

func (f *fakePromptEngine) EffectiveMode() Mode { return f.mode }
func (f *fakePromptEngine) Enqueue(context.Context, Request) error {
	f.enqueues.Add(1)
	return f.err
}
func (f *fakePromptEngine) Evaluate(context.Context, Request) (*PromptDecision, error) {
	f.evaluates.Add(1)
	return f.decision, f.err
}

type copyingPromptEngine struct {
	mode Mode
	body []byte
}

func (f *copyingPromptEngine) EffectiveMode() Mode { return f.mode }
func (f *copyingPromptEngine) Enqueue(_ context.Context, req Request) error {
	f.body = req.Clone().Body
	return nil
}
func (f *copyingPromptEngine) Evaluate(context.Context, Request) (*PromptDecision, error) {
	return &PromptDecision{Kind: DecisionAllow, AllowNextStage: true}, nil
}

func TestCoordinatorModes(t *testing.T) {
	tests := []struct {
		name           string
		mode           Mode
		prompt         *PromptDecision
		promptErr      error
		wantKind       DecisionKind
		wantCode       string
		wantEnqueue    int64
		wantEvaluation int64
	}{
		{name: "off", mode: ModeOff, wantKind: DecisionAllow},
		{name: "async enqueues", mode: ModeAsync, wantKind: DecisionAllow, wantEnqueue: 1},
		{name: "blocking block", mode: ModeBlocking, prompt: &PromptDecision{Kind: DecisionBlock}, wantKind: DecisionBlock, wantCode: ErrorCodeBlocked, wantEvaluation: 1},
		{name: "blocking unavailable", mode: ModeBlocking, promptErr: errors.New("down"), wantKind: DecisionUnavailable, wantCode: ErrorCodeUnavailable, wantEvaluation: 1},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			prompt := &fakePromptEngine{mode: tt.mode, decision: tt.prompt, err: tt.promptErr}
			decision := NewCoordinator(prompt).Check(context.Background(), Request{Body: []byte(`{"input":"hello"}`)})
			require.Equal(t, tt.wantKind, decision.Kind)
			require.Equal(t, tt.wantCode, decision.ErrorCode)
			require.Equal(t, tt.wantEnqueue, prompt.enqueues.Load())
			require.Equal(t, tt.wantEvaluation, prompt.evaluates.Load())
		})
	}
}

func TestCoordinatorRequiresCheckOnlyTracksPromptAudit(t *testing.T) {
	require.False(t, (*Coordinator)(nil).RequiresCheck())
	require.False(t, NewCoordinator(nil).RequiresCheck())
	require.False(t, NewCoordinator(&fakePromptEngine{mode: ModeOff}).RequiresCheck())
	require.True(t, NewCoordinator(&fakePromptEngine{mode: ModeAsync}).RequiresCheck())
	require.True(t, NewCoordinator(&fakePromptEngine{mode: ModeBlocking}).RequiresCheck())
}

func TestCoordinatorDoesNotMutateRequestBody(t *testing.T) {
	body := []byte(`{"messages":[{"role":"user","content":"hello"}]}`)
	original := append([]byte(nil), body...)
	prompt := &copyingPromptEngine{mode: ModeAsync}
	decision := NewCoordinator(prompt).Check(context.Background(), Request{Body: body})
	require.True(t, decision.AllowNextStage)
	require.Equal(t, original, body)
	require.Equal(t, original, prompt.body)
}

func TestCoordinatorAsyncEnqueueFailuresRemainFailOpen(t *testing.T) {
	for _, enqueueErr := range []error{ErrQueueFull, ErrQueueAdmissionBusy, errors.New("backend unavailable")} {
		prompt := &fakePromptEngine{mode: ModeAsync, err: enqueueErr}
		decision := NewCoordinator(prompt).Check(context.Background(), Request{})
		require.Equal(t, DecisionAllow, decision.Kind)
		require.True(t, decision.AllowNextStage)
		require.Equal(t, int64(1), prompt.enqueues.Load())
	}
}
