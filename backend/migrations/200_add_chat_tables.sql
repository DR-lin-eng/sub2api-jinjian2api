-- 实时客服聊天：每个用户与客服（全体管理员）之间只有一条长期会话。
CREATE TABLE IF NOT EXISTS chat_conversations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id BIGINT NOT NULL,
    last_message_at TIMESTAMPTZ,
    unread_by_user INT NOT NULL DEFAULT 0,
    unread_by_admin INT NOT NULL DEFAULT 0,
    CONSTRAINT chat_conversations_user_id_key UNIQUE (user_id),
    CONSTRAINT chat_conversations_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message_at
    ON chat_conversations (last_message_at);

CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_type VARCHAR(10) NOT NULL,
    sender_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chat_messages_sender_type_check CHECK (sender_type IN ('user', 'admin')),
    CONSTRAINT chat_messages_conversation_id_fkey FOREIGN KEY (conversation_id)
        REFERENCES chat_conversations (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id_created_at
    ON chat_messages (conversation_id, created_at);
