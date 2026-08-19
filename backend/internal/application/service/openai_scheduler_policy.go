package service

// The gateway scheduler is intentionally fixed for the high-concurrency pool.
// Keeping these values in code avoids a database read and prevents per-instance
// setting drift from changing cache affinity or failure isolation at runtime.
const (
	openAIFixedSchedulerTopK                    = 8
	openAIFixedDeterministicLoadGap             = 20
	openAIFixedSchedulerStickyWeighted          = false
	openAIFixedSchedulerSubscriptionPriority    = false
	openAIFixedContentSessionBurstBalance       = true
	openAIFixedOAuthSchedulingRateMultiplier    = 0.05
	openAIFixedStickyEscapeTTFTMs               = 8000
	openAIFixedStickyEscapeErrorRate            = 0.35
	openAIFixedPrewarmFailurePersistAfterStreak = 2
)

// These weights favour admission pressure and observed health while retaining
// enough affinity to keep prompt-cache and WS connection reuse effective.
func fixedOpenAISchedulerWeights() GatewayOpenAIWSSchedulerScoreWeightsView {
	return GatewayOpenAIWSSchedulerScoreWeightsView{
		Priority:      0.8,
		Load:          1.4,
		Queue:         1.2,
		ErrorRate:     2.0,
		TTFT:          1.0,
		Reset:         0.3,
		QuotaHeadroom: 0.4,
		UpstreamCost:  1.5,
		Previous:      2.5,
		SessionSticky: 2.0,
	}
}
