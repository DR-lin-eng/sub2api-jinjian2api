package repository

import (
	"strings"
	"testing"

	"github.com/Wei-Shaw/sub2api/migrations"
	"github.com/stretchr/testify/require"
)

func TestChatUnreadIndexMigrationIsPartialAndNonTransactional(t *testing.T) {
	migration, err := migrations.FS.ReadFile("201_add_chat_unread_index_notx.sql")
	require.NoError(t, err)
	content := strings.TrimSpace(string(migration))
	require.Contains(t, content, "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_conversations_unread_by_admin_active")
	require.Contains(t, content, "WHERE unread_by_admin > 0")
	require.NotContains(t, content, "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_conversations_unread_by_admin\n")
	nonTx, err := validateMigrationExecutionMode("201_add_chat_unread_index_notx.sql", content)
	require.NoError(t, err)
	require.True(t, nonTx)
}
