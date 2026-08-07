//go:build integration

package repository

import (
	"context"
	"fmt"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"

	dbent "github.com/Wei-Shaw/sub2api/ent"
	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/shared/pagination"
	"github.com/Wei-Shaw/sub2api/internal/shared/timezone"
	"github.com/Wei-Shaw/sub2api/internal/shared/usagestats"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type UsageLogRepoSuite struct {
	suite.Suite
	ctx    context.Context
	tx     *dbent.Tx
	client *dbent.Client
	repo   *usageLogRepository
}

func (s *UsageLogRepoSuite) SetupTest() {
	s.ctx = context.Background()
	tx := testEntTx(s.T())
	s.tx = tx
	s.client = tx.Client()
	s.repo = newUsageLogRepositoryWithSQL(s.client, tx)
}

func TestUsageLogRepoSuite(t *testing.T) {
	suite.Run(t, new(UsageLogRepoSuite))
}

// truncateToDayUTC 截断到 UTC 日期边界（测试辅助函数）
func truncateToDayUTC(t time.Time) time.Time {
	t = t.UTC()
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC)
}

func (s *UsageLogRepoSuite) createUsageLog(user *service.User, apiKey *service.APIKey, account *service.Account, inputTokens, outputTokens int, cost float64, createdAt time.Time) *service.UsageLog {
	log := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    uuid.New().String(), // Generate unique RequestID for each log
		Model:        "claude-3",
		InputTokens:  inputTokens,
		OutputTokens: outputTokens,
		TotalCost:    cost,
		ActualCost:   cost,
		CreatedAt:    createdAt,
	}
	_, err := s.repo.Create(s.ctx, log)
	s.Require().NoError(err)
	return log
}

func (s *UsageLogRepoSuite) TestGetAccountHourlyUsageStatsBatch() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "account-hourly@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-account-hourly", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "account-hourly-primary"})
	otherAccount := mustCreateAccount(s.T(), s.client, &service.Account{Name: "account-hourly-other"})
	now := time.Now().UTC()

	for _, sample := range []struct {
		firstTokenMs int
		imageCount   int
		videoCount   int
		createdAt    time.Time
	}{
		{firstTokenMs: 120, createdAt: now.Add(-30 * time.Minute)},
		{firstTokenMs: 4000, imageCount: 1, createdAt: now.Add(-20 * time.Minute)},
		{firstTokenMs: 5000, videoCount: 1, createdAt: now.Add(-10 * time.Minute)},
		{firstTokenMs: 900, createdAt: now.Add(-2 * time.Hour)},
	} {
		firstTokenMs := sample.firstTokenMs
		_, err := s.repo.Create(s.ctx, &service.UsageLog{
			UserID: user.ID, APIKeyID: apiKey.ID, AccountID: account.ID,
			RequestID: uuid.New().String(), Model: "gpt-test",
			InputTokens: 1, OutputTokens: 1, TotalCost: 0.1, ActualCost: 0.1,
			FirstTokenMs: &firstTokenMs, ImageCount: sample.imageCount,
			VideoCount: sample.videoCount, CreatedAt: sample.createdAt,
		})
		s.Require().NoError(err)
	}

	_, err := s.repo.sql.ExecContext(s.ctx, `
		INSERT INTO ops_error_logs (account_id, error_phase, error_type, status_code, is_count_tokens, created_at)
		VALUES
			($1, 'upstream', 'http_error', 404, FALSE, $3),
			($1, 'upstream', 'http_error', 503, FALSE, $3),
			($2, 'upstream', 'http_error', 429, FALSE, $3),
			($1, 'upstream', 'http_error', 500, FALSE, $4),
			($1, 'upstream', 'http_error', 400, TRUE, $3)
	`, account.ID, otherAccount.ID, now.Add(-15*time.Minute), now.Add(-2*time.Hour))
	s.Require().NoError(err)

	stats, err := s.repo.GetAccountHourlyUsageStatsBatch(
		s.ctx, []int64{account.ID, otherAccount.ID}, now.Add(-time.Hour), now,
	)
	s.Require().NoError(err)

	s.Require().Equal(int64(5), stats[account.ID].TotalRequests)
	s.Require().Equal(int64(3), stats[account.ID].SuccessfulRequests)
	s.Require().InDelta(0.6, stats[account.ID].SuccessRate, 1e-9)
	s.Require().NotNil(stats[account.ID].AvgFirstTokenMs)
	s.Require().InDelta(120, *stats[account.ID].AvgFirstTokenMs, 1e-9)
	s.Require().Equal(int64(1), stats[account.ID].Error4xx)
	s.Require().Equal(int64(1), stats[account.ID].Error5xx)

	s.Require().Equal(int64(1), stats[otherAccount.ID].TotalRequests)
	s.Require().Zero(stats[otherAccount.ID].SuccessfulRequests)
	s.Require().Zero(stats[otherAccount.ID].SuccessRate)
	s.Require().Equal(int64(1), stats[otherAccount.ID].Error4xx)
}

// --- Create / GetByID ---

func (s *UsageLogRepoSuite) TestCreate() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "create@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-create", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-create"})

	log := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.4,
	}

	_, err := s.repo.Create(s.ctx, log)
	s.Require().NoError(err, "Create")
	s.Require().NotZero(log.ID)
}

