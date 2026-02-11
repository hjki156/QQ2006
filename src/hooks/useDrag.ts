import { useRef, useCallback, useEffect } from 'preact/hooks'

interface DragState {
  isDragging: boolean
  startX: number
  startY: number
  startLeft: number
  startTop: number
}

/**
 * 可拖拽窗口 Hook
 *
 * 用法:
 * ```tsx
 * const { parentRef, handleRef } = useDrag<HTMLDivElement>()
 * return (
 *   <div ref={parentRef} style="position: fixed">
 *     <div ref={handleRef}>拖拽这里</div>
 *   </div>
 * )
 * ```
 */
export function useDrag<T extends HTMLElement = HTMLDivElement>() {
  const parentRef = useRef<T>(null)
  const handleRef = useRef<T>(null)
  const state = useRef<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  })

  const getPosition = useCallback((el: HTMLElement) => {
    const style = window.getComputedStyle(el)
    return {
      left: parseInt(style.left, 10) || 0,
      top: parseInt(style.top, 10) || 0,
    }
  }, [])

  const onPointerDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!parentRef.current) return
      e.preventDefault()

      const clientX = 'clientX' in e ? e.clientX : e.touches[0]?.clientX ?? 0
      const clientY = 'clientY' in e ? e.clientY : e.touches[0]?.clientY ?? 0
      const pos = getPosition(parentRef.current)

      // 将当前窗口置顶
      const allWindows = document.querySelectorAll('.drag-parent')
      allWindows.forEach((w) => {
        ;(w as HTMLElement).style.zIndex = '1'
      })
      parentRef.current.style.zIndex = '9999'

      state.current = {
        isDragging: true,
        startX: clientX,
        startY: clientY,
        startLeft: pos.left,
        startTop: pos.top,
      }
    },
    [getPosition],
  )

  useEffect(() => {
    const handle = handleRef.current
    if (!handle) return

    const moveHandler = (e: MouseEvent | TouchEvent) => {
      if (!state.current.isDragging || !parentRef.current) return
      const clientX =
        'clientX' in e ? e.clientX : e.touches[0]?.clientX ?? 0
      const clientY =
        'clientY' in e ? e.clientY : e.touches[0]?.clientY ?? 0

      parentRef.current.style.left = `${state.current.startLeft + (clientX - state.current.startX)}px`
      parentRef.current.style.top = `${state.current.startTop + (clientY - state.current.startY)}px`
    }

    const endHandler = () => {
      state.current.isDragging = false
    }

    handle.addEventListener('mousedown', onPointerDown as EventListener)
    handle.addEventListener('touchstart', onPointerDown as EventListener, {
      passive: false,
    })
    document.addEventListener('mousemove', moveHandler as EventListener)
    document.addEventListener('touchmove', moveHandler as EventListener, {
      passive: false,
    })
    document.addEventListener('mouseup', endHandler)
    document.addEventListener('touchend', endHandler)

    return () => {
      handle.removeEventListener('mousedown', onPointerDown as EventListener)
      handle.removeEventListener(
        'touchstart',
        onPointerDown as EventListener,
      )
      document.removeEventListener('mousemove', moveHandler as EventListener)
      document.removeEventListener(
        'touchmove',
        moveHandler as EventListener,
      )
      document.removeEventListener('mouseup', endHandler)
      document.removeEventListener('touchend', endHandler)
    }
  }, [onPointerDown])

  return { parentRef, handleRef }
}
