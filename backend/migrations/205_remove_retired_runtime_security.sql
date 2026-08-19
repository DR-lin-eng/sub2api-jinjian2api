-- This branch is a standalone gateway and keeps Prompt Audit as its only
-- request-content review feature. Remove persisted state for the retired
-- multi-instance, content-moderation, and ingress-risk-control surfaces.

DROP TABLE IF EXISTS
    cluster_task_runs,
    cluster_instances,
    content_moderation_logs,
    ops_ingress_reject_aggregates,
    audit_logs
CASCADE;

DELETE FROM settings
WHERE key IN (
    'risk_control_enabled',
    'content_moderation_config',
    'cyber_session_block_enabled',
    'cyber_session_block_ttl_seconds',
    'audit_log_retention_days'
)
   OR key LIKE 'notification_email_template:content_moderation.%'
   OR key LIKE 'notification_email_delivery:content_moderation.%';
