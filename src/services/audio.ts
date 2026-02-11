export function playAudio(url: string): Promise<void> {
  return new Audio(url).play().catch((e) => console.error('播放失败:', e))
}

export const sounds = {
  message: '/sound/msg.mp3',
  system: '/sound/system.mp3',
  call: '/sound/call.mp3',
} as const
