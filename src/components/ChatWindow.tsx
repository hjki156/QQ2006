import { useRef, useEffect } from 'preact/hooks'
import { useDrag } from '../hooks/useDrag'
import {
  chatTarget,
  chatMessages,
  addMessage,
  isAITyping,
  startAIMessage,
  appendToLastAIMessage,
  finishAIMessage,
  persistChatHistory,
} from '../stores/chat'
import { chatWindowVisible } from '../stores/app'
import { currentUser } from '../stores/user'
import { playAudio, sounds } from '../services/audio'
import { streamChat, getSimulatedReply } from '../services/ai'
import { AI_CONFIG } from '../services/config'
import { deepThinking, streamEnabled } from '../stores/settings'

function buildSystemPrompt() {
  const target = chatTarget.value
  const user = currentUser.value
  const extra = target.userSet ? `\n补充设定: ${target.userSet}` : ''

  return (
    `${AI_CONFIG.systemPrompt}${extra}\n` +
    '以下是聊天背景资料(仅供你理解,不要直接复述给用户):\n' +
    `[对方资料] 昵称:${target.name} QQ:${target.id} 签名:${target.motto}\n` +
    `[用户资料] 昵称:${user.nickname} QQ:${user.qqNumber} 状态:${user.status}\n` +
    '请根据这些信息和聊天上下文进行自然回应.'
  )
}

