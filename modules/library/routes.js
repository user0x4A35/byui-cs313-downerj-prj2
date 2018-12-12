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
                });
            } catch (err) {
                console.log(err);
                httpUtil.sendUserError(res, `Error at "${chipType}": ${err}`);
                return;
            }
        },

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

function addChips(chipType, chipList) {
    let promises = [];

    console.log(`Adding chip list "${chipType}" of length ${chipList.length}`);

    for (let chipID in chipList) {
        let chip = chipList[chipID];
        let id = parseInt(chip.id);
        let name = chip.name;
        let damage = parseInt(chip.damage || 0);
        let memory = parseInt(chip.memory || 0);
        let description = chip.description | null;
        let fileName = chip.fileName || null;
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
                promises.push(dbUtil.doDatabase(dbQueries.chipLinksPost, PARAMS));
            }
        });

        promises.push(promise);
    }

    return promises;
}