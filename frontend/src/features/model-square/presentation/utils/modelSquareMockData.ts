export type ModelCategory = 'chat' | 'reasoning' | 'image' | 'video' | 'embedding'

export type ModelCapability =
  | 'vision'
  | 'tools'
  | 'reasoning'
  | 'streaming'
  | 'structuredOutput'
  | 'imageGeneration'
  | 'videoGeneration'
  | 'embedding'

export interface ModelGroupRate {
  groupId: 'default' | 'developer' | 'vip'
  inputMultiplier: number
  outputMultiplier: number
}

export interface ModelSquareDisplayItem {
  id: string
  name: string
  providerId: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'alibaba'
  providerName: string
  category: ModelCategory
  descriptionKey: string
  contextWindow: string
  maxOutput: string
  inputPrice: number
  outputPrice: number
  capabilities: ModelCapability[]
  groupRates: ModelGroupRate[]
  badge?: 'recommended' | 'new' | 'popular'
}

const standardGroupRates: ModelGroupRate[] = [
  { groupId: 'default', inputMultiplier: 1, outputMultiplier: 1 },
  { groupId: 'developer', inputMultiplier: 0.85, outputMultiplier: 0.85 },
  { groupId: 'vip', inputMultiplier: 0.72, outputMultiplier: 0.72 },
]

export const modelSquareMockData: ModelSquareDisplayItem[] = [
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    providerId: 'openai',
    providerName: 'OpenAI',
    category: 'chat',
    descriptionKey: 'modelSquare.models.gpt41',
    contextWindow: '1M',
    maxOutput: '32K',
    inputPrice: 2,
    outputPrice: 8,
    capabilities: ['vision', 'tools', 'streaming', 'structuredOutput'],
    groupRates: standardGroupRates,
    badge: 'recommended',
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    providerId: 'anthropic',
    providerName: 'Anthropic',
    category: 'chat',
    descriptionKey: 'modelSquare.models.claudeSonnet4',
    contextWindow: '200K',
    maxOutput: '64K',
    inputPrice: 3,
    outputPrice: 15,
    capabilities: ['vision', 'tools', 'reasoning', 'streaming'],
    groupRates: [
      { groupId: 'default', inputMultiplier: 1.1, outputMultiplier: 1.1 },
      { groupId: 'developer', inputMultiplier: 0.95, outputMultiplier: 0.95 },
      { groupId: 'vip', inputMultiplier: 0.8, outputMultiplier: 0.8 },
    ],
    badge: 'popular',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    providerId: 'google',
    providerName: 'Google',
    category: 'reasoning',
    descriptionKey: 'modelSquare.models.gemini25Pro',
    contextWindow: '1M',
    maxOutput: '64K',
    inputPrice: 1.25,
    outputPrice: 10,
    capabilities: ['vision', 'tools', 'reasoning', 'streaming', 'structuredOutput'],
    groupRates: standardGroupRates,
    badge: 'recommended',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    providerId: 'deepseek',
    providerName: 'DeepSeek',
    category: 'reasoning',
    descriptionKey: 'modelSquare.models.deepseekR1',
    contextWindow: '128K',
    maxOutput: '32K',
    inputPrice: 0.55,
    outputPrice: 2.19,
    capabilities: ['reasoning', 'streaming'],
    groupRates: [
      { groupId: 'default', inputMultiplier: 0.9, outputMultiplier: 0.9 },
      { groupId: 'developer', inputMultiplier: 0.75, outputMultiplier: 0.75 },
      { groupId: 'vip', inputMultiplier: 0.65, outputMultiplier: 0.65 },
    ],
    badge: 'popular',
  },
  {
    id: 'qwen3-235b-a22b',
    name: 'Qwen3 235B',
    providerId: 'alibaba',
    providerName: 'Alibaba Cloud',
    category: 'chat',
    descriptionKey: 'modelSquare.models.qwen3235b',
    contextWindow: '128K',
    maxOutput: '32K',
    inputPrice: 0.7,
    outputPrice: 2.8,
    capabilities: ['tools', 'reasoning', 'streaming'],
    groupRates: standardGroupRates,
    badge: 'new',
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    providerId: 'openai',
    providerName: 'OpenAI',
    category: 'image',
    descriptionKey: 'modelSquare.models.dalle3',
    contextWindow: '-',
    maxOutput: '4096 px',
    inputPrice: 0,
    outputPrice: 40,
    capabilities: ['imageGeneration'],
    groupRates: standardGroupRates,
  },
  {
    id: 'veo-3',
    name: 'Veo 3',
    providerId: 'google',
    providerName: 'Google',
    category: 'video',
    descriptionKey: 'modelSquare.models.veo3',
    contextWindow: '-',
    maxOutput: '1080p',
    inputPrice: 0,
    outputPrice: 0.4,
    capabilities: ['videoGeneration'],
    groupRates: [
      { groupId: 'default', inputMultiplier: 1.2, outputMultiplier: 1.2 },
      { groupId: 'developer', inputMultiplier: 1, outputMultiplier: 1 },
      { groupId: 'vip', inputMultiplier: 0.9, outputMultiplier: 0.9 },
    ],
    badge: 'new',
  },
  {
    id: 'text-embedding-3-large',
    name: 'Embedding 3 Large',
    providerId: 'openai',
    providerName: 'OpenAI',
    category: 'embedding',
    descriptionKey: 'modelSquare.models.embedding3Large',
    contextWindow: '8K',
    maxOutput: '3072 dims',
    inputPrice: 0.13,
    outputPrice: 0,
    capabilities: ['embedding'],
    groupRates: standardGroupRates,
  },
]