func TestUsageLogRepositoryCreate_BatchPathConcurrent(t *testing.T) {
	ctx := context.Background()
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)

	user := mustCreateUser(t, client, &service.User{Email: fmt.Sprintf("usage-batch-%d@example.com", time.Now().UnixNano())})
	apiKey := mustCreateApiKey(t, client, &service.APIKey{UserID: user.ID, Key: "sk-usage-batch-" + uuid.NewString(), Name: "k"})
	account := mustCreateAccount(t, client, &service.Account{Name: "acc-usage-batch-" + uuid.NewString()})

	const total = 16
	results := make([]bool, total)
	errs := make([]error, total)
	logs := make([]*service.UsageLog, total)

	var wg sync.WaitGroup
	wg.Add(total)
	for i := 0; i < total; i++ {
		i := i
		logs[i] = &service.UsageLog{
			UserID:       user.ID,
			APIKeyID:     apiKey.ID,
			AccountID:    account.ID,
			RequestID:    uuid.NewString(),
			Model:        "claude-3",
			InputTokens:  10 + i,
			OutputTokens: 20 + i,
			TotalCost:    0.5,
			ActualCost:   0.5,
			CreatedAt:    time.Now().UTC(),
		}
		go func() {
			defer wg.Done()
			results[i], errs[i] = repo.Create(ctx, logs[i])
		}()
	}
	wg.Wait()

	for i := 0; i < total; i++ {
		require.NoError(t, errs[i])
		require.True(t, results[i])
		require.NotZero(t, logs[i].ID)
	}

	var count int
	require.NoError(t, integrationDB.QueryRowContext(ctx, "SELECT COUNT(*) FROM usage_logs WHERE api_key_id = $1", apiKey.ID).Scan(&count))
	require.Equal(t, total, count)
}

func TestUsageLogRepositoryCreate_BatchPathDuplicateRequestID(t *testing.T) {
	ctx := context.Background()
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)

	user := mustCreateUser(t, client, &service.User{Email: fmt.Sprintf("usage-dup-%d@example.com", time.Now().UnixNano())})
	apiKey := mustCreateApiKey(t, client, &service.APIKey{UserID: user.ID, Key: "sk-usage-dup-" + uuid.NewString(), Name: "k"})
	account := mustCreateAccount(t, client, &service.Account{Name: "acc-usage-dup-" + uuid.NewString()})
	requestID := uuid.NewString()

	log1 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    requestID,
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    time.Now().UTC(),
	}
	log2 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    requestID,
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    time.Now().UTC(),
	}

	inserted1, err1 := repo.Create(ctx, log1)
	inserted2, err2 := repo.Create(ctx, log2)
	require.NoError(t, err1)
	require.NoError(t, err2)
	require.True(t, inserted1)
	require.False(t, inserted2)
	require.Equal(t, log1.ID, log2.ID)

	var count int
	require.NoError(t, integrationDB.QueryRowContext(ctx, "SELECT COUNT(*) FROM usage_logs WHERE request_id = $1 AND api_key_id = $2", requestID, apiKey.ID).Scan(&count))
	require.Equal(t, 1, count)
}

func TestUsageLogRepositoryFlushCreateBatch_DeduplicatesSameKeyInMemory(t *testing.T) {
	ctx := context.Background()
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)

	user := mustCreateUser(t, client, &service.User{Email: fmt.Sprintf("usage-batch-memdup-%d@example.com", time.Now().UnixNano())})
	apiKey := mustCreateApiKey(t, client, &service.APIKey{UserID: user.ID, Key: "sk-usage-batch-memdup-" + uuid.NewString(), Name: "k"})
	account := mustCreateAccount(t, client, &service.Account{Name: "acc-usage-batch-memdup-" + uuid.NewString()})
	requestID := uuid.NewString()

	const total = 8
	batch := make([]usageLogCreateRequest, 0, total)
	logs := make([]*service.UsageLog, 0, total)

	for i := 0; i < total; i++ {
		log := &service.UsageLog{
			UserID:       user.ID,
			APIKeyID:     apiKey.ID,
			AccountID:    account.ID,
			RequestID:    requestID,
			Model:        "claude-3",
			InputTokens:  10 + i,
			OutputTokens: 20 + i,
			TotalCost:    0.5,
			ActualCost:   0.5,
			CreatedAt:    time.Now().UTC(),
		}
		logs = append(logs, log)
		batch = append(batch, usageLogCreateRequest{
			log:      log,
			prepared: prepareUsageLogInsert(log),
			resultCh: make(chan usageLogCreateResult, 1),
		})
	}

	repo.flushCreateBatch(integrationDB, batch)

	insertedCount := 0
	var firstID int64
	for idx, req := range batch {
		res := <-req.resultCh
		require.NoError(t, res.err)
		if res.inserted {
			insertedCount++
		}
		require.NotZero(t, logs[idx].ID)
		if idx == 0 {
			firstID = logs[idx].ID
		} else {
			require.Equal(t, firstID, logs[idx].ID)
		}
	}

	require.Equal(t, 1, insertedCount)

	var count int
	require.NoError(t, integrationDB.QueryRowContext(ctx, "SELECT COUNT(*) FROM usage_logs WHERE request_id = $1 AND api_key_id = $2", requestID, apiKey.ID).Scan(&count))
	require.Equal(t, 1, count)
}

