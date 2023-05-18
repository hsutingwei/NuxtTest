const env_value = useRuntimeConfig();
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: env_value.AUTH0_SECRET,
    baseURL: env_value.public.PROFILE_PAGE,
    clientID: env_value.public.AUTH0_CLIENTID,
    issuerBaseURL: env_value.public.AUTH0_DOMAIN
};

export default defineEventHandler(async (event) => {
    /*let request = $fetch()
    var options = { method: 'POST',
  url: env_value.public.AUTH0_DOMAIN + '/oauth/token',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  form:
   { grant_type: 'authorization_code',
     client_id: '{yourClientId}',
     client_secret: 'YOUR_CLIENT_SECRET',
     code: 'AUTHORIZATION_CODE',
     redirect_uri: '{https://yourApp/callback}' }
   };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});*/

    return '';
})