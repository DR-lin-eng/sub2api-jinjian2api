# `@/types` 拆分规划

## 背景

`src/types/index.ts`（2257行）+ `src/types/payment.ts`（231行）包含189+17个类型，
全部是 snake_case 的后端契约类型，当前同时充当 DTO 和 Entity 角色。

目标：按 spec §5.3，将每个类型归入对应 feature 的
`data/models/<entity>Dto.ts`（DTO，snake_case）+
`domain/models/<entity>.ts`（Entity，camelCase）+
`data/models/<entity>Mapper.ts`（映射函数）。

`@/types` 最终只保留**跨 feature UI 类型**和**infra 类型**（见下方保留列表）。

---

## 一、保留在 `@/types`（纯UI / infra，不属于任何 feature）

| 类型 | 理由 |
|---|---|
| `SelectOption` | 通用UI原子 |
| `BasePaginationResponse<T>` | infra pagination shape |
| `PaginatedResponse<T>` | infra pagination shape |
| `FetchOptions` | infra abort signal wrapper |
| `ApiResponse<T>` | infra HTTP wrapper |
| `ApiError` | infra error shape |
| `ToastType` | UI 通知类型 |
| `Toast` | UI 通知对象 |
| `AppState` | core/stores/appStore 使用 |
| `ValidationError` | 通用表单校验 |
| `SortConfig` | 通用表格排序 |
| `FilterConfig` | 通用表格过滤 |
| `PaginationConfig` | 通用分页参数 |

---

## 二、迁移到各 feature

### feature: `auth`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `UserAuthProvider` | authDto.ts | auth.ts | union type，无字段映射 |
| `UserAuthBindingStatus` | authDto.ts | auth.ts | snake_case字段需映射 |
| `UserProfileSourceContext` | authDto.ts | auth.ts | |
| `User` | authDto.ts | auth.ts | snake_case字段需映射 |
| `LoginRequest` | authDto.ts | auth.ts | Request类型，snake_case |
| `CredentialEnvelope` | authDto.ts | auth.ts | |
| `RegisterRequest` | authDto.ts | auth.ts | |
| `EncryptedRegisterRequest` | authDto.ts | auth.ts | |
| `AuthResponse` | authDto.ts | auth.ts | |
| `CurrentUserResponse` | authDto.ts | auth.ts | |
| `LoginAgreementDocument` | authDto.ts | auth.ts | |
| `PublicSettings` | authDto.ts | auth.ts | snake_case字段 |
| `SendVerifyCodeRequest` | authDto.ts | auth.ts | |
| `SendVerifyCodeResponse` | authDto.ts | auth.ts | |
| `TotpStatus` | totpDto.ts | totp.ts | |
| `TotpSetupRequest` | totpDto.ts | totp.ts | |
| `TotpSetupResponse` | totpDto.ts | totp.ts | snake_case字段 |
| `TotpEnableRequest` | totpDto.ts | totp.ts | |
| `TotpEnableResponse` | totpDto.ts | totp.ts | |
| `TotpDisableRequest` | totpDto.ts | totp.ts | |
| `TotpVerificationMethod` | totpDto.ts | totp.ts | |
| `TotpLoginResponse` | totpDto.ts | totp.ts | snake_case字段 |
| `TotpLogin2FARequest` | totpDto.ts | totp.ts | |
| `NotifyEmailEntry` | authDto.ts | auth.ts | |
| `ChangePasswordRequest` | authDto.ts | auth.ts | snake_case字段 |

### feature: `admin-users`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `AdminUser` | adminUserDto.ts | adminUser.ts | extends User，snake_case |
| `UpdateUserRequest` | adminUserDto.ts | adminUser.ts | |
| `UserAttributeType` | userAttributeDto.ts | userAttribute.ts | union |
| `UserAttributeOption` | userAttributeDto.ts | userAttribute.ts | |
| `UserAttributeValidation` | userAttributeDto.ts | userAttribute.ts | snake_case |
| `UserAttributeDefinition` | userAttributeDto.ts | userAttribute.ts | snake_case字段 |
| `UserAttributeValue` | userAttributeDto.ts | userAttribute.ts | snake_case |
| `CreateUserAttributeRequest` | userAttributeDto.ts | userAttribute.ts | |
| `UpdateUserAttributeRequest` | userAttributeDto.ts | userAttribute.ts | |
| `UserAttributeValuesMap` | userAttributeDto.ts | userAttribute.ts | |

