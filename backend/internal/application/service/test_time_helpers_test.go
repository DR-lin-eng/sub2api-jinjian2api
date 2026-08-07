package service

import "time"

func ptrTime(value time.Time) *time.Time {
	return &value
}

func ptrInt64(value int64) *int64 {
	return &value
}