func TestUsageLogRepositoryCreateBestEffort_BatchPathDuplicateRequestID(t *testing.T) {
	ctx := context.Background()
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)

	user := mustCreateUser(t, client, &service.User{Email: fmt.Sprintf("usage-best-effort-dup-%d@example.com", time.Now().UnixNano())})
	apiKey := mustCreateApiKey(t, client, &service.APIKey{UserID: user.ID, Key: "sk-usage-best-effort-dup-" + uuid.NewString(), Name: "k"})
	account := mustCreateAccount(t, client, &service.Account{Name: "acc-usage-best-effort-dup-" + uuid.NewString()})
	requestID := uuid.NewString()

	log1 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    requestID,
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    time.Now().UTC(),
	}
	log2 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    requestID,
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    time.Now().UTC(),
	}

	require.NoError(t, repo.CreateBestEffort(ctx, log1))
	require.NoError(t, repo.CreateBestEffort(ctx, log2))

	require.Eventually(t, func() bool {
		var count int
		err := integrationDB.QueryRowContext(ctx, "SELECT COUNT(*) FROM usage_logs WHERE request_id = $1 AND api_key_id = $2", requestID, apiKey.ID).Scan(&count)
		return err == nil && count == 1
	}, 3*time.Second, 20*time.Millisecond)
}

func TestUsageLogRepositoryCreateBestEffort_QueueFullBlocksUntilCtxDeadline(t *testing.T) {
	// 队列满时不再立即丢弃：阻塞等待入队，直到调用方 ctx 到期才标记 dropped（issue #3656）。
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)
	repo.bestEffortBatchCh = make(chan usageLogBestEffortRequest, 1)
	repo.bestEffortBatchCh <- usageLogBestEffortRequest{}

	ctx, cancel := context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer cancel()

	start := time.Now()
	err := repo.CreateBestEffort(ctx, &service.UsageLog{
		UserID:       1,
		APIKeyID:     2,
		AccountID:    3,
		RequestID:    uuid.NewString(),
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    time.Now().UTC(),
	})

	require.Error(t, err)
	require.True(t, service.IsUsageLogCreateDropped(err))
	require.GreaterOrEqual(t, time.Since(start), 150*time.Millisecond)
}

func TestUsageLogRepositoryCreateBestEffort_QueueFullWaitsForDrain(t *testing.T) {
	// 队列满但批处理器随后排空时，阻塞的入队应成功完成而非丢弃。
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)
	repo.bestEffortBatchCh = make(chan usageLogBestEffortRequest, 1)
	repo.bestEffortBatchCh <- usageLogBestEffortRequest{}

	go func() {
		time.Sleep(100 * time.Millisecond)
		<-repo.bestEffortBatchCh // 排空占位请求，为阻塞中的入队腾出空间
		req := <-repo.bestEffortBatchCh
		sendUsageLogBestEffortResult(req.resultCh, nil)
	}()

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := repo.CreateBestEffort(ctx, &service.UsageLog{
		UserID:       1,
		APIKeyID:     2,
		AccountID:    3,
		RequestID:    uuid.NewString(),
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    time.Now().UTC(),
	})

	require.NoError(t, err)
}

func TestUsageLogRepositoryCreate_BatchPathCanceledContextMarksNotPersisted(t *testing.T) {
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)

	user := mustCreateUser(t, client, &service.User{Email: fmt.Sprintf("usage-cancel-%d@example.com", time.Now().UnixNano())})
	apiKey := mustCreateApiKey(t, client, &service.APIKey{UserID: user.ID, Key: "sk-usage-cancel-" + uuid.NewString(), Name: "k"})
	account := mustCreateAccount(t, client, &service.Account{Name: "acc-usage-cancel-" + uuid.NewString()})

	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	inserted, err := repo.Create(ctx, &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    uuid.NewString(),
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    time.Now().UTC(),
	})

	require.False(t, inserted)
	require.Error(t, err)
	require.True(t, service.IsUsageLogCreateNotPersisted(err))
}

func TestUsageLogRepositoryCreate_BatchPathQueueFullMarksNotPersisted(t *testing.T) {
	// 队列满时阻塞等待入队，直到调用方 ctx 到期才标记 not persisted（issue #3656）。
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)
	repo.createBatchCh = make(chan usageLogCreateRequest, 1)
	repo.createBatchCh <- usageLogCreateRequest{}

	user := mustCreateUser(t, client, &service.User{Email: fmt.Sprintf("usage-create-full-%d@example.com", time.Now().UnixNano())})
	apiKey := mustCreateApiKey(t, client, &service.APIKey{UserID: user.ID, Key: "sk-usage-create-full-" + uuid.NewString(), Name: "k"})
	account := mustCreateAccount(t, client, &service.Account{Name: "acc-usage-create-full-" + uuid.NewString()})

	ctx, cancel := context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer cancel()

	start := time.Now()
	inserted, err := repo.Create(ctx, &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    uuid.NewString(),
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    time.Now().UTC(),
	})

	require.False(t, inserted)
	require.Error(t, err)
	require.True(t, service.IsUsageLogCreateNotPersisted(err))
	require.GreaterOrEqual(t, time.Since(start), 150*time.Millisecond)
}

