<script setup lang="ts">
const username = ref('');
const password = ref('');

async function Login() {
    const valid = await $fetch('/api/login', {
        'method': 'post',
        'body': {
            username: username.value,
            password: password.value
        }
    });

    if (valid.success)
        console.log('成功');
    else
        console.log('失敗');
}
</script>

<template>
    <div class="bg-red-5">
        帳號<input type="text" v-model="username">
        密碼<input type="password" v-model="password">
        <button @click="Login">登入</button>
    </div>
</template>
  