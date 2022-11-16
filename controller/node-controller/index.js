const express = require("express");
const cors = require("cors");
const axios = require('axios');

const app = express()

// const settings = require("./settings");
// const model_api_url = settings.model_api_url;
// const port = settings.port;
const model_api_url = 'http://localhost:8000/';
const post_model_api_url = model_api_url + 'post/';
const comment_model_api_url = model_api_url + 'comment/';
const authentication_model_api_url = model_api_url + 'authentication/';
const user_authentication_model_api_url = authentication_model_api_url + 'user/';
const token_authentication_model_api_url = authentication_model_api_url + 'token/';
const refresh_token_authentication_model_api_url = token_authentication_model_api_url + 'refresh/';

const port = 3030;

app.use(express.json());
app.use(cors());
app.set('json spaces', 2)


// /
app.get("/", (req, res) => {
    return res.json({'hi': 'world'})
});


// /authentication/user/
app.get("/authentication/user/", (req, res) => {
    basic_get_req(req, res, user_authentication_model_api_url)
});

app.post("/authentication/user/", (req, res) => {
    basic_post_req(req, res, user_authentication_model_api_url)
});


// /authentication/token/
app.post("/authentication/token/", (req, res) => {
    basic_post_req(req, res, token_authentication_model_api_url)
});


// /authentication/token/refresh/
app.post("/authentication/token/refresh/", (req, res) => {
    basic_post_req(req, res, refresh_token_authentication_model_api_url)
});


// /post/
app.get("/post/", (req, res) => {
    basic_get_req(req, res, post_model_api_url)
});

app.post("/post/", (req, res) => {
    auth_post_req(req, res, post_model_api_url)
});


// /post/:post_id/
app.get("/post/:post_id/", (req, res) => {
    const post_id = req.params.post_id;
    const url = post_model_api_url + `${post_id}/`;
    basic_get_req(req, res, url)
});

app.put("/post/:post_id/", (req, res) => {
    const post_id = req.params.post_id;
    const url = post_model_api_url + `${post_id}/`;
    auth_put_req(req, res, url)
});

app.delete("/post/:post_id/", (req, res) => {
    const post_id = req.params.post_id;
    const url = post_model_api_url + `${post_id}/`;
    auth_delete_req(req, res, url)
});


// /comment/
app.get("/comment/", (req, res) => {
    basic_get_req(req, res, comment_model_api_url)
});

app.post("/comment/", (req, res) => {
    auth_post_req(req, res, comment_model_api_url)
});


// /comment/:comment_id/
app.get("/comment/:comment_id/", (req, res) => {
    const comment_id = req.params.comment_id;
    const url = comment_model_api_url + `${comment_id}/`;
    basic_get_req(req, res, url)
});

app.put("/comment/:comment_id/", (req, res) => {
    const comment_id = req.params.comment_id;
    const url = comment_model_api_url + `${comment_id}/`;
    auth_put_req(req, res, url)
});

app.delete("/comment/:comment_id/", (req, res) => {
    const comment_id = req.params.comment_id;
    const url = comment_model_api_url + `${comment_id}/`;
    auth_delete_req(req, res, url)
});


app.listen(port, () => {
    console.log(`Node server is running on port ${port}!`);
});


function basic_get_req(req, res, model_url) {
    console.log(req.method + ' ' + req.path);
    axios.get(model_url).then(
        model_res => res.json(model_res.data),
        err => res.status(err.response.status).send(err.response.data)
    )
}

function basic_post_req(req, res, model_url) {
    console.log(req.method + ' ' + req.path);
    axios.post(model_url, req.body).then(
        model_res => res.json(model_res.data),
        err => res.status(err.response.status).send(err.response.data)
    )
} 

function auth_post_req(req, res, model_url) {
    console.log(req.method + ' ' + req.path);
    const headers = {authorization: req.headers.authorization};
    axios.post(model_url, req.body, {headers}).then(
        model_res => res.json(model_res.data),
        err => res.status(err.response.status).send(err.response.data)
    );
}

function auth_put_req(req, res, model_url) {
    console.log(req.method + ' ' + req.path);
    const headers = {authorization: req.headers.authorization};
    axios.put(model_url, req.body, {headers}).then(
        model_res => res.json(model_res.data),
        err => res.status(err.response.status).send(err.response.data)
    );
}

function auth_delete_req(req, res, model_url) {
    console.log(req.method + ' ' + req.path);
    const headers = {authorization: req.headers.authorization};
    axios.delete(model_url, {headers}).then(
        model_res => res.json(model_res.data),
        err => res.status(err.response.status).send(err.response.data)
    );
}