func TestUsageLogRepositoryCreate_BatchPathCanceledAfterQueueMarksNotPersisted(t *testing.T) {
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)
	repo.createBatchCh = make(chan usageLogCreateRequest, 1)

	user := mustCreateUser(t, client, &service.User{Email: fmt.Sprintf("usage-cancel-queued-%d@example.com", time.Now().UnixNano())})
	apiKey := mustCreateApiKey(t, client, &service.APIKey{UserID: user.ID, Key: "sk-usage-cancel-queued-" + uuid.NewString(), Name: "k"})
	account := mustCreateAccount(t, client, &service.Account{Name: "acc-usage-cancel-queued-" + uuid.NewString()})

	ctx, cancel := context.WithCancel(context.Background())
	errCh := make(chan error, 1)

	go func() {
		_, err := repo.createBatched(ctx, &service.UsageLog{
			UserID:       user.ID,
			APIKeyID:     apiKey.ID,
			AccountID:    account.ID,
			RequestID:    uuid.NewString(),
			Model:        "claude-3",
			InputTokens:  10,
			OutputTokens: 20,
			TotalCost:    0.5,
			ActualCost:   0.5,
			CreatedAt:    time.Now().UTC(),
		})
		errCh <- err
	}()

	req := <-repo.createBatchCh
	require.NotNil(t, req.shared)
	cancel()

	err := <-errCh
	require.Error(t, err)
	require.True(t, service.IsUsageLogCreateNotPersisted(err))
	completeUsageLogCreateRequest(req, usageLogCreateResult{inserted: false, err: service.MarkUsageLogCreateNotPersisted(context.Canceled)})
}

func TestUsageLogRepositoryFlushCreateBatch_CanceledRequestReturnsNotPersisted(t *testing.T) {
	client := testEntClient(t)
	repo := newUsageLogRepositoryWithSQL(client, integrationDB)

	user := mustCreateUser(t, client, &service.User{Email: fmt.Sprintf("usage-flush-cancel-%d@example.com", time.Now().UnixNano())})
	apiKey := mustCreateApiKey(t, client, &service.APIKey{UserID: user.ID, Key: "sk-usage-flush-cancel-" + uuid.NewString(), Name: "k"})
	account := mustCreateAccount(t, client, &service.Account{Name: "acc-usage-flush-cancel-" + uuid.NewString()})

	log := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    uuid.NewString(),
		Model:        "claude-3",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    time.Now().UTC(),
	}
	req := usageLogCreateRequest{
		log:      log,
		prepared: prepareUsageLogInsert(log),
		shared:   &usageLogCreateShared{},
		resultCh: make(chan usageLogCreateResult, 1),
	}
	req.shared.state.Store(usageLogCreateStateCanceled)

	repo.flushCreateBatch(integrationDB, []usageLogCreateRequest{req})

	res := <-req.resultCh
	require.False(t, res.inserted)
	require.Error(t, res.err)
	require.True(t, service.IsUsageLogCreateNotPersisted(res.err))
}

func (s *UsageLogRepoSuite) TestGetByID() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "getbyid@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-getbyid", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-getbyid"})

	log := s.createUsageLog(user, apiKey, account, 10, 20, 0.5, time.Now())

	got, err := s.repo.GetByID(s.ctx, log.ID)
	s.Require().NoError(err, "GetByID")
	s.Require().Equal(log.ID, got.ID)
	s.Require().Equal(10, got.InputTokens)
}

func (s *UsageLogRepoSuite) TestGetByID_NotFound() {
	_, err := s.repo.GetByID(s.ctx, 999999)
	s.Require().Error(err, "expected error for non-existent ID")
}

func (s *UsageLogRepoSuite) TestGetByID_ReturnsAccountRateMultiplier() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "getbyid-mult@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-getbyid-mult", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-getbyid-mult"})

	m := 0.5
	log := &service.UsageLog{
		UserID:                user.ID,
		APIKeyID:              apiKey.ID,
		AccountID:             account.ID,
		RequestID:             uuid.New().String(),
		Model:                 "claude-3",
		InputTokens:           10,
		OutputTokens:          20,
		TotalCost:             1.0,
		ActualCost:            2.0,
		AccountRateMultiplier: &m,
		CreatedAt:             timezone.Today().Add(2 * time.Hour),
	}
	_, err := s.repo.Create(s.ctx, log)
	s.Require().NoError(err)

	got, err := s.repo.GetByID(s.ctx, log.ID)
	s.Require().NoError(err)
	s.Require().NotNil(got.AccountRateMultiplier)
	s.Require().InEpsilon(0.5, *got.AccountRateMultiplier, 0.0001)
}

func (s *UsageLogRepoSuite) TestGetByID_ReturnsOpenAIWSMode() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "getbyid-ws@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-getbyid-ws", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-getbyid-ws"})

	log := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    uuid.New().String(),
		Model:        "gpt-5.3-codex",
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    1.0,
		ActualCost:   1.0,
		OpenAIWSMode: true,
		CreatedAt:    timezone.Today().Add(3 * time.Hour),
	}
	_, err := s.repo.Create(s.ctx, log)
	s.Require().NoError(err)

	got, err := s.repo.GetByID(s.ctx, log.ID)
	s.Require().NoError(err)
	s.Require().True(got.OpenAIWSMode)
}

func (s *UsageLogRepoSuite) TestGetByID_ReturnsRequestTypeAndLegacyFallback() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "getbyid-request-type@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-getbyid-request-type", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-getbyid-request-type"})

	log := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		RequestID:    uuid.New().String(),
		Model:        "gpt-5.3-codex",
		RequestType:  service.RequestTypeWSV2,
		Stream:       true,
		OpenAIWSMode: false,
		InputTokens:  10,
		OutputTokens: 20,
		TotalCost:    1.0,
		ActualCost:   1.0,
		CreatedAt:    timezone.Today().Add(4 * time.Hour),
	}
	_, err := s.repo.Create(s.ctx, log)
	s.Require().NoError(err)

	got, err := s.repo.GetByID(s.ctx, log.ID)
	s.Require().NoError(err)
	s.Require().Equal(service.RequestTypeWSV2, got.RequestType)
	s.Require().True(got.Stream)
	s.Require().True(got.OpenAIWSMode)
}

