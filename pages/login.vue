<template>
    <div>
        <a
            href="https://dev-tc6olcvek7d4xkgt.us.auth0.com/authorize?audience=API_IDENTIFIER&scope=SCOPE&response_type=code&client_id=ehiYMGrwfM20Z2g4PIAgKLcg4vb96ZkJ&redirect_uri=http://localhost:3000/api/auth0&state=STATE">登入</a>
    </div>
</template>
  
<script lang="ts" setup>
let test = ref('');
test = '/profile'
let auth0_link = ref('');
const auth0_domain = ref('')
const runtimeConfig = useRuntimeConfig();
auth0_link = runtimeConfig.public.AUTH0_DOMAIN + '/authorize?audience=API_IDENTIFIER&scope=SCOPE&response_type=code&client_id='
    + runtimeConfig.public.AUTH0_CLIENTID + '&redirect_uri=' + runtimeConfig.public.PROFILE_PAGE + '&state=STATE';
console.log(auth0_link);
console.log('asd132sad145');
</script>