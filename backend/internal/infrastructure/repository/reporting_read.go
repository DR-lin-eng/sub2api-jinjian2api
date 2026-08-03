package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/lib/pq"
)

const disableParallelReportingSQL = "SET LOCAL max_parallel_workers_per_gather = 0"

// withReportingRead preserves PostgreSQL's parallel fast path, but retries the
// report without parallel workers when Docker's small /dev/shm is exhausted.
func withReportingRead(ctx context.Context, q sqlExecutor, read func(sqlQueryer) error) error {
	if q == nil {
		return fmt.Errorf("nil reporting query executor")
	}
	if read == nil {
		return fmt.Errorf("nil reporting read")
	}

	if db, ok := q.(*sql.DB); ok {
		if err := read(db); !isReportingSharedMemoryExhausted(err) {
			return err
		}
		return withSerialReportingRead(ctx, db, read)
	}

	// A transaction-bound executor cannot be reused after PostgreSQL aborts its
	// transaction, so prevent the parallel plan before the first read.
	return withSerialReportingRead(ctx, q, read)
}

func isReportingSharedMemoryExhausted(err error) bool {
	if err == nil {
		return false
	}
	var pqErr *pq.Error
	if errors.As(err, &pqErr) {
		return pqErr.Code == "53100" && strings.Contains(strings.ToLower(pqErr.Message), "shared memory segment")
	}
	message := strings.ToLower(err.Error())
	return strings.Contains(message, "could not resize shared memory segment") && strings.Contains(message, "no space left on device")
}

// withSerialReportingRead keeps large reporting aggregates off PostgreSQL's
// dynamic shared memory while leaving parallel query enabled for other work.
func withSerialReportingRead(ctx context.Context, q sqlExecutor, read func(sqlQueryer) error) error {
	if q == nil {
		return fmt.Errorf("nil reporting query executor")
	}
	if read == nil {
		return fmt.Errorf("nil reporting read")
	}

	if db, ok := q.(*sql.DB); ok {
		tx, err := db.BeginTx(ctx, &sql.TxOptions{ReadOnly: true})
		if err != nil {
			return fmt.Errorf("begin reporting read: %w", err)
		}
		defer func() { _ = tx.Rollback() }()

		if _, err := tx.ExecContext(ctx, disableParallelReportingSQL); err != nil {
			return fmt.Errorf("disable reporting query parallelism: %w", err)
		}
		if err := read(tx); err != nil {
			return err
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit reporting read: %w", err)
		}
		return nil
	}

	// Non-DB executors in this package are transaction-bound Ent clients.
	if _, err := q.ExecContext(ctx, disableParallelReportingSQL); err != nil {
		return fmt.Errorf("disable reporting query parallelism: %w", err)
	}
	return read(q)
}
