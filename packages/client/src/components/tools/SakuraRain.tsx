import { ref, onMounted, onUnmounted, defineComponent } from 'vue'

interface Props {
    interval?: number
    speedRange?: [number, number]
    colors?: string[]
}
export default defineComponent({
    setup(props: Props, { slots }) {
        const {
            interval = 100,
            speedRange = [0.3, 0.6],
            colors = ['#ff9a9e', '#fad0c4', '#f5576c'],
        } = props

        const containerRef = ref<HTMLElement | null>(null)
        interface Petal {
            element: HTMLDivElement
            startTime: number
            speed: number
            initialX: number
            scale: number
        }
        const petals = ref<Petal[]>([])
        let animationFrameId: number
        let intervalId: ReturnType<typeof setInterval>

        const createPetal = () => {
            if (!containerRef.value) return

            const containerRect = containerRef.value.getBoundingClientRect()
            const initialX = Math.random() * containerRect.width
            const scale = 0.5 + Math.random() * 0.5

            const petal = document.createElement('div')
            petal.style.position = 'absolute'
            petal.style.left = `${initialX}px`
            petal.style.top = `-30px`
            petal.style.width = `${10 * scale}px`
            petal.style.height = `${10 * scale}px`
            petal.style.background = colors[Math.floor(Math.random() * colors.length)]
            petal.style.borderRadius = '50% 50% 0 50%'
            petal.style.transform = `rotate(${Math.random() * 360}deg)`
            petal.style.opacity = '0.8'
            petal.style.pointerEvents = 'none'
            containerRef.value.appendChild(petal)

            petals.value.push({
                element: petal,
                startTime: Date.now(),
                speed: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
                initialX,
                scale,
            })
        }

        const animate = () => {
            if (!containerRef.value) return

            const currentTime = Date.now()
            const containerHeight = containerRef.value.offsetHeight
            const containerWidth = containerRef.value.offsetWidth

            petals.value = petals.value.filter((petal) => {
                const elapsed = currentTime - petal.startTime
                const progress = elapsed / 5000

                // 垂直运动
                const yPos = elapsed * petal.speed

                // 水平摆动
                const xOffset = Math.sin(elapsed / 500) * 50 * petal.scale
                const currentX = petal.initialX + xOffset

                // 旋转动画
                const rotate = elapsed * 0.1

                // 透明度变化
                const opacity = Math.min(1, 3 * (1 - progress))

                if (yPos > containerHeight + 50) {
                    petal.element.remove()
                    return false
                }

                petal.element.style.transform = `translate(${currentX}px, ${yPos}px) rotate(${rotate}deg)`
                petal.element.style.opacity = `${opacity}`
                return true
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        onMounted(() => {
            intervalId = setInterval(createPetal, interval)
            animate()
        })

        onUnmounted(() => {
            clearInterval(intervalId)
            cancelAnimationFrame(animationFrameId)
            petals.value.forEach((petal) => petal.element.remove())
            petals.value = []
        })

        return () => (
            <div ref={containerRef} class="app-content">
                {slots.default?.()}
            </div>
        )
    },
})
