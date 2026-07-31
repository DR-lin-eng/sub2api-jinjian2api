<template>
  <div class="space-y-6">
    <!-- Default Settings -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.defaults.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.defaults.description") }}
        </p>
      </div>
      <div class="space-y-6 p-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.defaults.defaultBalance") }}
            </label>
            <input
                v-model.number="(form as any).defaultBalance"
                type="number"
                step="0.01"
                min="0"
                class="input"
                placeholder="0.00"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.defaults.defaultBalanceHint") }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.defaults.defaultConcurrency") }}
            </label>
            <input
                v-model.number="(form as any).defaultConcurrency"
                type="number"
                min="1"
                class="input"
                placeholder="1"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.defaults.defaultConcurrencyHint") }}
            </p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("admin.settings.defaults.defaultUserRpmLimit") }}
            </label>
            <input
                v-model.number="(form as any).defaultUserRpmLimit"
                type="number"
                min="0"
                step="1"
                class="input"
                placeholder="0"
            />
            <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.defaults.defaultUserRpmLimitHint") }}
            </p>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4 dark:border-dark-700">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <label class="font-medium text-gray-900 dark:text-white">
                {{ t("admin.settings.defaults.defaultSubscriptions") }}
              </label>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.defaults.defaultSubscriptionsHint") }}
              </p>
            </div>
            <button
                type="button"
                class="btn btn-secondary btn-sm"
                @click="addDefaultSubscription"
                :disabled="subscriptionGroups.length === 0"
            >
              {{ t("admin.settings.defaults.addDefaultSubscription") }}
            </button>
          </div>

          <div
              v-if="(form as any).defaultSubscriptions.length === 0"
              class="rounded border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 dark:border-dark-600 dark:text-gray-400"
          >
            {{ t("admin.settings.defaults.defaultSubscriptionsEmpty") }}
          </div>

          <div v-else class="space-y-3">
            <div
                v-for="(item, index) in (form as any).defaultSubscriptions"
                :key="`default-sub-${index}`"
                class="grid grid-cols-1 gap-3 rounded border border-gray-200 p-3 md:grid-cols-[1fr_160px_auto] dark:border-dark-600"
            >
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{ t("admin.settings.defaults.subscriptionGroup") }}
                </label>
                <Select
                    v-model="item.groupId"
                    class="default-sub-group-select"
                    :options="defaultSubscriptionGroupOptions"
                    :placeholder="t('admin.settings.defaults.subscriptionGroup')"
                >
                  <template #selected="{ option }">
                    <GroupBadge
                        v-if="option"
                        :name="(option as unknown as DefaultSubscriptionGroupOption).label"
                        :platform="(option as unknown as DefaultSubscriptionGroupOption).platform"
                        :subscription-type="(option as unknown as DefaultSubscriptionGroupOption).subscriptionType"
                        :rate-multiplier="(option as unknown as DefaultSubscriptionGroupOption).rate"
                    />
                    <span v-else class="text-gray-400">
                      {{ t("admin.settings.defaults.subscriptionGroup") }}
                    </span>
                  </template>
                  <template #option="{ option, selected }">
                    <GroupOptionItem
                        :name="(option as unknown as DefaultSubscriptionGroupOption).label"
                        :platform="(option as unknown as DefaultSubscriptionGroupOption).platform"
                        :subscription-type="(option as unknown as DefaultSubscriptionGroupOption).subscriptionType"
                        :rate-multiplier="(option as unknown as DefaultSubscriptionGroupOption).rate"
                        :description="(option as unknown as DefaultSubscriptionGroupOption).description"
                        :selected="selected"
                    />
                  </template>
                </Select>
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{ t("admin.settings.defaults.subscriptionValidityDays") }}
                </label>
                <input
                    v-model.number="item.validityDays"
                    type="number"
                    min="1"
                    max="36500"
                    class="input h-[42px]"
                />
              </div>
              <div class="flex items-end">
                <button
                    type="button"
                    class="btn btn-secondary default-sub-delete-btn w-full text-red-600 hover:text-red-700 dark:text-red-400"
                    @click="removeDefaultSubscription(index)"
                >
                  {{ t("common.delete") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 系统全局默认平台限额矩阵 -->
        <div class="border-t border-gray-100 pt-4 dark:border-dark-700">
          <div class="mb-3">
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t("admin.settings.defaults.defaultPlatformQuotas") }}
            </label>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.defaults.defaultPlatformQuotasHint") }}
            </p>
            <p class="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
              {{ t("admin.settings.defaults.platformQuotaNotice") }}
            </p>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
              <tr class="text-left text-xs text-gray-500 dark:text-gray-400">
                <th class="pb-2 pr-4 font-medium">{{ t("admin.settings.platformQuota.platform") }}</th>
                <th class="pb-2 pr-4 font-medium">{{ t("admin.settings.platformQuota.daily") }}</th>
                <th class="pb-2 pr-4 font-medium">{{ t("admin.settings.platformQuota.weekly") }}</th>
                <th class="pb-2 font-medium">{{ t("admin.settings.platformQuota.monthly") }}</th>
              </tr>
              </thead>
              <tbody class="space-y-2">
              <tr v-for="p in (['anthropic', 'openai', 'gemini', 'antigravity', 'grok'] as const)" :key="p"
                  class="align-top">
                <td class="pr-4 py-1">
                  <span class="font-mono text-xs text-gray-700 dark:text-gray-300">{{ p }}</span>
                </td>
                <td class="pr-4 py-1">
                  <input
                      v-model.number="(form as any).default_platform_quotas[p]!.daily"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input h-8 w-28 text-sm"
                      :placeholder="t('admin.settings.platformQuota.placeholder')"
                  />
                </td>
                <td class="pr-4 py-1">
                  <input
                      v-model.number="(form as any).default_platform_quotas[p]!.weekly"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input h-8 w-28 text-sm"
                      :placeholder="t('admin.settings.platformQuota.placeholder')"
                  />
                </td>
                <td class="py-1">
                  <input
                      v-model.number="(form as any).default_platform_quotas[p]!.monthly"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input h-8 w-28 text-sm"
                      :placeholder="t('admin.settings.platformQuota.placeholder')"
                  />
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- /全局平台限额矩阵 -->
      </div>
    </div>

    <!-- Auth Source Defaults -->
    <div class="card">
      <div class="border-b border-gray-100 px-6 py-4 dark:border-dark-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("admin.settings.authSourceDefaults.title") }}
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.settings.authSourceDefaults.description") }}
        </p>
      </div>
      <div class="space-y-6 p-6">
        <div
            class="flex items-center justify-between rounded border border-gray-200 px-4 py-3 dark:border-dark-700"
        >
          <div>
            <label class="font-medium text-gray-900 dark:text-white">
              {{ t("admin.settings.authSourceDefaults.requireEmailLabel") }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("admin.settings.authSourceDefaults.requireEmailHint") }}
            </p>
          </div>
          <Toggle v-model="(form as any).force_email_on_third_party_signup"/>
        </div>

        <div class="space-y-4">
          <div
              v-for="authSource in authSourceDefaultsMeta"
              :key="authSource.source"
              class="rounded-xl border border-gray-200 p-4 dark:border-dark-700"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ authSource.title }}
                </div>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ authSource.description }}
                </p>
              </div>
              <Toggle
                  v-model="authSourceDefaults[authSource.source].grantOnSignup"
                  :data-testid="`auth-source-${authSource.source}-enabled`"
              />
            </div>

            <div
                v-if="authSourceDefaults[authSource.source].grantOnSignup"
                :data-testid="`auth-source-${authSource.source}-panel`"
                class="mt-4 space-y-4 border-t border-gray-100 pt-4 dark:border-dark-700"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t("admin.settings.authSourceDefaults.enabledHint") }}
              </p>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t("admin.settings.defaults.defaultBalance") }}
                  </label>
                  <input
                      v-model.number="authSourceDefaults[authSource.source].balance"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input"
                      placeholder="0.00"
                  />
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t("admin.settings.defaults.defaultConcurrency") }}
                  </label>
                  <input
                      v-model.number="authSourceDefaults[authSource.source].concurrency"
                      type="number"
                      min="1"
                      class="input"
                      placeholder="5"
                  />
                </div>
              </div>

              <div
                  class="flex items-center justify-between rounded border border-gray-200 px-4 py-3 dark:border-dark-700"
              >
                <div>
                  <label class="font-medium text-gray-900 dark:text-white">
                    {{ t("admin.settings.authSourceDefaults.grantOnFirstBindLabel") }}
                  </label>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {{ t("admin.settings.authSourceDefaults.grantOnFirstBindHint") }}
                  </p>
                </div>
                <Toggle v-model="authSourceDefaults[authSource.source].grantOnFirstBind"/>
              </div>

              <div class="mb-3 flex items-center justify-between">
                <div>
                  <label class="font-medium text-gray-900 dark:text-white">
                    {{ t("admin.settings.authSourceDefaults.defaultSubscriptionsLabel") }}
                  </label>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ t("admin.settings.authSourceDefaults.defaultSubscriptionsHint") }}
                  </p>
                </div>
                <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    @click="addAuthSourceDefaultSubscription(authSource.source)"
                    :disabled="subscriptionGroups.length === 0"
                >
                  {{ t("admin.settings.defaults.addDefaultSubscription") }}
                </button>
              </div>

              <div
                  v-if="authSourceDefaults[authSource.source].subscriptions.length === 0"
                  class="rounded border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 dark:border-dark-600 dark:text-gray-400"
              >
                {{ t("admin.settings.authSourceDefaults.noSourceSubscriptions") }}
              </div>

              <div v-else class="space-y-3">
                <div
                    v-for="(item, index) in authSourceDefaults[authSource.source].subscriptions"
                    :key="`${authSource.source}-sub-${index}`"
                    class="grid grid-cols-1 gap-3 rounded border border-gray-200 p-3 md:grid-cols-[1fr_160px_auto] dark:border-dark-600"
                >
                  <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                      {{ t("admin.settings.defaults.subscriptionGroup") }}
                    </label>
                    <Select
                        v-model="item.groupId"
                        class="default-sub-group-select"
                        :options="defaultSubscriptionGroupOptions"
                        :placeholder="t('admin.settings.defaults.subscriptionGroup')"
                    >
                      <template #selected="{ option }">
                        <GroupBadge
                            v-if="option"
                            :name="(option as unknown as DefaultSubscriptionGroupOption).label"
                            :platform="(option as unknown as DefaultSubscriptionGroupOption).platform"
                            :subscription-type="(option as unknown as DefaultSubscriptionGroupOption).subscriptionType"
                            :rate-multiplier="(option as unknown as DefaultSubscriptionGroupOption).rate"
                        />
                        <span v-else class="text-gray-400">
                          {{ t("admin.settings.defaults.subscriptionGroup") }}
                        </span>
                      </template>
                      <template #option="{ option, selected }">
                        <GroupOptionItem
                            :name="(option as unknown as DefaultSubscriptionGroupOption).label"
                            :platform="(option as unknown as DefaultSubscriptionGroupOption).platform"
                            :subscription-type="(option as unknown as DefaultSubscriptionGroupOption).subscriptionType"
                            :rate-multiplier="(option as unknown as DefaultSubscriptionGroupOption).rate"
                            :description="(option as unknown as DefaultSubscriptionGroupOption).description"
                            :selected="selected"
                        />
                      </template>
                    </Select>
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                      {{ t("admin.settings.defaults.subscriptionValidityDays") }}
                    </label>
                    <input
                        v-model.number="item.validityDays"
                        type="number"
                        min="1"
                        max="36500"
                        class="input h-[42px]"
                    />
                  </div>
                  <div class="flex items-end">
                    <button
                        type="button"
                        class="btn btn-secondary w-full text-red-600 hover:text-red-700 dark:text-red-400"
                        @click="removeAuthSourceDefaultSubscription(authSource.source, index)"
                    >
                      {{ t("common.delete") }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- auth source 平台限额覆盖区块 -->
              <div class="border-t border-gray-100 pt-4 dark:border-dark-700">
                <div class="mb-3">
                  <label class="font-medium text-gray-900 dark:text-white">
                    {{ t("admin.settings.authSourceDefaults.platformQuotasOverride") }}
                  </label>
                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {{ t("admin.settings.authSourceDefaults.platformQuotasOverrideHint") }}
                  </p>
                </div>
                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <thead>
                    <tr class="text-left text-xs text-gray-500 dark:text-gray-400">
                      <th class="pb-2 pr-4 font-medium">{{ t("admin.settings.platformQuota.platform") }}</th>
                      <th class="pb-2 pr-4 font-medium">{{ t("admin.settings.platformQuota.daily") }}</th>
                      <th class="pb-2 pr-4 font-medium">{{ t("admin.settings.platformQuota.weekly") }}</th>
                      <th class="pb-2 font-medium">{{ t("admin.settings.platformQuota.monthly") }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="p in (['anthropic', 'openai', 'gemini', 'antigravity', 'grok'] as const)"
                        :key="`${authSource.source}-pq-${p}`" class="align-top">
                      <td class="pr-4 py-1">
                        <span class="font-mono text-xs text-gray-700 dark:text-gray-300">{{ p }}</span>
                      </td>
                      <td class="pr-4 py-1">
                        <input
                            v-model.number="authSourceDefaults[authSource.source].platformQuotas[p]!.daily"
                            type="number"
                            step="0.01"
                            min="0"
                            class="input h-8 w-28 text-sm"
                            :placeholder="t('admin.settings.platformQuota.placeholder')"
                        />
                      </td>
                      <td class="pr-4 py-1">
                        <input
                            v-model.number="authSourceDefaults[authSource.source].platformQuotas[p]!.weekly"
                            type="number"
                            step="0.01"
                            min="0"
                            class="input h-8 w-28 text-sm"
                            :placeholder="t('admin.settings.platformQuota.placeholder')"
                        />
                      </td>
                      <td class="py-1">
                        <input
                            v-model.number="authSourceDefaults[authSource.source].platformQuotas[p]!.monthly"
                            type="number"
                            step="0.01"
                            min="0"
                            class="input h-8 w-28 text-sm"
                            :placeholder="t('admin.settings.platformQuota.placeholder')"
                        />
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- /auth source 平台限额覆盖区块 -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { buildAuthSourceDefaultsState } from "@/features/admin-settings/presentation/utils/adminSettingsUtils";
import type { AuthSourceDefaultsState } from "@/features/admin-settings/domain/models/adminSettings";
import type { AuthSourceType } from "@/features/admin-settings/enums/authSourceType";
import type { DefaultSubscriptionSetting } from "@/features/admin-settings/domain/models/defaultSubscriptionSetting";
import type { AdminGroup } from "@/features/admin-groups/domain/models/adminGroup";
import { useAdminGroups } from "@/features/admin-groups/presentation/composables/useAdminGroups";
import Select from "@/common/widgets/forms/Select.vue";
import Toggle from "@/common/widgets/forms/Toggle.vue";
import GroupBadge from "@/common/widgets/data/GroupBadge.vue";
import GroupOptionItem from "@/common/widgets/data/GroupOptionItem.vue";

interface DefaultSubscriptionGroupOption {
  value: number;
  label: string;
  description: string | null;
  platform: AdminGroup["platform"];
  subscriptionType: AdminGroup["subscriptionType"];
  rate: number;
  [key: string]: unknown;
}

const props = defineProps<{
  form: Record<string, any>;
  saving: boolean;
  loadFailed: boolean;
}>();

const { t, locale } = useI18n();
const $groups = useAdminGroups();

const isZhLocale = computed(() => locale.value.startsWith("zh"));

function localText(zh: string, en: string): string {
  return isZhLocale.value ? zh : en;
}

// ---- subscription groups ----

const subscriptionGroups = ref<AdminGroup[]>([]);

const defaultSubscriptionGroupOptions = computed<DefaultSubscriptionGroupOption[]>(() =>
  subscriptionGroups.value.map((group: any) => ({
    value: group.id,
    label: group.name,
    description: group.description,
    platform: group.platform,
    subscriptionType: group.subscriptionType,
    rate: group.rateMultiplier,
  })),
);

async function loadSubscriptionGroups() {
  try {
    const groups = await $groups.getAll();
    subscriptionGroups.value = groups.filter(
      (group: any) =>
        group.subscriptionType === "subscription" && group.status === "active",
    );
  } catch (_error: unknown) {
    subscriptionGroups.value = [];
  }
}

function findNextAvailableSubscriptionGroup(
  existingGroupIDs: number[],
): AdminGroup | undefined {
  const existing = new Set(existingGroupIDs);
  return subscriptionGroups.value.find((group: any) => !existing.has(group.id));
}

// ---- default subscriptions ----

function addDefaultSubscription() {
  if (subscriptionGroups.value.length === 0) return;
  const defaultSubs = props.form.defaultSubscriptions as DefaultSubscriptionSetting[] | undefined;
  if (!Array.isArray(defaultSubs)) return;
  const candidate = findNextAvailableSubscriptionGroup(defaultSubs.map((item) => item.groupId));
  if (!candidate) return;
  defaultSubs.push({ groupId: (candidate as any).id, validityDays: 30 });
}

function removeDefaultSubscription(index: number) {
  const defaultSubs = props.form.defaultSubscriptions as DefaultSubscriptionSetting[] | undefined;
  if (Array.isArray(defaultSubs)) {
    defaultSubs.splice(index, 1);
  }
}

// ---- auth source defaults ----

const authSourceDefaults = reactive<AuthSourceDefaultsState>(
  buildAuthSourceDefaultsState({}),
);

const authSourceDefaultsMeta = computed(() => [
  {
    source: "email" as AuthSourceType,
    title: t("admin.settings.authSourceDefaults.sources.email.title"),
    description: t("admin.settings.authSourceDefaults.sources.email.description"),
  },
  {
    source: "linuxdo" as AuthSourceType,
    title: t("admin.settings.authSourceDefaults.sources.linuxdo.title"),
    description: t("admin.settings.authSourceDefaults.sources.linuxdo.description"),
  },
  {
    source: "oidc" as AuthSourceType,
    title: t("admin.settings.authSourceDefaults.sources.oidc.title"),
    description: t("admin.settings.authSourceDefaults.sources.oidc.description"),
  },
  {
    source: "wechat" as AuthSourceType,
    title: t("admin.settings.authSourceDefaults.sources.wechat.title"),
    description: t("admin.settings.authSourceDefaults.sources.wechat.description"),
  },
  {
    source: "github" as AuthSourceType,
    title: "GitHub",
    description: localText(
      "通过 GitHub 已验证邮箱首次注册或首次绑定时应用。",
      "Applied on first signup or first bind through a verified GitHub email.",
    ),
  },
  {
    source: "google" as AuthSourceType,
    title: "Google",
    description: localText(
      "通过 Google 已验证邮箱首次注册或首次绑定时应用。",
      "Applied on first signup or first bind through a verified Google email.",
    ),
  },
  {
    source: "dingtalk" as AuthSourceType,
    title: t("auth.dingtalkProviderName"),
    description: localText(
      "通过钉钉首次注册或首次绑定时应用。",
      "Applied on first signup or first bind through DingTalk.",
    ),
  },
]);

function addAuthSourceDefaultSubscription(source: AuthSourceType) {
  if (subscriptionGroups.value.length === 0) return;
  const candidate = findNextAvailableSubscriptionGroup(
    authSourceDefaults[source].subscriptions.map((item) => item.groupId),
  );
  if (!candidate) return;
  authSourceDefaults[source].subscriptions.push({
    groupId: (candidate as any).id,
    validityDays: 30,
  });
}

function removeAuthSourceDefaultSubscription(source: AuthSourceType, index: number) {
  authSourceDefaults[source].subscriptions.splice(index, 1);
}

function findDuplicateDefaultSubscription(
  subscriptions: DefaultSubscriptionSetting[],
): DefaultSubscriptionSetting | undefined {
  const seenGroupIDs = new Set<number>();
  return subscriptions.find((item) => {
    if (seenGroupIDs.has(item.groupId)) return true;
    seenGroupIDs.add(item.groupId);
    return false;
  });
}

// expose state needed by parent (for save/load)
defineExpose({ authSourceDefaults, authSourceDefaultsMeta, findDuplicateDefaultSubscription, loadSubscriptionGroups });

onMounted(() => {
  loadSubscriptionGroups();
});
</script>
