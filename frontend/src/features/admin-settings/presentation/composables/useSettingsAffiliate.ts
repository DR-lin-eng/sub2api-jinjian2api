import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { affiliatesAPI, type AffiliateAdminEntry, type SimpleUser as AffiliateSimpleUser } from '@/features/affiliate/data/datasources/adminAffiliatesDatasource'
import { extractApiErrorMessage } from '@/core/utils/apiError'
import { useAppStore } from '@/core/stores/appStore'

interface AffiliateSettingsForm {
  affiliate_enabled: boolean
}
export function useSettingsAffiliate(form: AffiliateSettingsForm) {
  const { t } = useI18n()
  const appStore = useAppStore()

  // =========================
  // Affiliate (邀请返利) 专属用户管理
  // =========================

  interface AffiliateState {
    loading: boolean;
    entries: AffiliateAdminEntry[];
    total: number;
    page: number;
    pageSize: number;
    search: string;
    selected: number[];
    searchTimer: number | null;
  }

  const affiliateState = reactive<AffiliateState>({
    loading: false,
    entries: [],
    total: 0,
    page: 1,
    pageSize: 20,
    search: "",
    selected: [],
    searchTimer: null,
  });

  // `rate` is typed as string|number because <input type="number"> makes Vue's
  // v-model auto-cast the bound value to a Number on every keystroke. We keep
  // both shapes and normalize at read time.
  interface AffiliateModalState {
    open: boolean;
    mode: "add" | "edit";
    saving: boolean;
    userQuery: string;
    userResults: AffiliateSimpleUser[];
    selectedUser: AffiliateSimpleUser | null;
    editingEntry: AffiliateAdminEntry | null;
    code: string;
    rate: string | number;
    searchTimer: number | null;
  }

  const affiliateModal = reactive<AffiliateModalState>({
    open: false,
    mode: "add",
    saving: false,
    userQuery: "",
    userResults: [],
    selectedUser: null,
    editingEntry: null,
    code: "",
    rate: "",
    searchTimer: null,
  });

  const affiliateBatchModal = reactive<{
    open: boolean;
    saving: boolean;
    rate: string | number;
  }>({
    open: false,
    saving: false,
    rate: "",
  });

  // affiliateConfirmDialog drives the project-standard <ConfirmDialog>. We can't
  // `await` the user's response from the dialog component, so the confirm action
  // runs from the @confirm callback once the user clicks the dialog's confirm
  // button.
  const affiliateConfirmDialog = reactive<{
    show: boolean;
    title: string;
    message: string;
    confirmText: string;
    pending: (() => Promise<unknown>) | null;
  }>({
    show: false,
    title: "",
    message: "",
    confirmText: "",
    pending: null,
  });

  function openAffiliateConfirm(
    title: string,
    message: string,
    confirmText: string,
    fn: () => Promise<unknown>,
  ) {
    affiliateConfirmDialog.title = title;
    affiliateConfirmDialog.message = message;
    affiliateConfirmDialog.confirmText = confirmText;
    affiliateConfirmDialog.pending = fn;
    affiliateConfirmDialog.show = true;
  }

  async function handleAffiliateConfirm() {
    const fn = affiliateConfirmDialog.pending;
    affiliateConfirmDialog.show = false;
    affiliateConfirmDialog.pending = null;
    if (!fn) return;
    try {
      await fn();
      appStore.showSuccess(t("common.saved"));
      await loadAffiliateUsers();
    } catch (err) {
      appStore.showError(extractApiErrorMessage(err, t("common.error")));
    }
  }

  function cancelAffiliateConfirm() {
    affiliateConfirmDialog.show = false;
    affiliateConfirmDialog.pending = null;
  }

  // debounceTimer wires a single timer slot to a callback with a delay,
  // canceling any pending invocation. Used for type-as-you-go search inputs.
  function debounceTimer(slot: { searchTimer: number | null }, delayMs: number, run: () => void) {
    if (slot.searchTimer != null) window.clearTimeout(slot.searchTimer);
    slot.searchTimer = window.setTimeout(run, delayMs);
  }

  // parseRebateRate validates 0-100 numeric input. Returns the parsed number on
  // success, null when the field is empty (caller decides empty semantics), or
  // undefined on invalid input (after surfacing a toast).
  //
  // Accepts unknown because <input type="number"> makes Vue's v-model coerce
  // the value to Number on each keystroke (e.g. typing "30" lands a `30: number`
  // in state, not a `"30": string`). String("") and (30).trim() would crash, so
  // we normalize here instead of forcing every caller to remember.
  function parseRebateRate(raw: unknown): number | null | undefined {
    const s = String(raw ?? "").trim();
    if (s === "") return null;
    const parsed = Number(s);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
      appStore.showError(t("admin.settings.features.affiliate.modal.errorBadRate"));
      return undefined;
    }
    return parsed;
  }

  async function loadAffiliateUsers() {
    affiliateState.loading = true;
    try {
      const res = await affiliatesAPI.listUsers({
        page: affiliateState.page,
        page_size: affiliateState.pageSize,
        search: affiliateState.search,
      });
      affiliateState.entries = res.items ?? [];
      affiliateState.total = res.total ?? 0;
      // Drop selections that are no longer visible.
      const visibleIds = new Set(affiliateState.entries.map((e) => e.user_id));
      affiliateState.selected = affiliateState.selected.filter((id) => visibleIds.has(id));
    } catch (err) {
      appStore.showError(extractApiErrorMessage(err, t("common.error")));
    } finally {
      affiliateState.loading = false;
    }
  }

  function onAffiliateSearchInput() {
    debounceTimer(affiliateState, 300, () => {
      affiliateState.page = 1;
      loadAffiliateUsers();
    });
  }

  function changeAffiliatePage(page: number) {
    if (page < 1) return;
    affiliateState.page = page;
    loadAffiliateUsers();
  }

  function toggleAffiliateSelectAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    affiliateState.selected = checked ? affiliateState.entries.map((entry) => entry.user_id) : [];
  }

  function toggleAffiliateSelect(userId: number) {
    const idx = affiliateState.selected.indexOf(userId);
    if (idx >= 0) affiliateState.selected.splice(idx, 1);
    else affiliateState.selected.push(userId);
  }

  // openAffiliateModal opens the add/edit modal, prefilling fields from the
  // edited entry when present and resetting them otherwise.
  function openAffiliateModal(entry: AffiliateAdminEntry | null) {
    affiliateModal.open = true;
    affiliateModal.mode = entry ? "edit" : "add";
    affiliateModal.userQuery = "";
    affiliateModal.userResults = [];
    affiliateModal.selectedUser = null;
    affiliateModal.editingEntry = entry;
    affiliateModal.code = entry?.aff_code_custom ? entry.aff_code : "";
    affiliateModal.rate =
      entry?.aff_rebate_rate_percent != null ? String(entry.aff_rebate_rate_percent) : "";
  }

  function closeAffiliateModal() {
    affiliateModal.open = false;
    if (affiliateModal.searchTimer != null) {
      window.clearTimeout(affiliateModal.searchTimer);
      affiliateModal.searchTimer = null;
    }
  }

  function onAffiliateUserSearchInput() {
    const q = affiliateModal.userQuery.trim();
    if (!q) {
      affiliateModal.userResults = [];
      return;
    }
    debounceTimer(affiliateModal, 300, async () => {
      try {
        affiliateModal.userResults = await affiliatesAPI.lookupUsers(q);
      } catch (err) {
        appStore.showError(extractApiErrorMessage(err, t("common.error")));
      }
    });
  }

  // selectAffiliateUser picks a user from the dropdown and collapses the search
  // UI. Clearing the result list also clears the visual dropdown.
  function selectAffiliateUser(user: AffiliateSimpleUser) {
    affiliateModal.selectedUser = user;
    affiliateModal.userQuery = "";
    affiliateModal.userResults = [];
  }

  function clearSelectedAffiliateUser() {
    affiliateModal.selectedUser = null;
  }

  // affiliateModalCanSubmit guards the Save button: must have a user picked AND
  // produce at least one field change. Without this the admin could "save" an
  // empty payload that silently does nothing — the user reported exactly that
  // confusion.
  const affiliateModalCanSubmit = computed(() => {
    if (affiliateModal.mode === "add") {
      if (!affiliateModal.selectedUser) return false;
    } else if (!affiliateModal.editingEntry) {
      return false;
    }
    const codeFilled = affiliateModal.code.trim() !== "";
    const rateFilled = String(affiliateModal.rate ?? "").trim() !== "";
    if (codeFilled || rateFilled) return true;
    // Edit mode + empty rate input is a meaningful "clear" only if the user
    // currently has an exclusive rate to clear.
    return (
      affiliateModal.mode === "edit" &&
      affiliateModal.editingEntry?.aff_rebate_rate_percent != null
    );
  });

  async function submitAffiliateModal() {
    if (!affiliateModalCanSubmit.value) {
      // Should be unreachable because the button is disabled, but keep a guard.
      appStore.showError(t("admin.settings.features.affiliate.modal.errorEmpty"));
      return;
    }

    let userId: number;
    if (affiliateModal.mode === "add") {
      userId = affiliateModal.selectedUser!.id;
    } else {
      userId = affiliateModal.editingEntry!.user_id;
    }

    const payload: Parameters<typeof affiliatesAPI.updateUserSettings>[1] = {};
    const codeRaw = affiliateModal.code.trim();
    if (codeRaw) payload.aff_code = codeRaw.toUpperCase();

    const rateInput = parseRebateRate(affiliateModal.rate);
    if (rateInput === undefined) return; // toast already shown
    if (rateInput === null) {
      if (affiliateModal.mode === "edit" && affiliateModal.editingEntry?.aff_rebate_rate_percent != null) {
        payload.clear_rebate_rate = true;
      }
    } else {
      payload.aff_rebate_rate_percent = rateInput;
    }

    affiliateModal.saving = true;
    try {
      await affiliatesAPI.updateUserSettings(userId, payload);
      appStore.showSuccess(t("common.saved"));
      closeAffiliateModal();
      affiliateState.page = 1;
      await loadAffiliateUsers();
    } catch (err) {
      appStore.showError(extractApiErrorMessage(err, t("common.error")));
    } finally {
      affiliateModal.saving = false;
    }
  }

  // askResetAffiliateUser prompts via the project ConfirmDialog, then on confirm
  // calls the backend "reset all" endpoint that clears both the exclusive rate
  // AND regenerates the invite code as a system random one.
  function askResetAffiliateUser(entry: AffiliateAdminEntry) {
    openAffiliateConfirm(
      t("admin.settings.features.affiliate.customUsers.resetTitle"),
      t("admin.settings.features.affiliate.customUsers.resetMessage", {
        email: entry.email || `#${entry.user_id}`,
      }),
      t("common.delete"),
      () => affiliatesAPI.clearUserSettings(entry.user_id),
    );
  }

  function openAffiliateBatchModal() {
    if (affiliateState.selected.length === 0) return;
    affiliateBatchModal.open = true;
    affiliateBatchModal.rate = "";
  }

  async function submitAffiliateBatchModal() {
    const rateInput = parseRebateRate(affiliateBatchModal.rate);
    if (rateInput === undefined) return;
    const userIDs = [...affiliateState.selected];
    const payload: Parameters<typeof affiliatesAPI.batchSetRate>[0] =
      rateInput === null
        ? { user_ids: userIDs, clear: true }
        : { user_ids: userIDs, aff_rebate_rate_percent: rateInput };

    affiliateBatchModal.saving = true;
    try {
      await affiliatesAPI.batchSetRate(payload);
      appStore.showSuccess(t("common.saved"));
      affiliateBatchModal.open = false;
      affiliateState.selected = [];
      await loadAffiliateUsers();
    } catch (err) {
      appStore.showError(extractApiErrorMessage(err, t("common.error")));
    } finally {
      affiliateBatchModal.saving = false;
    }
  }

  // Load the per-user table the first time the affiliate switch is observed
  // as enabled. The form starts disabled and is updated to the server's value
  // after the settings load — so this fires either when the saved value is
  // truthy on first paint, or when the admin manually toggles it on.
  watch(
    () => form.affiliate_enabled,
    (enabled, prev) => {
      if (enabled && !prev) {
        loadAffiliateUsers();
      }
    },
  );

  // bypass_registration 与身份同步三开关仅在 internal_only 模式下生效。切换 policy 到其它值时，
  // 立即把相关字段重置为 false，避免保存请求里残留旧值。后端 admin handler 与
  // 配置加载层都有 coerce 兜底，这里是 UX 层的同步而非安全防线。

  return {
    affiliateBatchModal,
    affiliateConfirmDialog,
    affiliateModal,
    affiliateModalCanSubmit,
    affiliateState,
    askResetAffiliateUser,
    cancelAffiliateConfirm,
    changeAffiliatePage,
    clearSelectedAffiliateUser,
    closeAffiliateModal,
    handleAffiliateConfirm,
    onAffiliateSearchInput,
    onAffiliateUserSearchInput,
    openAffiliateBatchModal,
    openAffiliateModal,
    selectAffiliateUser,
    submitAffiliateBatchModal,
    submitAffiliateModal,
    toggleAffiliateSelect,
    toggleAffiliateSelectAll,
  }
}
