export default {
    // Shared usage analytics labels
    dashboard: {
      timeRange: 'Time Range',
      granularity: 'Granularity',
      day: 'Day',
      hour: 'Hour',
      modelDistribution: 'Model Distribution',
      groupDistribution: 'Group Usage Distribution',
      metricTokens: 'By Tokens',
      metricActualCost: 'By Actual Cost',
      tokenUsageTrend: 'Token Usage Trend',
      model: 'Model',
      group: 'Group',
      noGroup: 'No Group',
      requests: 'Requests',
      tokens: 'Tokens',
      actual: 'Actual',
      accountCost: 'Cost',
      standard: 'Standard',
      noDataAvailable: 'No data available'
    },

    backup: {
      title: 'Database Backup',
      description: 'Full database backup to S3-compatible storage with scheduled backup and restore',
      s3: {
        title: 'S3 Storage Configuration',
        description: 'Configure S3-compatible storage (supports Cloudflare R2)',
        descriptionPrefix: 'Configure S3-compatible storage (supports',
        descriptionSuffix: ')',
        enabled: 'Enable S3 Storage',
        endpoint: 'Endpoint',
        region: 'Region',
        bucket: 'Bucket',
        prefix: 'Key Prefix',
        accessKeyId: 'Access Key ID',
        secretAccessKey: 'Secret Access Key',
        secretConfigured: 'Already configured, leave empty to keep',
        forcePathStyle: 'Force Path Style',
        testConnection: 'Test Connection',
        testSuccess: 'S3 connection test successful',
        testFailed: 'S3 connection test failed',
        saved: 'S3 configuration saved'
      },
      imageStorage: {
        title: 'Async image object storage',
        description: 'Enables the asynchronous image endpoints and offloads generated images to object storage, keeping only short links in Redis. Shares the S3 client with backups and takes effect on save — no restart needed.',
        enabled: 'Enable async image tasks',
        reuseBackupS3: 'Reuse the backup S3 configuration above (different bucket/prefix only)',
        bucket: 'Bucket',
        bucketInherited: 'Leave empty to use the backup bucket',
        prefix: 'Key prefix',
        publicBaseUrl: 'Public base URL',
        publicBaseUrlPlaceholder: 'Leave empty to return presigned links',
        presignExpiryHours: 'Presigned link TTL (hours)',
        saved: 'Async image object storage saved'
      },
      schedule: {
        title: 'Scheduled Backup',
        description: 'Configure automatic scheduled backups',
        enabled: 'Enable Scheduled Backup',
        cronExpr: 'Cron Expression',
        cronHint: 'e.g. "0 2 * * *" means every day at 2:00 AM',
        retainDays: 'Backup Expire Days',
        retainDaysHint: 'Backup files auto-delete after this many days, 0 = never expire',
        retainCount: 'Max Retain Count',
        retainCountHint: 'Maximum number of backups to keep, 0 = unlimited',
        saved: 'Schedule configuration saved'
      },
      operations: {
        title: 'Backup Records',
        description: 'Create manual backups and manage existing backup records',
        createBackup: 'Create Backup',
        backing: 'Backing up...',
        backupCreated: 'Backup created successfully',
        expireDays: 'Expire Days',
        alreadyInProgress: 'A backup is already in progress',
        backupRunning: 'Backup in progress...',
        backupFailed: 'Backup failed',
        restoreRunning: 'Restore in progress...',
        restoreFailed: 'Restore failed',
      },
      columns: {
        status: 'Status',
        fileName: 'File Name',
        size: 'Size',
        expiresAt: 'Expires At',
        triggeredBy: 'Triggered By',
        startedAt: 'Started At',
        actions: 'Actions'
      },
      status: {
        pending: 'Pending',
        running: 'Running',
        completed: 'Completed',
        failed: 'Failed'
      },
      progress: {
        pending: 'Preparing',
        dumping: 'Dumping database',
        uploading: 'Uploading',
      },
      trigger: {
        manual: 'Manual',
        scheduled: 'Scheduled'
      },
      neverExpire: 'Never',
      empty: 'No backup records',
      actions: {
        download: 'Download',
        restore: 'Restore',
        restoreConfirm: 'Are you sure you want to restore from this backup? This will overwrite the current database!',
        restorePasswordPrompt: 'Please enter your admin password to confirm the restore operation',
        restoreSuccess: 'Database restored successfully',
        deleteConfirm: 'Are you sure you want to delete this backup?',
        deleted: 'Backup deleted'
      },
      r2Guide: {
        title: 'Cloudflare R2 Setup Guide',
        intro: 'Cloudflare R2 provides S3-compatible object storage with a free tier of 10GB storage + 1M Class A requests/month, ideal for database backups.',
        step1: {
          title: 'Create an R2 Bucket',
          line1: 'Log in to the Cloudflare Dashboard (dash.cloudflare.com), select "R2 Object Storage" from the sidebar',
          line2: 'Click "Create bucket", enter a name (e.g. sub2api-backups), choose a region',
          line3: 'Click create to finish'
        },
        step2: {
          title: 'Create an API Token',
          line1: 'On the R2 page, click "Manage R2 API Tokens" in the top right',
          line2: 'Click "Create API token", set permission to "Object Read & Write"',
          line3: 'Recommended: restrict to specific bucket for better security',
          line4: 'After creation, you will see the Access Key ID and Secret Access Key',
          warning: 'The Secret Access Key is only shown once — copy and save it immediately!'
        },
        step3: {
          title: 'Get the S3 Endpoint',
          desc: 'Find your Account ID on the R2 overview page (in the URL or the right panel). The endpoint format is:',
          accountId: 'your_account_id'
        },
        step4: {
          title: 'Fill in the Configuration',
          checkEnabled: 'Checked',
          bucketValue: 'Your bucket name',
          fromStep2: 'Value from Step 2',
          unchecked: 'Unchecked'
        },
        freeTier: 'R2 Free Tier: 10GB storage + 1M Class A requests + 10M Class B requests per month — more than enough for database backups.'
      }
    },

    dataManagement: {
      title: 'Data Management',
      description: 'Manage data management agent status, object storage settings, and backup jobs in one place',
      agent: {
        title: 'Data Management Agent Status',
        description: 'The system probes a fixed Unix socket and enables data management only when reachable.',
        enabled: 'Data management agent is ready. Data management operations are available.',
        disabled: 'Data management agent is unavailable. Only diagnostic information is available now.',
        socketPath: 'Socket Path',
        version: 'Version',
        status: 'Status',
        uptime: 'Uptime',
        reasonLabel: 'Unavailable Reason',
        reason: {
          DATA_MANAGEMENT_AGENT_SOCKET_MISSING: 'Data management socket file is missing',
          DATA_MANAGEMENT_AGENT_UNAVAILABLE: 'Data management agent is unreachable',
          BACKUP_AGENT_SOCKET_MISSING: 'Backup socket file is missing',
          BACKUP_AGENT_UNAVAILABLE: 'Backup agent is unreachable',
          UNKNOWN: 'Unknown reason'
        }
      },
      sections: {
        config: {
          title: 'Backup Configuration',
          description: 'Configure backup source, retention policy, and S3 settings.'
        },
        s3: {
          title: 'S3 Object Storage',
          description: 'Configure and test uploads of backup artifacts to a standard S3-compatible storage.'
        },
        backup: {
          title: 'Backup Operations',
          description: 'Trigger PostgreSQL, Redis, and full backup jobs.'
        },
        history: {
          title: 'Backup History',
          description: 'Review backup job status, errors, and artifact metadata.'
        }
      },
      form: {
        sourceMode: 'Source Mode',
        backupRoot: 'Backup Root',
        activePostgresProfile: 'Active PostgreSQL Profile',
        activeRedisProfile: 'Active Redis Profile',
        activeS3Profile: 'Active S3 Profile',
        retentionDays: 'Retention Days',
        keepLast: 'Keep Last Jobs',
        uploadToS3: 'Upload to S3',
        useActivePostgresProfile: 'Use Active PostgreSQL Profile',
        useActiveRedisProfile: 'Use Active Redis Profile',
        useActiveS3Profile: 'Use Active Profile',
        idempotencyKey: 'Idempotency Key (Optional)',
        secretConfigured: 'Configured already, leave empty to keep unchanged',
        source: {
          profileID: 'Profile ID (Unique)',
          profileName: 'Profile Name',
          setActive: 'Set as active after creation'
        },
        postgres: {
          title: 'PostgreSQL',
          host: 'Host',
          port: 'Port',
          user: 'User',
          password: 'Password',
          database: 'Database',
          sslMode: 'SSL Mode',
          containerName: 'Container Name (docker_exec mode)'
        },
        redis: {
          title: 'Redis',
          addr: 'Address (host:port)',
          username: 'Username',
          password: 'Password',
          db: 'Database Index',
          containerName: 'Container Name (docker_exec mode)'
        },
        s3: {
          enabled: 'Enable S3 Upload',
          profileID: 'Profile ID (Unique)',
          profileName: 'Profile Name',
          endpoint: 'Endpoint (Optional)',
          region: 'Region',
          bucket: 'Bucket',
          accessKeyID: 'Access Key ID',
          secretAccessKey: 'Secret Access Key',
          prefix: 'Object Prefix',
          forcePathStyle: 'Force Path Style',
          useSSL: 'Use SSL',
          setActive: 'Set as active after creation'
        }
      },
      sourceProfiles: {
        createTitle: 'Create Source Profile',
        editTitle: 'Edit Source Profile',
        empty: 'No source profiles yet, create one first',
        deleteConfirm: 'Delete source profile {profileID}?',
        columns: {
          profile: 'Profile',
          active: 'Active',
          connection: 'Connection',
          database: 'Database',
          updatedAt: 'Updated At',
          actions: 'Actions'
        }
      },
      s3Profiles: {
        createTitle: 'Create S3 Profile',
        editTitle: 'Edit S3 Profile',
        empty: 'No S3 profiles yet, create one first',
        editHint: 'Click "Edit" to modify profile details in the right drawer.',
        deleteConfirm: 'Delete S3 profile {profileID}?',
        columns: {
          profile: 'Profile',
          active: 'Active',
          storage: 'Storage',
          updatedAt: 'Updated At',
          actions: 'Actions'
        }
      },
      history: {
        total: '{count} jobs',
        empty: 'No backup jobs yet',
        columns: {
          jobID: 'Job ID',
          type: 'Type',
          status: 'Status',
          triggeredBy: 'Triggered By',
          pgProfile: 'PostgreSQL Profile',
          redisProfile: 'Redis Profile',
          s3Profile: 'S3 Profile',
          finishedAt: 'Finished At',
          artifact: 'Artifact',
          error: 'Error'
        },
        status: {
          queued: 'Queued',
          running: 'Running',
          succeeded: 'Succeeded',
          failed: 'Failed',
          partial_succeeded: 'Partial Succeeded'
        }
      },
      actions: {
        refresh: 'Refresh Status',
        disabledHint: 'Start datamanagementd first and ensure the socket is reachable.',
        reloadConfig: 'Reload Config',
        reloadSourceProfiles: 'Reload Source Profiles',
        reloadProfiles: 'Reload Profiles',
        newSourceProfile: 'New Source Profile',
        saveConfig: 'Save Config',
        configSaved: 'Configuration saved',
        testS3: 'Test S3 Connection',
        s3TestOK: 'S3 connection test succeeded',
        s3TestFailed: 'S3 connection test failed',
        newProfile: 'New Profile',
        saveProfile: 'Save Profile',
        activateProfile: 'Activate',
        profileIDRequired: 'Profile ID is required',
        profileNameRequired: 'Profile name is required',
        profileSelectRequired: 'Select a profile to edit first',
        profileCreated: 'S3 profile created',
        profileSaved: 'S3 profile saved',
        profileActivated: 'S3 profile activated',
        profileDeleted: 'S3 profile deleted',
        sourceProfileCreated: 'Source profile created',
        sourceProfileSaved: 'Source profile saved',
        sourceProfileActivated: 'Source profile activated',
        sourceProfileDeleted: 'Source profile deleted',
        createBackup: 'Create Backup Job',
        jobCreated: 'Backup job created: {jobID} ({status})',
        refreshJobs: 'Refresh Jobs',
        loadMore: 'Load More'
      }
    },

    // Groups
    groups: {
      title: 'Group Management',
      description: 'Manage API key groups and rate multipliers',
      searchGroups: 'Search groups...',
      createGroup: 'Create Group',
      editGroup: 'Edit Group',
      deleteGroup: 'Delete Group',
      duplicate: 'Duplicate',
      duplicating: 'Duplicating',
      duplicateSuccess: 'Group duplicated as "{name}" and disabled. Review its configuration before enabling it.',
      duplicateFailed: 'Failed to duplicate group',
      sortOrder: 'Sort',
      columnSettings: 'Column Settings',
      sortOrderHint: 'Drag groups to adjust display order, groups at the top will be displayed first',
      sortOrderUpdated: 'Sort order updated',
      failedToUpdateSortOrder: 'Failed to update sort order',
      allPlatforms: 'All Platforms',
      allStatus: 'All Status',
      allGroups: 'All Groups',
      columns: {
        name: 'Name',
        id: 'ID',
        platform: 'Platform',
        rateMultiplier: 'Rate Multiplier',
        priority: 'Priority',
        apiKeys: 'API Keys',
        accounts: 'Accounts',
        capacity: 'Capacity',
        usage: 'Usage',
        status: 'Status',
        actions: 'Actions'
      },
      usageToday: 'Today',
      usageTotal: 'Total',
      accountsAvailable: 'Avail:',
      accountsRateLimited: 'Limited:',
      accountsTotal: 'Total:',
      accountsUnit: '',
      rateAndAccounts: '{rate}x rate · {count} accounts',
      accountsCount: '{count} accounts',
      rateLabel: 'rate',
      accountFilters: {
        title: 'Account Filter Controls',
        oauthOnly: 'Only allow OAuth accounts',
        oauthOnlyEnabled: 'Enabled — API Key accounts will be excluded',
        privacySetOnly: 'Only allow accounts with privacy protection set',
        privacySetOnlyEnabled: 'Enabled — accounts with unset Privacy will be excluded',
        disabled: 'Disabled'
      },
      form: {
        name: 'Name',
        description: 'Description',
        platform: 'Platform',
        rateMultiplier: 'Rate Multiplier',
        status: 'Status',
        nameLabel: 'Group Name',
        namePlaceholder: 'Enter group name',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Enter description (optional)',
        rateMultiplierLabel: 'Rate Multiplier',
        rateMultiplierHint: '1.0 = standard rate, 0.5 = half price, 2.0 = double',
        rpmLimit: 'Requests Per Minute (RPM)',
        rpmLimitPlaceholder: '0 = unlimited',
        rpmLimitHint: 'Maximum requests per minute for API keys assigned to this group; 0 = unlimited.',
        maxReasoningEffort: 'Max reasoning effort',
        maxReasoningEffortUnlimited: 'Unlimited (follow request)',
        maxReasoningEffortHint: 'Limits explicit OpenAI reasoning effort requests only. For Composite groups, it applies only to requests resolved to OpenAI. Higher values are capped; omitted effort stays omitted. The ceiling takes precedence over reasoning effort mappings.',
        reasoningEffortMappings: 'Reasoning effort mappings',
        addReasoningEffortMapping: 'Add mapping',
        removeReasoningEffortMapping: 'Remove mapping',
        reasoningEffortFrom: 'Request value',
        reasoningEffortTo: 'Forwarded value',
        reasoningEffortFromPlaceholder: 'Select A',
        reasoningEffortToPlaceholder: 'Select B',
        fromRequired: 'Select request value A',
        toRequired: 'Select forwarded value B',
        unsupportedFrom: 'Request value is not supported by this platform',
        unsupportedTo: 'Forwarded value is not supported by this platform',
        duplicateFrom: 'Request value A must be unique',
        platformLabel: 'Platform Restriction',
        platformPlaceholder: 'Select platform (leave empty for no restriction)',
        accountsLabel: 'Designated Accounts',
        accountsPlaceholder: 'Select accounts (leave empty for no restriction)',
        priorityLabel: 'Priority',
        priorityHint: 'Lower value means higher priority, used for account scheduling',
        statusLabel: 'Status'
      },
      enterGroupName: 'Enter group name',
      optionalDescription: 'Optional description',
      platformHint: 'Select the platform this group is associated with',
      platformNotEditable: 'Platform cannot be changed after creation',
      saving: 'Saving...',
      noGroups: 'No groups yet',
      noGroupsDescription: 'Create a group to better manage API keys and rates.',
      groupCreatedSuccess: 'Group created successfully',
      groupUpdatedSuccess: 'Group updated successfully',
      groupDeletedSuccess: 'Group deleted successfully',
      rateMultiplierHint: 'Cost multiplier for this group (e.g., 1.5 = 150% of base cost)',
      noGroupsYet: 'No groups yet',
      createFirstGroup: 'Create your first group to organize API keys.',
      creating: 'Creating...',
      updating: 'Updating...',
      groupCreated: 'Group created successfully',
      groupUpdated: 'Group updated successfully',
      groupDeleted: 'Group deleted successfully',
      failedToLoad: 'Failed to load groups',
      failedToCreate: 'Failed to create group',
      failedToUpdate: 'Failed to update group',
      failedToSave: 'Failed to save group',
      failedToDelete: 'Failed to delete group',
      nameRequired: 'Please enter group name',
      platforms: {
        all: 'All Platforms',
        anthropic: 'Anthropic',
        openai: 'OpenAI',
        gemini: 'Gemini',
        antigravity: 'Antigravity',
        grok: 'Grok',
        composite: 'Composite',
      },
      deleteConfirm:
        "Are you sure you want to delete '{name}'? All associated API keys will no longer belong to any group.",
      imagePricing: {
        title: 'Image Generation Pricing',
        description: 'Configure image generation access and base image prices. Leave empty to use default prices.',
        allowImageGeneration: 'Allow image generation for this group',
        forceImageTool: 'Force Responses image tool through Images API',
        forceImageToolHint: 'Injects image_generation when absent and routes each image through a same-group forced Images API account.',
        independentMultiplier: 'Use independent image multiplier',
        imageMultiplier: 'Image multiplier',
        modeHint: 'By default, image billing uses image price × current effective group multiplier. Independent mode uses image price × image multiplier.',
        finalPricePreview: 'Final per-image price preview',
        notConfigured: 'Not configured'
      },
      videoPricing: {
        title: 'Video Generation Pricing',
        description:
          'Configure Grok video generation prices in USD per second of output video. Leave empty to use the default per-second rates (grok-imagine-video: $0.05/s 480p, $0.07/s 720p; video-1.5: $0.08/s 480p, $0.14/s 720p, $0.25/s 1080p).',
        independentMultiplier: 'Use independent video multiplier',
        videoMultiplier: 'Video multiplier',
        modeHint:
          'Videos are billed per second: per-second price × duration (1-15s, default 8s). By default the current effective group multiplier applies; independent mode uses the video multiplier instead.',
        finalPricePreview: 'Final per-second price preview',
        notConfigured: 'Not configured'
      },
      webSearchPricing: {
        title: 'Codex Web Search Pricing',
        pricePerCall: 'Price per search call (USD)',
        pricePerCallHint:
          'Leave empty to use the default $0.01 per call (official pricing: $10 per 1,000 calls); 0 means free. The group rate multiplier is applied on top.',
        finalPricePreview: 'Per-call price after current multiplier: {price}'
      },
      profitControl: {
        enable: 'Enable profit control',
        enabledHint: 'Scheduling only admits accounts whose account multiplier is no greater than the request effective downstream multiplier times (1 - min margin - safety buffer). Existing ordering, stickiness, and breakers keep working among qualified accounts. Image and video scheduling are not covered yet.',
        disabledHint: 'When disabled, scheduling does no profit filtering. Accounts whose multiplier exceeds the downstream multiplier can still be selected and may produce loss-making requests.',
        minMargin: 'Min gross margin (%)',
        minMarginHint: 'Percent input, e.g. 30 means 30%; stored as a decimal on the backend',
        safetyBuffer: 'Safety buffer (%)',
        safetyBufferHint: 'Added to min margin and deducted from the downstream multiplier; defaults to 0',
        marginRangeError: 'Min gross margin must be between 0 and 99.99',
        bufferRangeError: 'Safety buffer must be between 0 and 99.99',
        sumTooHigh: 'Min gross margin plus safety buffer must be less than 100%, otherwise every account would be excluded'
      },
      modelsList: {
        title: 'Custom /v1/models Model List',
        hint: 'Only changes the /v1/models response. Whitelist model calls and account routing are unchanged.',
        loading: 'Loading model list...',
        empty: 'No displayable models',
        selectedSummary: 'Selected {selected} / {total}',
        selectAll: 'Select all',
        invertSelection: 'Invert'
      },
      compositeRoutes: {
        action: 'Routes',
        title: 'Composite Routes',
        titleWithGroup: 'Composite Routes: {name}',
        routes: 'Saved Routes',
        empty: 'No composite routes configured',
        publicModel: 'Public Model',
        target: 'Target',
        scope: 'Scope',
        priority: 'Priority',
        addRoute: 'Add Route',
        editRoute: 'Edit Route',
        matchType: 'Match',
        endpoint: 'Endpoint',
        targetPlatform: 'Target Platform',
        upstreamModel: 'Upstream Model',
        upstreamModelHint: 'Leave empty to pass the original requested model through: under prefix match each matched model forwards verbatim (e.g. deepseek-v4-flash and deepseek-v4-pro each forwarded as-is); set a value to forward every matched request to that fixed model.',
        passthroughRequestedModel: 'Requested model (passthrough)',
        notes: 'Notes',
        enabled: 'Enabled',
        preview: 'Preview',
        matched: 'Matched',
        notMatched: 'No Match',
        publicModelRequired: 'Public model is required',
        routeCreated: 'Composite route created',
        routeUpdated: 'Composite route updated',
        routeDeleted: 'Composite route deleted',
        failedToLoad: 'Failed to load composite routes',
        failedToSave: 'Failed to save composite route',
        failedToDelete: 'Failed to delete composite route',
        failedToPreview: 'Failed to preview composite route',
        deleteConfirm: 'Delete this composite route?',
        endpoints: {
          any: 'Any',
          messages: 'Messages',
          countTokens: 'Count Tokens',
          responses: 'Responses',
          chatCompletions: 'Chat Completions',
          embeddings: 'Embeddings',
          images: 'Images',
          gemini: 'Gemini Native'
        },
        match: {
          exact: 'Exact',
          prefix: 'Prefix'
        },
        sources: {
          route: 'Route',
          detector: 'Detector'
        }
      },
      claudeCode: {
        title: 'Claude Code Client Restriction',
        tooltip: 'When enabled, this group only allows official Claude Code clients. Non-Claude Code requests will be rejected or fallback to the specified group.',
        enabled: 'Claude Code Only',
        disabled: 'Allow All Clients',
        fallbackGroup: 'Fallback Group',
        fallbackHint: 'Non-Claude Code requests will use this group. Leave empty to reject directly.',
        noFallback: 'No Fallback (Reject)'
      },
      openaiMessages: {
        title: 'OpenAI Messages Dispatch',
        allowDispatch: 'Allow /v1/messages dispatch',
        allowDispatchHint: 'When enabled, API keys in this OpenAI group can dispatch requests through /v1/messages endpoint',
        familyMappingTitle: 'Family Default Mapping',
        familyMappingHint: 'Requests that match the Opus, Sonnet, or Haiku families will prefer the target model configured here.',
        opusModel: 'Opus Target Model',
        opusModelPlaceholder: 'e.g., gpt-5.4',
        sonnetModel: 'Sonnet Target Model',
        sonnetModelPlaceholder: 'e.g., gpt-5.3-codex',
        haikuModel: 'Haiku Target Model',
        haikuModelPlaceholder: 'e.g., gpt-5.4-mini',
        exactMappingTitle: 'Exact Model Overrides',
        exactMappingHint: 'Exact Claude model overrides take priority over the family defaults and can route a specific Claude model to a different target model.',
        noExactMappings: 'No exact model overrides yet',
        addExactMapping: 'Add Exact Mapping',
        claudeModel: 'Claude Model',
        claudeModelPlaceholder: 'e.g., claude-sonnet-4-5-20250929',
        targetModel: 'Target Model',
        targetModelPlaceholder: 'e.g., gpt-5.4',
        removeExactMapping: 'Remove Exact Mapping'
      },
      openaiLive: {
        title: 'OpenAI Live',
        allow: 'Allow Live access',
        hint: 'When enabled, API keys in this OpenAI group can create and control Live voice sessions. Disabled by default. The Sub2API server must run on Apple Silicon macOS with the official ChatGPT app installed; client platforms are unrestricted.',
        unsupportedTitle: 'Current server does not support Live',
        unsupportedMessage: 'This Sub2API server cannot generate the required Live attestation. Live will not work even if enabled. Continue anyway?',
        enableAnyway: 'Enable anyway'
      },
      invalidRequestFallback: {
        title: 'Invalid Request Fallback Group',
        hint: 'Triggered only when upstream explicitly returns prompt too long. Leave empty to disable fallback.',
        noFallback: 'No Fallback'
      },
      copyAccounts: {
        title: 'Copy Accounts from Groups',
        tooltip: 'Select one or more groups of the same platform. After creation, all accounts from these groups will be automatically bound to the new group (deduplicated).',
        tooltipEdit: 'Select one or more groups of the same platform. After saving, current group accounts will be replaced with accounts from these groups (deduplicated).',
        selectPlaceholder: 'Select groups to copy accounts from...',
        hint: 'Multiple groups can be selected, accounts will be deduplicated',
        hintEdit: '⚠️ Warning: This will replace all existing account bindings'
      },
      modelRouting: {
        title: 'Model Routing',
        tooltip: 'Configure specific model requests to be routed to designated accounts. Supports wildcard matching, e.g., claude-opus-* matches all opus models.',
        enabled: 'Enabled',
        disabled: 'Disabled',
        disabledHint: 'Routing rules will only take effect when enabled',
        addRule: 'Add Routing Rule',
        modelPattern: 'Model Pattern',
        modelPatternPlaceholder: 'claude-opus-*',
        modelPatternHint: 'Supports * wildcard, e.g., claude-opus-* matches all opus models',
        accounts: 'Priority Accounts',
        selectAccounts: 'Select accounts',
        noAccounts: 'No accounts in this group',
        loadingAccounts: 'Loading accounts...',
        removeRule: 'Remove Rule',
        noRules: 'No routing rules',
        noRulesHint: 'Add routing rules to route specific model requests to designated accounts',
        searchAccountPlaceholder: 'Search accounts...',
        accountsHint: 'Select accounts to prioritize for this model pattern'
      },
      mcpXml: {
        title: 'MCP XML Protocol Injection',
        tooltip: 'When enabled, if the request contains MCP tools, an XML format call protocol prompt will be injected into the system prompt. Disable this to avoid interference with certain clients.',
        enabled: 'Enabled',
        disabled: 'Disabled'
      },
      claudeMaxSimulation: {
        title: 'Claude Max Usage Simulation',
        tooltip:
          'When enabled, for Claude models without upstream cache-write usage, the system deterministically maps tokens to a small input plus 1h cache creation while keeping total tokens unchanged.',
        enabled: 'Enabled (simulate 1h cache)',
        disabled: 'Disabled',
        hint: 'Only token categories in usage billing logs are adjusted. No per-request mapping state is persisted.'
      },
      supportedScopes: {
        title: 'Supported Model Families',
        tooltip: 'Select the model families this group supports. Unchecked families will not be routed to this group.',
        claude: 'Claude',
        geminiText: 'Gemini Text',
        geminiImage: 'Gemini Image',
        hint: 'Select at least one model family'
      }
    },

    // Available Channels (aggregated read-only view)
}
