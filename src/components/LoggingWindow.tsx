import { useEffect } from 'preact/hooks'
import { useDrag } from '../hooks/useDrag'
import { appView } from '../stores/app'
import { playAudio, sounds } from '../services/audio'

export function LoggingWindow() {
  const { parentRef, handleRef } = useDrag()

  useEffect(() => {
    const timer = setTimeout(() => {
      appView.value = 'main'
      playAudio(sounds.system)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleCancel = () => {
    appView.value = 'login'
  }

  return (
    <div
      ref={parentRef}
      class="qq-logging drag-parent"
      style="left: 28%; top: 10%; z-index: 999"
    >
      <div ref={handleRef} class="qq-title drag-handle">
        <div class="qq-title-left"></div>
        <div class="qq-title-center"></div>
        <div class="qq-title-right"></div>
        <div class="qq-title-btns">
          <button id="qq-min"></button>
          <button id="qq-close" onClick={handleCancel}></button>
        </div>
      </div>
      <div class="qq-logging-body qq-flex-bg">
        <div class="qq-body-left"></div>
        <div class="qq-body-center"></div>
        <div class="qq-body-right"></div>
      </div>
      <div class="qq-logging-bottom qq-flex-bg">
        <div class="qq-bottom-left"></div>
        <div class="qq-bottom-center"></div>
        <div class="qq-bottom-right"></div>
      </div>
      <div id="qq-logging-main">
        <img src="/img/logging/BITMAP1710_1.png" />
        <img src="/img/logging/START_GIF1704_1.gif" />
        <p>正在登录</p>
        <button id="qq-logging-cancel" onClick={handleCancel}></button>
      </div>
    </div>
  )
}
