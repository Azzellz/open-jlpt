<template>
    <div ref="containerRef" class="relative" :style="containerStyle">
        <slot />
        <!-- 指示器 -->
        <div
            v-for="dir in directions"
            :key="dir"
            class="absolute z-1"
            :class="`handle-${dir}`"
            :style="getHandleStyle(dir)"
            @mousedown.prevent="startResize(dir, $event)"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from 'vue'

const props = withDefaults(
    defineProps<{
        x?: number
        y?: number
        width?: number
        height?: number
        minWidth?: number
        minHeight?: number
    }>(),
    {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        minWidth: 100,
        minHeight: 100,
    },
)

const emit = defineEmits([
    'update:x',
    'update:y',
    'update:width',
    'update:height',
    'resize-start',
    'resize',
    'resize-end',
])

const containerRef = ref<HTMLElement | null>(null)
const isResizing = ref(false)
const resizeDirection = ref('')
const startX = ref(0)
const startY = ref(0)

const directions = ['n', 'e', 's', 'w']

const containerStyle = computed<Record<string, string>>(() => ({
    width: `${containerRect.value.width}px`,
    height: `${containerRect.value.height}px`,
}))

const containerRect = ref({
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
})

const lastRect = ref({ ...containerRect.value })

const getHandleStyle = (dir: string) => {
    const size = 8 // Handle size
    const offset = -size / 2
    const styles: Record<string, string> = {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'blue',
        borderRadius: '50%',
    }

    if (dir === 'n') {
        styles.top = `${offset}px`
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
        styles.cursor = 'ns-resize'
    } else if (dir === 'e') {
        styles.right = `${offset}px`
        styles.top = '50%'
        styles.transform = 'translateY(-50%)'
        styles.cursor = 'ew-resize'
    } else if (dir === 's') {
        styles.bottom = `${offset}px`
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
        styles.cursor = 'ns-resize'
    } else if (dir === 'w') {
        styles.left = `${offset}px`
        styles.top = '50%'
        styles.transform = 'translateY(-50%)'
        styles.cursor = 'ew-resize'
    }

    return styles
}

const startResize = (dir: string, event: MouseEvent) => {
    isResizing.value = true
    resizeDirection.value = dir
    startX.value = event.clientX
    startY.value = event.clientY

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', stopResize)
    emit('resize-start')
}

const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing.value) return

    const deltaX = event.clientX - startX.value
    const deltaY = event.clientY - startY.value
    let newX = lastRect.value.x
    let newY = lastRect.value.y
    let newWidth = lastRect.value.width
    let newHeight = lastRect.value.height

    if (resizeDirection.value.includes('e')) {
        newWidth = Math.max(lastRect.value.width + deltaX, props.minWidth)
    }
    if (resizeDirection.value.includes('w')) {
        newWidth = Math.max(lastRect.value.width - deltaX, props.minWidth)
        newX = lastRect.value.x + deltaX
    }
    if (resizeDirection.value.includes('s')) {
        newHeight = Math.max(lastRect.value.height + deltaY, props.minHeight)
    }
    if (resizeDirection.value.includes('n')) {
        newHeight = Math.max(lastRect.value.height - deltaY, props.minHeight)
        newY = lastRect.value.y + deltaY
    }

    const newRect = { x: newX, y: newY, width: newWidth, height: newHeight }
    emit('update:x', newX)
    emit('update:y', newY)
    emit('update:width', newWidth)
    emit('update:height', newHeight)
    emit('resize', newRect)
    containerRect.value = newRect
}

const stopResize = () => {
    isResizing.value = false
    resizeDirection.value = ''
    lastRect.value = {
        ...containerRect.value,
    }
    emit('resize-end')
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', stopResize)
}

onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', stopResize)
})
</script>
