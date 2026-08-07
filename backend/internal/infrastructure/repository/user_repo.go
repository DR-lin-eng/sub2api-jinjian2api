package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	dbent "github.com/Wei-Shaw/sub2api/ent"
	"github.com/Wei-Shaw/sub2api/ent/predicate"
	dbuser "github.com/Wei-Shaw/sub2api/ent/user"
	"github.com/Wei-Shaw/sub2api/internal/application/service"

	entsql "entgo.io/ent/dialect/sql"
)

type userRepository struct {
	client *dbent.Client
	sql    sqlExecutor
}

func NewUserRepository(client *dbent.Client, sqlDB *sql.DB) service.UserRepository {
	return newUserRepositoryWithSQL(client, sqlDB)
}

func newUserRepositoryWithSQL(client *dbent.Client, sqlq sqlExecutor) *userRepository {
	return &userRepository{client: client, sql: sqlq}
}

func (r *userRepository) GetByID(ctx context.Context, id int64) (*service.User, error) {
	row, err := clientFromContext(ctx, r.client).User.Query().Where(dbuser.IDEQ(id)).Only(ctx)
	if err != nil {
		return nil, translatePersistenceError(err, service.ErrUserNotFound, nil)
	}
	return userEntityToService(row), nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*service.User, error) {
	rows, err := clientFromContext(ctx, r.client).User.Query().
		Where(userEmailLookupPredicate(email)).
		Order(dbent.Asc(dbuser.FieldID)).
		Limit(2).
		All(ctx)
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return nil, service.ErrUserNotFound
	}
	if len(rows) > 1 {
		return nil, fmt.Errorf("normalized email lookup matched multiple administrators for %q", strings.TrimSpace(email))
	}
	return userEntityToService(rows[0]), nil
}

func (r *userRepository) GetFirstAdmin(ctx context.Context) (*service.User, error) {
	row, err := clientFromContext(ctx, r.client).User.Query().
		Where(dbuser.RoleEQ(service.RoleAdmin), dbuser.StatusEQ(service.StatusActive)).
		Order(dbent.Asc(dbuser.FieldID)).
		First(ctx)
	if err != nil {
		return nil, translatePersistenceError(err, service.ErrUserNotFound, nil)
	}
	return userEntityToService(row), nil
}

func (r *userRepository) Update(ctx context.Context, userIn *service.User, fields service.UserUpdateFields) error {
	if userIn == nil || fields.IsEmpty() {
		return nil
	}
	client := clientFromContext(ctx, r.client)
	update := client.User.UpdateOneID(userIn.ID)
	if fields.Username {
		update.SetUsername(strings.TrimSpace(userIn.Username))
	}
	if fields.PasswordHash {
		update.SetPasswordHash(userIn.PasswordHash)
	}
	if fields.Status {
		update.SetStatus(userIn.Status)
	}
	if fields.LastLoginAt {
		if userIn.LastLoginAt == nil {
			update.ClearLastLoginAt()
		} else {
			update.SetLastLoginAt(*userIn.LastLoginAt)
		}
	}
	if fields.LastActiveAt {
		if userIn.LastActiveAt == nil {
			update.ClearLastActiveAt()
		} else {
			update.SetLastActiveAt(*userIn.LastActiveAt)
		}
	}

	updated, err := update.Save(ctx)
	if err != nil {
		return translatePersistenceError(err, service.ErrUserNotFound, nil)
	}
	userIn.UpdatedAt = updated.UpdatedAt
	return nil
}

func userEmailLookupPredicate(email string) predicate.User {
	normalized := strings.ToLower(strings.TrimSpace(email))
	if normalized == "" {
		return dbuser.EmailEQ(email)
	}
	return predicate.User(func(selector *entsql.Selector) {
		selector.Where(entsql.P(func(builder *entsql.Builder) {
			builder.WriteString("LOWER(TRIM(").
				Ident(selector.C(dbuser.FieldEmail)).
				WriteString(")) = ").
				Arg(normalized)
		}))
	})
}

func applyUserEntityToService(dst *service.User, src *dbent.User) {
	if dst == nil || src == nil {
		return
	}
	*dst = *userEntityToService(src)
}

func (r *userRepository) UpdateTotpSecret(ctx context.Context, userID int64, encryptedSecret *string) error {
	update := clientFromContext(ctx, r.client).User.UpdateOneID(userID)
	if encryptedSecret == nil {
		update.ClearTotpSecretEncrypted()
	} else {
		update.SetTotpSecretEncrypted(*encryptedSecret)
	}
	_, err := update.Save(ctx)
	return translatePersistenceError(err, service.ErrUserNotFound, nil)
}

func (r *userRepository) EnableTotp(ctx context.Context, userID int64) error {
	_, err := clientFromContext(ctx, r.client).User.UpdateOneID(userID).
		SetTotpEnabled(true).
		SetTotpEnabledAt(time.Now()).
		Save(ctx)
	return translatePersistenceError(err, service.ErrUserNotFound, nil)
}

func (r *userRepository) DisableTotp(ctx context.Context, userID int64) error {
	_, err := clientFromContext(ctx, r.client).User.UpdateOneID(userID).
		SetTotpEnabled(false).
		ClearTotpEnabledAt().
		ClearTotpSecretEncrypted().
		Save(ctx)
	return translatePersistenceError(err, service.ErrUserNotFound, nil)
}
