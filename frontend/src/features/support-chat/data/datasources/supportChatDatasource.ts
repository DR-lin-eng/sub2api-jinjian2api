import apiClient, { buildApiUrl } from '@/core/networks/client'
import { getAccessToken } from '@/core/networks/tokenStore'
import type { PaginatedResponse } from '@/types'

export type ChatSenderType = 'user' | 'admin'

export interface ChatConversation {
  id: number
  user_id: number
  last_message_at: string | null
  unread_by_user: number
  unread_by_admin: number
  created_at: string
  updated_at: string
  user_email?: string
  user_username?: string
}

export interface ChatMessage {
  id: number
  conversation_id: number
  sender_type: ChatSenderType
  sender_id: number
  content: string
  created_at: string
}

export interface ChatConversationListParams {
  page?: number
  page_size?: number
  unread_only?: boolean
  search?: string
}

export interface ChatMessageListParams {
  page?: number
  page_size?: number
}

interface RawChatConversation {
  id?: number
  ID?: number
  user_id?: number
  UserID?: number
  last_message_at?: string | null
  LastMessageAt?: string | null
  unread_by_user?: number
  UnreadByUser?: number
  unread_by_admin?: number
  UnreadByAdmin?: number
  created_at?: string
  CreatedAt?: string
  updated_at?: string
  UpdatedAt?: string
  user_email?: string
  UserEmail?: string
  user_username?: string
  UserUsername?: string
}

interface RawChatMessage {
  id?: number
  ID?: number
  conversation_id?: number
  ConversationID?: number
  sender_type?: ChatSenderType
  SenderType?: ChatSenderType
  sender_id?: number
  SenderID?: number
  content?: string
  Content?: string
  created_at?: string
  CreatedAt?: string
}

interface RawSocketEvent {
  type?: string
  Type?: string
  message?: RawChatMessage
  Message?: RawChatMessage
}

const USER_CHAT_WS_PROTOCOL = 'sub2api-chat'
const ADMIN_CHAT_WS_PROTOCOL = 'sub2api-admin-chat'

function numberValue(value: unknown, fallback = 0): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function nullableStringValue(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

export function normalizeChatConversation(raw: RawChatConversation): ChatConversation {
  return {
    id: numberValue(raw.id ?? raw.ID),
    user_id: numberValue(raw.user_id ?? raw.UserID),
    last_message_at: nullableStringValue(raw.last_message_at ?? raw.LastMessageAt),
    unread_by_user: numberValue(raw.unread_by_user ?? raw.UnreadByUser),
    unread_by_admin: numberValue(raw.unread_by_admin ?? raw.UnreadByAdmin),
    created_at: stringValue(raw.created_at ?? raw.CreatedAt),
    updated_at: stringValue(raw.updated_at ?? raw.UpdatedAt),
    user_email: stringValue(raw.user_email ?? raw.UserEmail),
    user_username: stringValue(raw.user_username ?? raw.UserUsername),
  }
}

export function normalizeChatMessage(raw: RawChatMessage): ChatMessage {
  const senderType = raw.sender_type ?? raw.SenderType
  return {
    id: numberValue(raw.id ?? raw.ID),
    conversation_id: numberValue(raw.conversation_id ?? raw.ConversationID),
    sender_type: senderType === 'admin' ? 'admin' : 'user',
    sender_id: numberValue(raw.sender_id ?? raw.SenderID),
    content: stringValue(raw.content ?? raw.Content),
    created_at: stringValue(raw.created_at ?? raw.CreatedAt),
  }
}

function normalizePaginatedMessages(data: PaginatedResponse<RawChatMessage>): PaginatedResponse<ChatMessage> {
  return {
    ...data,
    items: Array.isArray(data.items) ? data.items.map(normalizeChatMessage) : [],
  }
}

function normalizePaginatedConversations(data: PaginatedResponse<RawChatConversation>): PaginatedResponse<ChatConversation> {
  return {
    ...data,
    items: Array.isArray(data.items) ? data.items.map(normalizeChatConversation) : [],
  }
}

export function parseChatSocketEvent(raw: string): { type: string; message?: ChatMessage } | null {
  try {
    const data = JSON.parse(raw) as RawSocketEvent
    const type = stringValue(data.type ?? data.Type)
    const message = data.message ?? data.Message
    if (!type) return null
    return { type, message: message ? normalizeChatMessage(message) : undefined }
  } catch {
    return null
  }
}

export async function getUserChatConversation(): Promise<ChatConversation> {
  const { data } = await apiClient.get<RawChatConversation>('/chat/conversation')
  return normalizeChatConversation(data)
}

export async function listUserChatMessages(params: ChatMessageListParams): Promise<PaginatedResponse<ChatMessage>> {
  const { data } = await apiClient.get<PaginatedResponse<RawChatMessage>>('/chat/messages', { params })
  return normalizePaginatedMessages(data)
}

export async function sendUserChatMessage(content: string): Promise<ChatMessage> {
  const { data } = await apiClient.post<RawChatMessage>('/chat/messages', { content })
  return normalizeChatMessage(data)
}

export async function markUserChatRead(): Promise<void> {
  await apiClient.post('/chat/read')
}

export async function getUserChatUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<{ unread_count?: number }>('/chat/unread-count')
  return numberValue(data?.unread_count)
}

export async function listAdminChatConversations(params: ChatConversationListParams): Promise<PaginatedResponse<ChatConversation>> {
  const { data } = await apiClient.get<PaginatedResponse<RawChatConversation>>('/admin/chat/conversations', { params })
  return normalizePaginatedConversations(data)
}

export async function getAdminChatUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<{ unread_count?: number }>('/admin/chat/unread-count')
  return numberValue(data?.unread_count)
}

export async function listAdminChatMessages(conversationID: number, params: ChatMessageListParams): Promise<PaginatedResponse<ChatMessage>> {
  const { data } = await apiClient.get<PaginatedResponse<RawChatMessage>>(
    `/admin/chat/conversations/${conversationID}/messages`,
    { params },
  )
  return normalizePaginatedMessages(data)
}

export async function sendAdminChatMessage(conversationID: number, content: string): Promise<ChatMessage> {
  const { data } = await apiClient.post<RawChatMessage>(`/admin/chat/conversations/${conversationID}/messages`, { content })
  return normalizeChatMessage(data)
}

export async function markAdminChatRead(conversationID: number): Promise<void> {
  await apiClient.post(`/admin/chat/conversations/${conversationID}/read`)
}

export function buildChatWebSocket(scope: 'user' | 'admin'): WebSocket | null {
  const token = getAccessToken()
  if (!token) return null

  const path = scope === 'admin' ? '/admin/chat/ws' : '/chat/ws'
  const httpURL = buildApiUrl(path)
  const url = new URL(httpURL, window.location.origin)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'

  const protocol = scope === 'admin' ? ADMIN_CHAT_WS_PROTOCOL : USER_CHAT_WS_PROTOCOL
  return new WebSocket(url.toString(), [protocol, `jwt.${token}`])
}
