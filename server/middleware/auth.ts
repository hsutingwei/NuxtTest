import { getUserInfoFromAuthToken } from '~/server/utils/getAuth0UserInfo'
const env_value = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    event.context.userInfo = await getUserInfoFromAuthToken(event)
})