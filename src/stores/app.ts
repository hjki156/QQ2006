import { signal } from '@preact/signals'
import type { AppView } from '../types'

/** 当前应用视图: login → logging → main */
export const appView = signal<AppView>('login')

/** 聊天窗口是否可见 */
export const chatWindowVisible = signal(false)

/** 添加好友窗口是否可见 */
export const addFriendVisible = signal(false)

/** 主面板视图 */
export const mainPanelTab = signal<'friends' | 'settings'>('friends')