### feature: `admin-groups`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `GroupPlatform` | groupDto.ts | group.ts | union，无映射 |
| `SubscriptionType` | groupDto.ts | group.ts | union |
| `OpenAIMessagesDispatchModelConfig` | groupDto.ts | group.ts | snake_case |
| `Group` | groupDto.ts | group.ts | 大量snake_case字段 |
| `AdminGroup` | groupDto.ts | group.ts | extends Group |
| `ModelsListConfig` | groupDto.ts | group.ts | |
| `CompositeRouteMatchType` | groupDto.ts | group.ts | |
| `CompositeRouteEndpoint` | groupDto.ts | group.ts | |
| `CompositeRouteSource` | groupDto.ts | group.ts | |
| `CompositeModelRoute` | groupDto.ts | group.ts | snake_case |
| `CompositeModelRouteInput` | groupDto.ts | group.ts | snake_case |
| `CompositeRoutePreviewRequest` | groupDto.ts | group.ts | |
| `CompositeRouteDecision` | groupDto.ts | group.ts | snake_case |
| `CreateGroupRequest` | groupDto.ts | group.ts | 大量snake_case |
| `UpdateGroupRequest` | groupDto.ts | group.ts | 大量snake_case |

### feature: `admin-accounts`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `AccountPlatform` | accountDto.ts | account.ts | union |
| `AccountType` | accountDto.ts | account.ts | union |
| `OAuthAddMethod` | accountDto.ts | account.ts | union |
| `ClaudeModel` | accountDto.ts | account.ts | snake_case |
| `Account` | accountDto.ts | account.ts | 大量snake_case |
| `AccountSchedulerGroupScore` | accountDto.ts | account.ts | snake_case |
| `WindowStats` | accountDto.ts | account.ts | 无snake_case字段 |
| `UsageProgress` | accountDto.ts | account.ts | snake_case |
| `AccountHourlyUsageStats` | accountDto.ts | account.ts | snake_case |
| `CodexUsageSnapshot` | accountDto.ts | account.ts | snake_case |
| `OpenAICompactMode` | accountDto.ts | account.ts | union |
| `OpenAIResponsesMode` | accountDto.ts | account.ts | union |
| `OpenAIEndpointCapability` | accountDto.ts | account.ts | union |
| `OpenAICompactState` | accountDto.ts | account.ts | snake_case |
| `OpenAIResponsesState` | accountDto.ts | account.ts | snake_case |
| `CreateAccountRequest` | accountDto.ts | account.ts | snake_case |
| `UpdateAccountRequest` | accountDto.ts | account.ts | snake_case |
| `CheckMixedChannelRequest` | accountDto.ts | account.ts | snake_case |
| `MixedChannelWarningDetails` | accountDto.ts | account.ts | snake_case |
| `CheckMixedChannelResponse` | accountDto.ts | account.ts | snake_case |
| `AdminDataPayload` | accountDto.ts | account.ts | snake_case |
| `AdminDataProxy` | accountDto.ts | account.ts | snake_case |
| `AdminDataAccount` | accountDto.ts | account.ts | snake_case |
| `AdminDataImportError` | accountDto.ts | account.ts | snake_case |
| `AdminDataImportResult` | accountDto.ts | account.ts | snake_case |
| `CodexSessionImportRequest` | accountDto.ts | account.ts | snake_case |
| `OpenAICodexPATCreateRequest` | accountDto.ts | account.ts | snake_case |
| `CodexSessionImportMessage` | accountDto.ts | account.ts | snake_case |
| `CodexSessionImportItem` | accountDto.ts | account.ts | snake_case |
| `CodexSessionImportResult` | accountDto.ts | account.ts | snake_case |
| `ScheduledTestPlan` | scheduledTestDto.ts | scheduledTest.ts | snake_case |
| `ScheduledTestResult` | scheduledTestDto.ts | scheduledTest.ts | snake_case |
| `CreateScheduledTestPlanRequest` | scheduledTestDto.ts | scheduledTest.ts | |
| `UpdateScheduledTestPlanRequest` | scheduledTestDto.ts | scheduledTest.ts | |
| `GeminiCredentials` | geminiDto.ts | gemini.ts | snake_case |
| `TempUnschedulableRule` | accountDto.ts | account.ts | snake_case |
| `TempUnschedulableState` | accountDto.ts | account.ts | snake_case |
| `TempUnschedulableStatus` | accountDto.ts | account.ts | |
| `UpstreamBillingData` | accountDto.ts | account.ts | snake_case |
| `UpstreamBillingProbeStatus` | accountDto.ts | account.ts | union |
| `UpstreamBillingProbeSnapshot` | accountDto.ts | account.ts | snake_case |
| `UpstreamBillingProbeSettings` | accountDto.ts | account.ts | snake_case |
| `UpstreamBillingProbeResult` | accountDto.ts | account.ts | snake_case |
| `AntigravityModelQuota` | antigravityDto.ts | antigravity.ts | snake_case |
| `AccountUsageInfo` | accountDto.ts | account.ts | snake_case |
| `AccountUsageHistory` | accountDto.ts | account.ts | snake_case |
| `AccountUsageSummary` | accountDto.ts | account.ts | snake_case |
| `AccountUsageStatsResponse` | accountDto.ts | account.ts | |

