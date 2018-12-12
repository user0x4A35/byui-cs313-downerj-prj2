module.exports = {
    sendUserError: (res, msg) => {
        res
        .status(400)
        .end(`${msg}\n`);
    },

    sendJSONData: (res, data) => {
        res
        .status(200)
        .set('Content-Type', 'application/json')
        .end(JSON.stringify(data));
    },
};