import vue3GoogleLogin from 'vue3-google-login';
const env_value = useRuntimeConfig();

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const clientid = env_value.public.GOOGLE_CLIENTID;

    nuxtApp.vueApp.use(vue3GoogleLogin, {
        clientId: clientid
    });
})