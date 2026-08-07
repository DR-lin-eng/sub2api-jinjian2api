package service

import "strings"

const defaultSiteName = "Sub2API"

func sanitizeEmailHeader(value string) string {
	return strings.NewReplacer("\r", "", "\n", "").Replace(value)
}
