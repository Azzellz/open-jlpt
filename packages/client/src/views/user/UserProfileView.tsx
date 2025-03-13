import { defineComponent } from 'vue'
import { NAvatar, NCard } from 'naive-ui'
import CalendarHeatmap from '@/components/tools/CalendarHeatmap'
import { ref } from 'vue'

const records = ref([
    { date: '2025-02-25', completed: true },
    { date: '2025-01-02', completed: true },
    // ...其他打卡记录
])

export default defineComponent(() => {
    return () => (
        <div class="flex-x gap-10">
            <div class="flex-1/3 flex-y">
                <NAvatar
                    round
                    size={256}
                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
                <div class="mt-10 text-xl font-bold">OpenJLPT</div>
                <div class="text-xl text-gray font-light">YuzuTea</div>
                <div class="mt-4">Code for code. Live for life. Tyee my tea</div>
            </div>
            <div class="flex-2/3">
                <NCard class="h-full">
                    <CalendarHeatmap records={records.value} year={2025} />
                </NCard>
            </div>
        </div>
    )
})
