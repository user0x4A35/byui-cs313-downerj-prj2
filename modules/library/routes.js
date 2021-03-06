let dbUtil = require('../db/dbutil.js');
let httpUtil = require('../utils/httputil.js');
let dbQueries = require('./queries.js');

module.exports = {
    chiplist: {
        get: (req, res) => {
            dbUtil.doDatabase(dbQueries.chipsGet, [])
            .then((data) => {
                httpUtil.sendJSONData(res, data);
            });
        },

        post: (req, res) => {
            if (!('chips' in req.body)) {
                httpUtil.sendUserError(res, 'Missing "chips" argument in body');
                return;
            }
    
            let chips = req.body.chips;
    
            let chipType;
            try {
                let promiseArray = [];
                for (chipType in chips) {
                    console.log(chipType);
                    let promises = addChips(chipType, chips[chipType]);

                    console.log(`Adding ${promises.length} promises`);
                    for (let promise of promises) {
                        promiseArray.push(promise);
                    }
                }
    
                Promise
                .all(promiseArray)
                .then(() => {
                    let message = 'POST complete';
                    console.log(message);
                    res.end(message);
                }).catch((err) => {
                    console.error(err);
                    httpUtil.sendServerError(res, err);
                });
            } catch (err) {
                console.log(err);
                httpUtil.sendUserError(res, `Error at "${chipType}": ${err}`);
                return;
            }
        },

        put: (req, res) => {
            if (!('id' in req.body)) {
                httpUtil.sendUserError(res, 'Missing "id" argument in body');
                return;
            } else if (!('key' in req.body)) {
                httpUtil.sendUserError(res, 'Missing "key" argument in body');
                return;
            } else if (!('value' in req.body)) {
                httpUtil.sendUserError(res, 'Missing "value" argument in body');
                return;
            } else if (req.body.key !== 'element' && req.body.key !== 'rarity') {
                httpUtil.sendUserError(res, `Invalid field key "${req.body.key}"`);
                return;
            }

            updateChip(req.body.id, req.body.key, req.body.value)
            .then(() => {
                let message = 'PUT complete';
                console.log(message);
                res.end(message);
            }).catch((err) => {
                console.error(err);
                httpUtil.sendServerError(res, err);
            });
        },
        delete: (req, res) => {},
    },

    navicust: {
        get: (req, res) => {},
        post: (req, res) => {},
        put: (req, res) => {},
        delete: (req, res) => {},
    },
};

function addChips(chipType, chipList) {
    let promises = [];

    console.log(`Adding chip list "${chipType}" of length ${chipList.length}`);

    for (let chipID in chipList) {
        let chip = chipList[chipID];
        let id = parseInt(chip.id);
        let name = chip.name;
        let damage = parseInt(chip.damage || 0);
        let memory = parseInt(chip.memory || 0);
        let description = chip.description || null;
        let fileName = chip.url || null;
        let rarity = chip.rarity;
        let element = chip.element || null;
        let codes = chip.codes;

        function throwErr(chipID, msg) {
            throw `${msg} for chip @id=${chipID}`;
        }

        if (!chip) {
            throwErr(id, 'Empty chip');
        } else if (id === null || id === undefined) {
            throwErr(id, 'Empty ID');
        } else if (memory === null || memory === undefined) {
            throwErr(id, 'Empty memory');
        } else if (!name) {
            throwErr(id, 'Empty name');
        } else if (!codes) {
            throwErr(id, 'Empty codes');
        }

        // first: insert chip
        const PARAMS = [
            id, name, damage, memory, description, fileName, rarity, element, chipType
        ];
        let promise = dbUtil.doDatabase(dbQueries.chipsPost, PARAMS);

        // then: insert chip-code link
        promise.then(() => {
            for (let code of codes) {
                const PARAMS = [
                    id, code
                ];
                let promise2 = dbUtil.doDatabase(dbQueries.chipLinksPost, PARAMS)
                .catch((err) => {
                    console.error(err);
                });
                promises.push(promise2);
            }
        }).catch((err) => {
            console.error(err);
        });

        promises.push(promise);
    }

    return promises;
}

function updateChip(id, key, value) {
    const PARAMS = [
        value, id
    ];

    return dbUtil.doDatabase(dbQueries.chipPut.replace('$0', key), PARAMS);
}