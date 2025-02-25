<template>
    <n-config-provider
        abstract
        :theme-overrides="themeOverrides"
        :locale="jaJP"
        :date-locale="dateJaJP"
    >
        <slot />
    </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, type GlobalThemeOverrides, jaJP, dateJaJP } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#fdb5c0',
        primaryColorHover: '#fdb5c0',
        primaryColorPressed: '#fdb5c0',
        primaryColorSuppl: '#fdb5c0',
    },
}
</script>
