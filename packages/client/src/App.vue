<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/app/AppHeader.vue'
import AppContent from './components/app/AppContent.vue'
import AppProvider from './components/app/AppProvider.vue'
</script>

<template>
    <AppProvider>
        <AppHeader />
        <AppContent>
            <RouterView />
        </AppContent>
    </AppProvider>
</template>
