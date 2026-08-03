package wsutil

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func TestIsAllowedOrigin(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name   string
		host   string
		origin string
		policy string
		want   bool
	}{
		{name: "same HTTP origin", host: "example.com", origin: "http://example.com", want: true},
		{name: "same HTTPS origin behind TLS terminator", host: "example.com", origin: "https://example.com", want: true},
		{name: "same non-standard port", host: "example.com:8443", origin: "https://example.com:8443", want: true},
		{name: "different host", host: "example.com", origin: "https://evil.example", want: false},
		{name: "different explicit port", host: "example.com:8443", origin: "https://example.com:9443", want: false},
		{name: "script origin scheme", host: "example.com", origin: "javascript://example.com", want: false},
		{name: "websocket origin scheme", host: "example.com", origin: "ws://example.com", want: false},
		{name: "origin with credentials", host: "example.com", origin: "https://user@example.com", want: false},
		{name: "origin with path", host: "example.com", origin: "https://example.com/path", want: false},
		{name: "missing permissive origin", host: "example.com", policy: OriginPolicyPermissive, want: true},
		{name: "missing strict origin", host: "example.com", policy: OriginPolicyStrict, want: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			req := &http.Request{Host: tt.host, Header: make(http.Header)}
			if tt.origin != "" {
				req.Header.Set("Origin", tt.origin)
			}
			if got := IsAllowedOrigin(req, false, nil, tt.policy); got != tt.want {
				t.Fatalf("IsAllowedOrigin() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestIsAllowedOriginUsesForwardedAuthorityOnlyFromTrustedProxy(t *testing.T) {
	t.Parallel()

	req := &http.Request{
		Host:       "internal:8080",
		RemoteAddr: "127.0.0.1:43210",
		Header:     make(http.Header),
	}
	req.Header.Set("Origin", "https://app.example.com")
	req.Header.Set("X-Forwarded-Host", "app.example.com")
	req.Header.Set("X-Forwarded-Proto", "https")

	if !IsAllowedOrigin(req, true, DefaultTrustedProxies(), OriginPolicyStrict) {
		t.Fatal("trusted proxy authority should be accepted")
	}
	if IsAllowedOrigin(req, false, DefaultTrustedProxies(), OriginPolicyStrict) {
		t.Fatal("forwarded authority must be ignored when proxy trust is disabled")
	}
}

func TestPumpWebSocketClosesWhenAuthenticationExpires(t *testing.T) {
	t.Parallel()

	upgrader := websocket.Upgrader{}
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}
		defer func() { _ = conn.Close() }()

		PumpWebSocket(conn, make(chan []byte), PumpConfig{
			WriteTimeout:  time.Second,
			PongWait:      time.Second,
			PingInterval:  time.Hour,
			MaxReadBytes:  1024,
			AuthExpiresAt: time.Now().Add(50 * time.Millisecond),
		})
	}))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("dial websocket: %v", err)
	}
	defer func() { _ = conn.Close() }()
	_ = conn.SetReadDeadline(time.Now().Add(2 * time.Second))

	_, _, err = conn.ReadMessage()
	closeErr, ok := err.(*websocket.CloseError)
	if !ok {
		t.Fatalf("ReadMessage() error = %T %v, want CloseError", err, err)
	}
	if closeErr.Code != websocket.ClosePolicyViolation {
		t.Fatalf("close code = %d, want %d", closeErr.Code, websocket.ClosePolicyViolation)
	}
}
