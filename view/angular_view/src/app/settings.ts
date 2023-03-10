import { environment } from '../environments/environment';

export const conf = environment.production;
export const api_url = environment.nodeUrl;
export const post_api_url = api_url + 'post/';
export const comment_api_url = api_url + 'comment/';
export const authentication_api_url = api_url + 'authentication/';
export const register_user_api_url = authentication_api_url + 'user/';
export const login_user_and_get_token_api_url = authentication_api_url + 'token/';
export const refresh_token_api_url = login_user_and_get_token_api_url + 'refresh/';
export const debug = true;