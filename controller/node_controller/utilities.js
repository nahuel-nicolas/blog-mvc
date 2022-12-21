const settings = require('./settings')

function isResponseOk(response) {
    return response.status >= 200 && response.status < 300;
}

class Log {
    debug(params) {
        if (settings.debug) {
            console.log(params);
        }
    }

    info(params) {
        console.log(params);
    }
}

const log = new Log();

module.exports = {
    isResponseOk,
    log
}