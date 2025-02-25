<template>
    <div class="flex flex-col gap-8">
        <div class="flex justify-center text-gray">{{ year }}年 一共打卡 {{ totalCount }} 次</div>
        <div class="flex flex-wrap gap-4">
            <div v-for="(month, midx) in calendarData" :key="midx" class="month-container">
                <div class="month-label">{{ month.monthLabel }}</div>
                <div class="weeks-container">
                    <div v-for="(week, widx) in month.weeks" :key="widx" class="week-container">
                        <n-popover v-for="(day, didx) in week.days" trigger="hover">
                            <template #trigger>
                                <div
                                    :key="didx"
                                    class="day-cell"
                                    :class="{
                                        active: day.active,
                                        future: day.isFuture,
                                        today: day.isToday,
                                    }"
                                    @click="handleDayClick(day.date)"
                                />
                            </template>
                            <span>{{ dayTooltip(day) }}</span>
                        </n-popover>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import { NPopover } from 'naive-ui'

interface DailyRecord {
    date: string // YYYY-MM-DD
    completed: boolean
}

interface CalendarDay {
    date: Dayjs
    active: boolean
    isToday: boolean
    isFuture: boolean
}

const props = defineProps<{
    records: DailyRecord[]
    year: number
}>()

const emit = defineEmits<{
    (e: 'day-click', date: string): void
}>()

// 生成全年数据
const calendarData = computed(() => {
    const targetYear = props.year || dayjs().year()
    const months = []

    for (let month = 0; month < 12; month++) {
        // 明确基于目标年份创建日期对象
        const startDate = dayjs(new Date(targetYear, month, 1))
        const endDate = startDate.endOf('month')

        const weeks = []
        let currentWeek = []
        // 从每个月初开始
        let currentDate = startDate.startOf('month')

        // 包含结束边界
        while (
            currentDate.isBefore(endDate.endOf('week')) ||
            currentDate.isSame(endDate.endOf('week'))
        ) {
            currentWeek.push({
                date: currentDate,
                active: isDayActive(currentDate),
                isToday: currentDate.isSame(dayjs(), 'day'),
                isFuture: currentDate.isAfter(dayjs(), 'day'),
            })

            if (currentWeek.length === 7) {
                weeks.push({ days: currentWeek })
                currentWeek = []
            }

            currentDate = currentDate.add(1, 'day')
        }

        // 处理最后未满一周的剩余天数
        if (currentWeek.length > 0) {
            weeks.push({ days: currentWeek })
        }

        months.push({
            monthLabel: startDate.format('MMM'),
            weeks,
        })
    }
    return months
})

const totalCount = computed(() => {
    return props.records.filter((r) => r.completed).length
})

const isDayActive = (date: Dayjs) => {
    return props.records.some((r) => dayjs(r.date).isSame(date, 'day') && r.completed)
}

const handleDayClick = (date: Dayjs) => {
    if (!date.isAfter(dayjs(), 'day')) {
        emit('day-click', date.format('YYYY-MM-DD'))
    }
}

const dayTooltip = (day: CalendarDay) => {
    if (day.isFuture) return '未来'
    if (day.isToday) {
        return day.active ? '今天已打卡' : '今天未打卡'
    }
    return `${day.date.format('YYYY-MM-DD')}\n${day.active ? '已打卡' : '未打卡'}`
}
</script>

<style scoped>
.calendar-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.month-container {
    display: flex;
    gap: 1rem;
}

.month-label {
    width: 40px;
    text-align: right;
    font-size: 0.8em;
    color: #666;
}

.weeks-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.week-container {
    display: flex;
    gap: 2px;
}

.day-cell {
    width: 12px;
    height: 12px;
    background-color: #ebedf0;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.day-cell.active {
    background-color: #39d353;
}

.day-cell.today {
    border: 1px solid #216e39;
}

.day-cell.future {
    background-color: #ebedf07a;
    cursor: not-allowed;
}

.day-cell:hover:not(.future) {
    transform: scale(1.2);
}
</style>
