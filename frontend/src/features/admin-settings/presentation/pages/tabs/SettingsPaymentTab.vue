<template>
  <div class="space-y-6">
    <!-- Payment System Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.payment.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.payment.description") }}
          <a
              :href="paymentGuideHref"
              target="_blank"
              rel="noopener noreferrer"
              class="ml-2 inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <svg class="mr-0.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            {{ t("admin.settings.payment.configGuide") }}
          </a>
        </p>
      </div>
      <div class="space-y-4 p-6">
        <!-- Enable toggle -->
        <div class="flex items-center justify-between">
          <div>
            <label class="font-medium text-gray-900 dark:text-white">{{ t("admin.settings.payment.enabled") }}</label>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.payment.enabledHint") }}</p>
          </div>
          <Toggle v-model="form.paymentEnabled"/>
        </div>
        <template v-if="form.paymentEnabled">
          <!-- Row 1: Product name -->
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="input-label">{{ t("admin.settings.payment.productNamePrefix") }}</label>
              <input v-model="form.paymentProductNamePrefix" type="text" class="input" placeholder="Sub2API"/>
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.productNameSuffix") }}</label>
              <input v-model="form.paymentProductNameSuffix" type="text" class="input" placeholder="CNY"/>
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.preview") }}</label>
              <div class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-dark-600 dark:bg-dark-800 dark:text-gray-300">
                {{ (form.paymentProductNamePrefix || "Sub2API") + " 100 " + (form.paymentProductNameSuffix || "CNY") }}
              </div>
            </div>
          </div>
          <!-- Row 2: Balance toggle + amounts -->
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div>
              <label class="input-label">{{ t("admin.settings.payment.minAmount") }}</label>
              <input
                  :value="form.paymentMinAmount || ''"
                  @input="form.paymentMinAmount = parseFloat(($event.target as HTMLInputElement).value) || 0"
                  type="number" step="0.01" min="0" class="input"
                  :placeholder="t('admin.settings.payment.noLimit')"
              />
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.maxAmount") }}</label>
              <input
                  :value="form.paymentMaxAmount || ''"
                  @input="form.paymentMaxAmount = parseFloat(($event.target as HTMLInputElement).value) || 0"
                  type="number" step="0.01" min="0" class="input"
                  :placeholder="t('admin.settings.payment.noLimit')"
              />
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.dailyLimit") }}</label>
              <input
                  :value="form.paymentDailyLimit || ''"
                  @input="form.paymentDailyLimit = parseFloat(($event.target as HTMLInputElement).value) || 0"
                  type="number" step="0.01" min="0" class="input"
                  :placeholder="t('admin.settings.payment.noLimit')"
              />
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.balanceRechargeMultiplier") }}</label>
              <input
                  :value="form.paymentBalanceRechargeMultiplier || ''"
                  @input="form.paymentBalanceRechargeMultiplier = parseFloat(($event.target as HTMLInputElement).value) || 1"
                  type="number" step="0.01" min="0.01" class="input"
              />
              <p class="mt-0.5 text-xs text-gray-400">{{ t("admin.settings.payment.balanceRechargeMultiplierHint") }}</p>
              <p class="mt-1 text-xs font-medium text-primary-600 dark:text-primary-400">
                {{ t("admin.settings.payment.balanceRechargePreview", {usd: (Number(form.paymentBalanceRechargeMultiplier) || 1).toFixed(2)}) }}
              </p>
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.subscriptionUsdToCnyRate") }}</label>
              <input
                  :value="form.paymentSubscriptionUsdToCnyRate || ''"
                  @input="form.paymentSubscriptionUsdToCnyRate = parseFloat(($event.target as HTMLInputElement).value) || 0"
                  type="number" step="0.01" min="0" class="input"
                  :placeholder="t('admin.settings.payment.subscriptionUsdToCnyRateDisabled')"
              />
              <p class="mt-0.5 text-xs text-gray-400">{{ t("admin.settings.payment.subscriptionUsdToCnyRateHint") }}</p>
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.rechargeFeeRate") }}</label>
              <div class="relative">
                <input
                    :value="form.paymentRechargeFeeRate ?? ''"
                    @input="form.paymentRechargeFeeRate = Math.min(100, Math.max(0, Math.round(parseFloat(($event.target as HTMLInputElement).value || '0') * 100) / 100))"
                    type="number" step="0.01" min="0" max="100" class="input pr-8"
                />
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">%</span>
              </div>
              <p class="mt-0.5 text-xs text-gray-400">{{ t("admin.settings.payment.rechargeFeeRateHint") }}</p>
              <p v-if="(Number(form.paymentRechargeFeeRate) || 0) > 0" class="mt-1 text-xs font-medium text-primary-600 dark:text-primary-400">
                {{ t("admin.settings.payment.rechargeFeePreview", {fee: (Number(form.paymentRechargeFeeRate) || 0).toFixed(2)}) }}
              </p>
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.orderTimeout") }} <span class="text-red-500">*</span></label>
              <input v-model.number="form.paymentOrderTimeoutMinutes" type="number" min="1" class="input" required/>
              <p class="mt-0.5 text-xs text-gray-400">{{ t("admin.settings.payment.orderTimeoutHint") }}</p>
            </div>
          </div>
          <!-- Row 3: Pending orders + load balance + cancel rate limit -->
          <div class="flex flex-wrap items-end gap-4">
            <div class="w-28">
              <label class="input-label">{{ t("admin.settings.payment.maxPendingOrders") }}</label>
              <input v-model.number="form.paymentMaxPendingOrders" type="number" min="1" class="input"/>
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.loadBalanceStrategy") }}</label>
              <Select v-model="form.paymentLoadBalanceStrategy" :options="loadBalanceOptions" class="w-40"/>
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.cancelRateLimit") }}</label>
              <div class="flex items-center gap-2">
                <button
                    type="button"
                    :class="['relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2', form.paymentCancelRateLimitEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600']"
                    @click="form.paymentCancelRateLimitEnabled = !form.paymentCancelRateLimitEnabled"
                >
                  <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', form.paymentCancelRateLimitEnabled ? 'translate-x-5' : 'translate-x-0']"/>
                </button>
                <Select v-model="form.paymentCancelRateLimitWindowMode" :options="cancelRateLimitModeOptions" class="w-24" :disabled="!form.paymentCancelRateLimitEnabled"/>
                <span :class="['text-sm whitespace-nowrap', form.paymentCancelRateLimitEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600']">{{ t("admin.settings.payment.cancelRateLimitEvery") }}</span>
                <input v-model.number="form.paymentCancelRateLimitWindow" type="number" min="1" required class="input w-14 text-center" :disabled="!form.paymentCancelRateLimitEnabled"/>
                <Select v-model="form.paymentCancelRateLimitUnit" :options="cancelRateLimitUnitOptions" class="w-28" :disabled="!form.paymentCancelRateLimitEnabled"/>
                <span :class="['text-sm whitespace-nowrap', form.paymentCancelRateLimitEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600']">{{ t("admin.settings.payment.cancelRateLimitAllowMax") }}</span>
                <input v-model.number="form.paymentCancelRateLimitMax" type="number" min="1" required class="input w-14 text-center" :disabled="!form.paymentCancelRateLimitEnabled"/>
                <span :class="['text-sm whitespace-nowrap', form.paymentCancelRateLimitEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600']">{{ t("admin.settings.payment.cancelRateLimitTimes") }}</span>
              </div>
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.alipayForceQRCode") }}</label>
              <div class="flex items-center gap-2">
                <button
                    type="button"
                    :class="['relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2', form.paymentAlipayForceQrcode ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600']"
                    @click="form.paymentAlipayForceQrcode = !form.paymentAlipayForceQrcode"
                >
                  <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', form.paymentAlipayForceQrcode ? 'translate-x-5' : 'translate-x-0']"/>
                </button>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ t("admin.settings.payment.alipayForceQRCodeHint") }}</span>
              </div>
            </div>
          </div>
          <!-- Row 4: Enabled payment types -->
          <div>
            <label class="input-label">{{ t("admin.settings.payment.enabledPaymentTypes") }}</label>
            <div class="mt-1.5 flex flex-wrap gap-2">
              <button
                  v-for="pt in allPaymentTypes"
                  :key="pt.value"
                  type="button"
                  @click="togglePaymentType(pt.value)"
                  :class="['rounded-lg border px-3 py-1.5 text-sm font-medium transition-all', isPaymentTypeEnabled(pt.value) ? 'border-primary-500 bg-primary-500 text-white shadow-sm' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:border-dark-600 dark:bg-dark-800 dark:text-gray-300 dark:hover:border-dark-500']"
              >
                {{ pt.label }}
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
              {{ t("admin.settings.payment.enabledPaymentTypesHint") }}
              <a
                  :href="paymentMethodsHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ml-1 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {{ t("admin.settings.payment.findProvider") }}
                <svg class="mb-0.5 ml-0.5 inline h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </p>
          </div>
          <!-- Row 5: Help image + text -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="input-label">{{ t("admin.settings.payment.helpImage") }}</label>
              <ImageUpload
                  v-model="form.paymentHelpImageUrl"
                  :upload-label="t('admin.settings.site.uploadImage')"
                  :remove-label="t('admin.settings.site.remove')"
                  :placeholder="t('admin.settings.payment.helpImagePlaceholder')"
              />
            </div>
            <div>
              <label class="input-label">{{ t("admin.settings.payment.helpText") }}</label>
              <textarea
                  v-model="form.paymentHelpText"
                  rows="3"
                  class="input"
                  :placeholder="t('admin.settings.payment.helpTextPlaceholder')"
              ></textarea>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Provider Management -->
    <PaymentProviderList
        v-if="form.paymentEnabled"
        :providers="providers"
        :loading="providersLoading"
        :can-create="hasAnyPaymentTypeEnabled"
        :enabled-payment-types="form.paymentEnabledTypes"
        :all-payment-types="allPaymentTypes"
        :redirect-label="t('admin.settings.payment.easypayRedirect')"
        @refresh="loadProviders"
        @create="openCreateProvider"
        @edit="openEditProvider"
        @delete="confirmDeleteProvider"
        @toggle-field="handleToggleField"
        @toggle-type="handleToggleType"
        @reorder="handleReorderProviders"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import Select from "@/common/widgets/forms/Select.vue";
