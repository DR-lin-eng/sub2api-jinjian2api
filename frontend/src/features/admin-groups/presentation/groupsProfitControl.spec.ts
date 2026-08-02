import { describe, expect, it } from "vitest";

import {
  profitDecimalToPercent,
  profitPercentToDecimal,
  validateProfitControlFormState,
  type ProfitControlFormState,
} from "./groupsProfitControl";

const formState = (
  overrides: Partial<ProfitControlFormState> = {},
): ProfitControlFormState => ({
  platform: "openai",
  profit_control_enabled: true,
  profit_min_margin_percent: 30,
  profit_safety_buffer_percent: 0,
  ...overrides,
});

describe("group profit control", () => {
  it("converts percent values to storage decimals without float tails", () => {
    expect(profitPercentToDecimal(30)).toBe(0.3);
    expect(profitPercentToDecimal(33.333)).toBe(0.3333);
    expect(profitPercentToDecimal(0.005)).toBe(0.0001);
    expect(profitPercentToDecimal("abc")).toBe(0);
  });

  it("round-trips representative storage values", () => {
    for (const decimal of [0.05, 0.3, 0.3333, 0.9999]) {
      expect(profitPercentToDecimal(profitDecimalToPercent(decimal))).toBe(
        decimal,
      );
    }
  });

  it("validates supported platforms and skips disabled or unsupported forms", () => {
    expect(validateProfitControlFormState(formState())).toBeNull();
    expect(
      validateProfitControlFormState(
        formState({
          profit_control_enabled: false,
          profit_min_margin_percent: 100,
        }),
      ),
    ).toBeNull();
    expect(
      validateProfitControlFormState(
        formState({ platform: "composite", profit_min_margin_percent: 100 }),
      ),
    ).toBeNull();
    expect(
      validateProfitControlFormState(
        formState({ platform: "anthropic", profit_min_margin_percent: 100 }),
      ),
    ).toBe("marginRangeError");
  });

  it("rejects invalid ratios and totals that exclude every account", () => {
    expect(
      validateProfitControlFormState(
        formState({ profit_safety_buffer_percent: -0.1 }),
      ),
    ).toBe("bufferRangeError");
    expect(
      validateProfitControlFormState(
        formState({
          profit_min_margin_percent: 60,
          profit_safety_buffer_percent: 40,
        }),
      ),
    ).toBe("sumTooHigh");
    expect(
      validateProfitControlFormState(
        formState({ profit_min_margin_percent: 99.999 }),
      ),
    ).toBe("marginRangeError");
  });
});
