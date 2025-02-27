<script setup lang="ts">
import API from '@/api'
import { onMounted } from 'vue'
import { isSuccessResponse, Log } from '@root/shared'
import { useConfigStore } from '@/stores/config'
import { NButton } from 'naive-ui'

const configStore = useConfigStore()

onMounted(async () => {
    const result = await API.Config.getConfig()
    if (isSuccessResponse(result)) {
        configStore.config = result.data
        console.log(result.data)
        Log.success(result.message)
    }
})

const test = async () => {
    const result = await API.User.getUsers()
    console.log(result)
}
</script>

<template>
    <div>
        <n-button @click="test">测试</n-button>
    </div>
</template>