// --- ListWithFilters ---

func (s *UsageLogRepoSuite) TestListWithFilters() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "filters@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-filters", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-filters"})

	s.createUsageLog(user, apiKey, account, 10, 20, 0.5, time.Now())

	filters := usagestats.UsageLogFilters{UserID: user.ID}
	logs, page, err := s.repo.ListWithFilters(s.ctx, pagination.PaginationParams{Page: 1, PageSize: 10}, filters)
	s.Require().NoError(err, "ListWithFilters")
	s.Require().Len(logs, 1)
	s.Require().Equal(int64(1), page.Total)
}

// --- GetAccountTodayStats ---

func (s *UsageLogRepoSuite) TestGetAccountTodayStats() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "acctoday@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-acctoday", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-today"})

	createdAt := timezone.Today().Add(1 * time.Hour)

	m1 := 1.5
	m2 := 0.0
	_, err := s.repo.Create(s.ctx, &service.UsageLog{
		UserID:                user.ID,
		APIKeyID:              apiKey.ID,
		AccountID:             account.ID,
		RequestID:             uuid.New().String(),
		Model:                 "claude-3",
		InputTokens:           10,
		OutputTokens:          20,
		TotalCost:             1.0,
		ActualCost:            2.0,
		AccountRateMultiplier: &m1,
		CreatedAt:             createdAt,
	})
	s.Require().NoError(err)
	_, err = s.repo.Create(s.ctx, &service.UsageLog{
		UserID:                user.ID,
		APIKeyID:              apiKey.ID,
		AccountID:             account.ID,
		RequestID:             uuid.New().String(),
		Model:                 "claude-3",
		InputTokens:           5,
		OutputTokens:          5,
		TotalCost:             0.5,
		ActualCost:            1.0,
		AccountRateMultiplier: &m2,
		CreatedAt:             createdAt,
	})
	s.Require().NoError(err)

	stats, err := s.repo.GetAccountTodayStats(s.ctx, account.ID)
	s.Require().NoError(err, "GetAccountTodayStats")
	s.Require().Equal(int64(2), stats.Requests)
	s.Require().Equal(int64(40), stats.Tokens)
	// account cost = SUM(total_cost * account_rate_multiplier)
	s.Require().InEpsilon(1.5, stats.Cost, 0.0001)
	// standard cost = SUM(total_cost)
	s.Require().InEpsilon(1.5, stats.StandardCost, 0.0001)
	// user cost = SUM(actual_cost)
	s.Require().InEpsilon(3.0, stats.UserCost, 0.0001)
}

