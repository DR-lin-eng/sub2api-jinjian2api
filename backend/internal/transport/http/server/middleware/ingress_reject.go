package middleware

import "github.com/gin-gonic/gin"

// IngressRejectReason keeps a small request-local classification for access
// logging and Ops error suppression. Durable rejection aggregation and abuse
// blocking were removed from the standalone branch.
type IngressRejectReason string

const (
	IngressRejectQueryAPIKeyDeprecated IngressRejectReason = "query_api_key_deprecated"
	IngressRejectAPIKeyRequired        IngressRejectReason = "api_key_required"
	IngressRejectInvalidAPIKey         IngressRejectReason = "invalid_api_key"
	IngressRejectAPIKeyDisabled        IngressRejectReason = "api_key_disabled"
	IngressRejectIPRestricted          IngressRejectReason = "ip_restricted"
	IngressRejectUserInactive          IngressRejectReason = "user_inactive"
	IngressRejectGroupDeleted          IngressRejectReason = "group_deleted"
	IngressRejectGroupDisabled         IngressRejectReason = "group_disabled"
	IngressRejectGroupUnassigned       IngressRejectReason = "group_unassigned"
	IngressRejectAPIKeyAuthOverloaded  IngressRejectReason = "api_key_auth_overloaded"
)

const ingressRejectReasonContextKey = "ingress_reject_reason"

func MarkIngressRejected(c *gin.Context, reason IngressRejectReason) {
	if c != nil && reason != "" {
		c.Set(ingressRejectReasonContextKey, reason)
	}
}

func GetIngressRejectReason(c *gin.Context) (IngressRejectReason, bool) {
	if c == nil {
		return "", false
	}
	value, exists := c.Get(ingressRejectReasonContextKey)
	if !exists {
		return "", false
	}
	reason, ok := value.(IngressRejectReason)
	return reason, ok && reason != ""
}
