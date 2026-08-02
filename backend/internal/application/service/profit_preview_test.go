package service

import (
	"math"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func profitPreviewTestAccount(id int64, rate *float64, models ...string) *Account {
	mapping := make(map[string]any, len(models))
	for _, model := range models {
		mapping[model] = model
	}
	return &Account{
		ID:             id,
		Name:           "preview-account",
		Platform:       PlatformOpenAI,
		Type:           AccountTypeAPIKey,
		RateMultiplier: rate,
		Extra:          make(map[string]any),
		Credentials:    map[string]any{"model_mapping": mapping},
	}
}

func TestPreviewProfitAdmissionUsesRuntimeThresholdsAndPreinitializesModels(t *testing.T) {
	now := time.Now()
	group := newProfitControlTestGroup(50, PlatformOpenAI)
	group.Name = "VIP-preview"
	group.ProfitMinMargin = 0.2

	cheap := profitPreviewTestAccount(1, float64Pointer(0.5), "gpt-sol")
	cheap.Name = "cheap"
	cheap.Extra[UpstreamBillingRateSyncEnabledExtraKey] = true
	staleAt := now.Add(-time.Minute)
	cheap.Extra[UpstreamBillingProbeExtraKey] = &UpstreamBillingProbeSnapshot{
		Status:     UpstreamBillingProbeStatusOK,
		FreshUntil: &staleAt,
	}

	boundary := profitPreviewTestAccount(2, float64Pointer(0.8), "gpt-sol", "gpt-luna")
	boundary.Name = "boundary"
	expensive := profitPreviewTestAccount(3, float64Pointer(1), "gpt-sol")
	expensive.Name = "expensive"
	invalid := profitPreviewTestAccount(4, nil, "gpt-sol")
	invalid.Name = "invalid"

	reports := PreviewProfitAdmission([]ProfitPreviewGroupInput{{
		Group:         group,
		Accounts:      []*Account{cheap, boundary, expensive, invalid},
		UserOverrides: map[int64]float64{40: 0.5},
		Models:        []string{"gpt-sol", "gpt-luna", "gpt-no-account"},
	}}, now)
	require.Len(t, reports, 1)
	report := reports[0]
	require.InDelta(t, 1, report.DefaultD, 1e-12)
	require.InDelta(t, 0.8, report.ThresholdDefault, 1e-12)
	require.InDelta(t, 0.5, report.MinEffectiveD, 1e-12)
	require.InDelta(t, 0.4, report.ThresholdMinD, 1e-12)

	byID := make(map[int64]ProfitPreviewAccountVerdict, len(report.Verdicts))
	for _, verdict := range report.Verdicts {
		byID[verdict.AccountID] = verdict
	}
	require.Equal(t, ProfitPreviewClassAdmitted, byID[cheap.ID].Class)
	require.Equal(t, ProfitPreviewRateSourceUpstreamProbe, byID[cheap.ID].RateSource)
	require.Contains(t, byID[cheap.ID].Warnings, ProfitPreviewWarningProbeStale)
	require.True(t, byID[cheap.ID].RejectedUnderMinD)
	require.Equal(t, ProfitPreviewClassAdmitted, byID[boundary.ID].Class)
	require.Equal(t, ProfitPreviewClassRejectedThreshold, byID[expensive.ID].Class)
	require.Contains(t, byID[expensive.ID].Warnings, ProfitPreviewWarningManualRateOne)
	require.Equal(t, ProfitPreviewClassRejectedInvalidRate, byID[invalid.ID].Class)

	require.Equal(t, 2, report.RemainingByModel["gpt-sol"])
	require.Equal(t, 1, report.RemainingByModel["gpt-luna"])
	count, present := report.RemainingByModel["gpt-no-account"]
	require.True(t, present)
	require.Zero(t, count)
}

func TestPreviewProfitAdmissionAssumeEnabledAndFivePlatforms(t *testing.T) {
	now := time.Now()
	platforms := []string{PlatformOpenAI, PlatformAnthropic, PlatformGemini, PlatformGrok, PlatformAntigravity}
	inputs := make([]ProfitPreviewGroupInput, 0, len(platforms)+1)
	for i, platform := range platforms {
		group := newProfitControlTestGroup(int64(100+i), platform)
		group.ProfitControlEnabled = false
		account := profitPreviewTestAccount(int64(200+i), float64Pointer(0.2), "model")
		account.Platform = platform
		inputs = append(inputs, ProfitPreviewGroupInput{
			Group:         group,
			Accounts:      []*Account{account},
			Models:        []string{"model"},
			AssumeEnabled: true,
		})
	}
	unsupported := newProfitControlTestGroup(999, PlatformComposite)
	inputs = append(inputs, ProfitPreviewGroupInput{Group: unsupported, AssumeEnabled: true})

	reports := PreviewProfitAdmission(inputs, now)
	require.Len(t, reports, len(inputs))
	for i := range platforms {
		require.True(t, reports[i].EffectiveGate, platforms[i])
		require.True(t, reports[i].AssumedEnabled, platforms[i])
		require.Equal(t, ProfitPreviewClassAdmitted, reports[i].Verdicts[0].Class, platforms[i])
	}
	require.False(t, reports[len(reports)-1].EffectiveGate)
}

func TestPreviewProfitAdmissionIgnoresInvalidUserOverrides(t *testing.T) {
	group := newProfitControlTestGroup(60, PlatformOpenAI)
	group.RateMultiplier = 0.5
	report := PreviewProfitAdmission([]ProfitPreviewGroupInput{{
		Group: group,
		UserOverrides: map[int64]float64{
			1: math.NaN(),
			2: math.Inf(1),
			3: -1,
			4: 0.4,
		},
	}}, time.Now())[0]
	require.InDelta(t, 0.4, report.MinEffectiveD, 1e-12)
}
