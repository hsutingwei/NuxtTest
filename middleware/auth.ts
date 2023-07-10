export default defineNuxtRouteMiddleware((to, from) => {
    console.log(99999)
    const userProfile = useNuxtApp().ssrContext?.event.context.userProfile
    useState('userProfile', () => userProfile)
    console.log(userProfile)

    if (!userProfile)
        return navigateTo('/login')
});