package handler

import (
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/stretchr/testify/require"
)

func TestOpenAIWSTurnChannelMappingStateKeepsExactTurnSnapshot(t *testing.T) {
	var state openAIWSTurnChannelMappingState
	first := service.ChannelMappingResult{Mapped: true, MappedModel: "gpt-5.6-sol", ChannelID: 1}
	second := service.ChannelMappingResult{Mapped: true, MappedModel: "gpt-5.6-terra", ChannelID: 2}

	state.Store(1, "sol", first)
	got, ok := state.Load(1)
	require.True(t, ok)
	require.Equal(t, "sol", got.requestedModel)
	require.Equal(t, first, got.mapping)

	state.Store(2, "terra", second)
	_, oldTurnExists := state.Load(1)
	require.False(t, oldTurnExists)
	got, ok = state.Load(2)
	require.True(t, ok)
	require.Equal(t, "terra", got.requestedModel)
	require.Equal(t, second, got.mapping)
}

func BenchmarkOpenAIWSTurnChannelMappingHotPath(b *testing.B) {
	var state openAIWSTurnChannelMappingState
	mapping := service.ChannelMappingResult{
		Mapped:             true,
		MappedModel:        "gpt-5.6-sol",
		ChannelID:          42,
		BillingModelSource: service.BillingModelSourceChannelMapped,
	}
	b.ReportAllocs()
	for turn := 1; turn <= b.N; turn++ {
		state.Store(turn, "public-sol", mapping)
		snapshot, ok := state.Load(turn)
		if !ok || snapshot.mapping.MappedModel != mapping.MappedModel {
			b.Fatal("turn snapshot was not preserved")
		}
	}
}
