<template>
    <div class="text-select-container" ref="containerRef">
        <slot name="default" />

        <div v-if="showMenu" class="floating-menu" :style="menuPosition" @mousedown.prevent>
            <slot name="menu" :selectedText="selectedText">
                <!-- 默认菜单内容 -->
                <div class="menu-item" @click="copyText">复制</div>
                <div class="menu-item" @click="shareText">分享</div>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Position {
    top: string
    left: string
}

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

// 点击外部关闭菜单
const handleClickOutside = (e: MouseEvent) => {
    if (!showMenu.value) return
    if (!(e.target as HTMLElement).closest('.floating-menu')) {
        showMenu.value = false
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
    console.log('Sharing:', selectedText.value)
    showMenu.value = false
}

// 事件监听
onMounted(() => {
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.text-select-container {
    position: relative;
    width: 100%;
}

.floating-menu {
    position: absolute;
    overflow: auto;
    /* min-width: 100px;
    max-width: 200px; */
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateX(-50%);
    z-index: 1;
}

.menu-item {
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.2s;
}

.menu-item:hover {
    background: #f5f5f5;
}
</style>
