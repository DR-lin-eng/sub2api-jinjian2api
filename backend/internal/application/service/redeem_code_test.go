package service

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

type chunkRecordingRedeemRepo struct {
	*redeemRejectRepo
	batchSizes []int
	nextID     int64
}

func (r *chunkRecordingRedeemRepo) CreateBatch(_ context.Context, codes []RedeemCode) error {
	r.batchSizes = append(r.batchSizes, len(codes))
	for i := range codes {
		r.nextID++
		codes[i].ID = r.nextID
	}
	return nil
}

func TestRedeemCodeExpiry(t *testing.T) {
	now := time.Now().UTC()
	past := now.Add(-time.Hour)
	future := now.Add(time.Hour)

	tests := []struct {
		name        string
		code        RedeemCode
		wantExpired bool
		wantCanUse  bool
	}{
		{
			name:        "unused without expiry can be used",
			code:        RedeemCode{Status: StatusUnused},
			wantExpired: false,
			wantCanUse:  true,
		},
		{
			name:        "unused before expiry can be used",
			code:        RedeemCode{Status: StatusUnused, ExpiresAt: &future},
			wantExpired: false,
			wantCanUse:  true,
		},
		{
			name:        "unused after expiry cannot be used",
			code:        RedeemCode{Status: StatusUnused, ExpiresAt: &past},
			wantExpired: true,
			wantCanUse:  false,
		},
		{
			name:        "explicit expired status is expired",
			code:        RedeemCode{Status: StatusExpired},
			wantExpired: true,
			wantCanUse:  false,
		},
		{
			name:        "used code remains used even after expiry time",
			code:        RedeemCode{Status: StatusUsed, ExpiresAt: &past},
			wantExpired: false,
			wantCanUse:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			require.Equal(t, tt.wantExpired, tt.code.IsExpiredAt(now))
			require.Equal(t, tt.wantCanUse, tt.code.CanUse())
		})
	}
}

func TestRedeemCodeUsageLimits(t *testing.T) {
	tests := []struct {
		name string
		code RedeemCode
		want bool
	}{
		{name: "total limit reached", code: RedeemCode{Status: StatusUnused, MaxUses: 3, UsedCount: 3}, want: false},
		{name: "total zero is unlimited", code: RedeemCode{Status: StatusUnused, MaxUses: 0, UsedCount: 999}, want: true},
		{name: "total limit still available", code: RedeemCode{Status: StatusUnused, MaxUses: 3, UsedCount: 2}, want: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			require.Equal(t, tt.want, tt.code.CanUse())
		})
	}
}

func TestGenerateCodesHasNoQuantityCapAndUsesBoundedChunks(t *testing.T) {
	repo := &chunkRecordingRedeemRepo{redeemRejectRepo: &redeemRejectRepo{}}
	svc := &RedeemService{redeemRepo: repo}

	codes, err := svc.GenerateCodes(context.Background(), GenerateCodesRequest{
		Count: 1001,
		Type:  RedeemTypeBalance,
		Value: 10,
	})

	require.NoError(t, err)
	require.Len(t, codes, 1001)
	require.Equal(t, []int{200, 200, 200, 200, 200, 1}, repo.batchSizes)
	require.EqualValues(t, 1, codes[0].ID)
	require.EqualValues(t, 1001, codes[len(codes)-1].ID)
}
