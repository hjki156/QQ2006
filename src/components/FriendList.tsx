import { friendGroups, toggleGroup } from '../stores/friends'
import { resetChat } from '../stores/chat'
import { chatWindowVisible } from '../stores/app'
import type { Friend } from '../types'

export function FriendList() {
  const handleFriendDoubleClick = (friend: Friend) => {
    // 切换聊天对象并打开聊天窗口
    resetChat(friend)
    chatWindowVisible.value = true
  }

  return (
    <div class="qq-friend-box">
      <button class="qq-btn">QQ好友</button>
      <div class="qq-friend-list">
        {friendGroups.value.map((group, i) => (
          <div key={group.name}>
            <div
              class={`qq-friend-group${group.isExpanded ? ' on' : ''}`}
              onClick={() => toggleGroup(i)}
            >
              {group.name}
              {group.onlineCount != null && group.totalCount != null
                ? `(${group.onlineCount}/${group.totalCount})`
                : ''}
            </div>
            {group.isExpanded &&
              group.friends.map((friend) => (
                <div
                  key={friend.id}
                  class={`qq-friend-item${friend.isVip ? ' qq-vip' : ''}${friend.isOffline ? ' qq-offline' : ''}`}
                  onDblClick={() => handleFriendDoubleClick(friend)}
                  title="双击打开聊天"
                >
                  <img class="qq-friend-avatar" src={friend.avatar} />
                  <div class="qq-friend-info">
                    <p class="qq-friend-name">{friend.name}</p>
                    <p class="qq-friend-motto">{friend.motto || '\u00a0'}</p>
                    <div class="qq-friend-icons">
                      {friend.icons.includes('music') && (
                        <div class="qq-icon-music"></div>
                      )}
                      {friend.icons.includes('mobile') && (
                        <div class="qq-icon-mobile"></div>
                      )}
                      {friend.icons.includes('ring') && (
                        <div class="qq-icon-ring"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      <button class="qq-btn">手机好友</button>
      <button class="qq-btn">群/校友录</button>
      <button class="qq-btn">最近联系人</button>
    </div>
  )
}
