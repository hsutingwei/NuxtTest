<template>
    <pre>
        {{ profile }}
    </pre>
    已登入
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["auth"]
})

const profile = useState('userProfile')
</script>