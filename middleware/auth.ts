export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) {
        const event = useRequestEvent()
        if (!event.context.userInfo?.uInfo && to.path !== '/login')
            return navigateTo('/login')
        else if (event.context.userInfo?.uInfo && event.context.userInfo?.uInfo.email_verified == false)
            return navigateTo('/resendEmail')
        else if (event.context.userInfo?.uInfo && to.path == '/login')
            return navigateTo('/dashboard')
        return
    }

    const userInfo = await $fetch('/api/userInfo')
    console.log(userInfo)
    if (!userInfo?.uInfo && to.path !== '/login')
        return navigateTo('/login')
    else if (userInfo?.uInfo && to.path == '/login')
        return navigateTo('/dashboard')
});