import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const readFeatureSource = (relativePath: string) =>
  readFileSync(resolve(currentDir, relativePath), "utf8");

const pageSource = readFeatureSource(
  "../presentation/pages/GroupsPage.vue",
);
const editorSource = readFeatureSource(
  "../presentation/widgets/GroupEditorDialog.vue",
);
const createWrapperSource = readFeatureSource(
  "../presentation/widgets/CreateGroupDialog.vue",
);
const editWrapperSource = readFeatureSource(
  "../presentation/widgets/EditGroupDialog.vue",
);
const createControllerSource = readFeatureSource(
  "../presentation/composables/useCreateGroupController.ts",
);
const editControllerSource = readFeatureSource(
  "../presentation/composables/useEditGroupController.ts",
);

describe("groups editor modularization", () => {
  it("keeps create and edit as static wrappers over the shared editor", () => {
    expect(createWrapperSource).toContain(
      'import GroupEditorDialog from "./GroupEditorDialog.vue"',
    );
    expect(createWrapperSource).toContain(
      '<GroupEditorDialog mode="create" :context="context" />',
    );
    expect(editWrapperSource).toContain(
      '<GroupEditorDialog mode="edit" :context="context" />',
    );
    expect(createWrapperSource).not.toContain("import(");
    expect(editWrapperSource).not.toContain("import(");
  });

  it("preserves form ids, selectors, and controller-owned submit payloads", () => {
    expect(editorSource).toContain("'edit-group-form' : 'create-group-form'");
    expect(editorSource).toContain("'edit-group-form-name' : 'group-form-name'");
    expect(editorSource).toContain('data-tour="group-form-submit"');
    expect(editorSource).toContain('@submit.prevent="submit"');

    expect(createControllerSource).toContain("submit: handleCreateGroup");
    expect(createControllerSource).toContain("...createForm");
    expect(createControllerSource).toContain("await groupsAPI.create(requestData)");
    expect(editControllerSource).toContain("submit: handleUpdateGroup");
    expect(editControllerSource).toContain("...editForm");
    expect(editControllerSource).toContain(
      "await groupsAPI.update(editingGroup.value.id, payload)",
    );
    expect(pageSource).toContain("useCreateGroupController");
    expect(pageSource).toContain("useEditGroupController");
  });

  it("uses one edit-platform watcher with the complete non-OpenAI reset", () => {
    expect(editControllerSource.match(/\(\) => editForm\.platform/g)).toHaveLength(1);

    const watcherStart = editControllerSource.indexOf("() => editForm.platform");
    const watcherEnd = editControllerSource.indexOf("\n  watch(", watcherStart + 1);
    const watcherSource = editControllerSource.slice(watcherStart, watcherEnd);

    expect(watcherSource).toContain("resetMessagesDispatchFormState(editForm)");
    expect(watcherSource).toContain('editForm.allow_live = false');
    expect(watcherSource).toContain('editForm.default_mapped_model = ""');
    expect(watcherSource).toContain(
      "editForm.fallback_group_id_on_invalid_request = null",
    );
  });
});
