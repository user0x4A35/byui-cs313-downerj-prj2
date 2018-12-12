let dbUtil = require('../db/dbutil.js');

const TBL_CHIP = 'prj2_chip';
const TBL_COMBO = 'prj2_chip_code_combo';

const dbQueries = {
    chipsGet: `SELECT `
            + `  chip.id `
            + `, chip.name `
            + `, chip.description `
            + `, chip.damage `
            + `, chip.element `
            + `, chip.memory `
            + `, array_agg(combo.code) AS codes`
            + `, chip.imageurl `
            + `FROM ${TBL_CHIP} AS chip `
            + `INNER JOIN ${TBL_COMBO} AS combo `
            + `ON combo.chip = chip.id `
            + `GROUP BY chip.id `
            + `ORDER BY chip.id;`,
    chipsPost: '',
    chipsPut: '',
    chipsDelete: '',

    navicustGet: '',
    navicustPost: '',
    navicustPut: '',
    navicustDelete: '',
};

module.exports = {
    chiplist: {
        get: (req, res) => {
            dbUtil.doDatabase(dbQueries.statsGet, [])
            .then((data) => {
                res
                .status(200)
                .set('Content-Type', 'application/json')
                .json(data);
            });
        },
        post: (req, res) => {},
        put: (req, res) => {},
        delete: (req, res) => {},
    },

    navicust: {
        get: (req, res) => {},
        post: (req, res) => {},
        put: (req, res) => {},
        delete: (req, res) => {},
    },
};