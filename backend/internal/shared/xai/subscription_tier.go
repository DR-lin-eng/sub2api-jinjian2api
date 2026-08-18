package xai

import (
	"encoding/json"
	"strconv"
	"strings"
)

// MapJWTSubscriptionTier maps the numeric tier claim used by xAI access-token
// JWTs to the stable labels stored on an account.
func MapJWTSubscriptionTier(tier uint64) string {
	switch tier {
	case 0:
		return "free"
	case 1:
		return "supergrok"
	case 2:
		return "x_basic"
	case 3:
		return "x_premium"
	case 4:
		return "x_premium_plus"
	case 5:
		return "supergrok_heavy"
	case 6:
		return "supergrok_lite"
	case 7:
		return "supergrok_plus"
	default:
		return strconv.FormatUint(tier, 10)
	}
}

// NormalizeSubscriptionTier keeps legacy labels and JWT-derived labels on a
// single representation without making OAuth refresh depend on UI strings.
func NormalizeSubscriptionTier(raw string) string {
	tier := strings.ToLower(strings.TrimSpace(raw))
	tier = strings.ReplaceAll(tier, "-", "_")
	tier = strings.Join(strings.Fields(tier), "_")
	switch tier {
	case "free", "grok_free", "grokfree", "free_tier", "freetier", "grok_basic", "grokbasic":
		return "free"
	case "supergrok", "grokpro":
		return "supergrok"
	case "supergrok_lite", "supergroklite":
		return "supergrok_lite"
	case "supergrok_heavy", "supergrokheavy":
		return "supergrok_heavy"
	case "supergrok_pro", "supergrokpro":
		return "supergrok_pro"
	case "supergrok_plus", "supergrokplus":
		return "supergrok_plus"
	case "x_basic", "xbasic", "basic":
		return "x_basic"
	case "x_premium", "xpremium":
		return "x_premium"
	case "x_premium_plus", "xpremiumplus", "x_premium+":
		return "x_premium_plus"
	default:
		return tier
	}
}

// SubscriptionTierFromJWT decodes the unsigned access-token payload and maps
// its tier claim. The token signature is verified by the OAuth provider; this
// helper only extracts metadata after a successful token response.
func SubscriptionTierFromJWT(token string) string {
	claims := DecodeJWTClaims(token)
	if claims == nil {
		return ""
	}
	raw, ok := claims["tier"]
	if !ok || raw == nil {
		return ""
	}
	switch value := raw.(type) {
	case float64:
		if value < 0 {
			return ""
		}
		return MapJWTSubscriptionTier(uint64(value))
	case json.Number:
		number, err := value.Int64()
		if err != nil || number < 0 {
			return NormalizeSubscriptionTier(value.String())
		}
		return MapJWTSubscriptionTier(uint64(number))
	case string:
		trimmed := strings.TrimSpace(value)
		if trimmed == "" {
			return ""
		}
		if number, err := strconv.ParseUint(trimmed, 10, 64); err == nil {
			return MapJWTSubscriptionTier(number)
		}
		return NormalizeSubscriptionTier(trimmed)
	default:
		return ""
	}
}