### feature: `admin-proxies`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `ProxyProtocol` | proxyDto.ts | proxy.ts | union |
| `Proxy` | proxyDto.ts | proxy.ts | snake_case |
| `ProxyAccountSummary` | proxyDto.ts | proxy.ts | |
| `ProxyQualityCheckItem` | proxyDto.ts | proxy.ts | snake_case |
| `ProxyQualityCheckResult` | proxyDto.ts | proxy.ts | snake_case |
| `CreateProxyRequest` | proxyDto.ts | proxy.ts | snake_case |
| `UpdateProxyRequest` | proxyDto.ts | proxy.ts | snake_case |

### feature: `admin-usage`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `RedeemCodeType` | usageDto.ts | usage.ts | union |
| `UsageRequestType` | usageDto.ts | usage.ts | union |
| `ImageSizeSource` | usageDto.ts | usage.ts | union |
| `ImageSizeBreakdown` | usageDto.ts | usage.ts | |
| `UsageLog` | usageDto.ts | usage.ts | 大量snake_case |
| `UsageLogAccountSummary` | usageDto.ts | usage.ts | |
| `AdminUsageLog` | usageDto.ts | usage.ts | extends UsageLog |
| `UsageCleanupFilters` | usageDto.ts | usage.ts | snake_case |
| `UsageCleanupTask` | usageDto.ts | usage.ts | snake_case |
| `UsageQueryParams` | usageDto.ts | usage.ts | snake_case |
| `UsageStatsResponse` | usageDto.ts | usage.ts | snake_case |
| `TrendDataPoint` | usageDto.ts | usage.ts | snake_case |
| `ModelStat` | usageDto.ts | usage.ts | snake_case |
| `EndpointStat` | usageDto.ts | usage.ts | |
| `GroupStat` | usageDto.ts | usage.ts | snake_case |
| `UserBreakdownItem` | usageDto.ts | usage.ts | snake_case |
| `UserUsageTrendPoint` | usageDto.ts | usage.ts | snake_case |
| `UserSpendingRankingItem` | usageDto.ts | usage.ts | snake_case |
| `UserSpendingRankingResponse` | usageDto.ts | usage.ts | snake_case |
| `ApiKeyUsageTrendPoint` | usageDto.ts | usage.ts | snake_case |

### feature: `admin-dashboard`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `DashboardStats` | dashboardDto.ts | dashboard.ts | 大量snake_case |

### feature: `admin-redeem`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `RedeemCode` | redeemDto.ts | redeem.ts | snake_case |
| `GenerateRedeemCodesRequest` | redeemDto.ts | redeem.ts | snake_case |
| `BatchUpdateRedeemCodeFields` | redeemDto.ts | redeem.ts | snake_case |
| `BatchUpdateRedeemCodesRequest` | redeemDto.ts | redeem.ts | |
| `RedeemCodeRequest` | redeemDto.ts | redeem.ts | |

