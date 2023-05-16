<template>
    <div>
        <button type="button" @click="handleGoogleLogin">
            使用 Google 繼續
        </button>
        <span>{{ userInfo }}</span>
    </div>
</template>
  
<script setup lang="ts">
import { googleTokenLogin } from 'vue3-google-login'

const runtimeConfig = useRuntimeConfig()
const { googleClientId: GOOGLE_CLIENT_ID } = runtimeConfig.public

const userInfo = ref()

const handleGoogleLogin = async () => {
    const accessToken = await googleTokenLogin({
        clientId: GOOGLE_CLIENT_ID
    }).then((response) => response?.access_token)

    if (!accessToken) {
        return '登入失敗'
    }

    const { data } = await useFetch('/api/auth/google', {
        method: 'POST',
        body: {
            accessToken
        },
        initialCache: false
    })

    userInfo.value = data.value
}
</script>