module.exports = {
    doNotFound: (req, res, next) => {
        res
        .status(404)
        .end("Page not found")
    },
};