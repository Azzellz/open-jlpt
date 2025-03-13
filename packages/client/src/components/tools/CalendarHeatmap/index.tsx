import { defineComponent, computed, type SetupContext } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import { NPopover } from 'naive-ui'
import './style.css'

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

interface Props {
    records: DailyRecord[]
    year: number
}

export default defineComponent(
    (
        props: Props,
        {
            emit,
        }: SetupContext<{
            dayClick: (date: string) => void
        }>,
    ) => {
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
                emit('dayClick', date.format('YYYY-MM-DD'))
            }
        }

        const dayTooltip = (day: CalendarDay) => {
            if (day.isFuture) return '未来'
            if (day.isToday) {
                return day.active ? '今天已打卡' : '今天未打卡'
            }
            return `${day.date.format('YYYY-MM-DD')}\n${day.active ? '已打卡' : '未打卡'}`
        }

        return () => (
            <div class="flex flex-col gap-8">
                <div class="flex justify-center text-gray">
                    {props.year}年 一共打卡 {totalCount.value} 次
                </div>
                <div class="flex flex-wrap gap-4">
                    {calendarData.value.map((month) => {
                        return (
                            <div class="month-container">
                                <div class="month-label">{month.monthLabel}</div>
                                <div class="weeks-container">
                                    {month.weeks.map((week) => {
                                        return (
                                            <div class="week-container">
                                                {week.days.map((day) => {
                                                    return (
                                                        <NPopover
                                                            trigger="hover"
                                                            v-slots={{
                                                                trigger: () => (
                                                                    <div
                                                                        class={{
                                                                            'day-cell': true,
                                                                            active: day.active,
                                                                            future: day.isFuture,
                                                                            today: day.isToday,
                                                                        }}
                                                                        onClick={() =>
                                                                            handleDayClick(day.date)
                                                                        }
                                                                    />
                                                                ),
                                                            }}
                                                        >
                                                            <span>{dayTooltip(day)}</span>
                                                        </NPopover>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    },
)
