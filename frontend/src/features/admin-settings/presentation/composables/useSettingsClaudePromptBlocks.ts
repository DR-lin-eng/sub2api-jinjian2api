import { computed, ref } from "vue";
import type { SettingsForm } from "./settingsForm";
import {
  createClaudeOAuthSystemPromptBlock,
  createDefaultClaudeOAuthSystemPromptBlocks,
  defaultClaudeCodeExpansionPrompt,
  defaultClaudeCodeSystemPrompt,
  defaultClaudeOAuthSystemPromptBlocks,
  detectClaudeOAuthSystemPromptPreset,
  parseClaudeOAuthSystemPromptBlocks,
  serializeClaudeOAuthSystemPromptBlocksToJSON,
  type ClaudeOAuthSystemPromptBlock,
  type ClaudeOAuthSystemPromptPreset,
} from "./settingsClaudePromptResolver";

type Translate = (key: string) => string;

export function useSettingsClaudePromptBlocks(
  form: SettingsForm,
  t: Translate,
) {
  const claudeOAuthSystemPromptBlocks = ref<ClaudeOAuthSystemPromptBlock[]>(
    createDefaultClaudeOAuthSystemPromptBlocks(),
  );

  const claudeOAuthSystemPromptPresetOptions = computed(() => [
    {
      value: "billing",
      label: t("admin.settings.gatewayForwarding.systemBlockPresetBilling"),
    },
    {
      value: "system",
      label: t("admin.settings.gatewayForwarding.systemBlockPresetIdentity"),
    },
    {
      value: "expansion",
      label: t("admin.settings.gatewayForwarding.systemBlockPresetExpansion"),
    },
    {
      value: "custom",
      label: t("admin.settings.gatewayForwarding.systemBlockPresetCustom"),
    },
  ]);

  const claudeOAuthSystemPromptBlockTypeOptions = computed(() => [
    {
      value: "text",
      label: t("admin.settings.gatewayForwarding.systemBlockTypeText"),
    },
  ]);

  const claudeOAuthSystemPromptCacheTTLOptions = computed(() => [
    { value: "5m", label: t("admin.settings.gatewayForwarding.cacheTTL5m") },
    { value: "1h", label: t("admin.settings.gatewayForwarding.cacheTTL1h") },
  ]);

  function getClaudeOAuthPresetLabel(
    preset: ClaudeOAuthSystemPromptPreset,
  ): string {
    return (
      claudeOAuthSystemPromptPresetOptions.value.find(
        (option) => option.value === preset,
      )?.label || t("admin.settings.gatewayForwarding.systemBlockPresetCustom")
    );
  }

  function syncClaudeOAuthSystemPromptBlocksFormField(): void {
    form.claude_oauth_system_prompt_blocks =
      serializeClaudeOAuthSystemPromptBlocksToJSON(
        claudeOAuthSystemPromptBlocks.value,
      );
  }

  function serializeClaudeOAuthSystemPromptBlocks(): string {
    return serializeClaudeOAuthSystemPromptBlocksToJSON(
      claudeOAuthSystemPromptBlocks.value,
    );
  }

  function loadClaudeOAuthSystemPromptBlocks(): void {
    if (!form.claude_oauth_system_prompt_blocks?.trim()) {
      form.claude_oauth_system_prompt_blocks =
        defaultClaudeOAuthSystemPromptBlocks;
    }
    claudeOAuthSystemPromptBlocks.value = parseClaudeOAuthSystemPromptBlocks(
      form.claude_oauth_system_prompt_blocks,
      form.claude_oauth_system_prompt,
    );
    syncClaudeOAuthSystemPromptBlocksFormField();
  }

  function addClaudeOAuthSystemPromptBlock(): void {
    claudeOAuthSystemPromptBlocks.value.push(
      createClaudeOAuthSystemPromptBlock({
        expanded: true,
        preset: "custom",
        text: "",
      }),
    );
    syncClaudeOAuthSystemPromptBlocksFormField();
  }

  function toggleClaudeOAuthSystemPromptBlock(index: number): void {
    const block = claudeOAuthSystemPromptBlocks.value[index];
    if (block) {
      block.expanded = !block.expanded;
    }
  }

  function removeClaudeOAuthSystemPromptBlock(index: number): void {
    claudeOAuthSystemPromptBlocks.value.splice(index, 1);
    syncClaudeOAuthSystemPromptBlocksFormField();
  }

  function moveClaudeOAuthSystemPromptBlock(
    index: number,
    direction: -1 | 1,
  ): void {
    const targetIndex = index + direction;
    if (
      targetIndex < 0 ||
      targetIndex >= claudeOAuthSystemPromptBlocks.value.length
    ) {
      return;
    }
    const blocks = claudeOAuthSystemPromptBlocks.value;
    const current = blocks[index];
    blocks[index] = blocks[targetIndex];
    blocks[targetIndex] = current;
    syncClaudeOAuthSystemPromptBlocksFormField();
  }

  function applyClaudeOAuthSystemPromptPreset(
    index: number,
    value: string | number | boolean | null,
  ): void {
    const block = claudeOAuthSystemPromptBlocks.value[index];
    if (!block) {
      return;
    }
    const preset = String(value || "custom") as ClaudeOAuthSystemPromptPreset;
    block.preset = preset;
    block.type = "text";
    if (preset === "billing") {
      block.text = "{billing_header}";
      block.cacheControlEnabled = false;
      block.cacheControlTTL = "5m";
    } else if (preset === "system") {
      block.text = defaultClaudeCodeSystemPrompt;
      block.cacheControlEnabled = false;
      block.cacheControlTTL = "5m";
    } else if (preset === "expansion") {
      block.text =
        form.claude_oauth_system_prompt.trim() ||
        defaultClaudeCodeExpansionPrompt;
      block.cacheControlEnabled = true;
      block.cacheControlTTL = "5m";
    }
    syncClaudeOAuthSystemPromptBlocksFormField();
  }

  function markClaudeOAuthSystemPromptBlockCustom(
    block: ClaudeOAuthSystemPromptBlock,
  ): void {
    block.preset = detectClaudeOAuthSystemPromptPreset(block.text);
    syncClaudeOAuthSystemPromptBlocksFormField();
  }

  function resetClaudeOAuthSystemPromptBlocks(): void {
    claudeOAuthSystemPromptBlocks.value =
      createDefaultClaudeOAuthSystemPromptBlocks(
        form.claude_oauth_system_prompt,
      );
    syncClaudeOAuthSystemPromptBlocksFormField();
  }

  return {
    addClaudeOAuthSystemPromptBlock,
    applyClaudeOAuthSystemPromptPreset,
    claudeOAuthSystemPromptBlocks,
    claudeOAuthSystemPromptBlockTypeOptions,
    claudeOAuthSystemPromptCacheTTLOptions,
    claudeOAuthSystemPromptPresetOptions,
    getClaudeOAuthPresetLabel,
    loadClaudeOAuthSystemPromptBlocks,
    markClaudeOAuthSystemPromptBlockCustom,
    moveClaudeOAuthSystemPromptBlock,
    removeClaudeOAuthSystemPromptBlock,
    resetClaudeOAuthSystemPromptBlocks,
    serializeClaudeOAuthSystemPromptBlocks,
    toggleClaudeOAuthSystemPromptBlock,
  };
}
