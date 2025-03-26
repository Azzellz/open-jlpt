import { defineComponent } from 'vue'
import { NAvatar, NCard } from 'naive-ui'
import CalendarHeatmap from '@/components/tools/CalendarHeatmap'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const records = ref([
    { date: '2025-02-25', completed: true },
    { date: '2025-01-02', completed: true },
    // ...其他打卡记录
])

export default defineComponent(() => {
    const userStore = useUserStore()
    return () => (
        <div class="gap-10 md:flex-x">
            <div class="flex-1/3 flex-y">
                <NAvatar round size={256} src={userStore.user!.avatar} />
                <div class="mt-10 text-2xl">{userStore.user!.name}</div>
                <div class="text-xl text-gray-300">{userStore.user!.account}</div>
                {/* <div class="mt-4">{userStore.user!.description}</div> */}
            </div>
            <div class="flex-2/3">
                <NCard>
                    <CalendarHeatmap records={records.value} year={2025} />
                </NCard>
            </div>
        </div>
    )
})