import Toggle from "@/common/widgets/forms/Toggle.vue";
import ImageUpload from "@/common/widgets/data/ImageUpload.vue";
import PaymentProviderList from "@/features/billing/presentation/widgets/PaymentProviderList.vue";
import {normalizeVisibleMethod} from "@/features/billing/presentation/utils/paymentFlowResolver";
import type {ProviderInstance} from "@/features/admin-orders/domain/models/providerInstance";
import type {UpdateProviderInstanceRequest} from "@/features/admin-orders/data/requests_models/updateProviderInstanceRequest";
import {useAdminOrdersQueryStore} from "@/features/admin-orders/presentation/stores/adminOrdersQueryStore";
import {useAdminOrdersActionStore} from "@/features/admin-orders/presentation/stores/adminOrdersActionStore";
import {useAppStore} from "@/core/stores/appStore";
import {extractI18nErrorMessage} from "@/core/utils/apiError";

const props = defineProps<{ form: Record<string, any>; saving: boolean; loadFailed: boolean }>();

const emit = defineEmits<{
  "create-provider": [];
  "edit-provider": [provider: ProviderInstance];
  "delete-provider": [provider: ProviderInstance];
}>();

const {t, locale} = useI18n();
const appStore = useAppStore();
const adminOrdersQueryStore = useAdminOrdersQueryStore();
const adminOrdersActionStore = useAdminOrdersActionStore();

