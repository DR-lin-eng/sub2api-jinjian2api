export interface AdminApiKeyStatus {
  exists: boolean;
  masked_key: string;
}

export type AdminApiKeyScope =
  | "admin.read"
  | "admin.write"
  | "admin.accounts.read"
  | "admin.accounts.write"
  | "admin.settings.read"
  | "admin.settings.write"
  | "admin.backups.read"
  | "admin.backups.write"
  | "admin.system.read"
  | "admin.system.write"
  | "admin.audit.read"
  | "admin.audit.write"
  | "admin.ops.read"
  | "admin.ops.write";

export interface AdminApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_four: string;
  scopes: AdminApiKeyScope[];
  status: "active" | "revoked" | string;
  expires_at?: string | null;
  created_by: number;
  last_used_at?: string | null;
  created_at: string;
  updated_at: string;
  revoked_at?: string | null;
}

export interface CreateAdminApiKeyRequest {
  name: string;
  scopes: AdminApiKeyScope[];
  expires_at?: string | null;
}

export interface UpdateAdminApiKeyRequest {
  name?: string;
  scopes?: AdminApiKeyScope[];
  expires_at?: string | null;
}
