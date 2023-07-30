<template>
    <div>
        <button @click="sendEmail">Resend Email Verification</button>
        <span>{{ message }}</span>
    </div>
</template>
  
<script lang="ts" setup>
definePageMeta({
    middleware: ["auth"]
})
const message = ref('');

async function sendEmail() {
    const response = await $fetch('/api/sendEmailVerification', {
        'method': 'post',
    });
    if (response.success && response.data?.message)
        message.value = response.data?.message
}
</script>