package migrations

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestRetiredRuntimeSecurityMigrationKeepsPromptAuditTables(t *testing.T) {
	sqlBytes, err := FS.ReadFile("205_remove_retired_runtime_security.sql")
	require.NoError(t, err)
	sql := strings.ToLower(string(sqlBytes))
	for _, table := range []string{"cluster_task_runs", "cluster_instances", "content_moderation_logs", "ops_ingress_reject_aggregates", "audit_logs"} {
		require.Contains(t, sql, "drop table if exists")
		require.Contains(t, sql, table)
	}
	require.NotContains(t, sql, "prompt_audit_jobs")
	require.NotContains(t, sql, "prompt_audit_events")
}
