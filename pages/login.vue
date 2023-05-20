<template>
    <div>
        帳號<input type="text" v-model="username">
        密碼<input type="password" v-model="password">
        <button @click="login">登入</button>
        <NuxtLink :to="google_auth0_link">Google登入</NuxtLink>
        <NuxtLink :to="facebook_auth0_link">Facebook登入</NuxtLink>
    </div>
</template>
  
<script lang="ts" setup>
import { PasswordValidationResult } from '~/type'
const username = ref('');
const password = ref('');

let google_auth0_link = ref('');
let facebook_auth0_link = ref('');
const env_value = useRuntimeConfig();
google_auth0_link.value = env_value.public.AUTH0_DOMAIN + '/authorize?audience=NuxtLoginAPI&scope=openid%20profile%20email%20offline_access&response_type=code&client_id='
    + env_value.public.AUTH0_CLIENTID + '&redirect_uri=' + env_value.public.REDIRECT_URL + '&connection=google-oauth2';
facebook_auth0_link.value = env_value.public.AUTH0_DOMAIN + '/authorize?audience=NuxtLoginAPI&scope=openid%20profile%20email%20offline_access&response_type=code&client_id='
    + env_value.public.AUTH0_CLIENTID + '&redirect_uri=' + env_value.public.REDIRECT_URL + '&connection=facebook';

async function login() {
    const valid = await $fetch('/api/login', {
        'method': 'post',
        'body': {
            username: username.value,
            password: password.value
        }
    });

    if (valid.success)
        window.location.href = '/dashboard';
}
</script>