### feature: `admin-promo`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `PromoCode` | promoDto.ts | promo.ts | snake_case |
| `PromoCodeUsage` | promoDto.ts | promo.ts | snake_case |
| `CreatePromoCodeRequest` | promoDto.ts | promo.ts | snake_case |
| `UpdatePromoCodeRequest` | promoDto.ts | promo.ts | snake_case |

### feature: `admin-subscriptions`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `UserSubscription` | subscriptionDto.ts | subscription.ts | snake_case |
| `SubscriptionProgress` | subscriptionDto.ts | subscription.ts | snake_case |
| `AssignSubscriptionRequest` | subscriptionDto.ts | subscription.ts | snake_case |
| `BulkAssignSubscriptionRequest` | subscriptionDto.ts | subscription.ts | snake_case |
| `ExtendSubscriptionRequest` | subscriptionDto.ts | subscription.ts | |

### feature: `admin-orders`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `SubscriptionPlan`（from payment.ts） | planDto.ts | plan.ts | snake_case |
| `PaymentOrder`（from payment.ts） | orderDto.ts | order.ts | snake_case |
| `CheckoutInfoResponse`（from payment.ts） | orderDto.ts | order.ts | snake_case |
| `PaymentConfig`（from payment.ts） | orderDto.ts | order.ts | snake_case |
| `MethodLimit`（from payment.ts） | orderDto.ts | order.ts | snake_case |
| `MethodLimitsResponse`（from payment.ts） | orderDto.ts | order.ts | snake_case |
| `PaymentChannel`（from payment.ts） | orderDto.ts | order.ts | |
| `ProviderInstance`（from payment.ts） | orderDto.ts | order.ts | snake_case |
| `CreateOrderRequest`（from payment.ts） | orderDto.ts | order.ts | snake_case |
| `CreateOrderResult`（from payment.ts） | orderDto.ts | order.ts | snake_case |
| `DashboardStats`（from payment.ts） | orderDto.ts | order.ts | snake_case（payment版） |
| `OrderStatus` | orderDto.ts | order.ts | union |
| `PaymentType` | orderDto.ts | order.ts | union |
| `OrderType` | orderDto.ts | order.ts | union |
| `CreateOrderResultType` | orderDto.ts | order.ts | union |
| `WechatOAuthInfo` | orderDto.ts | order.ts | snake_case |
| `WechatJSAPIPayload` | orderDto.ts | order.ts | camelCase already |

### feature: `announcements`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `AnnouncementStatus` | announcementDto.ts | announcement.ts | union |
| `AnnouncementNotifyMode` | announcementDto.ts | announcement.ts | union |
| `AnnouncementConditionType` | announcementDto.ts | announcement.ts | union |
| `AnnouncementOperator` | announcementDto.ts | announcement.ts | union |
| `AnnouncementCondition` | announcementDto.ts | announcement.ts | snake_case |
| `AnnouncementConditionGroup` | announcementDto.ts | announcement.ts | snake_case |
| `AnnouncementTargeting` | announcementDto.ts | announcement.ts | snake_case |
| `Announcement` | announcementDto.ts | announcement.ts | snake_case |
| `UserAnnouncement` | announcementDto.ts | announcement.ts | snake_case |
| `CreateAnnouncementRequest` | announcementDto.ts | announcement.ts | snake_case |
| `UpdateAnnouncementRequest` | announcementDto.ts | announcement.ts | snake_case |
| `AnnouncementUserReadStatus` | announcementDto.ts | announcement.ts | snake_case |

### feature: `keys`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `ApiKey` | apiKeyDto.ts | apiKey.ts | 大量snake_case |
| `CreateApiKeyRequest` | apiKeyDto.ts | apiKey.ts | snake_case |
| `UpdateApiKeyRequest` | apiKeyDto.ts | apiKey.ts | snake_case |

### feature: `profile`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `AffiliateInvitee` | profileDto.ts | profile.ts | snake_case |
| `UserAffiliateDetail` | profileDto.ts | profile.ts | snake_case |
| `AffiliateTransferResponse` | profileDto.ts | profile.ts | snake_case |

