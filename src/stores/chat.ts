import { signal } from '@preact/signals'
import type { ChatMessage, Friend } from '../types'

/** 默认聊天对象 */
const DEFAULT_FRIEND: Friend = {
  id: '3453674',
  name: 'メ乖乖女ソ',
  avatar: '/img/avatar/97.png',
  motto: '为了躲开所有结局的可能，你连开始都直接按了暂停键',
  icons: [],
}

const CHAT_STORAGE_PREFIX = 'qq2006-chat:'

export const chatTarget = signal<Friend>(DEFAULT_FRIEND)
export const isAITyping = signal(false)

let msgIdCounter = 0
function genId(): string {
  return `msg-${++msgIdCounter}-${Date.now()}`
}

function getTimeStr(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}

function getDefaultMessages(friend: Friend): ChatMessage[] {
  if (friend.id !== DEFAULT_FRIEND.id) return []
  return [
    {
      id: genId(),
      sender: '痴情梦丶',
      content: '在吗？',
      time: '20:37:01',
      isUser: true,
    },
    {
      id: genId(),
      sender: 'メ乖乖女ソ',
      content: '嗯，你说',
      time: '20:37:08',
      isUser: false,
    },
  ]
}

function getStorageKey(friendId: string): string {
  return `${CHAT_STORAGE_PREFIX}${friendId}`
}

export function loadChatHistory(friend: Friend): ChatMessage[] {
  try {
    const raw = localStorage.getItem(getStorageKey(friend.id))
    if (!raw) return getDefaultMessages(friend)
    const parsed = JSON.parse(raw) as ChatMessage[]
    if (!Array.isArray(parsed)) return getDefaultMessages(friend)
    return parsed
  } catch {
    return getDefaultMessages(friend)
  }
}

export function persistChatHistory(friendId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(getStorageKey(friendId), JSON.stringify(messages))
  } catch {
    // ignore persistence errors
  }
}

export const chatMessages = signal<ChatMessage[]>(
  loadChatHistory(DEFAULT_FRIEND),
)

/** 添加一条消息 */
export function addMessage(
  content: string,
  isUser: boolean,
  sender?: string,
): void {
  const target = chatTarget.value
  chatMessages.value = [
    ...chatMessages.value,
    {
      id: genId(),
      sender: sender || (isUser ? '痴情梦丶' : target.name),
      content,
      time: getTimeStr(),
      isUser,
    },
  ]
}

/** 向最后一条 AI 消息追加内容（流式输出） */
export function appendToLastAIMessage(content: string): void {
  const msgs = [...chatMessages.value]
  const last = msgs[msgs.length - 1]
  if (last && !last.isUser) {
    msgs[msgs.length - 1] = { ...last, content: last.content + content }
    chatMessages.value = msgs
  }
}

/** 开始 AI 流式消息（插入空消息占位） */
export function startAIMessage(): void {
  addMessage('', false)
  isAITyping.value = true
}

/** AI 回复完成 */
export function finishAIMessage(): void {
  isAITyping.value = false
}

/** 重置聊天记录（切换聊天对象时） */
export function resetChat(friend: Friend): void {
  chatTarget.value = friend
  chatMessages.value = loadChatHistory(friend)
  isAITyping.value = false
}
