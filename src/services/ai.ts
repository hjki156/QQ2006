import { AI_CONFIG } from './config'

interface SSEDelta {
  role?: string
  content?: string
}

interface AIStreamOptions {
  onStart?: () => void
  onChunk?: (content: string) => void
  onComplete?: () => void
  onError?: (error: Error) => void
  systemPrompt?: string
  stream?: boolean
  thinking?: boolean
}

function generateBody(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  stream: boolean,
  thinking?: boolean,
) {
  const body: Record<string, unknown> = {
    model: AI_CONFIG.model,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    stream,
  }

  if (typeof thinking === 'boolean') {
    body.thinking = { type: thinking ? 'enabled' : 'disabled' }
  }

  return body
}

export function formatSSE(line: string): SSEDelta | null {
  try {
    const data = line.slice(5).trim()
    if (data === '[DONE]') return null
    const parsed = JSON.parse(data)
    return parsed.choices[0].delta
  } catch {
    return null
  }
}

/**
 * 流式调用 AI 聊天接口 (SSE)
 */
export async function streamChat(
  messages: { role: string; content: string }[],
  options: AIStreamOptions = {},
): Promise<void> {
  const { onStart, onChunk, onComplete, onError, systemPrompt } = options
  const useStream = options.stream !== false

  try {
    if (!AI_CONFIG.apiKey) {
      throw new Error('API key not configured')
    }

    const response = await fetch(AI_CONFIG.entrypoint, {
      method: 'POST',
      body: JSON.stringify(
        generateBody(
          messages,
          systemPrompt || AI_CONFIG.systemPrompt,
          useStream,
          options.thinking,
        ),
      ),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      },
    })

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

    onStart?.()

    if (!useStream) {
      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[]
      }
      const content = data?.choices?.[0]?.message?.content || ''
      if (content) onChunk?.(content)
      onComplete?.()
      return
    }

    if (!response.body) throw new Error('ReadableStream not supported')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        if (buffer.trim()) {
          const delta = formatSSE(buffer)
          if (delta?.content) onChunk?.(delta.content)
        }
        onComplete?.()
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim()) {
          const delta = formatSSE(line)
          if (delta?.content) onChunk?.(delta.content)
        }
      }
    }
  } catch (error) {
    if (onError) {
      onError(error as Error)
    } else {
      console.error('AI stream error:', error)
    }
  }
}

/** 无 API 时的模拟回复 */
export const SIMULATED_MESSAGES = [
  '时光匆匆，那些篇章再也续不上',
  '好久不见，你还好吗？',
  '回不去的是青春，等不到的是旧人',
  '欢迎回到 2006 年~',
  '你好呀~很高兴认识你 :)',
  'Vae 的新歌《玫瑰花的葬礼》你听了吗',
  '哈哈哈，真有意思',
  '你有黄钻吗？帮我装修一下空间吧^_^',
  '我也这么觉得~',
  '真的吗？好厉害！',
  '今天天气好好哦，出去玩不~',
  '你QQ等级多少了？我快要一个太阳了！',
  '帮我踩踩空间嘛~',
  '你的QQ秀好好看！在哪买的？',
  '88~我先下了，明天聊~',
  '你空间新上传的照片好好看！',
]

export function getSimulatedReply(): string {
  return SIMULATED_MESSAGES[
    Math.floor(Math.random() * SIMULATED_MESSAGES.length)
  ]!
}
