import { getClientType, removeLineBreak } from '@/utils'
import { ref, onMounted, onUnmounted, defineComponent } from 'vue'
import type { VNode } from 'vue'

const menuItemClass = 'py-2 px-4 cursor-pointer transition hover:bg-white'
const menuClass =
    'absolute overflow-auto bg-white border border-gray-300 rounded oj-shadow transform -translate-x-1/2 z-10'

interface Position {
    top: string
    left: string
}

interface Props {
    menu: (selectedText: string) => VNode
    showMenu: boolean
    onShow: (showMenu: boolean) => void
    onClose: () => void
}

export default defineComponent({
    setup(props: Props, { slots }) {
        const containerRef = ref<HTMLElement | null>(null)
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

            selectedText.value = removeLineBreak(selection.toString())

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

            // 如果选中内容不为空，则显示菜单
            if (selectedText.value) {
                props.onShow(true)
            }
        }

        // 处理触摸结束事件
        const handleTouchEnd = (e: TouchEvent) => {
            const selection = window.getSelection()
            if (!selection?.toString()) return

            const rect = getSelectionPosition()
            if (!rect) return

            selectedText.value = removeLineBreak(selection.toString())

            // 获取父元素的 Rect
            const containerRect = containerRef.value!.getBoundingClientRect()

            const rectBottom = rect.y + rect.height
            const relativeY = rectBottom - containerRect.y + 5

            // 移动端菜单居中显示
            menuPosition.value = {
                top: relativeY + 'px',
                left: '50%', // 在移动端始终居中显示
            }

            // 如果选中内容不为空，则显示菜单
            if (selectedText.value) {
                props.onShow(true)
            }
        }

        // 点击外部关闭菜单
        const handleClickOutside = (e: MouseEvent) => {
            // 如果有_vts字段则为特殊情况，不关闭
            if (!props.showMenu || (e as any)._vts) {
                return
            }
            if (!(e.target as HTMLElement).closest('.floating-menu')) {
                props.onClose()
            }
        }

        // 点击外部关闭菜单，移动端有点特殊，需要点击右上角关闭
        const handleTouchOutside = (e: TouchEvent) => {
            if (!props.showMenu || (e as any)._vts) {
                return
            }
            if (!(e.target as HTMLElement).closest('.floating-menu')) {
                // props.onClose()
            }
        }

        // 事件监听
        onMounted(() => {
            if (getClientType() === 'mobile') {
                // 移动端
                document.addEventListener('touchend', handleTouchEnd)
                document.addEventListener('touchstart', handleTouchOutside)
            } else {
                // PC端
                document.addEventListener('mouseup', handleMouseUp)
                document.addEventListener('mousedown', handleClickOutside)
            }
        })

        // 卸载事件监听
        onUnmounted(() => {
            if (getClientType() === 'mobile') {
                // 移动端
                document.removeEventListener('touchend', handleTouchEnd)
                document.removeEventListener('touchstart', handleTouchOutside)
            } else {
                // PC端
                document.removeEventListener('mouseup', handleMouseUp)
                document.removeEventListener('mousedown', handleClickOutside)
            }
        })

        return () => (
            <div class="relative" ref={containerRef}>
                {slots.default?.()}
                {props.showMenu && (
                    <div class={`${menuClass} floating-menu`} style={menuPosition.value}>
                        {props.menu ? props.menu?.(selectedText.value) : <div>Default</div>}
                    </div>
                )}
            </div>
        )
    },
})
