package chat

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/shared/pagination"
	"github.com/stretchr/testify/require"
)

type conversationRepoStub struct {
	conversation     *Conversation
	getByUserErr     error
	getOrCreateCalls int
}

func (r *conversationRepoStub) GetOrCreateByUserID(context.Context, int64) (*Conversation, error) {
	r.getOrCreateCalls++
	return r.conversation, nil
}

func (r *conversationRepoStub) GetByID(context.Context, int64) (*Conversation, error) {
	return r.conversation, nil
}

func (r *conversationRepoStub) GetByUserID(context.Context, int64) (*Conversation, error) {
	if r.getByUserErr != nil {
		return nil, r.getByUserErr
	}
	return r.conversation, nil
}

func (r *conversationRepoStub) List(context.Context, pagination.PaginationParams, ConversationListFilters) ([]Conversation, *pagination.PaginationResult, error) {
	return nil, nil, nil
}

func (r *conversationRepoStub) CountUnreadByAdmin(context.Context) (int, error) {
	return 0, nil
}

func (r *conversationRepoStub) GetUnreadByUserID(context.Context, int64) (int, error) {
	return 0, nil
}

func (r *conversationRepoStub) MarkRead(context.Context, int64, SenderType) error {
	return nil
}

type messageRepoStub struct {
	createAndTouchErr   error
	createAndTouchCalls int
}

func (r *messageRepoStub) CreateAndTouch(_ context.Context, m *Message, _ time.Time, _ SenderType) error {
	r.createAndTouchCalls++
	if r.createAndTouchErr != nil {
		return r.createAndTouchErr
	}
	m.ID = 10
	m.CreatedAt = time.Now()
	return nil
}

func (r *messageRepoStub) List(context.Context, int64, pagination.PaginationParams) ([]Message, *pagination.PaginationResult, error) {
	return nil, nil, errors.New("message list should not be called")
}

type broadcasterStub struct {
	calls int
}

func (b *broadcasterStub) BroadcastMessage(int64, int64, *Message, bool) {
	b.calls++
}

func TestUserUnreadAndEmptyMessageListDoNotCreateConversation(t *testing.T) {
	conversations := &conversationRepoStub{getByUserErr: ErrConversationNotFound}
	service := NewService(conversations, &messageRepoStub{})

	unread, err := service.GetUnreadCountForUser(context.Background(), 42)
	require.NoError(t, err)
	require.Zero(t, unread)

	messages, page, err := service.ListMessagesForUser(
		context.Background(),
		42,
		pagination.PaginationParams{Page: 1, PageSize: 20},
	)
	require.NoError(t, err)
	require.Empty(t, messages)
	require.Zero(t, page.Total)
	require.Zero(t, conversations.getOrCreateCalls)
}

func TestPostMessageRequiresAtomicWriteAndDoesNotBroadcastOnFailure(t *testing.T) {
	conversations := &conversationRepoStub{conversation: &Conversation{ID: 7, UserID: 42}}
	messages := &messageRepoStub{createAndTouchErr: errors.New("transaction failed")}
	broadcaster := &broadcasterStub{}
	service := NewService(conversations, messages)
	service.SetBroadcaster(broadcaster)

	message, err := service.PostMessageFromUser(context.Background(), 42, "hello")
	require.ErrorContains(t, err, "create chat message and update conversation")
	require.Nil(t, message)
	require.Equal(t, 1, messages.createAndTouchCalls)
	require.Zero(t, broadcaster.calls)
}

func TestPostMessageLengthLimitCountsUnicodeCharacters(t *testing.T) {
	conversations := &conversationRepoStub{conversation: &Conversation{ID: 7, UserID: 42}}
	messages := &messageRepoStub{}
	service := NewService(conversations, messages)

	message, err := service.PostMessageFromUser(
		context.Background(),
		42,
		strings.Repeat("你", MaxMessageContentLen),
	)
	require.NoError(t, err)
	require.NotNil(t, message)

	message, err = service.PostMessageFromUser(
		context.Background(),
		42,
		strings.Repeat("你", MaxMessageContentLen+1),
	)
	require.ErrorIs(t, err, ErrMessageContentTooLong)
	require.Nil(t, message)
}
