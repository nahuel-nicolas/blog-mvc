const redis = require('redis');

const settings = require('./settings');


const client = redis.createClient({
    host: settings.redisHost,
    port: settings.redisPort,
});

client.connect();

module.exports = {
    client
}