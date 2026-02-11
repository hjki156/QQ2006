import { useRef } from 'preact/hooks'
import { useDrag } from '../hooks/useDrag'
import { addFriendVisible } from '../stores/app'
import { friendGroups, addFriendToGroup } from '../stores/friends'

const defaultAvatar = () =>
  `/img/avatar/${Math.floor(1 + Math.random() * 116)}.png`

export function AddFriendWindow() {
  const { parentRef, handleRef } = useDrag()
  const qqRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const mottoRef = useRef<HTMLInputElement>(null)
  const userSetRef = useRef<HTMLInputElement>(null)
  const groupRef = useRef<HTMLSelectElement>(null)
  const offlineRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    addFriendVisible.value = false
  }

  const handleAdd = () => {
    const qqNumber = (qqRef.current?.value || '').trim()
    const name = (nameRef.current?.value || '').trim()
    if (!qqNumber || !name) return

    const avatar = `https://q1.qlogo.cn/g?b=qq&nk=${qqNumber}&s=100` || defaultAvatar()
    const motto = (mottoRef.current?.value || '').trim()
    const userSet = (userSetRef.current?.value || '').trim()
    const groupName = groupRef.current?.value || '我的好友'

    addFriendToGroup(
      {
        id: qqNumber,
        name,
        avatar,
        motto,
        userSet: userSet || undefined,
        icons: [],
        isOffline: offlineRef.current?.checked || false,
      },
      groupName,
    )

    handleClose()
  }

  return (
    <div
      ref={parentRef}
      class="xp_form drag-parent qq-add-friend"
      style="z-index: 12; left: 45%; top: 20%;"
    >
      <div class="header__bg"></div>
      <header ref={handleRef} class="app__header drag-handle">
        <img
          src="/img/qq.png"
          alt="添加好友"
          class="app__header__icon"
          draggable={false}
        />
        <div class="app__header__title">添加好友</div>
        <div class="app__header__buttons">
          <button class="header__button header__button--minimize"></button>
          <button class="header__button header__button--maximize header__button--disable"></button>
          <button
            class="header__button header__button--close"
            onClick={handleClose}
          ></button>
        </div>
      </header>
      <div class="app__content">
        <div class="qq-add-form">
          <div class="qq-add-row">
            <label>QQ号码</label>
            <input ref={qqRef} type="text" placeholder="请输入QQ号" />
          </div>
          <div class="qq-add-row">
            <label>昵称</label>
            <input ref={nameRef} type="text" placeholder="请输入昵称" />
          </div>
          <div class="qq-add-row">
            <label>签名</label>
            <input ref={mottoRef} type="text" placeholder="个性签名" />
          </div>
          <div class="qq-add-row">
            <label>人设</label>
            <input
              ref={userSetRef}
              type="text"
              placeholder="聊天人设(可选)"
            />
          </div>
          <div class="qq-add-row">
            <label>分组</label>
            <select ref={groupRef}>
              {friendGroups.value.map((group) => (
                <option key={group.name} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div class="qq-add-row qq-add-check">
            <label></label>
            <input ref={offlineRef} type="checkbox" />
            <span>离线</span>
          </div>
          <div class="qq-add-actions">
            <button class="qq-btn" onClick={handleAdd}>
              添加
            </button>
            <button class="qq-btn" onClick={handleClose}>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
