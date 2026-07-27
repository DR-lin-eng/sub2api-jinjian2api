package service

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestOptionalUsageUpstreamModelKeepsOnlyInformativeValues(t *testing.T) {
	t.Parallel()

	require.Nil(t, optionalUsageUpstreamModel("", "gpt-5.6-sol", "gpt-5.6-sol"))
	require.Nil(t, optionalUsageUpstreamModel("gpt-5.6-sol", "gpt-5.6-sol", "gpt-5.6-sol"))

	channelMapped := optionalUsageUpstreamModel("gpt-5.6-terra", "gpt-5.6-terra", "gpt-5.6-sol")
	require.NotNil(t, channelMapped)
	require.Equal(t, "gpt-5.6-terra", *channelMapped)

	looped := optionalUsageUpstreamModel("gpt-5.6-sol", "gpt-5.6-terra", "gpt-5.6-sol")
	require.NotNil(t, looped)
	require.Equal(t, "gpt-5.6-sol", *looped)
}

func BenchmarkOptionalUsageUpstreamModel(b *testing.B) {
	b.Run("ordinary_sparse", func(b *testing.B) {
		b.ReportAllocs()
		for range b.N {
			if got := optionalUsageUpstreamModel("gpt-5.6-sol", "gpt-5.6-sol", "gpt-5.6-sol"); got != nil {
				b.Fatal("ordinary request should keep upstream_model sparse")
			}
		}
	})

	b.Run("mapped_informative", func(b *testing.B) {
		b.ReportAllocs()
		for range b.N {
			if got := optionalUsageUpstreamModel("gpt-5.6-terra", "gpt-5.6-terra", "gpt-5.6-sol"); got == nil {
				b.Fatal("mapped request should preserve upstream_model")
			}
		}
	})
}
