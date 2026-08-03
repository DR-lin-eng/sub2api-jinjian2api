package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// ChatMessage holds the schema definition for the ChatMessage entity.
//
// v1 仅支持文本消息，不支持附件/图片。
type ChatMessage struct {
	ent.Schema
}

func (ChatMessage) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "chat_messages"},
	}
}

func (ChatMessage) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("conversation_id"),
		field.Enum("sender_type").
			Values("user", "admin").
			Comment("发送者角色：user=会话所属用户，admin=任意管理员客服"),
		field.Int64("sender_id").
			Comment("发送者用户ID（管理员发送时为该管理员的用户ID）"),
		field.String("content").
			SchemaType(map[string]string{dialect.Postgres: "text"}).
			NotEmpty().
			MaxLen(10000),
		field.Time("created_at").
			Immutable().
			Default(time.Now).
			SchemaType(map[string]string{dialect.Postgres: "timestamptz"}),
	}
}

func (ChatMessage) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("conversation", ChatConversation.Type).
			Ref("messages").
			Field("conversation_id").
			Unique().
			Required(),
	}
}

func (ChatMessage) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("conversation_id", "created_at"),
	}
}
