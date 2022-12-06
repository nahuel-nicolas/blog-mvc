const axios = require('axios');


function get(req, model_url) {
    return axios.get(model_url).then(
        model_res => model_res,
        err => err.response
    )
}

function post(req, model_url) {
    return axios.post(model_url, req.body).then(
        model_res => model_res,
        err => err.response
    )
} 

function authPost(req, model_url) {
    const headers = {authorization: req.headers.authorization};
    return axios.post(model_url, req.body, {headers}).then(
        model_res => model_res,
        err => err.response
    );
}

function authPut(req, model_url) {
    const headers = {authorization: req.headers.authorization};
    return axios.put(model_url, req.body, {headers}).then(
        model_res => model_res,
        err => err.response
    );
}

function authDelete(req, model_url) {
    const headers = {authorization: req.headers.authorization};
    return axios.delete(model_url, {headers}).then(
        model_res => model_res,
        err => err.response
    );
}


module.exports = {
    get,
    post,
    authPost,
    authPut,
    authDelete
}

