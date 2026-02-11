export const AI_CONFIG = {
  entrypoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  apiKey: (import.meta.env.VITE_AI_API_KEY as string) || '',
  model: (import.meta.env.VITE_AI_MODEL as string) || 'glm-4.7-flash',
  systemPrompt:
    (import.meta.env.VITE_AI_SYSTEM_PROMPT as string) ||
    '你是QQ2006时代的一个网友',
}
