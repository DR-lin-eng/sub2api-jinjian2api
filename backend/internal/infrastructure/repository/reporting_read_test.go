package repository

import (
	"context"
	"errors"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/lib/pq"
	"github.com/stretchr/testify/require"
)

func expectSerialReportingReadStart(mock sqlmock.Sqlmock) {
	mock.ExpectBegin()
	mock.ExpectExec(regexp.QuoteMeta(disableParallelReportingSQL)).
		WillReturnResult(sqlmock.NewResult(0, 0))
}

func expectSerialReportingReadCommit(mock sqlmock.Sqlmock) {
	mock.ExpectCommit()
}

func TestWithSerialReportingReadScopesParallelSettingToReadOnlyTransaction(t *testing.T) {
	db, mock := newSQLMock(t)
	expectSerialReportingReadStart(mock)
	mock.ExpectQuery(regexp.QuoteMeta("SELECT 1")).
		WillReturnRows(sqlmock.NewRows([]string{"value"}).AddRow(1))
	expectSerialReportingReadCommit(mock)

	var value int
	err := withSerialReportingRead(context.Background(), db, func(q sqlQueryer) error {
		return scanSingleRow(context.Background(), q, "SELECT 1", nil, &value)
	})
	require.NoError(t, err)
	require.Equal(t, 1, value)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestWithSerialReportingReadRollsBackQueryFailure(t *testing.T) {
	db, mock := newSQLMock(t)
	expectSerialReportingReadStart(mock)
	mock.ExpectRollback()

	wantErr := errors.New("reporting query failed")
	err := withSerialReportingRead(context.Background(), db, func(sqlQueryer) error {
		return wantErr
	})
	require.ErrorIs(t, err, wantErr)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestWithReportingReadRetriesSharedMemoryFailureWithoutParallelWorkers(t *testing.T) {
	db, mock := newSQLMock(t)
	query := "SELECT report_value"
	mock.ExpectQuery(regexp.QuoteMeta(query)).
		WillReturnError(&pq.Error{
			Code:    "53100",
			Message: `could not resize shared memory segment "/PostgreSQL.123" to 25223168 bytes: No space left on device`,
		})
	expectSerialReportingReadStart(mock)
	mock.ExpectQuery(regexp.QuoteMeta(query)).
		WillReturnRows(sqlmock.NewRows([]string{"value"}).AddRow(42))
	expectSerialReportingReadCommit(mock)

	var calls, value int
	err := withReportingRead(context.Background(), db, func(q sqlQueryer) error {
		calls++
		return scanSingleRow(context.Background(), q, query, nil, &value)
	})
	require.NoError(t, err)
	require.Equal(t, 2, calls)
	require.Equal(t, 42, value)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestWithReportingReadDoesNotRetryUnrelatedFailure(t *testing.T) {
	db, mock := newSQLMock(t)
	query := "SELECT report_value"
	wantErr := errors.New("connection reset")
	mock.ExpectQuery(regexp.QuoteMeta(query)).WillReturnError(wantErr)

	err := withReportingRead(context.Background(), db, func(q sqlQueryer) error {
		return scanSingleRow(context.Background(), q, query, nil)
	})
	require.ErrorIs(t, err, wantErr)
	require.NoError(t, mock.ExpectationsWereMet())
}
