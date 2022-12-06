const redis = require('./redis');
const utilities = require('./utilities')


async function send(model_req_callable, req, res, model_url) {
    console.log(req.method + ' ' + req.path);
    try {
        let response = model_req_callable(req, model_url);
        response = await response;
        if (utilities.isResponseOk(response)) {
            res.json(response.data)
        } else {
            res.status(response.status).send(response.data)
        }
        console.log('response was sent')
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
}

async function sendWithRedis(model_req_callable, req, res, model_url) {
    console.log(req.method + ' ' + req.path);
    try {
        const redisData = await redis.client.get(model_url);
        let response = model_req_callable(req, model_url);
        if (redisData) {
            res.json(JSON.parse(redisData))
            console.log('response was sent with Redis')
        } else {
            response = await response;
            if (utilities.isResponseOk(response)) {
                // Saving the results in Redis. The "EX" and 10, sets an expiration of 10 Seconds
                redis.client.set(
                    model_url,
                    JSON.stringify(response.data),
                    {
                        EX: 10,
                    }
                );
                res.json(response.data)
            } else {
                res.status(response.status).send(response.data)
            }
            console.log('response was sent')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
}

module.exports = {
    send,
    sendWithRedis
}