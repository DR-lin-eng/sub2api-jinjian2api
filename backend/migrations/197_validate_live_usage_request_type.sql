-- Keep the ACCESS EXCLUSIVE lock in migration 188 short: validation runs in a
-- separate transaction and only takes the weaker lock PostgreSQL uses for
-- validating an existing NOT VALID constraint.
ALTER TABLE usage_logs
    VALIDATE CONSTRAINT usage_logs_request_type_check;
