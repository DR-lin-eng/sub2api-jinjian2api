-- Keep unread inbox scans index-backed without indexing the common zero state.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_conversations_unread_by_admin_active
    ON chat_conversations (unread_by_admin)
    WHERE unread_by_admin > 0;
