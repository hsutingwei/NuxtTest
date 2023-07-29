export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) {
        const event = useRequestEvent()

        if (!event.context.userInfo?.sub && to.path !== '/login')
            return navigateTo('/login')
        else if (event.context.userInfo?.sub && to.path == '/login')
            return navigateTo('/dashboard')
        return
    }

    const userInfo = await $fetch('/api/userInfo')
    console.log(userInfo)
    if (!userInfo?.sub && to.path !== '/login') {
        return navigateTo('/login')
    }
    else if (userInfo?.sub && to.path == '/login') {
        return navigateTo('/dashboard')
    }
});