// ── computed hrefs ──────────────────────────────────────────────────────────

const paymentGuideHref = computed(() =>
    locale.value.startsWith("zh")
        ? "https://github.com/Wei-Shaw/sub2api/blob/main/docs/PAYMENT_CN.md"
        : "https://github.com/Wei-Shaw/sub2api/blob/main/docs/PAYMENT.md",
);

const paymentMethodsHref = computed(() =>
    locale.value.startsWith("zh")
        ? "https://github.com/Wei-Shaw/sub2api/blob/main/docs/PAYMENT_CN.md#支持的支付方式"
        : "https://github.com/Wei-Shaw/sub2api/blob/main/docs/PAYMENT.md#supported-payment-methods",
);

// ── payment types ────────────────────────────────────────────────────────────

const allPaymentTypes = computed(() => [
  {value: "easypay", label: t("payment.methods.easypay")},
  {value: "alipay", label: t("payment.methods.alipay")},
  {value: "wxpay", label: t("payment.methods.wxpay")},
  {value: "stripe", label: t("payment.methods.stripe")},
  {value: "airwallex", label: t("payment.methods.airwallex")},
]);

function isPaymentTypeEnabled(type: string): boolean {
  return (props.form.paymentEnabledTypes as string[]).includes(type);
}

const hasAnyPaymentTypeEnabled = computed(
    () => (props.form.paymentEnabledTypes as string[]).length > 0,
);

