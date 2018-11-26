// external imports
const express = require('express');
const path = require('path');

// local imports
const endpoints = require('./modules/endpoints.js');

// constants
const PORT = process.env.PORT || 5000;

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    // static pages
    .get('/', (req, res) => res.sendFile('index.html'))
    // endpoint: chip list
    .put('/chiplist', () => {})
    .post('/chiplist', () => {})
    .get('/chiplist', () => {})
    // endpoint: player
    .put('/player', () => {})
    .post('/player', () => {})
    .get('/player', () => {})
    // endpoint: auth
    .put('/auth', () => {})
    .post('/auth', () => {})
    .get('/auth', () => {})
    // endpoint: others (404)
    .use(() => {})
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// for reference: render EJS
// <express()>.get('/', (req, res) => res.render('pages/index'))