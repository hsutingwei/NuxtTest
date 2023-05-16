import createAuth0Client from '@auth0/auth0-spa-js';

let auth0Client = null;

export const initAuth0 = async () => {
    auth0Client = await createAuth0Client({
        domain: '<%= options.domain %>',
        client_id: '<%= options.clientId %>'
    });
};

export const loginWithRedirect = () => {
    return auth0Client.loginWithRedirect();
};

export const handleRedirectCallback = () => {
    return auth0Client.handleRedirectCallback();
};

export const isAuthenticated = () => {
    return auth0Client.isAuthenticated();
};

export const getUser = () => {
    return auth0Client.getUser();
};