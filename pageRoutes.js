module.exports = {
    goRoot: (req, res) => {
        res.sendFile('hub.html');
    },

    goPlayer: (req, res) => {
        res.sendFile('player.html');
    },

    goLibrary: (req, res) => {
        res.sendFile('library.html');
    },

    doNotFound: (req, res, next) => {
        res.status(404).end("Page not found");
    },
};