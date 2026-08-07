export interface OverloadCooldownSettings {
  enabled: boolean;
  cooldown_minutes: number;
}

export interface RateLimit429CooldownSettings {
  enabled: boolean;
  cooldown_seconds: number;
}

export interface GlobalTempUnschedulableSettings {
  enabled: boolean;
}
