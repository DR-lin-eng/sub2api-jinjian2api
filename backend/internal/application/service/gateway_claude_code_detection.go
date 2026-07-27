package service

import (
	"strings"

	"github.com/tidwall/gjson"
)

// isProxiedClaudeCodeRequest identifies requests whose transport headers were
// replaced by a proxy while the validated Claude Code body metadata remains.
// This is only a request-rewrite hint; it must never be used for authentication.
func isProxiedClaudeCodeRequest(body []byte, metadataUserID string) bool {
	return ParseMetadataUserID(metadataUserID) != nil && systemHasBillingAttributionBlock(body)
}

func systemHasBillingAttributionBlock(body []byte) bool {
	system := gjson.GetBytes(body, "system")
	if !system.IsArray() {
		return false
	}
	found := false
	system.ForEach(func(_, item gjson.Result) bool {
		text := item.Get("text").String()
		if strings.HasPrefix(text, claudeCodeBillingHeaderPrefix) &&
			strings.Contains(text, claudeCodeEntrypointMarker) {
			found = true
			return false
		}
		return true
	})
	return found
}