export function ChatWindow() {
  const { parentRef, handleRef } = useDrag()
  const chatListRef = useRef<HTMLUListElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const target = chatTarget.value
  const user = currentUser.value
  const messages = chatMessages.value
  const typing = isAITyping.value

  // 消息变化时自动滚到底部
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }
  })

  useEffect(() => {
    persistChatHistory(target.id, messages)
  }, [target.id, messages])

  const sendMessage = () => {
    const input = inputRef.current
    if (!input) return
    const message = input.value.trim()
    if (!message || typing) return

    addMessage(message, true, user.nickname)
    input.value = ''

    if (AI_CONFIG.apiKey) {
      // 使用真实 AI 流式对话
      const history = chatMessages.value
        .filter((m) => m.content)
        .map((m) => ({
          role: m.isUser ? ('user' as const) : ('assistant' as const),
          content: m.content,
        }))

      startAIMessage()
      streamChat(history, {
        systemPrompt: buildSystemPrompt(),
        stream: streamEnabled.value,
        thinking: deepThinking.value,
        onChunk(content) {
          appendToLastAIMessage(content)
        },
        onComplete() {
          finishAIMessage()
          playAudio(sounds.message)
        },
        onError() {
          finishAIMessage()
          // AI 出错时回退到模拟回复
          setTimeout(() => {
            addMessage(getSimulatedReply(), false, target.name)
            playAudio(sounds.message)
          }, Math.random() * 1500 + 500)
        },
      })
    } else {
      // 无 API KEY 时使用模拟回复
      setTimeout(() => {
        addMessage(getSimulatedReply(), false, target.name)
        playAudio(sounds.message)
      }, Math.random() * 1500 + 500)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleClose = () => {
    chatWindowVisible.value = false
  }

  return (
    <div
      ref={parentRef}
      class="qq-im drag-parent"
      style="left: 40%; top: 20%; z-index: 9999"
    >
      {/* 皮肤背景 */}
      <div class="qq-skin">
        <div class="qq-title-bg">
          <div class="qq-title-left"></div>
          <div class="qq-title-center"></div>
          <div class="qq-title-right"></div>
        </div>
        <div class="qq-body-bg">
          <div class="qq-body-left"></div>
          <div class="qq-body-center"></div>
          <div class="qq-body-right"></div>
        </div>
        <div class="qq-bottom-bg">
          <div class="qq-bottom-left"></div>
          <div class="qq-bottom-center"></div>
          <div class="qq-bottom-right"></div>
        </div>
      </div>

      {/* 内容区域 */}
      <div class="qq-contant">
        {/* 标题栏 */}
        <div ref={handleRef} class="qq-title drag-handle">
          <div class="qq-title-icon"></div>
          <div class="qq-title-text">与 {target.name} 聊天中</div>
          <div class="qq-title-btns">
            <button id="qq-im-min" title="隐藏"></button>
            <button id="qq-im-max" title="最大化"></button>
            <button
              id="qq-im-close"
              title="关闭"
              onClick={handleClose}
            ></button>
          </div>
        </div>

        {/* 大工具栏 */}
        <div class="qq-im-big-toolbar">
          <button
            id="qq-im-msg"
            onClick={() => playAudio(sounds.message)}
          >
            短信
          </button>
          <button id="qq-im-video" onClick={() => playAudio(sounds.call)}>
            视频
          </button>
          <button id="qq-im-audio" onClick={() => playAudio(sounds.call)}>
            语音
          </button>
          <button id="qq-im-file">传文件</button>
          <button id="qq-im-3d">3D秀</button>
          <button
            id="qq-im-invite"
            onClick={() =>
              window.open('https://github.com/mengkunsoft/QQ2006')
            }
          >
            邀请
          </button>
        </div>

        {/* 主聊天区 */}
        <div class="qq-im-contant">
          <div class="qq-im-main">
            <div class="qq-im-chat">
              {/* 聊天内容 */}
              <div class="qq-im-chat-msg">
                <div class="qq-im-friend-info">
                  <img src={target.avatar} />
                  <p>
                    {target.name}({target.id})：{target.motto}
                  </p>
                </div>
                <ul class="qq-im-chat-msg-list" ref={chatListRef}>
                  {messages.map((msg) => (
                    <li key={msg.id} class={msg.isUser ? 'my' : ''}>
                      <p>
                        {msg.sender}
                        <span>{msg.time}</span>
                      </p>
                      <p>
                        {msg.content}
                        {!msg.isUser &&
                        typing &&
                        msg.id === messages[messages.length - 1]?.id
                          ? '▌'
                          : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 聊天工具栏 */}
              <div class="qq-im-chat-toolbar">
                <button class="im-toolbar-font"></button>
                <button class="im-toolbar-face"></button>
                <button class="im-toolbar-other"></button>
                <span></span>
                <button class="im-toolbar-picture"></button>
                <button class="im-toolbar-catch"></button>
                <button class="im-toolbar-scene"></button>
                <button class="im-toolbar-bag"></button>
                <button class="im-toolbar-ptt"></button>
              </div>

              {/* 输入框 */}
              <textarea
                class="qq-im-chat-send"
                ref={inputRef}
                onKeyDown={handleKeyDown}
              ></textarea>
            </div>

            {/* 底部按钮 */}
            <div class="qq-im-btns">
              <button class="qq-btn">聊天记录(H)</button>
              <button class="qq-btn">消息模式(T)</button>
              <span></span>
              <button class="qq-btn" onClick={handleClose}>
                关闭(C)
              </button>
              <div style="display: flex; gap: 2px;">
                <button class="qq-btn" onClick={sendMessage}>
                  发送(S)
                </button>
                <button class="qq-btn" style="padding: 0;">
                  ↓
                </button>
              </div>
            </div>
          </div>

          {/* 右侧面板 */}
          <div class="qq-im-side">
            <div style="flex: 1">
              <button class="qq-im-side-btn">对方形象</button>
              <div
                class="qq-im-show"
                style="background-image: url('/img/im/show1.gif')"
              ></div>
            </div>
            <div class="qq-im-zone qq-single-line">
              <button class="qq-im-side-btn">个人空间</button>
              <div>摘要：若无法为你撑起晴空，那我便陪你共沐风雨</div>
              <div>
                日记：<span>48</span>条/<span>169</span>评论
              </div>
              <div>
                相册：<span>12</span>张/<span>23</span>评论
              </div>
              <div>
                收藏：<span>62</span>个
              </div>
            </div>
            <div style="flex: 1">
              <button class="qq-im-side-btn">我的形象</button>
              <div
                class="qq-im-show"
                style="background-image: url('/img/im/show3.gif')"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
