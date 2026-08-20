//go:build wireinject
// +build wireinject

package main

import (
	"context"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/Wei-Shaw/sub2api/ent"
	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/infrastructure/repository"
	"github.com/Wei-Shaw/sub2api/internal/modules/securityaudit"
	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	clientip "github.com/Wei-Shaw/sub2api/internal/shared/ip"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/server"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"

	"github.com/google/wire"
	"github.com/redis/go-redis/v9"
)

type Application struct {
	Server      *http.Server
	PromptAudit *securityaudit.PromptService
	Cleanup     func()
}

func initializeApplication(buildInfo handler.BuildInfo) (*Application, error) {
	wire.Build(
		// Infrastructure layer ProviderSets
		config.ProviderSet,

		// Business layer ProviderSets
		repository.ProviderSet,
		service.ProviderSet,
		securityaudit.ProviderSet,
		middleware.ProviderSet,
		handler.ProviderSet,

		// Server layer ProviderSet
		server.ProviderSet,

		// Privacy client factory for OpenAI training opt-out
		providePrivacyClientFactory,

		// BuildInfo provider
		provideServiceBuildInfo,

		// Cleanup function provider
		provideCleanup,

		// Application struct
		wire.Struct(new(Application), "Server", "PromptAudit", "Cleanup"),
	)
	return nil, nil
}

func providePrivacyClientFactory() service.PrivacyClientFactory {
	return repository.CreatePrivacyReqClient
}

func provideServiceBuildInfo(buildInfo handler.BuildInfo) service.BuildInfo {
	return service.BuildInfo{
		Version:   buildInfo.Version,
		BuildType: buildInfo.BuildType,
	}
}

