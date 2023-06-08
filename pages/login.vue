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
    type tokenResponse = {
        access_token: string,
        expires_in: string,
        token_type: string,
    };
    console.log(env_value.public.AUTH0_CLIENTID)
    console.log(env_value.public.test)

    //取得API回傳的Token
    try {
        const getToken = await $fetch<tokenResponse>(`${env_value.public.AUTH0_DOMAIN}/oauth/token`, {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'password',
                username: username.value,//test@test.com
                password: password.value,//asdZXC123*
                scope: 'openid profile email offline_access',
                client_id: env_value.public.AUTH0_CLIENTID,
                client_secret: env_value.public.test,
                audience: 'NuxtLoginAPI',
            })
        });
        console.log(getToken);
    } catch (error) {
        console.log(error);
    }
}
</script>