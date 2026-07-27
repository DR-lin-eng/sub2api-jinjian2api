package service

import "testing"

func TestIsProxiedClaudeCodeRequestRequiresValidMetadata(t *testing.T) {
	body := []byte(`{"model":"claude-sonnet-4-5","system":[{"type":"text","text":"x-anthropic-billing-header: cc_version=2.1.220; cc_entrypoint=cli;"}]}`)
	validMetadata := `{"device_id":"0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef","account_uuid":"","session_id":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}`

	tests := []struct {
		name       string
		body       []byte
		metadataID string
		want       bool
	}{
		{name: "valid proxied request", body: body, metadataID: validMetadata, want: true},
		{name: "arbitrary metadata cannot change rewriting", body: body, metadataID: "spoofed", want: false},
		{name: "missing billing block", body: []byte(`{"system":[{"type":"text","text":"ordinary prompt"}]}`), metadataID: validMetadata, want: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := isProxiedClaudeCodeRequest(tt.body, tt.metadataID); got != tt.want {
				t.Fatalf("isProxiedClaudeCodeRequest() = %v, want %v", got, tt.want)
			}
		})
	}
}
