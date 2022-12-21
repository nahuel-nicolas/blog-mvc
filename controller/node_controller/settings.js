const port = 3030;
const model_api_url = 'http://localhost:8000/';

const post_model_api_url = model_api_url + 'post/';
const comment_model_api_url = model_api_url + 'comment/';
const authentication_model_api_url = model_api_url + 'authentication/';
const user_authentication_model_api_url = authentication_model_api_url + 'user/';
const token_authentication_model_api_url = authentication_model_api_url + 'token/';
const refresh_token_authentication_model_api_url = token_authentication_model_api_url + 'refresh/';

const redisHost = '127.0.0.1';
const redisPort = 6379;

const reactViewHost = 'http://localhost:3500';
const angularViewHost = 'http://localhost:4200';
const nextViewHost = 'http://localhost:3000';

const debug = true;

module.exports = {
    port,
    model_api_url,
    post_model_api_url,
    comment_model_api_url,
    authentication_model_api_url,
    user_authentication_model_api_url,
    token_authentication_model_api_url,
    refresh_token_authentication_model_api_url,
    redisHost,
    redisPort,
    reactViewHost,
    angularViewHost,
    nextViewHost,
    debug
}