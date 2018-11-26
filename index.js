// external imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// local imports
const epChipList = require('./modules/ep-chip-list.js');
const epPlayer = require('./modules/ep-player.js');
const epAuth = require('./modules/ep-auth.js');
const epRedir = require('./modules/ep-redir.js');

// constants
const PORT = process.env.PORT || 5000;

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    // static pages
    .get('/', (req, res) => res.sendFile('index.html'))
    // endpoint: chip list
    .put('/chiplist', epChipList.doPut)
    .post('/chiplist', epChipList.doPost)
    .get('/chiplist', epChipList.doGet)
    // endpoint: player
    .put('/player', epPlayer.doPut)
    .post('/player', epPlayer.doPost)
    .get('/player', epPlayer.doGet)
    // endpoint: auth
    .put('/auth', epAuth.doPut)
    .post('/auth', epAuth.doPost)
    .get('/auth', epAuth.doGet)
    // endpoint: others (404)
    .use(epRedir.doNotFound)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// for reference: render EJS
// <express()>.get('/', (req, res) => res.render('pages/index'))