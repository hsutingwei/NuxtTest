import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'

const env_value = useRuntimeConfig();

export default NuxtAuthHandler({
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        GithubProvider.default({
           clientId: env_value.public.AUTH0_CLIENTID,
           clientSecret: env_value.public.AUTH0_SECRET
        })
    ]
})