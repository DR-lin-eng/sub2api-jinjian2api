package xai

import (
	"encoding/base64"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestSubscriptionTierFromJWTMapsNumericClaim(t *testing.T) {
	payload := base64.RawURLEncoding.EncodeToString([]byte(`{"tier":0}`))
	require.Equal(t, "free", SubscriptionTierFromJWT("header."+payload+".signature"))
}

func TestSubscriptionTierFromJWTNormalizesStringClaim(t *testing.T) {
	payload := base64.RawURLEncoding.EncodeToString([]byte(`{"tier":"supergrok-heavy"}`))
	require.Equal(t, "supergrok_heavy", SubscriptionTierFromJWT("header."+payload+".signature"))
}
