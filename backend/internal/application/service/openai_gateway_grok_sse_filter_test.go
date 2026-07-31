package service

import (
	"io"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func filterGrokPingTestInput(t testing.TB, input string) string {
	t.Helper()
	body := newGrokResponsesBillingPingFilterBody(
		io.NopCloser(strings.NewReader(input)),
		&Account{Platform: PlatformGrok},
		defaultMaxLineSize,
	)
	output, err := io.ReadAll(body)
	require.NoError(t, err)
	require.NoError(t, body.Close())
	return string(output)
}

func TestGrokResponsesBillingPingFilter(t *testing.T) {
	input := ": upstream keepalive\n\n" +
		"event: response.output_text.delta\n" +
		`data: {"type":"response.output_text.delta","delta":"hello"}` + "\n\n" +
		"event: ping\n" +
		`data: {"type":"ping","x-opencode-type":"inference-cost","cost":2.75}` + "\n\n" +
		"event: response.completed\n" +
		`data: {"type":"response.completed","response":{"id":"resp_1"}}` + "\n\n"

	result := filterGrokPingTestInput(t, input)
	require.NotContains(t, result, "event: ping")
	require.NotContains(t, result, "inference-cost")
	require.Contains(t, result, ": ping\n\n")
	require.Contains(t, result, "response.output_text.delta")
	require.Contains(t, result, "response.completed")
}

func TestGrokResponsesBillingPingFilterPreservesNonPingFrames(t *testing.T) {
	input := "event: future.vendor_event\r\n" +
		`data: {"type":"future.vendor_event","value":1}` + "\r\n\r\n" +
		"event: ping\n" + `data: {"type":"response.completed"}` + "\n\n" +
		": keepalive comment\n\n"
	require.Equal(t, input, filterGrokPingTestInput(t, input))
}

func TestGrokResponsesBillingPingFilterConvertsPingVariants(t *testing.T) {
	frames := []string{
		"event: ping\ndata: {\"type\":\"ping\",\"cost\":\"0\"}\n\n",
		"event: ping\ndata: {\"cost\":\"0\"}\n\n",
		"event: ping\ndata: {not-json}\n\n",
		"event: ping\n\n",
		"event: ping\n: vendor note\ndata: {\"type\":\"ping\"}\n\n",
	}
	require.Equal(t, strings.Repeat(": ping\n\n", len(frames)), filterGrokPingTestInput(t, strings.Join(frames, "")))
}

func TestGrokResponsesBillingPingFilterPassesThroughOversizedPingFrame(t *testing.T) {
	lines := []string{"event: ping"}
	for i := 0; i < grokResponsesPingFrameMaxLines; i++ {
		lines = append(lines, ": filler comment")
	}
	lines = append(lines, `data: {"type":"ping","cost":"0"}`, "")
	input := strings.Join(lines, "\n")
	require.Equal(t, input, filterGrokPingTestInput(t, input))
}

func TestGrokResponsesBillingPingFilterDoesNotFilterNonGrokAccounts(t *testing.T) {
	input := "event: ping\ndata: {\"type\":\"ping\",\"cost\":\"0\"}\n\n"
	source := io.NopCloser(strings.NewReader(input))
	body := newGrokResponsesBillingPingFilterBody(source, &Account{Platform: PlatformOpenAI}, defaultMaxLineSize)
	output, err := io.ReadAll(body)
	require.NoError(t, err)
	require.NoError(t, body.Close())
	require.Equal(t, input, string(output))
}

func BenchmarkGrokResponsesBillingPingFilterPassthrough(b *testing.B) {
	frame := "event: response.output_text.delta\n" +
		`data: {"type":"response.output_text.delta","delta":"ordinary payload"}` + "\n\n"
	input := strings.Repeat(frame, 128)
	b.ReportAllocs()
	b.SetBytes(int64(len(input)))
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		body := newGrokResponsesBillingPingFilterBody(
			io.NopCloser(strings.NewReader(input)),
			&Account{Platform: PlatformGrok},
			defaultMaxLineSize,
		)
		if _, err := io.Copy(io.Discard, body); err != nil {
			b.Fatal(err)
		}
		if err := body.Close(); err != nil {
			b.Fatal(err)
		}
	}
}
