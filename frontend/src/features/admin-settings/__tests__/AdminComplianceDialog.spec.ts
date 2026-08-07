import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { complianceStore, showError, showSuccess } = vi.hoisted(() => ({
  complianceStore: {
    shouldShow: true,
    expectedPhrase: "I agree",
    submitting: false,
    status: null,
    accept: vi.fn(),
  },
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock("marked", () => ({
  marked: {
    setOptions: vi.fn(),
    parse: () => "<p>Compliance document</p>",
  },
}));

vi.mock("dompurify", () => ({
  default: { sanitize: (html: string) => html },
}));

vi.mock("@/core/i18n", () => ({ getLocale: () => "en" }));

vi.mock("@/core/stores/appStore", () => ({
  useAppStore: () => ({ showError, showSuccess }),
}));

vi.mock(
  "@/features/admin-settings/presentation/stores/adminComplianceStore",
  () => ({ useAdminComplianceStore: () => complianceStore }),
);

import AdminComplianceDialog from "@/features/admin-settings/presentation/widgets/AdminComplianceDialog.vue";

const BaseDialogStub = defineComponent({
  props: { show: Boolean },
  template:
    '<div v-if="show" data-testid="compliance-dialog"><slot /><slot name="footer" /></div>',
});

function mountDialog(isAuthenticated = true, isAdmin = true) {
  return mount(AdminComplianceDialog, {
    props: { isAuthenticated, isAdmin },
    global: {
      stubs: {
        BaseDialog: BaseDialogStub,
        Icon: true,
        Input: true,
      },
    },
  });
}

describe("AdminComplianceDialog", () => {
  beforeEach(() => {
    complianceStore.shouldShow = true;
    complianceStore.submitting = false;
    complianceStore.accept.mockReset();
    showError.mockReset();
    showSuccess.mockReset();
  });

  it("is visible only for an authenticated administrator with required compliance", async () => {
    const wrapper = mountDialog();
    expect(wrapper.find('[data-testid="compliance-dialog"]').exists()).toBe(
      true,
    );

    await wrapper.setProps({ isAdmin: false });
    expect(wrapper.find('[data-testid="compliance-dialog"]').exists()).toBe(
      false,
    );

    await wrapper.setProps({ isAdmin: true, isAuthenticated: false });
    expect(wrapper.find('[data-testid="compliance-dialog"]').exists()).toBe(
      false,
    );
  });

  it("delegates logout to the app composition boundary", async () => {
    const wrapper = mountDialog();
    const logoutButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "adminCompliance.logout");

    expect(logoutButton).toBeDefined();
    await logoutButton!.trigger("click");

    expect(wrapper.emitted("logout")).toEqual([[]]);
  });
});
