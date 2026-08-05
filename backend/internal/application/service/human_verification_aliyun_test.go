//go:build unit

package service

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/require"
)

type aliyunCaptchaVerifierSpy struct {
	calls       int
	credentials AliyunCaptchaCredentials
	param       string
	result      *AliyunCaptchaVerifyResult
	err         error
}

func (s *aliyunCaptchaVerifierSpy) VerifyCaptcha(_ context.Context, credentials AliyunCaptchaCredentials, param string) (*AliyunCaptchaVerifyResult, error) {
	s.calls++
	s.credentials = credentials
	s.param = param
	if s.err != nil {
		return nil, s.err
	}
	if s.result != nil {
		return s.result, nil
	}
	return &AliyunCaptchaVerifyResult{VerifyResult: true}, nil
}

func aliyunHumanVerificationSettings() map[string]string {
	return map[string]string{
		SettingKeyAliyunCaptchaEnabled:         "true",
		SettingKeyAliyunCaptchaAccessKeyID:     " ak-id ",
		SettingKeyAliyunCaptchaAccessKeySecret: " ak-secret ",
		SettingKeyAliyunCaptchaSceneID:         " scene-1 ",
		SettingKeyAliyunCaptchaPrefix:          " prefix-1 ",
		SettingKeyAliyunCaptchaRegion:          AliyunCaptchaRegionSGP,
	}
}

func TestAliyunCaptchaVerificationUsesSingleSnapshotAndNormalizedCredentials(t *testing.T) {
	repo := &humanVerificationSettingRepoSpy{values: aliyunHumanVerificationSettings()}
	settings := NewSettingService(repo, nil)
	verifier := &aliyunCaptchaVerifierSpy{}
	humanVerification := NewHumanVerificationServiceWithAliyun(settings, nil, nil, nil, nil, verifier)

	err := humanVerification.VerifyProof(context.Background(), HumanVerificationProof{Token: " captcha-param "}, "", false)

	require.NoError(t, err)
	require.Equal(t, 1, repo.calls)
	require.Equal(t, 1, verifier.calls)
	require.Equal(t, AliyunCaptchaCredentials{
		AccessKeyID:     "ak-id",
		AccessKeySecret: "ak-secret",
		SceneID:         "scene-1",
		Endpoint:        aliyunCaptchaEndpointSGP,
	}, verifier.credentials)
	require.Equal(t, "captcha-param", verifier.param)
}

func TestAliyunCaptchaVerificationRejectsEmptyProofBeforeVerifier(t *testing.T) {
	repo := &humanVerificationSettingRepoSpy{values: aliyunHumanVerificationSettings()}
	verifier := &aliyunCaptchaVerifierSpy{}
	humanVerification := NewHumanVerificationServiceWithAliyun(NewSettingService(repo, nil), nil, nil, nil, nil, verifier)

	err := humanVerification.VerifyProof(context.Background(), HumanVerificationProof{}, "", false)

	require.ErrorIs(t, err, ErrAliyunCaptchaVerificationFailed)
	require.Zero(t, verifier.calls)
}

func TestAliyunCaptchaVerificationFailsClosedOnVerifierError(t *testing.T) {
	repo := &humanVerificationSettingRepoSpy{values: aliyunHumanVerificationSettings()}
	verifier := &aliyunCaptchaVerifierSpy{err: errors.New("upstream unavailable")}
	humanVerification := NewHumanVerificationServiceWithAliyun(NewSettingService(repo, nil), nil, nil, nil, nil, verifier)

	err := humanVerification.VerifyProof(context.Background(), HumanVerificationProof{Token: "param"}, "", false)

	require.ErrorIs(t, err, ErrAliyunCaptchaVerificationFailed)
}

func TestAliyunCaptchaActionGateOnlyRunsForAliyunProvider(t *testing.T) {
	verifier := &aliyunCaptchaVerifierSpy{}
	settings := NewSettingService(&humanVerificationSettingRepoSpy{values: aliyunHumanVerificationSettings()}, nil)
	humanVerification := NewHumanVerificationServiceWithAliyun(settings, nil, nil, nil, nil, verifier)

	require.NoError(t, humanVerification.VerifyActionCaptchaIfEnabled(context.Background(), HumanVerificationProof{Token: "param"}, ""))
	require.Equal(t, 1, verifier.calls)

	settings = NewSettingService(&humanVerificationSettingRepoSpy{values: map[string]string{}}, nil)
	humanVerification = NewHumanVerificationServiceWithAliyun(settings, nil, nil, nil, nil, verifier)
	require.NoError(t, humanVerification.VerifyActionCaptchaIfEnabled(context.Background(), HumanVerificationProof{}, ""))
	require.Equal(t, 1, verifier.calls)
}

func TestValidateAliyunCaptchaPrefix(t *testing.T) {
	tests := []struct {
		name    string
		prefix  string
		wantErr bool
	}{
		{name: "numeric prefix", prefix: "14abc123"},
		{name: "hyphenated prefix", prefix: "captcha-prod-1"},
		{name: "trimmed prefix", prefix: "  captcha-prod  "},
		{name: "empty", prefix: "", wantErr: true},
		{name: "leading hyphen", prefix: "-captcha", wantErr: true},
		{name: "trailing hyphen", prefix: "captcha-", wantErr: true},
		{name: "directive separator", prefix: "captcha; script-src *", wantErr: true},
		{name: "dot", prefix: "captcha.example", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateAliyunCaptchaPrefix(tt.prefix)
			if tt.wantErr {
				require.Error(t, err)
				return
			}
			require.NoError(t, err)
		})
	}
}