func provideCleanup(
	entClient *ent.Client,
	rdb *redis.Client,
	opsMetricsCollector *service.OpsMetricsCollector,
	opsAggregation *service.OpsAggregationService,
	opsAlertEvaluator *service.OpsAlertEvaluatorService,
	opsCleanup *service.OpsCleanupService,
	opsScheduledReport *service.OpsScheduledReportService,
	opsSystemLogSink *service.OpsSystemLogSink,
	opsService *service.OpsService,
	settingService *service.SettingService,
	apiKeyService *service.APIKeyService,
	authCacheInvalidationWorker *service.AuthCacheInvalidationWorker,
	schedulerSnapshot *service.SchedulerSnapshotService,
	tokenRefresh *service.TokenRefreshService,
	accountExpiry *service.AccountExpiryService,
	codexVersionSync *service.OpenAICodexVersionSyncService,
	proxyExpiry *service.ProxyExpiryService,
	idempotencyCleanup *service.IdempotencyCleanupService,
	pricing *service.PricingService,
	usageRecordWorkerPool *service.UsageRecordWorkerPool,
	oauth *service.OAuthService,
	openaiOAuth *service.OpenAIOAuthService,
	geminiOAuth *service.GeminiOAuthService,
	antigravityOAuth *service.AntigravityOAuthService,
	grokOAuth *service.GrokOAuthService,
	openAIGateway *service.OpenAIGatewayService,
	scheduledTestRunner *service.ScheduledTestRunnerService,
	backupSvc *service.BackupService,
	channelMonitorRunner *service.ChannelMonitorRunner,
	upstreamBillingProbe *service.UpstreamBillingProbeService,
	ollamaCloudUsage *service.OllamaCloudUsageService,
	promptAudit *securityaudit.PromptService,
	concurrency *service.ConcurrencyService,
	userMessageQueue *service.UserMessageQueueService,
	dashboardAggregation *service.DashboardAggregationService,
	deferred *service.DeferredService,
	timingWheel *service.TimingWheelService,
	clientIPResolver *clientip.Resolver,
) func() {
	return func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		type cleanupStep struct {
			name string
			fn   func() error
		}

		// 应用层清理步骤可并行执行，基础设施资源（Redis/Ent）最后按顺序关闭。
		parallelSteps := []cleanupStep{
			{"RequestPriorityAdmissionSettingsSync", func() error {
				if settingService != nil {
					settingService.StopRequestPriorityAdmissionSettingsSync()
				}
				return nil
			}},
			{"ClientIPResolver", func() error {
				if clientIPResolver != nil {
					clientIPResolver.Stop()
				}
				return nil
			}},
			{"AuthCacheInvalidationWorker", func() error {
				if authCacheInvalidationWorker != nil {
					authCacheInvalidationWorker.Stop()
				}
				return nil
			}},
			{"AuthCacheInvalidationSubscriber", func() error {
				if apiKeyService != nil {
					apiKeyService.StopAuthCacheInvalidationSubscriber()
				}
				return nil
			}},
			{"OpsRuntimeSettingsRefresh", func() error {
				if opsService != nil {
					opsService.StopRuntimeSettingsRefresh()
				}
				return nil
			}},
			{"PromptAuditService", func() error {
				if promptAudit != nil {
					return promptAudit.Shutdown(ctx)
				}
				return nil
			}},
			{"ConcurrencyService", func() error {
				if concurrency != nil {
					concurrency.Stop()
				}
				return nil
			}},
			{"UserMessageQueueService", func() error {
				if userMessageQueue != nil {
					userMessageQueue.Stop()
				}
				return nil
			}},
			{"DashboardAggregationService", func() error {
				if dashboardAggregation != nil {
					dashboardAggregation.Stop()
				}
				return nil
			}},
			{"OpsScheduledReportService", func() error {
				if opsScheduledReport != nil {
					opsScheduledReport.Stop()
				}
				return nil
			}},
			{"OpsCleanupService", func() error {
				if opsCleanup != nil {
					opsCleanup.Stop()
				}
				return nil
			}},
			{"OpsSystemLogSink", func() error {
				if opsSystemLogSink != nil {
					opsSystemLogSink.Stop()
				}
				return nil
			}},
			{"OpsAlertEvaluatorService", func() error {
				if opsAlertEvaluator != nil {
					opsAlertEvaluator.Stop()
				}
				return nil
			}},
			{"OpsAggregationService", func() error {
				if opsAggregation != nil {
					opsAggregation.Stop()
				}
				return nil
			}},
			{"OpsMetricsCollector", func() error {
				if opsMetricsCollector != nil {
					opsMetricsCollector.Stop()
				}
				return nil
			}},
			{"SchedulerSnapshotService", func() error {
				if schedulerSnapshot != nil {
					schedulerSnapshot.Stop()
				}
				return nil
			}},
			{"OpenAICodexVersionSyncService", func() error {
				if codexVersionSync != nil {
					codexVersionSync.Stop()
				}
				return nil
			}},
			{"IdempotencyCleanupService", func() error {
				if idempotencyCleanup != nil {
					idempotencyCleanup.Stop()
				}
				return nil
			}},
			{"TokenRefreshService", func() error {
				tokenRefresh.Stop()
				return nil
			}},
			{"AccountExpiryService", func() error {
				accountExpiry.Stop()
				return nil
			}},
			{"ProxyExpiryService", func() error {
				proxyExpiry.Stop()
				return nil
			}},
			{"PricingService", func() error {
				pricing.Stop()
				return nil
			}},
			{"OAuthService", func() error {
				oauth.Stop()
				return nil
			}},
			{"OpenAIOAuthService", func() error {
				openaiOAuth.Stop()
				return nil
			}},
			{"GeminiOAuthService", func() error {
				geminiOAuth.Stop()
				return nil
			}},
			{"AntigravityOAuthService", func() error {
				antigravityOAuth.Stop()
				return nil
			}},
			{"GrokOAuthService", func() error {
				if grokOAuth != nil {
					grokOAuth.Stop()
				}
				return nil
			}},
			{"OpenAIWSPool", func() error {
				if openAIGateway != nil {
					openAIGateway.CloseOpenAIWSPool()
				}
				return nil
			}},
			{"ScheduledTestRunnerService", func() error {
				if scheduledTestRunner != nil {
					scheduledTestRunner.Stop()
				}
				return nil
			}},
			{"BackupService", func() error {
				if backupSvc != nil {
					backupSvc.Stop()
				}
				return nil
			}},
			{"ChannelMonitorRunner", func() error {
				if channelMonitorRunner != nil {
					channelMonitorRunner.Stop()
				}
				return nil
			}},
			{"UpstreamBillingProbeService", func() error {
				if upstreamBillingProbe != nil {
					upstreamBillingProbe.Stop()
				}
				return nil
			}},
			{"OllamaCloudUsageService", func() error {
				if ollamaCloudUsage != nil {
					ollamaCloudUsage.Stop()
				}
				return nil
			}},
		}

		usageSteps := []cleanupStep{
			{"UsageRecordWorkerPool", func() error {
				if usageRecordWorkerPool != nil {
					usageRecordWorkerPool.Stop()
				}
				return nil
			}},
		}

		timingWheelSteps := []cleanupStep{
			{"DeferredService", func() error {
				if deferred != nil {
					deferred.Stop()
				}
				return nil
			}},
			{"TimingWheelService", func() error {
				if timingWheel != nil {
					timingWheel.Stop()
				}
				return nil
			}},
		}

		infraSteps := []cleanupStep{
			{"Redis", func() error {
				if rdb == nil {
					return nil
				}
				return rdb.Close()
			}},
			{"Ent", func() error {
				if entClient == nil {
					return nil
				}
				return entClient.Close()
			}},
		}

		runParallel := func(steps []cleanupStep) {
			var wg sync.WaitGroup
			for i := range steps {
				step := steps[i]
				wg.Add(1)
				go func() {
					defer wg.Done()
					if err := step.fn(); err != nil {
						log.Printf("[Cleanup] %s failed: %v", step.name, err)
						return
					}
					log.Printf("[Cleanup] %s succeeded", step.name)
				}()
			}
			wg.Wait()
		}

		runSequential := func(steps []cleanupStep) {
			for i := range steps {
				step := steps[i]
				if err := step.fn(); err != nil {
					log.Printf("[Cleanup] %s failed: %v", step.name, err)
					continue
				}
				log.Printf("[Cleanup] %s succeeded", step.name)
			}
		}

		runParallel(parallelSteps)
		runSequential(timingWheelSteps)
		runSequential(usageSteps)
		runSequential(infraSteps)

		// Check if context timed out
		select {
		case <-ctx.Done():
			log.Printf("[Cleanup] Warning: cleanup timed out after 10 seconds")
		default:
			log.Printf("[Cleanup] All cleanup steps completed")
		}
	}
}
