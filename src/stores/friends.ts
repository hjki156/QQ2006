import { signal } from '@preact/signals'
import type { Friend, FriendGroup } from '../types'

const FRIENDS_STORAGE_KEY = 'qq2006-friend-groups'

const DEFAULT_GROUPS: FriendGroup[] = [
  {
    name: '我的好友',
    onlineCount: 1,
    totalCount: 1,
    friends: [{
        id: '0',
        name: '℡﹏﹏壞乖ル',
        avatar: '/img/avatar/97.png',
        motto: '伱噈媞莪啲掱鎯菿，莪想浔找涐の天堂。',
        userSet: '你是QQ2006时代的一个可爱女生网友,说话风格是2006年流行的网络用语,古灵精怪,调皮,可爱,偶尔会用火星文和颜文字',
        icons: ['music'],
    }],
    isExpanded: false,
  },
  {
    name: '家人',
    onlineCount: 5,
    totalCount: 13,
    friends: [
      {
        id: '1',
        name: '阿辉',
        avatar: '/img/avatar/16.png',
        motto: '人生沟坎多因能力不足，门槛高低全凭实力',
        icons: [],
      },
      {
        id: '2',
        name: '哎哟喂',
        avatar: '/img/avatar/22.png',
        motto: '我爱吃红烧肉',
        isVip: true,
        icons: ['music', 'mobile'],
      },
      {
        id: '3',
        name: '小王子',
        avatar: '/img/avatar/5.png',
        motto: '我珍忄昔、祢鳪忄董，我放掱、你却拉住我。。',
        icons: ['music'],
      },
      {
        id: '4',
        name: 'happy',
        avatar: '/img/avatar/7.png',
        motto: '',
        icons: ['mobile'],
      },
      {
        id: '5',
        name: '木子',
        avatar: '/img/avatar/9.png',
        motto: '你也在网上冲浪啊',
        icons: [],
      },
      {
        id: '6',
        name: '灰',
        avatar: '/img/avatar/11.png',
        motto: '有事请留言',
        icons: ['music', 'mobile'],
      },
      {
        id: '7',
        name: '爱拼才会赢',
        avatar: '/img/avatar/18.png',
        motto: '我还年轻，所以我可以',
        isOffline: true,
        icons: [],
      },
      {
        id: '8',
        name: '最深的记忆',
        avatar: '/img/avatar/100.png',
        motto: '把你留在心中',
        isOffline: true,
        icons: ['mobile'],
      },
    ],
    isExpanded: false,
  },
  {
    name: '同学',
    onlineCount: 28,
    totalCount: 37,
    friends: [],
    isExpanded: false,
  },
  {
    name: '陌生人',
    friends: [],
    isExpanded: false,
  },
  {
    name: '黑名单',
    friends: [],
    isExpanded: false,
  },
]

function loadFriendGroups(): FriendGroup[] {
  try {
    const raw = localStorage.getItem(FRIENDS_STORAGE_KEY)
    if (!raw) return DEFAULT_GROUPS
    const parsed = JSON.parse(raw) as FriendGroup[]
    if (!Array.isArray(parsed)) return DEFAULT_GROUPS
    return parsed
  } catch {
    return DEFAULT_GROUPS
  }
}

function persistFriendGroups(groups: FriendGroup[]) {
  try {
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(groups))
  } catch {
    // ignore persistence errors
  }
}

export const friendGroups = signal<FriendGroup[]>(loadFriendGroups())

/** 展开/折叠好友分组 */
export function toggleGroup(index: number) {
  const groups = [...friendGroups.value]
  const group = groups[index]
  if (group) {
    groups[index] = { ...group, isExpanded: !group.isExpanded }
    friendGroups.value = groups
    persistFriendGroups(groups)
  }
}

export function addFriendToGroup(friend: Friend, groupName: string) {
  const groups = [...friendGroups.value]
  const index = groups.findIndex((group) => group.name === groupName)

  if (index === -1) {
    groups.push({
      name: groupName,
      friends: [friend],
      isExpanded: true,
    })
    friendGroups.value = groups
    persistFriendGroups(groups)
    return
  }

  const group = groups[index]
  const updatedFriends = [friend, ...group.friends]
  const onlineDelta = friend.isOffline ? 0 : 1

  groups[index] = {
    ...group,
    friends: updatedFriends,
    onlineCount:
      group.onlineCount != null ? group.onlineCount + onlineDelta : undefined,
    totalCount:
      group.totalCount != null ? group.totalCount + 1 : undefined,
    isExpanded: true,
  }

  friendGroups.value = groups
  persistFriendGroups(groups)
}