func (s *UsageLogRepoSuite) TestDashboardAggregationConsistency() {
	now := time.Now().UTC().Truncate(time.Second)
	// 使用固定的时间偏移确保 hour1 和 hour2 在同一天且都在过去
	// 选择当天 02:00 和 03:00 作为测试时间点（基于 now 的日期）
	dayStart := truncateToDayUTC(now)
	hour1 := dayStart.Add(2 * time.Hour) // 当天 02:00
	hour2 := dayStart.Add(3 * time.Hour) // 当天 03:00
	// 如果当前时间早于 hour2，则使用昨天的时间
	if now.Before(hour2.Add(time.Hour)) {
		dayStart = dayStart.Add(-24 * time.Hour)
		hour1 = dayStart.Add(2 * time.Hour)
		hour2 = dayStart.Add(3 * time.Hour)
	}

	user := mustCreateUser(s.T(), s.client, &service.User{Email: "agg@test.com"})
	apiKey1 := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-agg-1", Name: "k1"})
	apiKey2 := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-agg-2", Name: "k2"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-agg"})

	d1, d2, d3 := 100, 200, 150
	log1 := &service.UsageLog{
		UserID:              user.ID,
		APIKeyID:            apiKey1.ID,
		AccountID:           account.ID,
		Model:               "claude-3",
		InputTokens:         10,
		OutputTokens:        20,
		CacheCreationTokens: 2,
		CacheReadTokens:     1,
		TotalCost:           1.0,
		ActualCost:          0.9,
		DurationMs:          &d1,
		CreatedAt:           hour1.Add(5 * time.Minute),
	}
	_, err := s.repo.Create(s.ctx, log1)
	s.Require().NoError(err)

	log2 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey1.ID,
		AccountID:    account.ID,
		Model:        "claude-3",
		InputTokens:  5,
		OutputTokens: 5,
		TotalCost:    0.5,
		ActualCost:   0.5,
		DurationMs:   &d2,
		CreatedAt:    hour1.Add(20 * time.Minute),
	}
	_, err = s.repo.Create(s.ctx, log2)
	s.Require().NoError(err)

	log3 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey2.ID,
		AccountID:    account.ID,
		Model:        "claude-3",
		InputTokens:  7,
		OutputTokens: 8,
		TotalCost:    0.7,
		ActualCost:   0.7,
		DurationMs:   &d3,
		CreatedAt:    hour2.Add(10 * time.Minute),
	}
	_, err = s.repo.Create(s.ctx, log3)
	s.Require().NoError(err)

	aggRepo := newDashboardAggregationRepositoryWithSQL(s.tx)
	aggStart := hour1.Add(-5 * time.Minute)
	aggEnd := hour2.Add(time.Hour) // 确保覆盖 hour2 的所有数据
	s.Require().NoError(aggRepo.AggregateRange(s.ctx, aggStart, aggEnd))

	type hourlyRow struct {
		totalRequests       int64
		inputTokens         int64
		outputTokens        int64
		cacheCreationTokens int64
		cacheReadTokens     int64
		totalCost           float64
		actualCost          float64
		totalDurationMs     int64
	}
	fetchHourly := func(bucketStart time.Time) hourlyRow {
		var row hourlyRow
		err := scanSingleRow(s.ctx, s.tx, `
			SELECT total_requests, input_tokens, output_tokens, cache_creation_tokens, cache_read_tokens,
			       total_cost, actual_cost, total_duration_ms
			FROM usage_dashboard_hourly
			WHERE bucket_start = $1
		`, []any{bucketStart}, &row.totalRequests, &row.inputTokens, &row.outputTokens,
			&row.cacheCreationTokens, &row.cacheReadTokens, &row.totalCost, &row.actualCost,
			&row.totalDurationMs,
		)
		s.Require().NoError(err)
		return row
	}

	hour1Row := fetchHourly(hour1)
	s.Require().Equal(int64(2), hour1Row.totalRequests)
	s.Require().Equal(int64(15), hour1Row.inputTokens)
	s.Require().Equal(int64(25), hour1Row.outputTokens)
	s.Require().Equal(int64(2), hour1Row.cacheCreationTokens)
	s.Require().Equal(int64(1), hour1Row.cacheReadTokens)
	s.Require().Equal(1.5, hour1Row.totalCost)
	s.Require().Equal(1.4, hour1Row.actualCost)
	s.Require().Equal(int64(300), hour1Row.totalDurationMs)

	hour2Row := fetchHourly(hour2)
	s.Require().Equal(int64(1), hour2Row.totalRequests)
	s.Require().Equal(int64(7), hour2Row.inputTokens)
	s.Require().Equal(int64(8), hour2Row.outputTokens)
	s.Require().Equal(int64(0), hour2Row.cacheCreationTokens)
	s.Require().Equal(int64(0), hour2Row.cacheReadTokens)
	s.Require().Equal(0.7, hour2Row.totalCost)
	s.Require().Equal(0.7, hour2Row.actualCost)
	s.Require().Equal(int64(150), hour2Row.totalDurationMs)

	var daily struct {
		totalRequests       int64
		inputTokens         int64
		outputTokens        int64
		cacheCreationTokens int64
		cacheReadTokens     int64
		totalCost           float64
		actualCost          float64
		totalDurationMs     int64
	}
	err = scanSingleRow(s.ctx, s.tx, `
		SELECT total_requests, input_tokens, output_tokens, cache_creation_tokens, cache_read_tokens,
		       total_cost, actual_cost, total_duration_ms
		FROM usage_dashboard_daily
		WHERE bucket_date = $1::date
	`, []any{dayStart}, &daily.totalRequests, &daily.inputTokens, &daily.outputTokens,
		&daily.cacheCreationTokens, &daily.cacheReadTokens, &daily.totalCost, &daily.actualCost,
		&daily.totalDurationMs,
	)
	s.Require().NoError(err)
	s.Require().Equal(int64(3), daily.totalRequests)
	s.Require().Equal(int64(22), daily.inputTokens)
	s.Require().Equal(int64(33), daily.outputTokens)
	s.Require().Equal(int64(2), daily.cacheCreationTokens)
	s.Require().Equal(int64(1), daily.cacheReadTokens)
	s.Require().Equal(2.2, daily.totalCost)
	s.Require().Equal(2.1, daily.actualCost)
	s.Require().Equal(int64(450), daily.totalDurationMs)
}

// --- GetBatchAPIKeyUsageStats ---

func (s *UsageLogRepoSuite) TestGetBatchApiKeyUsageStats() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "batchkey@test.com"})
	apiKey1 := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-batchkey1", Name: "k1"})
	apiKey2 := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-batchkey2", Name: "k2"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-batchkey"})

	s.createUsageLog(user, apiKey1, account, 10, 20, 0.5, time.Now())
	s.createUsageLog(user, apiKey2, account, 15, 25, 0.6, time.Now())

	stats, err := s.repo.GetBatchAPIKeyUsageStats(s.ctx, []int64{apiKey1.ID, apiKey2.ID}, time.Time{}, time.Time{})
	s.Require().NoError(err, "GetBatchAPIKeyUsageStats")
	s.Require().Len(stats, 2)
}

func (s *UsageLogRepoSuite) TestGetBatchApiKeyUsageStats_Empty() {
	stats, err := s.repo.GetBatchAPIKeyUsageStats(s.ctx, []int64{}, time.Time{}, time.Time{})
	s.Require().NoError(err)
	s.Require().Empty(stats)
}

// --- GetAccountWindowStats ---

func (s *UsageLogRepoSuite) TestGetAccountWindowStats() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "windowstats@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-windowstats", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-windowstats"})

	now := time.Now()
	windowStart := now.Add(-10 * time.Minute)

	s.createUsageLog(user, apiKey, account, 10, 20, 0.5, now.Add(-5*time.Minute))
	s.createUsageLog(user, apiKey, account, 15, 25, 0.6, now.Add(-3*time.Minute))
	s.createUsageLog(user, apiKey, account, 20, 30, 0.7, now.Add(-30*time.Minute)) // outside window

	stats, err := s.repo.GetAccountWindowStats(s.ctx, account.ID, windowStart)
	s.Require().NoError(err, "GetAccountWindowStats")
	s.Require().Equal(int64(2), stats.Requests)
	s.Require().Equal(int64(70), stats.Tokens) // (10+20) + (15+25)
}

