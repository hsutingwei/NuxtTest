<template>
    <button @click="login">登入</button>
</template>
  
<script setup lang="ts">
import { defineComponent } from 'vue';
import { useAuth0 } from '~/plugins/auth0.client';

export default defineComponent({
    setup() {
        const auth0 = useAuth0();

        const login = () => {
            auth0.loginWithRedirect();
        };

        return {
            login,
        };
    },
});
</script>