function togglePaymentType(type: string) {
  const current = props.form.paymentEnabledTypes as string[];
  if (current.includes(type)) {
    props.form.paymentEnabledTypes = current.filter((t) => t !== type);
    disableProvidersByType(type);
  } else {
    props.form.paymentEnabledTypes = [...current, type];
  }
}

// ── select options ───────────────────────────────────────────────────────────

const loadBalanceOptions = computed(() => [
  {value: "round-robin", label: t("admin.settings.payment.strategyRoundRobin")},
  {value: "least-amount", label: t("admin.settings.payment.strategyLeastAmount")},
]);

const cancelRateLimitUnitOptions = computed(() => [
  {value: "minute", label: t("admin.settings.payment.cancelRateLimitUnitMinute")},
  {value: "hour", label: t("admin.settings.payment.cancelRateLimitUnitHour")},
  {value: "day", label: t("admin.settings.payment.cancelRateLimitUnitDay")},
]);

const cancelRateLimitModeOptions = computed(() => [
  {value: "rolling", label: t("admin.settings.payment.cancelRateLimitWindowModeRolling")},
  {value: "fixed", label: t("admin.settings.payment.cancelRateLimitWindowModeFixed")},
]);

// ── provider management ──────────────────────────────────────────────────────

const providersLoading = ref(false);
const providers = ref<ProviderInstance[]>([]);

const providerKeyOptions = computed(() => [
  {value: "easypay", label: t("admin.settings.payment.providerEasypay")},
  {value: "alipay", label: t("admin.settings.payment.providerAlipay")},
  {value: "wxpay", label: t("admin.settings.payment.providerWxpay")},
  {value: "stripe", label: t("admin.settings.payment.providerStripe")},
  {value: "airwallex", label: t("admin.settings.payment.providerAirwallex")},
]);

const enabledProviderKeyOptions = computed(() => {
  const enabled = props.form.paymentEnabledTypes as string[];
  return providerKeyOptions.value.filter((opt) => enabled?.includes(opt.value));
});

type ProviderEnablementCandidate = Pick<
    ProviderInstance,
    "id" | "providerKey" | "supportedTypes" | "enabled" | "name"
>;

function getProviderVisibleMethods(
    provider: ProviderEnablementCandidate,
): Array<"alipay" | "wxpay"> {
  if (!provider.enabled) return [];

  const supportedTypes = Array.isArray(provider.supportedTypes) ? provider.supportedTypes : [];
  const methods = new Set<"alipay" | "wxpay">();
  const addMethod = (type: string) => {
    const method = normalizeVisibleMethod(type);
    if (method === "alipay" || method === "wxpay") methods.add(method);
  };

  if (provider.providerKey === "alipay") {
    if (supportedTypes.length === 0) {
      methods.add("alipay");
    } else {
      supportedTypes.forEach((type) => {
        if (normalizeVisibleMethod(type) === "alipay") methods.add("alipay");
      });
    }
  } else if (provider.providerKey === "wxpay") {
    if (supportedTypes.length === 0) {
      methods.add("wxpay");
    } else {
      supportedTypes.forEach((type) => {
        if (normalizeVisibleMethod(type) === "wxpay") methods.add("wxpay");
      });
    }
  } else if (provider.providerKey === "easypay") {
    supportedTypes.forEach(addMethod);
  }

  return Array.from(methods);
}

function findProviderEnablementConflict(
    candidate: ProviderEnablementCandidate,
): {method: "alipay" | "wxpay"; conflicting: ProviderInstance} | null {
  const claimedMethods = getProviderVisibleMethods(candidate);
  if (claimedMethods.length === 0) return null;

  for (const other of providers.value) {
    if (other.id === candidate.id || !other.enabled) continue;
    const otherMethods = getProviderVisibleMethods(other);
    const matchedMethod = claimedMethods.find((method) => otherMethods.includes(method));
    if (matchedMethod) return {method: matchedMethod, conflicting: other};
  }
  return null;
}

function showProviderEnablementConflict(
    conflict: {method: "alipay" | "wxpay"; conflicting: ProviderInstance},
) {
  appStore.showError(
      t("admin.settings.payment.enableConflict", {
        method: t(`payment.methods.${conflict.method}`),
        provider: conflict.conflicting.name,
      }),
  );
}

function slog(...args: unknown[]) {
  console.warn("[payment]", ...args);
}

