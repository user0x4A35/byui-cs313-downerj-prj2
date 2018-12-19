const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// const pages = require('./pageRoutes.js');
const endpoints = require('./endpointRoutes.js');

const PORT = process.env.PORT || 5000;
const app = express();

/**
 * BASIC SETUP
 */
app
.use(express.static(path.join(__dirname, 'public')))
.use(bodyParser.json())
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')

/**
 * PAGES
 */
// .get('/', pages.goRoot)
// .get('/player', pages.goPlayer)
// .get('/library', pages.goLibrary)

/**
 * ENDPOINTS : PLAYER : ACCOUNT
 */
.get('/player/account', endpoints.player.account.get)
.post('/player/account', endpoints.player.account.post)
.put('/player/account', endpoints.player.account.put)
.delete('/player/account', endpoints.player.account.delete)

/**
 * ENDPOINTS : PLAYER : STATS
 */
.get('/player/stats', endpoints.player.stats.get)
.post('/player/stats', endpoints.player.stats.post)
.put('/player/stats', endpoints.player.stats.put)
.delete('/player/stats', endpoints.player.stats.delete)

/**
 * ENDPOINTS : PLAYER : CHIP LIST
 */
.get('/player/chiplist', endpoints.player.chiplist.get)
.post('/player/chiplist', endpoints.player.chiplist.post)
.put('/player/chiplist', endpoints.player.chiplist.put)
.delete('/player/chiplist', endpoints.player.chiplist.delete)

/**
 * ENDPOINTS : LIBRARY : CHIP LIST
 */
.get('/library/chiplist', endpoints.library.chiplist.get)
.post('/library/chiplist', endpoints.library.chiplist.post)
.put('/library/chiplist', endpoints.library.chiplist.put)
.delete('/library/chiplist', endpoints.library.chiplist.delete)

/**
 * ENDPOINTS : LIBRARY : NAVI CUSTOMIZATION
 */
.get('/library/navicust', endpoints.library.navicust.get)
.post('/library/navicust', endpoints.library.navicust.post)
.put('/library/navicust', endpoints.library.navicust.put)
.delete('/library/navicust', endpoints.library.navicust.delete)

/**
 * OTHER REDIRECT / PAGE NOT FOUND
 */
.use(pages.doNotFound)

/**
 * START SERVER
 */
.listen(PORT, () => console.log(`Listening on ${ PORT }`));