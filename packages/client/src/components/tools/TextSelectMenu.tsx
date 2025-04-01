import { ref, onMounted, onUnmounted, defineComponent } from 'vue'
import type { VNode } from 'vue'

const menuItemClass = 'py-2 px-4 cursor-pointer transition hover:bg-white'
const menuClass =
    'absolute overflow-auto bg-white border border-gray-300 rounded oj-shadow transform -translate-x-1/2 z-10'

interface Position {
    top: string
    left: string
}

export default defineComponent({
    setup(props: { menu: (selectedText: string) => VNode }, { slots }) {
        const containerRef = ref<HTMLElement | null>(null)
        const showMenu = ref(false)
        const selectedText = ref('')
        const menuPosition = ref<Position>({ top: '0px', left: '0px' })

        // 获取选中位置
        const getSelectionPosition = (): DOMRect | null => {
            const selection = window.getSelection()
            if (!selection?.rangeCount) return null

            const range = selection.getRangeAt(0)
            return range.getBoundingClientRect()
        }

        // 处理鼠标松开事件
        const handleMouseUp = (e: MouseEvent) => {
            if (e.button !== 0) return // 仅左键

            const selection = window.getSelection()
            if (!selection?.toString()) return

            const rect = getSelectionPosition()
            if (!rect) return

            selectedText.value = selection.toString()

            //获取父元素的 Rect
            const containerRect = containerRef.value!.getBoundingClientRect()

            // const rectRight = rect.x + rect.width
            const rectLeft = rect.x - containerRect.x
            const rectBottom = rect.y + rect.height
            // const relativeX = rectRight - containerRect.x
            const relativeY = rectBottom - containerRect.y + 5
            menuPosition.value = {
                top: relativeY + 'px',
                left: rectLeft + rect.width / 2 + 'px',
            }

            showMenu.value = true
        }

        // 处理触摸结束事件
        const handleTouchEnd = (e: TouchEvent) => {
            const selection = window.getSelection()
            if (!selection?.toString()) return

            const rect = getSelectionPosition()
            if (!rect) return

            selectedText.value = selection.toString()

            // 获取父元素的 Rect
            const containerRect = containerRef.value!.getBoundingClientRect()

            const rectLeft = rect.x - containerRect.x
            const rectBottom = rect.y + rect.height
            const relativeY = rectBottom - containerRect.y + 5

            menuPosition.value = {
                top: relativeY + 'px',
                left: rectLeft + rect.width / 2 + 'px',
            }

            showMenu.value = true
        }

        // 点击外部关闭菜单
        const handleClickOutside = (e: MouseEvent) => {
            console.log(e)
            // 如果有_vts字段则为特殊情况，不关闭
            if (!showMenu.value || (e as any)._vts) {
                return
            }
            if (!(e.target as HTMLElement).closest('.floating-menu')) {
                showMenu.value = false
            }
        }

        // 点击外部关闭菜单
        const handleTouchOutside = (e: TouchEvent) => {
            if (!showMenu.value || (e as any)._vts) {
                return
            }
            if (!(e.target as HTMLElement).closest('.floating-menu')) {
                // showMenu.value = false
            }
        }

        // 复制功能
        const copyText = () => {
            navigator.clipboard.writeText(selectedText.value)
            showMenu.value = false
        }

        // 分享功能
        const shareText = () => {
            // 实现分享逻辑
            showMenu.value = false
        }

        // 事件监听
        onMounted(() => {
            if ('ontouchstart' in window) {
                // 移动端
                document.addEventListener('touchend', handleTouchEnd)
                document.addEventListener('touchstart', handleTouchOutside)
            } else {
                // PC端
                document.addEventListener('mouseup', handleMouseUp)
                document.addEventListener('mousedown', handleClickOutside)
            }
        })

        onUnmounted(() => {
            if ('ontouchstart' in window) {
                document.removeEventListener('touchend', handleTouchEnd)
                document.removeEventListener('touchstart', handleTouchOutside)
            } else {
                document.removeEventListener('mouseup', handleMouseUp)
                document.removeEventListener('mousedown', handleClickOutside)
            }
        })

        const defaultMenu = (
            <>
                <div class={menuItemClass} onClick={copyText}>
                    复制
                </div>
                <div class={menuItemClass} onClick={shareText}>
                    分享
                </div>
            </>
        )
        return () => (
            <div class="relative" ref={containerRef}>
                {slots.default?.()}
                {showMenu.value && (
                    <div class={menuClass} style={menuPosition.value}>
                        {props.menu ? props.menu?.(selectedText.value) : defaultMenu}
                    </div>
                )}
            </div>
        )
    },
})