// --- GetUsageTrendWithFilters ---

func (s *UsageLogRepoSuite) TestGetUsageTrendWithFilters() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "trendfilters@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-trendfilters", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-trendfilters"})

	base := time.Date(2025, 1, 15, 12, 0, 0, 0, time.UTC)
	s.createUsageLog(user, apiKey, account, 10, 20, 0.5, base)
	s.createUsageLog(user, apiKey, account, 15, 25, 0.6, base.Add(24*time.Hour))

	startTime := base.Add(-1 * time.Hour)
	endTime := base.Add(48 * time.Hour)

	// Test with user filter
	trend, err := s.repo.GetUsageTrendWithFilters(s.ctx, startTime, endTime, "day", user.ID, 0, 0, 0, "", nil, nil)
	s.Require().NoError(err, "GetUsageTrendWithFilters user filter")
	s.Require().Len(trend, 2)

	// Test with apiKey filter
	trend, err = s.repo.GetUsageTrendWithFilters(s.ctx, startTime, endTime, "day", 0, apiKey.ID, 0, 0, "", nil, nil)
	s.Require().NoError(err, "GetUsageTrendWithFilters apiKey filter")
	s.Require().Len(trend, 2)

	// Test with both filters
	trend, err = s.repo.GetUsageTrendWithFilters(s.ctx, startTime, endTime, "day", user.ID, apiKey.ID, 0, 0, "", nil, nil)
	s.Require().NoError(err, "GetUsageTrendWithFilters both filters")
	s.Require().Len(trend, 2)
}

func (s *UsageLogRepoSuite) TestGetUsageTrendWithFilters_HourlyGranularity() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "trendfilters-h@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-trendfilters-h", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-trendfilters-h"})

	base := time.Date(2025, 1, 15, 12, 0, 0, 0, time.UTC)
	s.createUsageLog(user, apiKey, account, 10, 20, 0.5, base)
	s.createUsageLog(user, apiKey, account, 15, 25, 0.6, base.Add(1*time.Hour))

	startTime := base.Add(-1 * time.Hour)
	endTime := base.Add(3 * time.Hour)

	trend, err := s.repo.GetUsageTrendWithFilters(s.ctx, startTime, endTime, "hour", user.ID, 0, 0, 0, "", nil, nil)
	s.Require().NoError(err, "GetUsageTrendWithFilters hourly")
	s.Require().Len(trend, 2)
}

// --- GetModelStatsWithFilters ---

func (s *UsageLogRepoSuite) TestGetModelStatsWithFilters() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "modelfilters@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-modelfilters", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-modelfilters"})

	base := time.Date(2025, 1, 15, 12, 0, 0, 0, time.UTC)

	log1 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		Model:        "claude-3-opus",
		InputTokens:  100,
		OutputTokens: 200,
		TotalCost:    0.5,
		ActualCost:   0.5,
		CreatedAt:    base,
	}
	_, err := s.repo.Create(s.ctx, log1)
	s.Require().NoError(err)

	log2 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		Model:        "claude-3-sonnet",
		InputTokens:  50,
		OutputTokens: 100,
		TotalCost:    0.2,
		ActualCost:   0.2,
		CreatedAt:    base.Add(1 * time.Hour),
	}
	_, err = s.repo.Create(s.ctx, log2)
	s.Require().NoError(err)

	startTime := base.Add(-1 * time.Hour)
	endTime := base.Add(2 * time.Hour)

	// Test with user filter
	stats, err := s.repo.GetModelStatsWithFilters(s.ctx, startTime, endTime, user.ID, 0, 0, 0, nil, nil)
	s.Require().NoError(err, "GetModelStatsWithFilters user filter")
	s.Require().Len(stats, 2)

	// Test with apiKey filter
	stats, err = s.repo.GetModelStatsWithFilters(s.ctx, startTime, endTime, 0, apiKey.ID, 0, 0, nil, nil)
	s.Require().NoError(err, "GetModelStatsWithFilters apiKey filter")
	s.Require().Len(stats, 2)

	// Test with account filter
	stats, err = s.repo.GetModelStatsWithFilters(s.ctx, startTime, endTime, 0, 0, account.ID, 0, nil, nil)
	s.Require().NoError(err, "GetModelStatsWithFilters account filter")
	s.Require().Len(stats, 2)
}

// --- GetAccountUsageStats ---

