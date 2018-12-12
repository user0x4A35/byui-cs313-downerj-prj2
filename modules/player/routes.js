let dbUtil = require('../db/dbutil.js');

const dbQueries = {
    accountGet: '',
    accountPost: '',
    accountPut: '',
    accountDelete: '',

    statsGet: '',
    statsPost: '',
    statsPut: '',
    statsDelete: '',

    chipsGet: '',
    chipsPost: '',
    chipsPut: '',
    chipsDelete: '',
};

module.exports = {
    account: {
        get: (req, res) => {},
        post: (req, res) => {},
        put: (req, res) => {},
        delete: (req, res) => {},
    },

    stats: {
        get: (req, res) => {},
        post: (req, res) => {},
        put: (req, res) => {},
        delete: (req, res) => {},
    },

    chiplist: {
        get: (req, res) => {},
        post: (req, res) => {},
        put: (req, res) => {},
        delete: (req, res) => {},
    },
};