import {
  tablePageSizeMax,
  tablePageSizeMin,
  type SettingsForm,
} from "./settingsForm";

interface SettingsSavePreparationContext {
  form: SettingsForm;
  tablePageSizeOptionsInput: string;
  parseTablePageSizeOptionsInput: (raw: string) => number[] | null;
  serializeClaudeOAuthSystemPromptBlocks: () => string;
}

export type SettingsSaveValidationError =
  | { kind: "tableDefaultPageSize" }
  | { kind: "tablePageSizeOptions" };

export type SettingsSavePreparationResult =
  | {
      ok: true;
      claudeOAuthSystemPromptBlocksJSON: string;
    }
  | { ok: false; error: SettingsSaveValidationError };

export function prepareSettingsSave({
  form,
  tablePageSizeOptionsInput,
  parseTablePageSizeOptionsInput,
  serializeClaudeOAuthSystemPromptBlocks,
}: SettingsSavePreparationContext): SettingsSavePreparationResult {
  const tableDefaultPageSize = Math.floor(
    Number(form.table_default_page_size),
  );
  if (
    !Number.isInteger(tableDefaultPageSize) ||
    tableDefaultPageSize < tablePageSizeMin ||
    tableDefaultPageSize > tablePageSizeMax
  ) {
    return { ok: false, error: { kind: "tableDefaultPageSize" } };
  }

  const tablePageSizeOptions = parseTablePageSizeOptionsInput(
    tablePageSizeOptionsInput,
  );
  if (!tablePageSizeOptions) {
    return { ok: false, error: { kind: "tablePageSizeOptions" } };
  }

  const claudeOAuthSystemPromptBlocksJSON =
    serializeClaudeOAuthSystemPromptBlocks();
  form.table_default_page_size = tableDefaultPageSize;
  form.table_page_size_options = tablePageSizeOptions;
  form.claude_oauth_system_prompt_blocks = claudeOAuthSystemPromptBlocksJSON;

  return { ok: true, claudeOAuthSystemPromptBlocksJSON };
}
