<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/app/AppHeader.vue'
import AppContent from './components/app/AppContent.vue'
</script>

<template>
    <AppHeader></AppHeader>
    <AppContent>
        <RouterView></RouterView>
    </AppContent>
</template>

<style scoped></style>
