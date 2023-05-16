<template>
    <div>
        <button type="button" @click="handleGoogleLogin">
            使用 Google 繼續
        </button>
    </div>
</template>
  
<script setup lang="ts">
import { googleAuthCodeLogin } from 'vue3-google-login'

const runtimeConfig = useRuntimeConfig()
const { googleClientId: GOOGLE_CLIENT_ID } = runtimeConfig.public


const handleGoogleLogin = () => {
    googleAuthCodeLogin({
        clientId: GOOGLE_CLIENT_ID
    }).then((response) => {
        console.log(response)
    })
}
</script>