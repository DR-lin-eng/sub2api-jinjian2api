package service

// Profit-control preview consumes a read-only export and reuses the runtime
// U/D threshold semantics without touching production state.

import (
	"math"
	"sort"
	"time"
)

const (
	ProfitPreviewRateSourceManual        = "manual"
	ProfitPreviewRateSourceUpstreamProbe = "upstream_probe_sync"

	ProfitPreviewWarningProbeMissing     = "probe_snapshot_missing"
	ProfitPreviewWarningProbeStale       = "probe_snapshot_stale"
	ProfitPreviewWarningProbeFailed      = "probe_failed"
	ProfitPreviewWarningProbeUnsupported = "probe_unsupported"
	ProfitPreviewWarningManualRateOne    = "manual_rate_1_suspected_unmaintained"
)

type ProfitPreviewGroupInput struct {
	Group *Group
	// Accounts are schedulable accounts bound to the group. Mixed scheduling may
	// include Antigravity accounts for Anthropic or Gemini groups.
	Accounts []*Account
	Models   []string
	// AssumeEnabled evaluates saved profit settings while the group remains off.
	AssumeEnabled bool
}

const (
	ProfitPreviewClassAdmitted            = "admitted"
	ProfitPreviewClassRejectedThreshold   = "rejected_threshold"
	ProfitPreviewClassRejectedInvalidRate = "rejected_invalid_account_rate"
)

type ProfitPreviewAccountVerdict struct {
	AccountID         int64    `json:"account_id"`
	Name              string   `json:"name"`
	Platform          string   `json:"platform"`
	Class             string   `json:"class"`
	AccountRate       *float64 `json:"account_rate,omitempty"`
	RateSource        string   `json:"rate_source"`
	Warnings          []string `json:"warnings,omitempty"`
	RejectedUnderMinD bool     `json:"rejected_under_min_d,omitempty"`
	SupportedModels   []string `json:"supported_models,omitempty"`
}

type ProfitPreviewGroupReport struct {
	GroupID              int64                         `json:"group_id"`
	GroupName            string                        `json:"group_name"`
	Platform             string                        `json:"platform"`
	EffectiveGate        bool                          `json:"effective_gate"`
	AssumedEnabled       bool                          `json:"assumed_enabled,omitempty"`
	DefaultD             float64                       `json:"default_d"`
	MinEffectiveD        float64                       `json:"min_effective_d"`
	ThresholdDefault     float64                       `json:"threshold_default"`
	ThresholdMinD        float64                       `json:"threshold_min_d"`
	RemainingByModel     map[string]int                `json:"profit_admitted_by_model"`
	RemainingByModelMinD map[string]int                `json:"profit_admitted_by_model_min_d"`
	Verdicts             []ProfitPreviewAccountVerdict `json:"verdicts"`
}

