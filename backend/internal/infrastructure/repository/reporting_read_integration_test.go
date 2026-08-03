//go:build integration

package repository

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestWithSerialReportingReadScopesParallelismToTransaction(t *testing.T) {
	ctx := context.Background()
	var before, inside, after string
	require.NoError(t, scanSingleRow(ctx, integrationDB, "SHOW max_parallel_workers_per_gather", nil, &before))

	err := withSerialReportingRead(ctx, integrationDB, func(q sqlQueryer) error {
		return scanSingleRow(ctx, q, "SHOW max_parallel_workers_per_gather", nil, &inside)
	})
	require.NoError(t, err)
	require.Equal(t, "0", inside)

	require.NoError(t, scanSingleRow(ctx, integrationDB, "SHOW max_parallel_workers_per_gather", nil, &after))
	require.Equal(t, before, after)
}
