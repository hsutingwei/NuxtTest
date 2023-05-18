<template>
    <div>
        <NuxtLink :to="google_auth0_link">Google登入</NuxtLink>
        <NuxtLink :to="facebook_auth0_link">Facebook登入</NuxtLink>
    </div>
</template>
  
<script lang="ts" setup>
let google_auth0_link = ref('');
let facebook_auth0_link = ref('');
const env_value = useRuntimeConfig();
google_auth0_link.value = env_value.public.AUTH0_DOMAIN + '/authorize?audience=NuxtLoginAPI&scope=openid%20profile%20email&response_type=code&client_id='
    + env_value.public.AUTH0_CLIENTID + '&redirect_uri=' + env_value.public.PROFILE_PAGE + '&connection=google-oauth2';
facebook_auth0_link.value = env_value.public.AUTH0_DOMAIN + '/authorize?audience=NuxtLoginAPI&scope=openid%20profile%20email&response_type=code&client_id='
    + env_value.public.AUTH0_CLIENTID + '&redirect_uri=' + env_value.public.PROFILE_PAGE + '&connection=facebook';
</script>