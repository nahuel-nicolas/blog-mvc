const express = require("express");
const cors = require("cors");
const responseTime = require("response-time");

const server = express();
server.use(express.json());
server.use(cors(
    {
        origin: [
            'http://localhost:3000', 
            'http://localhost:4200'
        ]
    }
));
server.use(responseTime());
server.set('json spaces', 2);

module.exports = {
    server
}