// PreviewProfitAdmission evaluates the five supported platform groups. Probe
// state explains rate provenance only; admission always uses Account.RateMultiplier.
func PreviewProfitAdmission(inputs []ProfitPreviewGroupInput, evalAt time.Time) []ProfitPreviewGroupReport {
	reports := make([]ProfitPreviewGroupReport, 0, len(inputs))
	for _, input := range inputs {
		if input.Group == nil {
			continue
		}
		group := input.Group
		effectiveGate := (group.ProfitControlEnabled || input.AssumeEnabled) && profitControlPlatformSupported(group.Platform)
		report := ProfitPreviewGroupReport{
			GroupID:              group.ID,
			GroupName:            group.Name,
			Platform:             group.Platform,
			EffectiveGate:        effectiveGate,
			AssumedEnabled:       input.AssumeEnabled && !group.ProfitControlEnabled && effectiveGate,
			RemainingByModel:     make(map[string]int, len(input.Models)),
			RemainingByModelMinD: make(map[string]int, len(input.Models)),
		}
		for _, model := range input.Models {
			report.RemainingByModel[model] = 0
			report.RemainingByModelMinD[model] = 0
		}

		defaultD := group.RateMultiplier
		minD := defaultD
		deduction := group.ProfitMinMargin + group.ProfitSafetyBuffer
		report.DefaultD = defaultD
		report.MinEffectiveD = minD
		report.ThresholdDefault = clampProfitControlThreshold(defaultD * (1 - deduction))
		report.ThresholdMinD = clampProfitControlThreshold(minD * (1 - deduction))

		for _, account := range input.Accounts {
			if account == nil {
				continue
			}
			verdict := previewAccountProfitAdmission(account, effectiveGate, report.ThresholdDefault, report.ThresholdMinD, evalAt)
			admittedDefault := verdict.Class == ProfitPreviewClassAdmitted
			admittedMinD := admittedDefault && !verdict.RejectedUnderMinD
			for _, model := range input.Models {
				if !account.IsModelSupported(model) {
					continue
				}
				verdict.SupportedModels = append(verdict.SupportedModels, model)
				if admittedDefault {
					report.RemainingByModel[model]++
				}
				if admittedMinD {
					report.RemainingByModelMinD[model]++
				}
			}
			sort.Strings(verdict.SupportedModels)
			report.Verdicts = append(report.Verdicts, verdict)
		}
		sort.Slice(report.Verdicts, func(i, j int) bool {
			return report.Verdicts[i].AccountID < report.Verdicts[j].AccountID
		})
		reports = append(reports, report)
	}
	return reports
}

func previewAccountProfitAdmission(account *Account, effectiveGate bool, thresholdDefault, thresholdMinD float64, evalAt time.Time) ProfitPreviewAccountVerdict {
	verdict := ProfitPreviewAccountVerdict{
		AccountID:  account.ID,
		Name:       account.Name,
		Platform:   account.Platform,
		RateSource: ProfitPreviewRateSourceManual,
	}
	if enabled, _ := account.Extra[UpstreamBillingRateSyncEnabledExtraKey].(bool); enabled {
		verdict.RateSource = ProfitPreviewRateSourceUpstreamProbe
		verdict.Warnings = append(verdict.Warnings, profitPreviewProbeWarnings(account, evalAt)...)
	} else if account.RateMultiplier != nil && *account.RateMultiplier == 1 {
		verdict.Warnings = append(verdict.Warnings, ProfitPreviewWarningManualRateOne)
	}

	validRate := account.RateMultiplier != nil &&
		!math.IsNaN(*account.RateMultiplier) &&
		!math.IsInf(*account.RateMultiplier, 0) &&
		*account.RateMultiplier >= 0
	if validRate {
		rate := *account.RateMultiplier
		verdict.AccountRate = &rate
	}
	switch {
	case !effectiveGate:
		verdict.Class = ProfitPreviewClassAdmitted
	case !validRate:
		verdict.Class = ProfitPreviewClassRejectedInvalidRate
	case profitControlOverThreshold(*account.RateMultiplier, thresholdDefault):
		verdict.Class = ProfitPreviewClassRejectedThreshold
	default:
		verdict.Class = ProfitPreviewClassAdmitted
		verdict.RejectedUnderMinD = profitControlOverThreshold(*account.RateMultiplier, thresholdMinD)
	}
	return verdict
}

func profitPreviewProbeWarnings(account *Account, evalAt time.Time) []string {
	snapshot := decodeUpstreamBillingProbeSnapshot(account.Extra)
	if snapshot == nil {
		return []string{ProfitPreviewWarningProbeMissing}
	}
	switch snapshot.Status {
	case UpstreamBillingProbeStatusFailed:
		return []string{ProfitPreviewWarningProbeFailed}
	case UpstreamBillingProbeStatusUnsupported:
		return []string{ProfitPreviewWarningProbeUnsupported}
	case UpstreamBillingProbeStatusOK:
		if snapshot.FreshUntil == nil || !evalAt.Before(*snapshot.FreshUntil) {
			return []string{ProfitPreviewWarningProbeStale}
		}
	}
	return nil
}
