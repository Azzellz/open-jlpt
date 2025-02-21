<script setup lang="ts">
import API from '@/api'
import { onMounted } from 'vue'
import { isSuccessResponse, Log } from '@root/shared'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

onMounted(async () => {
    const result = await API.Config.getConfig()
    if (isSuccessResponse(result)) {
        configStore.config = result.data
        console.log(result.data)
        Log.success(result.message)
    }
})
</script>

<template>
    <div></div>
</template>
