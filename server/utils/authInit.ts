import { createAuth0Client } from "@auth0/auth0-spa-js"

export async function getAuth0Client() {
    const env_value = useRuntimeConfig();
    return await createAuth0Client({
        domain: env_value.public.AUTH0_DOMAIN,
        clientId: env_value.public.AUTH0_CLIENTID
    });
}
