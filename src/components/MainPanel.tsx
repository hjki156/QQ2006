import { useDrag } from '../hooks/useDrag'
import { currentUser } from '../stores/user'
import { FriendList } from './FriendList'
import { SettingsPanel } from './SettingsPanel'
import { playAudio, sounds } from '../services/audio'
import { addFriendVisible, mainPanelTab } from '../stores/app'

export function MainPanel() {
  const { parentRef, handleRef } = useDrag()
  const user = currentUser.value

  return (
    <div
      ref={parentRef}
      class="qq-panel drag-parent"
      style="left: 70%; top: 10%;"
    >
      {/* 标题栏 */}
      <div ref={handleRef} class="qq-title drag-handle">
        <div class="qq-title-left"></div>
        <div class="qq-title-center"></div>
        <div class="qq-title-right"></div>
        <div class="qq-title-btns">
          <button id="qq-min" title="隐藏"></button>
          <button id="qq-color" title="颜色改变"></button>
          <button id="qq-close" title="关闭"></button>
        </div>
      </div>

      {/* 用户信息头部 */}
      <div class="qq-head">
        <div class="qq-flex-bg">
          <div class="qq-head-left"></div>
          <div class="qq-head-center"></div>
          <div class="qq-head-right"></div>
        </div>
        <div
          id="qq-status-pic"
          title="修改个人资料"
          style={`background-image: url('${user.avatar}')`}
        ></div>
        <button id="qq-status-btn" title="更改状态"></button>
        <label id="qq-num">{user.nickname}(在线)</label>
        <div class="qq-head-btns">
          <button
            id="qq-mail"
            title="收发邮件"
            onClick={() => window.open('http://mail.qq.com/')}
          >
            <img src="/img/MailButton.png" />
            <label>(0)</label>
          </button>
          <button id="qq-security" title="安全中心">
            <img src="/img/security_normal.png" />
          </button>
          <button id="qq-payment" title="我的钱包">
            <img src="/img/payment.png" />
          </button>
        </div>
      </div>

      {/* 主面板区域 */}
      <div class="qq-body">
        <div class="qq-flex-bg">
          <div class="qq-body-left"></div>
          <div class="qq-body-center"></div>
          <div class="qq-body-right"></div>
        </div>
        <div class="qq-panel-bar">
          <button
            id="qq-FriendButton"
            title="QQ好友面板"
            class={mainPanelTab.value === 'friends' ? 'active' : ''}
            onClick={() => {
              mainPanelTab.value = 'friends'
            }}
          >
            <img src="/img/panel-bar/FriendButton.png" />
          </button>
          <button id="qq-SBuddyButton" title="互动空间">
            <img src="/img/panel-bar/SBuddyButton.png" />
          </button>
          <button id="qq-MobileButton" title="我的无线乐园">
            <img src="/img/panel-bar/MobileButton.png" />
          </button>
          <button id="qq-RtxButton" title="企业好友面板">
            <img src="/img/panel-bar/RtxButton.png" />
          </button>
          <button id="qq-ContentsButton" title="网络杂志面板">
            <img src="/img/panel-bar/ContentsButton.png" />
          </button>
          <button id="qq-CustomButton" title="用户自定义面板">
            <img src="/img/panel-bar/CustomButton.png" />
          </button>
          <button id="qq-EaseButton" title="音乐中心">
            <img src="/img/panel-bar/EaseButton.png" />
          </button>
          <button id="qq-NetDiskButton" title="网络硬盘">
            <img src="/img/panel-bar/NetDiskButton.png" />
          </button>
          <button id="qq-AllButton" title="综合业务面板">
            <img src="/img/panel-bar/IntegratePanel.png" />
          </button>
          <button id="qq-PanelMngButton" title="面板管理器">
            <img src="/img/panel-bar/BlankPanel.png" />
          </button>
          <button
            id="qq-SettingsPanelButton"
            title="设置"
            class={mainPanelTab.value === 'settings' ? 'active' : ''}
            onClick={() => {
              mainPanelTab.value = 'settings'
            }}
          >
            <img src="/img/panel-bar/BlankPanel.png" />
          </button>
        </div>

        {mainPanelTab.value === 'friends' && <FriendList />}
        {mainPanelTab.value === 'settings' && <SettingsPanel />}
      </div>

      {/* 底部工具栏 */}
      <div class="qq-toolbar">
        <div class="qq-flex-bg">
          <div class="qq-toolbar-left"></div>
          <div class="qq-toolbar-center"></div>
          <div class="qq-toolbar-right"></div>
        </div>
        <div class="qq-toolbar-btns">
          <button
            id="qq-MobileMsgButton"
            title="发送手机消息"
            style="background-image: url('/img/MobileMsgButton.png')"
          ></button>
          <button
            id="qq-GameButton"
            title="QQ游戏"
            style="background-image: url('/img/GameButton.png')"
            onClick={() => window.open('https://game.qq.com/')}
          ></button>
          <button
            id="qq-TTButton"
            title="腾讯TT浏览器"
            style="background-image: url('/img/TTButton.png')"
            onClick={() => window.open('https://browser.qq.com/')}
          ></button>
          <button
            id="qq-QQHome"
            title="QQ空间"
            style="background-image: url('/img/QQHome.png')"
            onClick={() => window.open('https://qzone.qq.com/')}
          ></button>
          <button
            id="qq-QQMusicButton"
            title="QQ音乐"
            style="background-image: url('/img/QQMusicButton.png')"
            onClick={() => window.open('https://y.qq.com/')}
          ></button>
          <button
            id="qq-QQTVButton"
            title="网络电视(QQLive)"
            style="background-image: url('/img/QQTVButton.png')"
            onClick={() => window.open('https://v.qq.com/')}
          ></button>
          <button
            id="qq-Pet"
            title="QQ宠物"
            style="background-image: url('/img/OpenPet.png')"
            onClick={() => window.open('https://pet.qq.com/')}
          ></button>
        </div>
        <div
          id="qq-MenuButton"
          onClick={() => window.open('https://mkblog.cn/')}
        ></div>
        <div class="qq-toolbar-btns qq-toolbar-2">
          <button
            id="qq-MsgManagerButton"
            title="信息管理器"
            style="background-image: url('/img/MsgManagerButton.png'); background-size: auto; width: 19px"
            onClick={() => playAudio(sounds.system)}
          ></button>
          <button
            id="qq-SearchButton"
            title="查找用户"
            onClick={() => {
              addFriendVisible.value = true
            }}
          >
            查找
          </button>
        </div>
      </div>
    </div>
  )
}
