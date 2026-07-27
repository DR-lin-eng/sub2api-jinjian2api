package service

import (
	"strings"

	"github.com/gin-gonic/gin"
)

// poolModeSkippedFailoverError turns a skipped custom error policy into the
// standard pool retry/failover contract. A nil account or a status that is not
// eligible for failover leaves the existing passthrough behavior unchanged.
func (s *GeminiMessagesCompatService) poolModeSkippedFailoverError(
	c *gin.Context,
	account *Account,
	statusCode int,
	respBody []byte,
	upstreamRequestID string,
) *UpstreamFailoverError {
	if account == nil || !account.IsPoolMode() || !s.shouldFailoverGeminiUpstreamError(statusCode) {
		return nil
	}

	upstreamMsg := sanitizeUpstreamErrorMessage(strings.TrimSpace(extractUpstreamErrorMessage(respBody)))
	upstreamDetail := ""
	if s != nil && s.cfg != nil && s.cfg.Gateway.LogUpstreamErrorBody {
		maxBytes := s.cfg.Gateway.LogUpstreamErrorBodyMaxBytes
		if maxBytes <= 0 {
			maxBytes = 2048
		}
		upstreamDetail = truncateString(string(respBody), maxBytes)
	}
	if c != nil {
		appendOpsUpstreamError(c, OpsUpstreamErrorEvent{
			Platform:           account.Platform,
			AccountID:          account.ID,
			AccountName:        account.Name,
			UpstreamStatusCode: statusCode,
			UpstreamRequestID:  upstreamRequestID,
			Kind:               "failover",
			Message:            upstreamMsg,
			Detail:             upstreamDetail,
		})
	}
	return &UpstreamFailoverError{
		StatusCode:             statusCode,
		ResponseBody:           respBody,
		RetryableOnSameAccount: account.IsPoolModeRetryableStatus(statusCode),
	}
}
