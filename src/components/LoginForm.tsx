import { useRef } from 'preact/hooks'
import { useDrag } from '../hooks/useDrag'
import { appView } from '../stores/app'
import { currentUser } from '../stores/user'

export function LoginForm() {
  const { parentRef, handleRef } = useDrag()
  const qqNumRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleLogin = () => {
    const qqNum = qqNumRef.current?.value || '10086'
    currentUser.value = { ...currentUser.value, qqNumber: qqNum }
    appView.value = 'logging'
  }

  const handleCancel = () => {
    if (qqNumRef.current) qqNumRef.current.value = ''
    if (passwordRef.current) passwordRef.current.value = ''
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div
      ref={parentRef}
      class="xp_form drag-parent"
      style="z-index: 10; left: 10%; top: 36%;"
    >
      <div class="header__bg"></div>
      <header ref={handleRef} class="app__header drag-handle">
        <img
          src="/img/qq.png"
          alt="QQ用户登录"
          class="app__header__icon"
          draggable={false}
        />
        <div class="app__header__title">QQ用户登录</div>
        <div class="app__header__buttons">
          <button class="header__button header__button--minimize"></button>
          <button class="header__button header__button--maximize header__button--disable"></button>
          <button class="header__button header__button--close"></button>
        </div>
      </header>
      <div class="app__content">
        <div class="qq-login">
          <div class="qq-login-banner"></div>
          <div class="qq-login-form">
            <div class="qq-login-form-row">
              <label for="qq-login-num">
                QQ号码
                <img id="qq-login-method" src="/img/select.png" />
              </label>
              <input
                ref={qqNumRef}
                type="text"
                id="qq-login-num"
                placeholder="<请在这儿输入QQ号码>"
                onKeyDown={handleKeyDown}
              />
              <button
                class="qq-btn"
                id="qq-login-reg"
                onClick={() =>
                  window.open('https://ssl.zc.qq.com/v3/index-chs.html')
                }
              >
                申请号码
              </button>
              <button id="qq-login-num-select"></button>
            </div>
            <div class="qq-login-form-row" style="align-items: flex-end">
              <label for="qq-login-password">QQ密码</label>
              <input
                ref={passwordRef}
                type="password"
                id="qq-login-password"
                onKeyDown={handleKeyDown}
              />
              <a
                href="https://accounts.qq.com/find/password"
                target="_blank"
                id="qq-login-forget"
              >
                忘了密码？
              </a>
            </div>
            <div class="qq-login-form-row qq-login-check">
              <label style="width: 55px"></label>
              <input type="checkbox" id="qq-login-auto" checked />
              <label for="qq-login-auto">自动登录</label>
              <input type="checkbox" id="qq-login-hide" />
              <label for="qq-login-hide">隐身登录</label>
            </div>
          </div>
          <div class="qq-login-buttons">
            <button class="qq-btn" style="width: 78px">
              高级设置 ↓
            </button>
            <span></span>
            <button class="qq-btn" onClick={handleLogin}>
              登录
            </button>
            <button class="qq-btn" onClick={handleCancel}>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
