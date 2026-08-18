package service

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// openAICodexTurnStateHeader is the opaque state minted by the Codex upstream
// and replayed by the client on the next turn.
const openAICodexTurnStateHeader = "x-codex-turn-state"

type openAICodexTurnStateOrigin struct {
	accountID int64
	expiresAt time.Time
}

func openAICodexTurnStateSeed(c *gin.Context) string {
	if c == nil || c.Request == nil {
		return ""
	}
	var sessionID string
	for _, name := range []string{"session-id", "session_id"} {
		if value := strings.TrimSpace(c.Request.Header.Get(name)); value != "" {
			sessionID = value
			break
		}
	}
	if sessionID == "" {
		return ""
	}
	return strconv.FormatInt(getAPIKeyIDFromContext(c), 10) + "\x00" + sessionID
}

func extractOpenAICodexTurnState(headers http.Header) string {
	if headers == nil {
		return ""
	}
	for key, values := range headers {
		if !strings.EqualFold(strings.TrimSpace(key), openAICodexTurnStateHeader) {
			continue
		}
		for _, value := range values {
			if trimmed := strings.TrimSpace(value); trimmed != "" {
				return trimmed
			}
		}
	}
	return ""
}

func deleteOpenAICodexTurnState(headers http.Header) {
	if headers == nil {
		return
	}
	for key := range headers {
		if strings.EqualFold(strings.TrimSpace(key), openAICodexTurnStateHeader) {
			delete(headers, key)
		}
	}
}

// relayOpenAICodexTurnState writes state before the response is committed and
// records the account that minted it. Missing state clears a stale failover
// value from the current response attempt.
func (s *OpenAIGatewayService) relayOpenAICodexTurnState(c *gin.Context, account *Account, upstream http.Header) {
	if s == nil || c == nil || c.Writer == nil {
		return
	}
	state := extractOpenAICodexTurnState(upstream)
	canonical := http.CanonicalHeaderKey(openAICodexTurnStateHeader)
	if state == "" {
		deleteOpenAICodexTurnState(c.Writer.Header())
		return
	}
	c.Writer.Header().Set(canonical, state)
	s.noteOpenAICodexTurnStateProvenance(c, account)
}

func stageOpenAICodexTurnState(dst *http.Header, upstream http.Header) {
	if dst == nil {
		return
	}
	state := extractOpenAICodexTurnState(upstream)
	canonical := http.CanonicalHeaderKey(openAICodexTurnStateHeader)
	if state == "" {
		if *dst != nil {
			deleteOpenAICodexTurnState(*dst)
		}
		return
	}
	if *dst == nil {
		*dst = make(http.Header)
	}
	(*dst).Set(canonical, state)
}

func (s *OpenAIGatewayService) noteStagedOpenAICodexTurnStateCommitted(c *gin.Context, account *Account, staged http.Header) {
	if extractOpenAICodexTurnState(staged) != "" {
		s.noteOpenAICodexTurnStateProvenance(c, account)
	}
}

func (s *OpenAIGatewayService) noteOpenAICodexTurnStateProvenance(c *gin.Context, account *Account) {
	if s == nil || account == nil || account.ID <= 0 {
		return
	}
	seed := openAICodexTurnStateSeed(c)
	if seed == "" {
		return
	}
	ttl := s.openAIWSSessionStickyTTL()
	if ttl <= 0 {
		ttl = time.Hour
	}
	s.openaiCodexTurnStateOrigins.Store(seed, openAICodexTurnStateOrigin{
		accountID: account.ID,
		expiresAt: time.Now().Add(ttl),
	})
	s.sweepOpenAICodexTurnStateOrigins()
}

// guardOpenAICodexTurnStateEcho strips only a value known to have been minted
// by another account. Unknown values remain untouched for compatibility with
// sessions that began outside this gateway.
func (s *OpenAIGatewayService) guardOpenAICodexTurnStateEcho(c *gin.Context, account *Account, headers http.Header) {
	if s == nil || account == nil || headers == nil || extractOpenAICodexTurnState(headers) == "" {
		return
	}
	seed := openAICodexTurnStateSeed(c)
	if seed == "" {
		return
	}
	value, ok := s.openaiCodexTurnStateOrigins.Load(seed)
	if !ok {
		return
	}
	origin, ok := value.(openAICodexTurnStateOrigin)
	if !ok {
		s.openaiCodexTurnStateOrigins.Delete(seed)
		return
	}
	if !origin.expiresAt.IsZero() && time.Now().After(origin.expiresAt) {
		s.openaiCodexTurnStateOrigins.Delete(seed)
		return
	}
	if origin.accountID != account.ID {
		deleteOpenAICodexTurnState(headers)
	}
}

func (s *OpenAIGatewayService) sweepOpenAICodexTurnStateOrigins() {
	if s == nil || s.openaiCodexTurnStateWrites.Add(1)%256 != 0 {
		return
	}
	now := time.Now()
	s.openaiCodexTurnStateOrigins.Range(func(key, value any) bool {
		origin, ok := value.(openAICodexTurnStateOrigin)
		if !ok || (!origin.expiresAt.IsZero() && now.After(origin.expiresAt)) {
			s.openaiCodexTurnStateOrigins.Delete(key)
		}
		return true
	})
}
