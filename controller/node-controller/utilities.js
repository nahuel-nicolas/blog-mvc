function isResponseOk(response) {
    return response.status >= 200 && response.status < 300;
}

module.exports = {
    isResponseOk
}