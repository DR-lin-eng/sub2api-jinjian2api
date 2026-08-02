-- Per-group profit control for scheduling admission.
-- An account qualifies when U <= D * (1 - margin - buffer), where U is the
-- account cost multiplier and D is the requester's effective token rate.
ALTER TABLE groups
    ADD COLUMN IF NOT EXISTS profit_control_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS profit_min_margin DECIMAL(10,4) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS profit_safety_buffer DECIMAL(10,4) NOT NULL DEFAULT 0;
