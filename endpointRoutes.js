const playerRoutes = require('./modules/player/routes.js');
const libraryRoutes = require('./modules/library/routes.js');

module.exports = {
    player: playerRoutes,
    library: libraryRoutes,
};