func (s *UsageLogRepoSuite) TestGetAccountUsageStats() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "accstats@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-accstats", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-accstats"})
	otherAccount := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-accstats-other"})

	base := time.Date(2025, 1, 15, 0, 0, 0, 0, time.UTC)
	firstTokenMs := 120
	otherFirstTokenMs := 900
	imageFirstTokenMs := 5000
	imageSize := "1K"

	// Create logs on different days
	log1 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		Model:        "claude-3-opus",
		InputTokens:  100,
		OutputTokens: 200,
		TotalCost:    0.5,
		ActualCost:   0.4,
		FirstTokenMs: &firstTokenMs,
		CreatedAt:    base.Add(12 * time.Hour),
	}
	_, err := s.repo.Create(s.ctx, log1)
	s.Require().NoError(err)

	log2 := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		Model:        "claude-3-sonnet",
		InputTokens:  50,
		OutputTokens: 100,
		TotalCost:    0.2,
		ActualCost:   0.15,
		CreatedAt:    base.Add(36 * time.Hour), // next day
	}
	_, err = s.repo.Create(s.ctx, log2)
	s.Require().NoError(err)

	imageLog := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    account.ID,
		Model:        "claude-3-opus",
		FirstTokenMs: &imageFirstTokenMs,
		ImageCount:   1,
		ImageSize:    &imageSize,
		CreatedAt:    base.Add(13 * time.Hour),
	}
	_, err = s.repo.Create(s.ctx, imageLog)
	s.Require().NoError(err)

	otherLog := &service.UsageLog{
		UserID:       user.ID,
		APIKeyID:     apiKey.ID,
		AccountID:    otherAccount.ID,
		Model:        "claude-3-opus",
		FirstTokenMs: &otherFirstTokenMs,
		CreatedAt:    base.Add(12 * time.Hour),
	}
	_, err = s.repo.Create(s.ctx, otherLog)
	s.Require().NoError(err)

	startTime := base
	endTime := base.Add(72 * time.Hour)

	resp, err := s.repo.GetAccountUsageStats(s.ctx, account.ID, startTime, endTime)
	s.Require().NoError(err, "GetAccountUsageStats")

	s.Require().Len(resp.History, 2, "expected 2 days of history")
	s.Require().Equal(int64(3), resp.Summary.TotalRequests)
	s.Require().Equal(int64(450), resp.Summary.TotalTokens)
	s.Require().NotNil(resp.Summary.AvgFirstTokenMs)
	s.Require().Equal(float64(firstTokenMs), *resp.Summary.AvgFirstTokenMs)
	s.Require().Len(resp.Models, 2)
}

func (s *UsageLogRepoSuite) TestGetAccountUsageStats_EmptyRange() {
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-emptystats"})

	base := time.Date(2025, 1, 15, 0, 0, 0, 0, time.UTC)
	startTime := base
	endTime := base.Add(72 * time.Hour)

	resp, err := s.repo.GetAccountUsageStats(s.ctx, account.ID, startTime, endTime)
	s.Require().NoError(err, "GetAccountUsageStats empty")

	s.Require().Len(resp.History, 0)
	s.Require().Equal(int64(0), resp.Summary.TotalRequests)
	s.Require().Nil(resp.Summary.AvgFirstTokenMs)
}

// --- ListWithFilters (additional filter tests) ---

func (s *UsageLogRepoSuite) TestListWithFilters_ApiKeyFilter() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "filterskey@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-filterskey", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-filterskey"})

	s.createUsageLog(user, apiKey, account, 10, 20, 0.5, time.Now())

	filters := usagestats.UsageLogFilters{APIKeyID: apiKey.ID}
	logs, page, err := s.repo.ListWithFilters(s.ctx, pagination.PaginationParams{Page: 1, PageSize: 10}, filters)
	s.Require().NoError(err, "ListWithFilters apiKey")
	s.Require().Len(logs, 1)
	s.Require().Equal(int64(1), page.Total)
}

func (s *UsageLogRepoSuite) TestListWithFilters_TimeRange() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "filterstime@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-filterstime", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-filterstime"})

	base := time.Date(2025, 1, 15, 12, 0, 0, 0, time.UTC)
	s.createUsageLog(user, apiKey, account, 10, 20, 0.5, base)
	s.createUsageLog(user, apiKey, account, 15, 25, 0.6, base.Add(1*time.Hour))
	s.createUsageLog(user, apiKey, account, 20, 30, 0.7, base.Add(-24*time.Hour)) // outside range

	startTime := base.Add(-1 * time.Hour)
	endTime := base.Add(2 * time.Hour)
	filters := usagestats.UsageLogFilters{StartTime: &startTime, EndTime: &endTime}
	logs, page, err := s.repo.ListWithFilters(s.ctx, pagination.PaginationParams{Page: 1, PageSize: 10}, filters)
	s.Require().NoError(err, "ListWithFilters time range")
	s.Require().Len(logs, 2)
	s.Require().Equal(int64(2), page.Total)
}

func (s *UsageLogRepoSuite) TestListWithFilters_CombinedFilters() {
	user := mustCreateUser(s.T(), s.client, &service.User{Email: "filterscombined@test.com"})
	apiKey := mustCreateApiKey(s.T(), s.client, &service.APIKey{UserID: user.ID, Key: "sk-filterscombined", Name: "k"})
	account := mustCreateAccount(s.T(), s.client, &service.Account{Name: "acc-filterscombined"})

	base := time.Date(2025, 1, 15, 12, 0, 0, 0, time.UTC)
	s.createUsageLog(user, apiKey, account, 10, 20, 0.5, base)
	s.createUsageLog(user, apiKey, account, 15, 25, 0.6, base.Add(1*time.Hour))

	startTime := base.Add(-1 * time.Hour)
	endTime := base.Add(2 * time.Hour)
	filters := usagestats.UsageLogFilters{
		UserID:    user.ID,
		APIKeyID:  apiKey.ID,
		StartTime: &startTime,
		EndTime:   &endTime,
	}
	logs, page, err := s.repo.ListWithFilters(s.ctx, pagination.PaginationParams{Page: 1, PageSize: 10}, filters)
	s.Require().NoError(err, "ListWithFilters combined")
	s.Require().Len(logs, 2)
	s.Require().Equal(int64(2), page.Total)
}
