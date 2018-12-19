module.exports = {
    sendUserError: (res, msg) => {
        res
        .status(400)
        .set('Content-Type', 'application/json')
        .end(`${msg}\n`);
    },

    sendServerError: (res, msg) => {
        res
        .status(500)
        .set('Content-Type', 'application/json')
        .end(`${msg}\n`);
    },

    sendJSONData: (res, data) => {
        res
        .status(200)
        .set('Content-Type', 'application/json')
        .end(JSON.stringify(data));
    },
};