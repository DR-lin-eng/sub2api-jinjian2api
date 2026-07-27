package service

import "time"

const (
	grokPaymentRequiredCooldown = 30 * time.Minute
	grokPaymentRequiredReason   = "grok payment required"
)
