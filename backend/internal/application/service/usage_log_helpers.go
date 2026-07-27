package service

import "strings"

func optionalTrimmedStringPtr(raw string) *string {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}

// optionalUsageUpstreamModel keeps the column sparse for ordinary requests
// while preserving every mapping shape that cannot be reconstructed from model
// alone. In particular, channel mappings can leave upstreamModel == model while
// requestedModel differs, and looped channel/account mappings can make the final
// upstream equal the original request.
func optionalUsageUpstreamModel(upstreamModel, model, requestedModel string) *string {
	upstreamModel = strings.TrimSpace(upstreamModel)
	if upstreamModel == "" {
		return nil
	}
	model = strings.TrimSpace(model)
	requestedModel = strings.TrimSpace(requestedModel)
	if upstreamModel == model && requestedModel == model {
		return nil
	}
	return optionalTrimmedStringPtr(upstreamModel)
}

func forwardResultBillingModel(requestedModel, upstreamModel string) string {
	if trimmed := strings.TrimSpace(requestedModel); trimmed != "" {
		return trimmed
	}
	return strings.TrimSpace(upstreamModel)
}

func optionalInt64Ptr(v int64) *int64 {
	if v == 0 {
		return nil
	}
	return &v
}