### feature: `subscriptions`（用户侧）
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `Subscription` | subscriptionDto.ts | subscription.ts | snake_case |
| `CreateSubscriptionRequest` | subscriptionDto.ts | subscription.ts | |
| `UpdateSubscriptionRequest` | subscriptionDto.ts | subscription.ts | |
| `SubscriptionStats` | subscriptionDto.ts | subscription.ts | snake_case |
| `UserStats` | subscriptionDto.ts | subscription.ts | snake_case |
| `ProxyNode` | subscriptionDto.ts | subscription.ts | snake_case |
| `ConversionRequest` | subscriptionDto.ts | subscription.ts | snake_case |
| `ConversionResult` | subscriptionDto.ts | subscription.ts | snake_case |

### feature: `admin-ops`
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `UserErrorRequest` | opsDto.ts | ops.ts | snake_case |
| `UserErrorRequestDetail` | opsDto.ts | ops.ts | snake_case |
| `UserErrorListParams` | opsDto.ts | ops.ts | snake_case |

### feature: `admin-accounts` (grok sub-feature)
| 类型 | DTO文件 | Entity文件 | 备注 |
|---|---|---|---|
| `GrokQuotaWindow` | grokDto.ts | grok.ts | snake_case |
| `GrokBillingProductUsage` | grokDto.ts | grok.ts | snake_case |
| `GrokBillingSummary` | grokDto.ts | grok.ts | snake_case |

### `core/routes` (UI infra)
| 类型 | 目标 | 备注 |
|---|---|---|
| `CustomMenuItem` | `core/routes/types/menuItem.ts` | 路由/菜单配置 |
| `CustomEndpoint` | `core/routes/types/menuItem.ts` | 自定义端点配置 |

---

## 三、迁移统计

| feature | 类型数 | DTO文件数 | 工作量估计 |
|---|---|---|---|
| auth | 25 | 2 | 高（User/PublicSettings字段多） |
| admin-accounts | 48 | 5 | 极高（Account字段最多） |
| admin-groups | 15 | 1 | 高 |
| admin-proxies | 7 | 1 | 中 |
| admin-users | 10 | 2 | 中 |
| admin-usage | 21 | 1 | 高 |
| admin-redeem | 5 | 1 | 低 |
| admin-promo | 4 | 1 | 低 |
| admin-subscriptions | 5 | 1 | 低 |
| admin-orders | 17 | 2 | 中 |
| admin-dashboard | 1 | 1 | 低 |
| announcements | 12 | 1 | 中 |
| keys | 3 | 1 | 低 |
| profile | 3 | 1 | 低 |
| subscriptions | 8 | 1 | 中 |
| admin-ops | 3 | 1 | 低 |
| **合计** | **~186** | **~22** | |

---

## 四、执行步骤

1. **写 DTO 文件**：每个 feature 的 `data/models/xxxDto.ts`，内容 = 从 `@/types` 剪切过来的 snake_case 类型（加 `Dto` 后缀或保持名称 + JSDoc 注释标明 "DTO"）
2. **写 Entity 文件**：每个 feature 的 `domain/models/xxx.ts`，内容 = camelCase 版本
3. **写 Mapper 文件**：每个 feature 的 `data/models/xxxMapper.ts`，`toEntity()` + `toDto()` 函数
4. **更新 RepositoryImpl**：调 datasource 后调 mapper，返回 Entity
5. **更新 `@/types/index.ts`**：删除已迁移的类型，改为从各 feature domain/models re-export（过渡期）或直接删除
6. **更新所有 import 引用**：全局替换 `from '@/types'` → `from '@/features/xxx/domain/models/xxx'`
7. **typecheck 验证**

---

## 五、`@/types` 过渡策略

迁移期间 `@/types/index.ts` 保留 re-export 桥接，确保不 break 现有代码：

```ts
// @/types/index.ts — 过渡期 re-export（迁移完成后删除）
export type { Account, CreateAccountRequest } from '@/features/admin-accounts/domain/models/account'
export type { Group, AdminGroup } from '@/features/admin-groups/domain/models/group'
// ...
```

所有引用点完成迁移后，删除这些 re-export，`@/types` 只留 Section 一的类型。
