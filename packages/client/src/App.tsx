import { defineComponent } from 'vue'
import AppHeader from '@/components/app/AppHeader'
import AppContent from '@/components/app/AppContent'
import AppProvider from '@/components/app/AppProvider'
import AppGuard from '@/components/app/AppGuard'
import { useUserStore } from '@/stores/user'

const AppBody = () => (
    <>
        <AppHeader />
        <AppContent />
    </>
)
export default defineComponent(() => {
    const userStore = useUserStore()
    return () => (
        <AppProvider>
            {/* 通过是否有 User 来判断是否登陆 */}
            {userStore.user ? <AppBody /> : <AppGuard />}
        </AppProvider>
    )
})
