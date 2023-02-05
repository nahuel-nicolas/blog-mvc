const protocol = process.env.PROTOCOL;
const isProduction = process.env.CONFIGURATION === 'production';
const hostname = isProduction ? process.env.PRODUCTION_HOSTNAME : process.env.HOSTNAME;
const port = process.env.NODE_ENV === 'test' ? process.env.NODE_TEST_PORT : process.env.NODE_PORT;
const model_api_url = protocol + hostname + ':' + process.env.DJANGO_PORT + '/';

const post_model_api_url = model_api_url + 'post/';
const comment_model_api_url = model_api_url + 'comment/';
const authentication_model_api_url = model_api_url + 'authentication/';
const user_authentication_model_api_url = authentication_model_api_url + 'user/';
const token_authentication_model_api_url = authentication_model_api_url + 'token/';
const refresh_token_authentication_model_api_url = token_authentication_model_api_url + 'refresh/';

const redisHost = hostname;
const redisPort = process.env.REDIS_PORT;

// build allowedCorsUrls
const allowedCorsUrls = []
const viewPorts = ['80', process.env.REACT_PORT, process.env.ANGULAR_PORT, process.env.NEXT_PORT]
for (const currentViewPort of viewPorts) {
    const allowedCorsHostnames = []
    if (isProduction) {
        allowedCorsHostnames.push(hostname)
    } else {
        allowedCorsHostnames.push('localhost', '0.0.0.0', '127.0.0.1')
    }
    for (const currentHostname of allowedCorsHostnames) {
        allowedCorsUrls.push(protocol + currentHostname + ':' + currentViewPort)
    }
}

const debug = true;

module.exports = {
    isProduction,
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
    allowedCorsUrls,
    debug
}