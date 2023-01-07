const { server } = require('./express');
const response = require('./response');
const request = require('./request');
const settings = require('./settings');
const { log } = require('./utilities');

const serverLife = server.listen(settings.port, () => {
    log.info(`Node server is running on port ${settings.port}!`);
});


// /
server.get("/", (req, res) => {
    return res.json({'hi': 'world'})
});


// /authentication/user/
server.get("/authentication/user/", (req, res) => {
    response.send(request.get, req, res, settings.user_authentication_model_api_url)
});

server.post("/authentication/user/", (req, res) => {
    response.send(request.post, req, res, settings.user_authentication_model_api_url)
});


// /authentication/token/
server.post("/authentication/token/", (req, res) => {
    response.send(request.post, req, res, settings.token_authentication_model_api_url)
});


// /authentication/token/refresh/
server.post("/authentication/token/refresh/", (req, res) => {
    response.send(request.post, req, res, settings.refresh_token_authentication_model_api_url)
});


// /post/
server.get("/post/", (req, res) => {
    response.sendWithRedis(request.get, req, res, settings.post_model_api_url)
});

server.post("/post/", (req, res) => {
    response.send(request.authPost, req, res, settings.post_model_api_url)
});


// /post/:post_id/
server.get("/post/:post_id/", (req, res) => {
    const post_id = req.params.post_id;
    const url = settings.post_model_api_url + `${post_id}/`;
    response.sendWithRedis(request.get, req, res, url)
});

server.put("/post/:post_id/", (req, res) => {
    const post_id = req.params.post_id;
    const url = settings.post_model_api_url + `${post_id}/`;
    response.send(request.authPut, req, res, url)
});

server.delete("/post/:post_id/", (req, res) => {
    const post_id = req.params.post_id;
    const url = settings.post_model_api_url + `${post_id}/`;
    response.send(request.authDelete, req, res, url)
});


// /comment/
server.get("/comment/", (req, res) => {
    response.sendWithRedis(request.get, req, res, settings.comment_model_api_url)
});

server.post("/comment/", (req, res) => {
    response.send(request.authPost, req, res, settings.comment_model_api_url)
});


// /comment/:comment_id/
server.get("/comment/:comment_id/", (req, res) => {
    const comment_id = req.params.comment_id;
    const url = settings.comment_model_api_url + `${comment_id}/`;
    response.sendWithRedis(request.get, req, res, url)
});

server.put("/comment/:comment_id/", (req, res) => {
    const comment_id = req.params.comment_id;
    const url = settings.comment_model_api_url + `${comment_id}/`;
    response.send(request.authPut, req, res, url)
});

server.delete("/comment/:comment_id/", (req, res) => {
    const comment_id = req.params.comment_id;
    const url = settings.comment_model_api_url + `${comment_id}/`;
    response.send(request.authDelete, req, res, url);
});

module.exports = { server, serverLife };