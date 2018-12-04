const { Pool } = require('pg');
let pool;

module.exports = {
    doGet: (req, res) => {
        touchPool();

        try {
            dbGetChips(res);
        } catch (err) {
            console.error(err);
            sendUserError(res, 'Server error');
            return;
        }
    },

    doPost: (req, res) => {
        touchPool();

        if (!('chips' in req.body)) {
            sendUserError(res, 'Missing "chips" argument in body');
            return;
        }

        let chips;
        try {
            chips = req.body.chips;
        } catch (err) {
            console.error(err);
            sendUserError(res, 'Malformed "chips" JSON');
            return;
        }

        if ('elements' in chips) {
            let elems = chips.elements;
            for (let elem of elems) {
               // TODO
            }
        }

        let key;
        try {
            let promiseArray = [];
            for (key in chips) {
                if (key === 'standard' || key === 'mega' || key === 'giga') {
                    let promises = addChips(key, chips[key]);
                    for (let promise of promises) {
                        console.log('Add');
                        promiseArray.push(promise);
                    }
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
            sendUserError(res, `Error at "${key}": ${err}`);
            return;
        }
    },

    doPut: (req, res) => {
        touchPool();
    },
};

function touchPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        console.log(process.env.DATABASE_URL);

        pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }
}

function sendUserError(res, msg) {
    res
    .status(400)
    .end(`${msg}\n`);
};

function sendJSONData(res, data) {
    res
    .status(200)
    .set('Content-Type', 'application/json')
    .end(JSON.stringify(data));
}

function addChips(sectionName, chipList) {
    let promises = [];

    for (let idd in chipList) {
        let chip = chipList[idd];
        let codes = chip.codes;
        let id = parseInt(chip.id);
        let damage = parseInt(chip.damage || 0);
        let description = chip.description;
        let element = chip.element || 1;
        let memory = parseInt(chip.memory);
        let name = chip.name;
        let imageURL = chip.imageURL || null;

        function throwErr(chipID, msg) {
            throw `${msg} for chip @id=${chipID}`;
        }

        if (!chip) {
            throwErr(id, 'Empty chip');
        } else if (id === null || id === undefined) {
            throwErr(id, 'Empty ID');
        } else if (!description) {
            throwErr(id, 'Empty description');
        } else if (memory === null || memory === undefined) {
            throwErr(id, 'Empty memory');
        } else if (!name) {
            throwErr(id, 'Empty name');
        } else if (!codes) {
            throwErr(id, 'Empty codes');
        }

        promises.push(dbInsertChip([
            id,
            damage,
            description,
            element,
            memory,
            name,
            imageURL,
        ]));

        Promise
        .all(promises)
        .then(() => {
            for (let code of codes) {
                dbInsertChipCodeCombo([
                    id,
                    code
                ]);
            }
        });
    }

    return promises;
}

const TBL_CHIP = 'prj2_chip';
const TBL_COMBO = 'prj2_chip_code_combo';

function dbInsertChip(chipDataArray) {
    return pool
    .connect()
    .then((client) => {
        const QUERY = `INSERT INTO ${TBL_CHIP} `
                    + `(id, damage, description, element, memory, name, imageURL) `
                    + `VALUES ($1, $2, $3, $4, $5, $6, $7);`;
        const PARAMS = chipDataArray;

        return client.query(QUERY, PARAMS)
        .then((res) => {
            client.release();
        })
        .catch((err) => {
            client.release();
            let id = chipDataArray[0];
            console.error(`chip @${id}: ${err}`);
            console.error(chipDataArray);
            throw err;
        })
    });
}

function dbInsertChipCodeCombo(comboDataArray) {
    return pool
    .connect()
    .then((client) => {
        const QUERY = `INSERT INTO ${TBL_COMBO} `
                    + `(chip, code) `
                    + `VALUES ($1, $2);`;
        const PARAMS = comboDataArray;

        return client.query(QUERY, PARAMS)
        .then((res) => {
            client.release();
        })
        .catch((err) => {
            client.release();
            console.error(err);
            throw err;
        })
    });
}

function dbGetChips(response) {
    return pool
    .connect()
    .then((client) => {
        const QUERY = `SELECT`
                    + `  chip.id`
                    + `, chip.name`
                    + `, chip.description`
                    + `, chip.damage`
                    + `, chip.element`
                    + `, chip.memory`
                    + `, array_agg(combo.code) AS codes`
                    + `, chip.imageurl`
                    + `FROM ${TBL_CHIP} AS chip`
                    + `INNER JOIN ${TBL_CHIP} AS combo`
                    + `ON combo.chip = chip.id`
                    + `GROUP BY chip.id`
                    + `ORDER BY chip.id;`
        const PARAMS = [];

        return client.query(QUERY, PARAMS)
        .then((res) => {
            client.release();
            sendJSONData(response, res);
        })
        .catch((err) => {
            client.release();
            console.error(err);
            throw err;
        })
    });
}