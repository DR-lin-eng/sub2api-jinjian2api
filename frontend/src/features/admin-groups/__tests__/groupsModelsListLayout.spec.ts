import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const coreFieldsSource = readFileSync(
  resolve(currentDir, "../presentation/widgets/GroupEditorCoreFields.vue"),
  "utf8",
);

describe("groups models list layout", () => {
  it("keeps the toolbar outside of the scrolling list content", () => {
    expect(coreFieldsSource).toContain("overflow-hidden rounded-lg border");
    expect(coreFieldsSource).toContain("max-h-64 space-y-2 overflow-y-auto p-2");
    expect(coreFieldsSource).not.toContain("sticky top-0");
  });
});
