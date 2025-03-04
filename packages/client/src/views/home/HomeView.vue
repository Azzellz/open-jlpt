<script setup lang="ts">
import SakuraIcon from '@/components/icon/SakuraIcon.vue'
import SakuraRain from '@/components/tools/SakuraRain.vue'
</script>

<template>
    <SakuraRain>
        <main class="h-full flex-x items-center reactive">
            <div class="m-auto flex-y gap-10">
                <div class="flex-x text-8xl gap-2 items-center">
                    <SakuraIcon class="mb-1.5 mr-2" size="150" />
                    <span class="text-gray">OPEN</span>
                    <span class="text-red-300">·</span>
                    <span class="text-red">JLPT</span>
                </div>
                <div class="text-2xl italic pl-5 text-center text-gray-300">
                    <a
                        class="underline hover:text-red-300 transition"
                        href="https://www.jlpt.jp"
                        v-text="$t('guard.title')"
                    />
                    <span v-text="$t('guard.description')" />
                </div>
            </div>
        </main>
    </SakuraRain>
</template>
