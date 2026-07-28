import { describe, expect, it } from "vitest";
import {
  defaultClaudeCodeExpansionPrompt,
  parseClaudeOAuthSystemPromptBlocks,
} from "@/features/admin-settings/presentation/composables/settingsClaudePromptResolver";

describe("settingsClaudePromptResolver", () => {
  it("preserves the historical default expansion prompt indentation", () => {
    expect(defaultClaudeCodeExpansionPrompt).toContain("\n\nIMPORTANT:");
    expect(defaultClaudeCodeExpansionPrompt).toContain("\n# Tone and style");
    expect(defaultClaudeCodeExpansionPrompt).toContain("\n - Only use emojis");
    expect(defaultClaudeCodeExpansionPrompt).not.toMatch(
      /\n {2}(?:IMPORTANT:|# Tone and style| - )/,
    );

    const [block] = parseClaudeOAuthSystemPromptBlocks(
      JSON.stringify([{ text: "{claude_code_expansion_prompt}" }]),
    );
    expect(block?.text).toBe(defaultClaudeCodeExpansionPrompt);
  });
});
