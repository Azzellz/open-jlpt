<script setup lang="ts">
import AppHeader from './components/app/AppHeader.vue'
import AppContent from './components/app/AppContent.vue'
import AppProvider from './components/app/AppProvider.vue'
import AppGuard from './components/app/AppGuard.vue'
import { useUserStore } from './stores/user'
const userStore = useUserStore()
</script>

<template>
    <AppProvider>
        <!-- 通过是否有 User 来判断是否登陆 -->
        <template v-if="userStore.user">
            <AppHeader />
            <AppContent />
        </template>
        <AppGuard v-else />
    </AppProvider>
</template>
