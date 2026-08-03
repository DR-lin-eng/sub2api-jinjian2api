// Package wsutil provides shared helpers for raw (non-gin-middleware) WebSocket
// handshake handlers: trusted-proxy-aware Origin checking and simple
// total/per-IP connection limiting. Extracted for the chat feature's user and
// admin WebSocket endpoints, which both need identical behavior.
package wsutil

import (
	"net"
	"net/http"
	"net/netip"
	"net/url"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

const (
	OriginPolicyStrict     = "strict"
	OriginPolicyPermissive = "permissive"
)

// IsAllowedOrigin reports whether r's Origin header is acceptable for a
// WebSocket upgrade. A missing Origin header is allowed unless originPolicy
// is OriginPolicyStrict. Otherwise the Origin host must match the request
// host, optionally resolved through X-Forwarded-Host when the peer is a
// trusted proxy.
func IsAllowedOrigin(r *http.Request, trustProxy bool, trustedProxies []netip.Prefix, originPolicy string) bool {
	if r == nil {
		return false
	}
	origin := strings.TrimSpace(r.Header.Get("Origin"))
	if origin == "" {
		return strings.ToLower(strings.TrimSpace(originPolicy)) != OriginPolicyStrict
	}
	parsed, err := url.Parse(origin)
	if err != nil || parsed.Hostname() == "" {
		return false
	}
	originHost := strings.ToLower(parsed.Hostname())

	reqHost := hostWithoutPort(r.Host)
	if trustProxy {
		if peerIP, ok := requestPeerIP(r); ok && isAddrInTrustedProxies(peerIP, trustedProxies) {
			if xfHost := strings.TrimSpace(r.Header.Get("X-Forwarded-Host")); xfHost != "" {
				if first := strings.TrimSpace(strings.Split(xfHost, ",")[0]); first != "" {
					reqHost = hostWithoutPort(first)
				}
			}
		}
	}
	reqHost = strings.ToLower(reqHost)
	return reqHost != "" && originHost == reqHost
}

// DefaultTrustedProxies returns loopback-only trusted proxy ranges.
func DefaultTrustedProxies() []netip.Prefix {
	prefixes, _ := ParseTrustedProxyList("127.0.0.0/8,::1/128")
	return prefixes
}

// ParseTrustedProxyList parses a comma-separated list of IPs/CIDRs, returning
// the valid prefixes and the raw tokens that failed to parse.
func ParseTrustedProxyList(raw string) (prefixes []netip.Prefix, invalid []string) {
	for _, token := range strings.Split(raw, ",") {
		item := strings.TrimSpace(token)
		if item == "" {
			continue
		}

		var (
			p   netip.Prefix
			err error
		)
		if strings.Contains(item, "/") {
			p, err = netip.ParsePrefix(item)
		} else {
			var addr netip.Addr
			addr, err = netip.ParseAddr(item)
			if err == nil {
				addr = addr.Unmap()
				bits := 128
				if addr.Is4() {
					bits = 32
				}
				p = netip.PrefixFrom(addr, bits)
			}
		}

		if err != nil || !p.IsValid() {
			invalid = append(invalid, item)
			continue
		}
		prefixes = append(prefixes, p.Masked())
	}
	return prefixes, invalid
}

func requestPeerIP(r *http.Request) (netip.Addr, bool) {
	if r == nil {
		return netip.Addr{}, false
	}
	host, _, err := net.SplitHostPort(strings.TrimSpace(r.RemoteAddr))
	if err != nil {
		host = strings.TrimSpace(r.RemoteAddr)
	}
	host = strings.TrimPrefix(host, "[")
	host = strings.TrimSuffix(host, "]")
	if host == "" {
		return netip.Addr{}, false
	}
	addr, err := netip.ParseAddr(host)
	if err != nil {
		return netip.Addr{}, false
	}
	return addr.Unmap(), true
}

func isAddrInTrustedProxies(addr netip.Addr, trusted []netip.Prefix) bool {
	if !addr.IsValid() {
		return false
	}
	for _, p := range trusted {
		if p.Contains(addr) {
			return true
		}
	}
	return false
}

func hostWithoutPort(hostport string) string {
	hostport = strings.TrimSpace(hostport)
	if hostport == "" {
		return ""
	}
	if host, _, err := net.SplitHostPort(hostport); err == nil {
		return host
	}
	if strings.HasPrefix(hostport, "[") && strings.HasSuffix(hostport, "]") {
		return strings.Trim(hostport, "[]")
	}
	return strings.Split(hostport, ":")[0]
}

// ConnLimiter bounds the number of concurrent connections, both globally and
// per client IP. A zero-value limit disables that particular check.
type ConnLimiter struct {
	total    atomic.Int32
	maxTotal int32

	mu       sync.Mutex
	byIP     map[string]int32
	maxPerIP int32
}

// NewConnLimiter creates a limiter with the given global and per-IP caps.
// A cap <= 0 disables that check.
func NewConnLimiter(maxTotal, maxPerIP int32) *ConnLimiter {
	return &ConnLimiter{
		maxTotal: maxTotal,
		maxPerIP: maxPerIP,
		byIP:     make(map[string]int32),
	}
}

// TryAcquire reserves a connection slot for clientIP. On success it returns a
// release function that must be called exactly once when the connection ends.
func (l *ConnLimiter) TryAcquire(clientIP string) (release func(), ok bool) {
	if l == nil {
		return func() {}, true
	}

	if !l.tryAcquireTotal() {
		return nil, false
	}
	if !l.tryAcquirePerIP(clientIP) {
		l.total.Add(-1)
		return nil, false
	}

	var released sync.Once
	return func() {
		released.Do(func() {
			l.total.Add(-1)
			l.releasePerIP(clientIP)
		})
	}, true
}

func (l *ConnLimiter) tryAcquireTotal() bool {
	if l.maxTotal <= 0 {
		l.total.Add(1)
		return true
	}
	for {
		current := l.total.Load()
		if current >= l.maxTotal {
			return false
		}
		if l.total.CompareAndSwap(current, current+1) {
			return true
		}
	}
}

func (l *ConnLimiter) tryAcquirePerIP(clientIP string) bool {
	clientIP = strings.TrimSpace(clientIP)
	if clientIP == "" || l.maxPerIP <= 0 {
		return true
	}
	l.mu.Lock()
	defer l.mu.Unlock()
	current := l.byIP[clientIP]
	if current >= l.maxPerIP {
		return false
	}
	l.byIP[clientIP] = current + 1
	return true
}

func (l *ConnLimiter) releasePerIP(clientIP string) {
	clientIP = strings.TrimSpace(clientIP)
	if clientIP == "" {
		return
	}
	l.mu.Lock()
	defer l.mu.Unlock()
	current, ok := l.byIP[clientIP]
	if !ok {
		return
	}
	if current <= 1 {
		delete(l.byIP, clientIP)
		return
	}
	l.byIP[clientIP] = current - 1
}

// PumpConfig controls timing for PumpWebSocket.
type PumpConfig struct {
	WriteTimeout time.Duration
	PongWait     time.Duration
	PingInterval time.Duration
	MaxReadBytes int64
}

// PumpWebSocket runs a connection's read and write pumps until either side
// closes. The read pump only processes control frames (ping/pong/close) —
// callers that don't expect application messages from the client can rely on
// this to detect disconnects and keep the read deadline alive via pongs.
// send is drained and written out as text frames; PingInterval keepalive
// pings are interleaved. Blocks until the connection is done.
func PumpWebSocket(conn *websocket.Conn, send <-chan []byte, cfg PumpConfig) {
	if conn == nil {
		return
	}

	done := make(chan struct{})
	var closeOnce sync.Once
	closeDone := func() {
		closeOnce.Do(func() { close(done) })
	}

	conn.SetReadLimit(cfg.MaxReadBytes)
	_ = conn.SetReadDeadline(time.Now().Add(cfg.PongWait))
	conn.SetPongHandler(func(string) error {
		return conn.SetReadDeadline(time.Now().Add(cfg.PongWait))
	})
	conn.SetCloseHandler(func(code int, text string) error {
		closeDone()
		return nil
	})

	go func() {
		defer closeDone()
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				return
			}
		}
	}()

	pingTicker := time.NewTicker(cfg.PingInterval)
	defer pingTicker.Stop()

	writeWithTimeout := func(messageType int, data []byte) error {
		if err := conn.SetWriteDeadline(time.Now().Add(cfg.WriteTimeout)); err != nil {
			return err
		}
		return conn.WriteMessage(messageType, data)
	}

	for {
		select {
		case msg, ok := <-send:
			if !ok {
				return
			}
			if err := writeWithTimeout(websocket.TextMessage, msg); err != nil {
				return
			}
		case <-pingTicker.C:
			if err := writeWithTimeout(websocket.PingMessage, nil); err != nil {
				return
			}
		case <-done:
			_ = writeWithTimeout(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			return
		}
	}
}
