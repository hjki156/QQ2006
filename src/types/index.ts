/** 好友 */
export interface Friend {
  id: string
  name: string
  avatar: string
  motto: string
  userSet?: string,
  isVip?: boolean
  isOffline?: boolean
  icons: ('music' | 'mobile' | 'ring')[]
}

/** 好友分组 */
export interface FriendGroup {
  name: string
  onlineCount?: number
  totalCount?: number
  friends: Friend[]
  isExpanded: boolean
}

/** 聊天消息 */
export interface ChatMessage {
  id: string
  sender: string
  content: string
  time: string
  isUser: boolean
}

/** 用户信息 */
export interface UserInfo {
  qqNumber: string
  nickname: string
  avatar: string
  status: 'online' | 'away' | 'busy' | 'invisible' | 'offline'
}

/** 应用视图状态 */
export type AppView = 'login' | 'logging' | 'main'
