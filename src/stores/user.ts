import { signal } from '@preact/signals'
import type { UserInfo } from '../types'

export const currentUser = signal<UserInfo>({
  qqNumber: '3518905442',
  nickname: '茶凉心涵',
  avatar: 'https://q1.qlogo.cn/g?b=qq&nk=3518905442&s=100',
  status: 'online',
})
