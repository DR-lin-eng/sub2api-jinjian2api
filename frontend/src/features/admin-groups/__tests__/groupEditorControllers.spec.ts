import { effectScope, nextTick, ref, type EffectScope } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminGroup } from "@/types";
import { useCreateGroupController } from "../presentation/composables/useCreateGroupController";
import { useEditGroupController } from "../presentation/composables/useEditGroupController";
import { useGroupEditorRuntime } from "../presentation/composables/useGroupEditorRuntime";

const {
  createGroup,
  updateGroup,
  getModelsListCandidates,
  getLiveCapability,
  listAccounts,
  getAccountByID,
  showError,
  showSuccess,
  isCurrentStep,
  nextStep,
} = vi.hoisted(() => ({
  createGroup: vi.fn(),
  updateGroup: vi.fn(),
  getModelsListCandidates: vi.fn(),
  getLiveCapability: vi.fn(),
  listAccounts: vi.fn(),
  getAccountByID: vi.fn(),
  showError: vi.fn(),
  showSuccess: vi.fn(),
  isCurrentStep: vi.fn(),
  nextStep: vi.fn(),
}));

vi.mock(
  "@/features/admin-groups/data/datasources/adminGroupsDatasource",
  () => ({
    create: createGroup,
    update: updateGroup,
    getModelsListCandidates,
    getLiveCapability,
  }),
);
vi.mock(
  "@/features/admin-accounts/data/datasources/adminAccountsDatasource",
  () => ({
    list: listAccounts,
    getById: getAccountByID,
  }),
);
vi.mock("@/core/stores/appStore", () => ({
  useAppStore: () => ({ showError, showSuccess }),
}));
vi.mock("@/core/stores/onboardingStore", () => ({
  useOnboardingStore: () => ({ isCurrentStep, nextStep }),
}));
vi.mock("vue-i18n", async () => {
  const actual = await vi.importActual<typeof import("vue-i18n")>("vue-i18n");
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  };
});

const sourceGroup: AdminGroup = {
  id: 42,
  name: "Primary",
  description: null,
  platform: "openai",
  rate_multiplier: 1,
  rpm_limit: 0,
  is_exclusive: false,
  status: "active",
  subscription_type: "standard",
  daily_limit_usd: null,
  weekly_limit_usd: null,
  monthly_limit_usd: null,
  allow_image_generation: false,
  allow_batch_image_generation: false,
  image_rate_independent: false,
  image_rate_multiplier: 1,
  batch_image_discount_multiplier: 0.5,
  batch_image_hold_multiplier: 0.6,
  image_price_1k: null,
  image_price_2k: null,
  image_price_4k: null,
  video_rate_independent: false,
  video_rate_multiplier: 1,
  video_price_480p: null,
  video_price_720p: null,
  video_price_1080p: null,
  web_search_price_per_call: null,
  peak_rate_enabled: false,
  peak_start: "",
  peak_end: "",
  peak_rate_multiplier: 1,
  claude_code_only: false,
  fallback_group_id: null,
  fallback_group_id_on_invalid_request: null,
  allow_messages_dispatch: false,
  default_mapped_model: "",
  messages_dispatch_model_config: undefined,
  require_oauth_only: false,
  require_privacy_set: false,
  created_at: "2026-07-16T00:00:00Z",
  updated_at: "2026-07-16T00:00:00Z",
  model_routing: null,
  model_routing_enabled: false,
  mcp_xml_inject: true,
  supported_model_scopes: [],
  account_count: 1,
  active_account_count: 1,
  rate_limited_account_count: 0,
  models_list_config: undefined,
  sort_order: 10,
};

describe("group editor controllers", () => {
  let scope: EffectScope;

  beforeEach(() => {
    scope = effectScope();
    for (const mock of [
      createGroup,
      updateGroup,
      getModelsListCandidates,
      getLiveCapability,
      listAccounts,
      getAccountByID,
      showError,
      showSuccess,
      isCurrentStep,
      nextStep,
    ]) {
      mock.mockReset();
    }
    getModelsListCandidates.mockResolvedValue([]);
    getLiveCapability.mockResolvedValue({ supported: true });
    isCurrentStep.mockReturnValue(false);
  });

  afterEach(() => {
    scope.stop();
  });

  it("keeps create payload normalization and refresh timing", async () => {
    const loadGroups = vi.fn();
    const groups = ref<AdminGroup[]>([]);
    const { controller } = scope.run(() => {
      const runtime = useGroupEditorRuntime();
      return {
        controller: useCreateGroupController({ groups, loadGroups, runtime }),
      };
    })!;
    const form = controller.dialogContext.form;
    form.name = "Created";
    form.daily_limit_usd = "";
    form.image_price_1k = "";

    let resolveCreate!: (group: AdminGroup) => void;
    createGroup.mockImplementationOnce(
      () =>
        new Promise<AdminGroup>((resolve) => {
          resolveCreate = resolve;
        }),
    );

    const submit = controller.dialogContext.submit() as Promise<void>;
    expect(createGroup).toHaveBeenCalledTimes(1);
    expect(loadGroups).not.toHaveBeenCalled();
    const request = createGroup.mock.calls[0][0];
    expect(request).toMatchObject({
      name: "Created",
      daily_limit_usd: null,
      image_price_1k: null,
      messages_dispatch_model_config: undefined,
    });

    resolveCreate({ ...sourceGroup, id: 43, name: "Created" });
    await submit;
    expect(loadGroups).toHaveBeenCalledTimes(1);
  });

  it("applies the non-OpenAI watcher before the update payload and refresh", async () => {
    const loadGroups = vi.fn();
    const groups = ref<AdminGroup[]>([sourceGroup]);
    const { controller } = scope.run(() => {
      const runtime = useGroupEditorRuntime();
      return {
        controller: useEditGroupController({ groups, loadGroups, runtime }),
      };
    })!;
    await controller.handleEdit(sourceGroup);
    controller.form.default_mapped_model = "legacy";
    controller.form.allow_messages_dispatch = true;
    controller.form.allow_live = true;
    controller.form.platform = "anthropic";
    await nextTick();

    expect(controller.form.default_mapped_model).toBe("");
    expect(controller.form.allow_messages_dispatch).toBe(false);
    expect(controller.form.allow_live).toBe(false);

    let resolveUpdate!: (group: AdminGroup) => void;
    updateGroup.mockImplementationOnce(
      () =>
        new Promise<AdminGroup>((resolve) => {
          resolveUpdate = resolve;
        }),
    );
    const submit = controller.dialogContext.submit() as Promise<void>;
    expect(updateGroup).toHaveBeenCalledTimes(1);
    expect(loadGroups).not.toHaveBeenCalled();
    expect(updateGroup.mock.calls[0][1]).toMatchObject({
      platform: "anthropic",
      default_mapped_model: "",
      allow_messages_dispatch: false,
      allow_live: false,
      fallback_group_id: 0,
      fallback_group_id_on_invalid_request: 0,
      image_price_1k: -1,
      messages_dispatch_model_config: undefined,
    });

    resolveUpdate({ ...sourceGroup, name: "Updated" });
    await submit;
    expect(loadGroups).toHaveBeenCalledTimes(1);
  });
});
