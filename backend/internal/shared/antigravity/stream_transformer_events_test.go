package antigravity

import (
	"errors"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

type collectingClaudeStreamEventSink struct {
	events []ClaudeStreamEvent
	err    error
}

func (s *collectingClaudeStreamEventSink) ConsumeClaudeStreamEvent(event ClaudeStreamEvent) error {
	if s.err != nil {
		return s.err
	}
	s.events = append(s.events, event)
	return nil
}

func TestStreamingProcessorTypedEventsMatchByteLifecycle(t *testing.T) {
	line := `data: {"response":{"responseId":"resp_typed","candidates":[{"content":{"parts":[{"text":"hello"}]},"finishReason":"STOP"}],"usageMetadata":{"promptTokenCount":8,"candidatesTokenCount":3}}}`

	byteProcessor := NewStreamingProcessor("gemini-test")
	byteOutput := byteProcessor.ProcessLine(line)
	finalBytes, _ := byteProcessor.Finish()
	byteOutput = append(byteOutput, finalBytes...)
	var byteEventTypes []string
	for _, line := range strings.Split(string(byteOutput), "\n") {
		if strings.HasPrefix(line, "event:") {
			byteEventTypes = append(byteEventTypes, strings.TrimSpace(strings.TrimPrefix(line, "event:")))
		}
	}

	typedProcessor := NewStreamingProcessor("gemini-test")
	sink := &collectingClaudeStreamEventSink{}
	require.NoError(t, typedProcessor.ProcessLineEvents(line, sink))
	usage, err := typedProcessor.FinishEvents(sink)
	require.NoError(t, err)
	require.NotNil(t, usage)
	require.Equal(t, 8, usage.InputTokens)
	require.Equal(t, 3, usage.OutputTokens)

	typedEventTypes := make([]string, 0, len(sink.events))
	for _, event := range sink.events {
		typedEventTypes = append(typedEventTypes, event.Type)
	}
	require.Equal(t, byteEventTypes, typedEventTypes)
	require.Equal(t, "hello", sink.events[2].Delta.Text)
	require.Equal(t, "end_turn", sink.events[len(sink.events)-2].Delta.StopReason)
}

func TestStreamingProcessorTypedSinkErrorIsPropagated(t *testing.T) {
	wantErr := errors.New("typed sink rejected event")
	sink := &collectingClaudeStreamEventSink{err: wantErr}
	processor := NewStreamingProcessor("gemini-test")

	err := processor.ProcessLineEvents(
		`data: {"response":{"responseId":"resp_typed","candidates":[{"content":{"parts":[{"text":"hello"}]}}]}}`,
		sink,
	)
	require.ErrorIs(t, err, wantErr)
}
