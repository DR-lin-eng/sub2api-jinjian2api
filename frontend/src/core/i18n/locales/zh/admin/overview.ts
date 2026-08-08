export default {
    // 通用用量分析文案
    dashboard: {
      timeRange: '时间范围',
      granularity: '粒度',
      day: '按天',
      hour: '按小时',
      modelDistribution: '模型分布',
      groupDistribution: '分组使用分布',
      metricTokens: '按 Token',
      metricActualCost: '按实际消费',
      tokenUsageTrend: 'Token 使用趋势',
      model: '模型',
      group: '分组',
      noGroup: '无分组',
      requests: '请求',
      tokens: 'Token',
      actual: '实际',
      accountCost: '成本',
      standard: '标准',
      noDataAvailable: '暂无数据'
    },

    backup: {
      title: '数据库备份',
      description: '全量数据库备份到 S3 兼容存储，支持定时备份与恢复',
      s3: {
        title: 'S3 存储配置',
        description: '配置 S3 兼容存储（支持 Cloudflare R2）',
        descriptionPrefix: '配置 S3 兼容存储（支持',
        descriptionSuffix: '）',
        enabled: '启用 S3 存储',
        endpoint: '端点地址',
        region: '区域',
        bucket: '存储桶',
        prefix: 'Key 前缀',
        accessKeyId: 'Access Key ID',
        secretAccessKey: 'Secret Access Key',
        secretConfigured: '已配置，留空保持不变',
        forcePathStyle: '强制路径风格',
        testConnection: '测试连接',
        testSuccess: 'S3 连接测试成功',
        testFailed: 'S3 连接测试失败',
        saved: 'S3 配置已保存'
      },
      imageStorage: {
        title: '异步生图对象存储',
        description: '开启后，异步生图接口可用，生成结果转存到对象存储，只把短链接写入 Redis。与备份共用同一套 S3 客户端，保存后立即生效，无需重启。',
        enabled: '启用异步生图',
        reuseBackupS3: '复用上方备份的 S3 配置（只用不同的存储桶/前缀）',
        bucket: '存储桶',
        bucketInherited: '留空则沿用备份存储桶',
        prefix: 'Key 前缀',
        publicBaseUrl: '公开访问域名',
        publicBaseUrlPlaceholder: '留空则返回预签名临时链接',
        presignExpiryHours: '预签名链接有效期（小时）',
        saved: '异步生图对象存储配置已保存'
      },
      schedule: {
        title: '定时备份',
        description: '配置自动定时备份',
        enabled: '启用定时备份',
        cronExpr: 'Cron 表达式',
        cronHint: '例如 "0 2 * * *" 表示每天凌晨 2 点',
        retainDays: '备份过期天数',
        retainDaysHint: '备份文件超过此天数后自动删除，0 = 永不过期',
        retainCount: '最大保留份数',
        retainCountHint: '最多保留的备份数量，0 = 不限制',
        saved: '定时备份配置已保存'
      },
      operations: {
        title: '备份记录',
        description: '创建手动备份和管理已有备份记录',
        createBackup: '创建备份',
        backing: '备份中...',
        backupCreated: '备份创建成功',
        expireDays: '过期天数',
        alreadyInProgress: '已有备份正在进行中',
        backupRunning: '备份进行中...',
        backupFailed: '备份失败',
        restoreRunning: '恢复进行中...',
        restoreFailed: '恢复失败',
      },
      columns: {
        status: '状态',
        fileName: '文件名',
        size: '大小',
        expiresAt: '过期时间',
        triggeredBy: '触发方式',
        startedAt: '开始时间',
        actions: '操作'
      },
      status: {
        pending: '等待中',
        running: '执行中',
        completed: '已完成',
        failed: '失败'
      },
      progress: {
        pending: '准备中',
        dumping: '导出数据库',
        uploading: '上传中',
      },
      trigger: {
        manual: '手动',
        scheduled: '定时'
      },
      neverExpire: '永不过期',
      empty: '暂无备份记录',
      actions: {
        download: '下载',
        restore: '恢复',
        restoreConfirm: '确定要从此备份恢复吗？这将覆盖当前数据库！',
        restorePasswordPrompt: '请输入管理员密码以确认恢复操作',
        restoreSuccess: '数据库恢复成功',
        deleteConfirm: '确定要删除此备份吗？',
        deleted: '备份已删除'
      },
      r2Guide: {
        title: 'Cloudflare R2 配置教程',
        intro: 'Cloudflare R2 提供 S3 兼容的对象存储，免费额度为 10GB 存储 + 每月 100 万次 A 类请求，非常适合数据库备份。',
        step1: {
          title: '创建 R2 存储桶',
          line1: '登录 Cloudflare Dashboard (dash.cloudflare.com)，左侧菜单选择「R2 对象存储」',
          line2: '点击「创建存储桶」，输入名称（如 sub2api-backups），选择区域',
          line3: '点击创建完成'
        },
        step2: {
          title: '创建 API 令牌',
          line1: '在 R2 页面，点击右上角「管理 R2 API 令牌」',
          line2: '点击「创建 API 令牌」，权限选择「对象读和写」',
          line3: '建议指定存储桶范围（仅允许访问备份桶，更安全）',
          line4: '创建后会显示 Access Key ID 和 Secret Access Key',
          warning: 'Secret Access Key 只会显示一次，请立即复制保存！'
        },
        step3: {
          title: '获取 S3 端点地址',
          desc: '在 R2 概览页面找到你的账户 ID（在 URL 或右侧面板中），端点格式为：',
          accountId: '你的账户 ID'
        },
        step4: {
          title: '填写以下配置',
          checkEnabled: '勾选',
          bucketValue: '你创建的存储桶名称',
          fromStep2: '第 2 步获取的值',
          unchecked: '不勾选'
        },
        freeTier: 'R2 免费额度：10GB 存储 + 每月 100 万次 A 类请求 + 1000 万次 B 类请求，对数据库备份完全够用。'
      }
    },

    dataManagement: {
      title: '数据管理',
      description: '统一管理数据管理代理状态、对象存储配置和备份任务',
      agent: {
        title: '数据管理代理状态',
        description: '系统会自动探测固定 Unix Socket，仅在可连通时启用数据管理功能。',
        enabled: '数据管理代理已就绪，可继续进行数据管理操作。',
        disabled: '数据管理代理不可用，当前仅可查看诊断信息。',
        socketPath: 'Socket 路径',
        version: '版本',
        status: '状态',
        uptime: '运行时长',
        reasonLabel: '不可用原因',
        reason: {
          DATA_MANAGEMENT_AGENT_SOCKET_MISSING: '未检测到数据管理 Socket 文件',
          DATA_MANAGEMENT_AGENT_UNAVAILABLE: '数据管理代理不可连通',
          BACKUP_AGENT_SOCKET_MISSING: '未检测到备份 Socket 文件',
          BACKUP_AGENT_UNAVAILABLE: '备份代理不可连通',
          UNKNOWN: '未知原因'
        }
      },
      sections: {
        config: {
          title: '备份配置',
          description: '配置备份源、保留策略与 S3 存储参数。'
        },
        s3: {
          title: 'S3 对象存储',
          description: '配置并测试备份产物上传到标准 S3 对象存储。'
        },
        backup: {
          title: '备份操作',
          description: '触发 PostgreSQL、Redis 与全量备份任务。'
        },
        history: {
          title: '备份历史',
          description: '查看备份任务执行状态、错误与产物信息。'
        }
      },
      form: {
        sourceMode: '源模式',
        backupRoot: '备份根目录',
        activePostgresProfile: '当前激活 PostgreSQL 配置',
        activeRedisProfile: '当前激活 Redis 配置',
        activeS3Profile: '当前激活 S3 账号',
        retentionDays: '保留天数',
        keepLast: '至少保留最近任务数',
        uploadToS3: '上传到 S3',
        useActivePostgresProfile: '使用当前激活 PostgreSQL 配置',
        useActiveRedisProfile: '使用当前激活 Redis 配置',
        useActiveS3Profile: '使用当前激活账号',
        idempotencyKey: '幂等键（可选）',
        secretConfigured: '已配置，留空不变',
        source: {
          profileID: '配置 ID（唯一）',
          profileName: '配置名称',
          setActive: '创建后立即设为激活配置'
        },
        postgres: {
          title: 'PostgreSQL',
          host: '主机',
          port: '端口',
          user: '用户名',
          password: '密码',
          database: '数据库',
          sslMode: 'SSL 模式',
          containerName: '容器名（docker_exec 模式）'
        },
        redis: {
          title: 'Redis',
          addr: '地址（host:port）',
          username: '用户名',
          password: '密码',
          db: '数据库编号',
          containerName: '容器名（docker_exec 模式）'
        },
        s3: {
          enabled: '启用 S3 上传',
          profileID: '账号 ID（唯一）',
          profileName: '账号名称',
          endpoint: 'Endpoint（可选）',
          region: 'Region',
          bucket: 'Bucket',
          accessKeyID: 'Access Key ID',
          secretAccessKey: 'Secret Access Key',
          prefix: '对象前缀',
          forcePathStyle: '强制 path-style',
          useSSL: '使用 SSL',
          setActive: '创建后立即设为激活账号'
        }
      },
      sourceProfiles: {
        createTitle: '创建数据源配置',
        editTitle: '编辑数据源配置',
        empty: '暂无配置，请先创建',
        deleteConfirm: '确定删除配置 {profileID} 吗？',
        columns: {
          profile: '配置',
          active: '激活状态',
          connection: '连接信息',
          database: '数据库',
          updatedAt: '更新时间',
          actions: '操作'
        }
      },
      s3Profiles: {
        createTitle: '创建 S3 账号',
        editTitle: '编辑 S3 账号',
        empty: '暂无 S3 账号，请先创建',
        editHint: '点击“编辑”将在右侧抽屉中修改账号信息。',
        deleteConfirm: '确定删除 S3 账号 {profileID} 吗？',
        columns: {
          profile: '账号',
          active: '激活状态',
          storage: '存储配置',
          updatedAt: '更新时间',
          actions: '操作'
        }
      },
      history: {
        total: '共 {count} 条',
        empty: '暂无备份任务',
        columns: {
          jobID: '任务 ID',
          type: '类型',
          status: '状态',
          triggeredBy: '触发人',
          pgProfile: 'PostgreSQL 配置',
          redisProfile: 'Redis 配置',
          s3Profile: 'S3 账号',
          finishedAt: '完成时间',
          artifact: '产物',
          error: '错误'
        },
        status: {
          queued: '排队中',
          running: '执行中',
          succeeded: '成功',
          failed: '失败',
          partial_succeeded: '部分成功'
        }
      },
      actions: {
        refresh: '刷新状态',
        disabledHint: '请先启动 datamanagementd 并确认 Socket 可连通。',
        reloadConfig: '加载配置',
        reloadSourceProfiles: '刷新数据源配置',
        reloadProfiles: '刷新账号列表',
        newSourceProfile: '新建数据源配置',
        saveConfig: '保存配置',
        configSaved: '配置保存成功',
        testS3: '测试 S3 连接',
        s3TestOK: 'S3 连接测试成功',
        s3TestFailed: 'S3 连接测试失败',
        newProfile: '新建账号',
        saveProfile: '保存账号',
        activateProfile: '设为激活',
        profileIDRequired: '请输入账号 ID',
        profileNameRequired: '请输入账号名称',
        profileSelectRequired: '请先选择要编辑的账号',
        profileCreated: 'S3 账号创建成功',
        profileSaved: 'S3 账号保存成功',
        profileActivated: 'S3 账号已切换为激活',
        profileDeleted: 'S3 账号删除成功',
        sourceProfileCreated: '数据源配置创建成功',
        sourceProfileSaved: '数据源配置保存成功',
        sourceProfileActivated: '数据源配置已切换为激活',
        sourceProfileDeleted: '数据源配置删除成功',
        createBackup: '创建备份任务',
        jobCreated: '备份任务已创建：{jobID}（{status}）',
        refreshJobs: '刷新任务',
        loadMore: '加载更多'
      }
    },

    // Groups Management
    groups: {
      title: '分组管理',
      description: '管理 API 密钥分组和费率配置',
      searchGroups: '搜索分组...',
      createGroup: '创建分组',
      editGroup: '编辑分组',
      deleteGroup: '删除分组',
      duplicate: '复制',
      duplicating: '复制中',
      duplicateSuccess: '分组已复制为「{name}」，已默认停用，请确认配置后再启用',
      duplicateFailed: '复制分组失败',
      sortOrder: '排序',
      columnSettings: '列设置',
      sortOrderHint: '拖拽分组调整显示顺序，排在前面的分组会优先显示',
      sortOrderUpdated: '排序已更新',
      failedToUpdateSortOrder: '更新排序失败',
      deleteConfirm: "确定要删除分组 '{name}' 吗？所有关联的 API 密钥将不再属于任何分组。",
      columns: {
        name: '名称',
        id: 'ID',
        platform: '平台',
        rateMultiplier: '费率倍数',
        priority: '优先级',
        apiKeys: 'API 密钥数',
        accounts: '账号数',
        capacity: '容量',
        usage: '用量',
        status: '状态',
        actions: '操作'
      },
      usageToday: '今日',
      usageTotal: '累计',
      accountsAvailable: '可用:',
      accountsRateLimited: '限流:',
      accountsTotal: '总量:',
      accountsUnit: '个账号',
      form: {
        name: '名称',
        description: '描述',
        platform: '平台',
        rateMultiplier: '费率倍数',
        status: '状态',
        nameLabel: '分组名称',
        namePlaceholder: '请输入分组名称',
        descriptionLabel: '描述',
        descriptionPlaceholder: '请输入描述（可选）',
        rateMultiplierLabel: '费率倍数',
        rateMultiplierHint: '1.0 = 标准费率，0.5 = 半价，2.0 = 双倍',
        rpmLimit: '每分钟请求数 (RPM)',
        rpmLimitPlaceholder: '0 表示不限制',
        rpmLimitHint: '分配到此分组的 API 密钥每分钟最大请求数；0 表示不限制。',
        maxReasoningEffort: '推理强度上限',
        maxReasoningEffortUnlimited: '不限制（跟随请求）',
        maxReasoningEffortHint: '仅限制客户端主动请求的 OpenAI reasoning effort；Composite 分组仅对解析到 OpenAI 的请求生效。超过上限时自动降档，不会为缺省请求主动开启推理。上限优先级高于推理强度映射。',
        reasoningEffortMappings: '推理强度映射',
        addReasoningEffortMapping: '添加映射',
        removeReasoningEffortMapping: '删除映射',
        reasoningEffortFrom: '请求值',
        reasoningEffortTo: '转发值',
        reasoningEffortFromPlaceholder: '请选择 A',
        reasoningEffortToPlaceholder: '请选择 B',
        fromRequired: '请选择请求值 A',
        toRequired: '请选择转发值 B',
        unsupportedFrom: '请求值不受当前平台支持',
        unsupportedTo: '转发值不受当前平台支持',
        duplicateFrom: '请求值 A 不能重复',
        platformLabel: '平台限制',
        platformPlaceholder: '选择平台（留空则不限制）',
        accountsLabel: '指定账号',
        accountsPlaceholder: '选择账号（留空则不限制）',
        priorityLabel: '优先级',
        priorityHint: '数值越小优先级越高，用于账号调度',
        statusLabel: '状态'
      },
      rateMultiplierHint: '1.0 = 标准费率，0.5 = 半价，2.0 = 双倍',
      platforms: {
        all: '全部平台',
        anthropic: 'Anthropic',
        openai: 'OpenAI',
        gemini: 'Gemini',
        antigravity: 'Antigravity',
        grok: 'Grok',
        composite: 'Composite',
      },
      saving: '保存中...',
      noGroups: '暂无分组',
      noGroupsDescription: '创建分组以更好地管理 API 密钥和费率。',
      groupCreatedSuccess: '分组创建成功',
      groupUpdatedSuccess: '分组更新成功',
      groupDeletedSuccess: '分组删除成功',
      failedToLoad: '加载分组列表失败',
      failedToSave: '保存分组失败',
      failedToDelete: '删除分组失败',
      allPlatforms: '全部平台',
      allStatus: '全部状态',
      allGroups: '全部分组',
      rateAndAccounts: '{rate}x 费率 · {count} 个账号',
      accountsCount: '{count} 个账号',
      rateLabel: '倍率',
      accountFilters: {
        title: '账号过滤控制',
        oauthOnly: '仅允许 OAuth 账号',
        oauthOnlyEnabled: '已启用 — 排除 API Key 类型账号',
        privacySetOnly: '仅允许隐私保护已设置的账号',
        privacySetOnlyEnabled: '已启用 — Privacy 未设置的账号将被排除',
        disabled: '未启用'
      },
      enterGroupName: '请输入分组名称',
      optionalDescription: '可选描述',
      platformHint: '选择此分组关联的平台',
      platformNotEditable: '创建后不可更改平台',
      noGroupsYet: '暂无分组',
      createFirstGroup: '创建您的第一个分组来组织 API 密钥。',
      creating: '创建中...',
      updating: '更新中...',
      groupCreated: '分组创建成功',
      groupUpdated: '分组更新成功',
      groupDeleted: '分组删除成功',
      failedToCreate: '创建分组失败',
      failedToUpdate: '更新分组失败',
      nameRequired: '请输入分组名称',
      imagePricing: {
        title: '图片生成计费',
        description: '配置图片生成能力和图片基础单价，留空则使用默认价格',
        allowImageGeneration: '允许当前分组生图',
        forceImageTool: '强制 Responses 画图工具走 Images API',
        forceImageToolHint: '未声明时注入 image_generation，并将每张图片重新调度到同组强制 Images API 账号。',
        independentMultiplier: '生图倍率独立',
        imageMultiplier: '生图独立倍率',
        modeHint: '默认关闭独立倍率时，图片费用 = 图片价格 × 当前分组有效倍率；开启独立倍率后，图片费用 = 图片价格 × 生图独立倍率。',
        finalPricePreview: '最终单张价格预览',
        notConfigured: '未配置'
      },
      videoPricing: {
        title: '视频生成计费',
        description:
          '配置 Grok 视频生成的每秒单价（USD/秒），留空则使用默认每秒价（grok-imagine-video：480p $0.05/s、720p $0.07/s；video-1.5：480p $0.08/s、720p $0.14/s、1080p $0.25/s）',
        independentMultiplier: '视频倍率独立',
        videoMultiplier: '视频独立倍率',
        modeHint:
          '视频按秒计费：费用 = 每秒价格 × 时长（1-15 秒，未指定默认 8 秒）。默认叠加当前分组有效倍率；开启独立倍率后改用视频独立倍率。',
        finalPricePreview: '最终每秒价格预览',
        notConfigured: '未配置'
      },
      webSearchPricing: {
        title: 'Codex 网页搜索计费',
        pricePerCall: '搜索单次价格（USD/次）',
        pricePerCallHint:
          '留空使用默认价 $0.01/次（官方定价 $10/1000 次）；填 0 表示不计成本。倍率费用会叠加分组费率倍数。',
        finalPricePreview: '应用当前倍率后的单次价格：{price}'
      },
      profitControl: {
        enable: '启用利润控制',
        enabledHint: '调度时仅允许“账号倍率不高于请求实际下游倍率乘以（1 - 最低毛利率 - 安全缓冲）”的账号进入候选池；既有排序、粘性与熔断在合格账号间照常工作。图片和视频调度暂不参与。',
        disabledHint: '关闭后调度不做利润过滤，账号倍率高于下游倍率的账号仍可能被选中并产生亏损请求。',
        minMargin: '最低毛利率（%）',
        minMarginHint: '百分比输入，如 30 表示 30%；后端按小数存储',
        safetyBuffer: '安全缓冲（%）',
        safetyBufferHint: '与最低毛利率相加后从下游倍率中扣除，默认 0',
        marginRangeError: '最低毛利率应在 0 到 99.99 之间',
        bufferRangeError: '安全缓冲应在 0 到 99.99 之间',
        sumTooHigh: '最低毛利率与安全缓冲之和必须小于 100%，否则将排除全部账号'
      },
      modelsList: {
        title: '自定义 /v1/models 模型列表',
        hint: '仅影响 /v1/models 展示结果，不影响白名单模型调用和账号调度。',
        loading: '正在加载模型列表...',
        empty: '暂无可展示模型',
        selectedSummary: '已选 {selected} / {total}',
        selectAll: '全选',
        invertSelection: '反选'
      },
      compositeRoutes: {
        action: '路由',
        title: 'Composite 路由',
        titleWithGroup: 'Composite 路由：{name}',
        routes: '已保存路由',
        empty: '暂无 Composite 路由',
        publicModel: '公开模型',
        target: '目标',
        scope: '范围',
        priority: '优先级',
        addRoute: '添加路由',
        editRoute: '编辑路由',
        matchType: '匹配方式',
        endpoint: '端点',
        targetPlatform: '目标平台',
        upstreamModel: '上游模型',
        upstreamModelHint: '留空表示透传原始请求模型：前缀匹配下每个命中模型各自原样转发（如 deepseek-v4-flash、deepseek-v4-pro 分别转发）；填写则所有命中请求都固定转发该模型。',
        passthroughRequestedModel: '原始请求模型（透传）',
        notes: '备注',
        enabled: '启用',
        preview: '预览',
        matched: '已匹配',
        notMatched: '未匹配',
        publicModelRequired: '请输入公开模型',
        routeCreated: 'Composite 路由已创建',
        routeUpdated: 'Composite 路由已更新',
        routeDeleted: 'Composite 路由已删除',
        failedToLoad: '加载 Composite 路由失败',
        failedToSave: '保存 Composite 路由失败',
        failedToDelete: '删除 Composite 路由失败',
        failedToPreview: '预览 Composite 路由失败',
        deleteConfirm: '确定删除此 Composite 路由？',
        endpoints: {
          any: '任意',
          messages: 'Messages',
          countTokens: 'Count Tokens',
          responses: 'Responses',
          chatCompletions: 'Chat Completions',
          embeddings: 'Embeddings',
          images: 'Images',
          gemini: 'Gemini 原生'
        },
        match: {
          exact: '精确',
          prefix: '前缀'
        },
        sources: {
          route: '路由',
          detector: '内置识别'
        }
      },
      claudeCode: {
        title: 'Claude Code 客户端限制',
        tooltip:
          '启用后，此分组仅允许 Claude Code 官方客户端访问。非 Claude Code 请求将被拒绝或降级到指定分组。',
        enabled: '仅限 Claude Code',
        disabled: '允许所有客户端',
        fallbackGroup: '降级分组',
        fallbackHint: '非 Claude Code 请求将使用此分组，留空则直接拒绝',
        noFallback: '不降级（直接拒绝）'
      },
      openaiMessages: {
        title: 'OpenAI Messages 调度配置',
        allowDispatch: '允许 /v1/messages 调度',
        allowDispatchHint: '启用后，此 OpenAI 分组的 API Key 可以通过 /v1/messages 端点调度请求',
        familyMappingTitle: '系列默认映射',
        familyMappingHint: '当请求命中 Opus、Sonnet、Haiku 系列时，会优先使用这里配置的目标模型。',
        opusModel: 'Opus 映射模型',
        opusModelPlaceholder: '例如: gpt-5.4',
        sonnetModel: 'Sonnet 映射模型',
        sonnetModelPlaceholder: '例如: gpt-5.3-codex',
        haikuModel: 'Haiku 映射模型',
        haikuModelPlaceholder: '例如: gpt-5.4-mini',
        exactMappingTitle: '精确模型覆盖',
        exactMappingHint: '精确 Claude 模型覆盖优先级高于系列默认映射，可将某个具体 Claude 模型单独映射到不同的目标模型。',
        noExactMappings: '暂无精确模型覆盖规则',
        addExactMapping: '添加精确映射',
        claudeModel: 'Claude 模型',
        claudeModelPlaceholder: '例如: claude-sonnet-4-5-20250929',
        targetModel: '目标模型',
        targetModelPlaceholder: '例如: gpt-5.4',
        removeExactMapping: '删除精确映射'
      },
      openaiLive: {
        title: 'OpenAI Live',
        allow: '允许访问 Live',
        hint: '启用后，此 OpenAI 分组的 API Key 可以创建并控制 Live 语音会话。默认关闭。运行 Sub2API 的服务端必须是 Apple Silicon Mac，并安装官方 ChatGPT App；客户端平台不受限制。',
        unsupportedTitle: '当前服务端不支持 Live',
        unsupportedMessage: '当前 Sub2API 服务端无法生成 Live 所需的设备证明，即使开启也不能使用。是否仍然开启？',
        enableAnyway: '仍然开启'
      },
      invalidRequestFallback: {
        title: '无效请求兜底分组',
        hint: '仅当上游明确返回 prompt too long 时才会触发，留空表示不兜底',
        noFallback: '不兜底'
      },
      copyAccounts: {
        title: '从分组复制账号',
        tooltip: '选择一个或多个相同平台的分组，创建后会自动将这些分组的所有账号绑定到新分组（去重）。',
        tooltipEdit: '选择一个或多个相同平台的分组，保存后当前分组的账号会被替换为这些分组的账号（去重）。',
        selectPlaceholder: '选择分组以复制其账号...',
        hint: '可选多个分组，账号会自动去重',
        hintEdit: '⚠️ 注意：这会替换当前分组的所有账号绑定'
      },
      modelRouting: {
        title: '模型路由配置',
        tooltip:
          '配置特定模型请求优先路由到指定账号。支持通配符匹配，如 claude-opus-* 匹配所有 opus 模型。',
        enabled: '已启用',
        disabled: '已禁用',
        disabledHint: '启用后，配置的路由规则才会生效',
        addRule: '添加路由规则',
        modelPattern: '模型模式',
        modelPatternPlaceholder: 'claude-opus-*',
        modelPatternHint: '支持 * 通配符，如 claude-opus-* 匹配所有 opus 模型',
        accounts: '优先账号',
        selectAccounts: '选择账号',
        noAccounts: '此分组暂无账号',
        loadingAccounts: '加载账号中...',
      claudeMaxSimulation: {
        title: 'Claude Max 用量模拟',
        tooltip:
          '启用后，对于没有上游缓存写入用量的 Claude 模型，系统会确定性地将 token 映射为少量输入加 1h 缓存创建，同时保持总 token 不变。',
        enabled: '已启用（模拟 1h 缓存）',
        disabled: '已禁用',
        hint: '仅调整用量计费日志中的 token 类别。不会持久化每个请求的映射状态。'
      },
        removeRule: '删除规则',
        noRules: '暂无路由规则',
        noRulesHint: '添加路由规则以将特定模型请求优先路由到指定账号',
        searchAccountPlaceholder: '搜索账号...',
        accountsHint: '选择此模型模式优先使用的账号'
      },
      mcpXml: {
        title: 'MCP XML 协议注入',
        tooltip: '启用后，当请求包含 MCP 工具时，会在 system prompt 中注入 XML 格式调用协议提示词。关闭此选项可避免对某些客户端造成干扰。',
        enabled: '已启用',
        disabled: '已禁用'
      },
      claudeMaxSimulation: {
        title: 'Claude Max 用量模拟',
        tooltip:
          '启用后，对于上游未返回 cache-write 用量的 Claude 模型，系统会确定性地把 token 映射为少量输入和 1h 缓存创建，同时保持总 token 不变。',
        enabled: '已启用（模拟 1h 缓存）',
        disabled: '已禁用',
        hint: '仅调整用量计费日志中的 token 分类，不会持久化逐请求映射状态。'
      },
      supportedScopes: {
        title: '支持的模型系列',
        tooltip: '选择此分组支持的模型系列。未勾选的系列将不会被路由到此分组。',
        claude: 'Claude',
        geminiText: 'Gemini Text',
        geminiImage: 'Gemini Image',
        hint: '至少选择一个模型系列'
      }
    },

    // Available Channels (aggregated read-only view)
}