async function disableProvidersByType(type: string) {
  const matching = providers.value.filter((p) => p.providerKey === type && p.enabled);
  for (const p of matching) {
    try {
      await adminOrdersActionStore.updateProvider(p.id, {enabled: false});
      p.enabled = false;
    } catch (err: unknown) {
      slog("disable provider failed", p.id, err);
    }
  }
}

async function loadProviders() {
  providersLoading.value = true;
  try {
    const res = await adminOrdersQueryStore.fetchProviders();
    providers.value = (res || []).map((p) => ({
      ...p,
      supportedTypes: Array.isArray(p.supportedTypes) ? p.supportedTypes : [],
    }));
  } catch (err: unknown) {
    appStore.showError(extractI18nErrorMessage(err, t, "payment.errors", t("common.error")));
  } finally {
    providersLoading.value = false;
  }
}

function openCreateProvider() {
  emit("create-provider");
}

function openEditProvider(provider: ProviderInstance) {
  emit("edit-provider", provider);
}

function confirmDeleteProvider(provider: ProviderInstance) {
  emit("delete-provider", provider);
}

function toUpdateProviderRequest(payload: Partial<ProviderInstance>): UpdateProviderInstanceRequest {
  const req: UpdateProviderInstanceRequest = {};
  if (payload.providerKey !== undefined) req.provider_key = payload.providerKey;
  if (payload.name !== undefined) req.name = payload.name;
  if (payload.config !== undefined) req.config = payload.config;
  if (payload.supportedTypes !== undefined) req.supported_types = payload.supportedTypes;
  if (payload.enabled !== undefined) req.enabled = payload.enabled;
  if (payload.paymentMode !== undefined) req.payment_mode = payload.paymentMode;
  if (payload.refundEnabled !== undefined) req.refund_enabled = payload.refundEnabled;
  if (payload.allowUserRefund !== undefined) req.allow_user_refund = payload.allowUserRefund;
  if (payload.limits !== undefined) req.limits = payload.limits;
  if (payload.sortOrder !== undefined) req.sort_order = payload.sortOrder;
  return req;
}

async function handleToggleField(
    provider: ProviderInstance,
    field: "enabled" | "refundEnabled" | "allowUserRefund",
) {
  let newValue: boolean;
  if (field === "enabled") newValue = !provider.enabled;
  else if (field === "refundEnabled") newValue = !provider.refundEnabled;
  else newValue = !provider.allowUserRefund;

  if (field === "enabled" && newValue) {
    const conflict = findProviderEnablementConflict({
      id: provider.id,
      providerKey: provider.providerKey,
      supportedTypes: provider.supportedTypes,
      enabled: true,
      name: provider.name,
    });
    if (conflict) {
      showProviderEnablementConflict(conflict);
      return;
    }
  }

  const payload: Partial<ProviderInstance> = {[field]: newValue};
  if (field === "refundEnabled" && !newValue) {
    payload.allowUserRefund = false;
  }
  try {
    await adminOrdersActionStore.updateProvider(provider.id, toUpdateProviderRequest(payload));
    await loadProviders();
  } catch (err: unknown) {
    appStore.showError(extractI18nErrorMessage(err, t, "payment.errors", t("common.error")));
  }
}

async function handleToggleType(provider: ProviderInstance, type: string) {
  const currentTypes = Array.isArray(provider.supportedTypes) ? provider.supportedTypes : [];
  const updated = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
  const conflict = findProviderEnablementConflict({
    id: provider.id,
    providerKey: provider.providerKey,
    supportedTypes: updated,
    enabled: provider.enabled,
    name: provider.name,
  });
  if (conflict) {
    showProviderEnablementConflict(conflict);
    return;
  }
  try {
    await adminOrdersActionStore.updateProvider(provider.id, {supported_types: updated});
    await loadProviders();
  } catch (err: unknown) {
    appStore.showError(extractI18nErrorMessage(err, t, "payment.errors", t("common.error")));
  }
}

async function handleReorderProviders(updates: {id: number; sortOrder: number}[]) {
  try {
    await Promise.all(
        updates.map((u) =>
            adminOrdersActionStore.updateProvider(u.id, {sort_order: u.sortOrder}),
        ),
    );
    await loadProviders();
  } catch (err: unknown) {
    appStore.showError(extractI18nErrorMessage(err, t, "payment.errors", t("common.error")));
    await loadProviders();
  }
}

// ── expose for parent (provider dialog needs enabled options + reload) ────────

defineExpose({
  loadProviders,
  enabledProviderKeyOptions,
  providers,
});

onMounted(() => {
  loadProviders();
});
</script>
