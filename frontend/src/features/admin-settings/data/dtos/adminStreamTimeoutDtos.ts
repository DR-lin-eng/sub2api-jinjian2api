export interface StreamTimeoutSettings {
  response_header_timeout_degradation_enabled: boolean;
  response_header_timeout_seconds: number;
  enabled: boolean;
  action: "temp_unsched" | "error" | "none";
  temp_unsched_minutes: number;
  threshold_count: number;
  threshold_window_minutes: number;
}
