<script setup lang="ts">
import SakuraIcon from '@/components/icon/SakuraIcon.vue'
import SakuraRain from '@/components/tools/SakuraRain.vue'
</script>

<template>
    <SakuraRain>
        <main class="h-full flex-x items-center reactive">
            <div class="m-auto flex-y items-center gap-10">
                <div class="flex-x text-8xl gap-2 items-center">
                    <SakuraIcon class="mb-1.5 mr-2" size="150" />
                    <span class="text-gray">OPEN</span>
                    <span class="text-red-300">·</span>
                    <a class="text-red underline" href="https://www.jlpt.jp">JLPT</a>
                </div>
                <div
                    class="text-2xl italic text-center text-gray-300 w-200"
                    v-text="$t('guard.description')"
                />
            </div>
        </main>
    </SakuraRain>
</template>
