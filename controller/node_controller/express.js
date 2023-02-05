const express = require("express");
const cors = require("cors");
const responseTime = require("response-time");
const settings = require("./settings");

const server = express();
server.use(express.json());
if (settings.isProduction) {
    server.use(cors(
        {
            origin: [
                ...settings.allowedCorsUrls,
            ]
        }
    ));
} else {
    server.use(cors());
}
server.use(responseTime());
server.set('json spaces', 2);

module.exports = {
    server
}