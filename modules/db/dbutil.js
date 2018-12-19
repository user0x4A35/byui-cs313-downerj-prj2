const { Pool } = require('pg');
let pgPool;

module.exports = {
    getPoolInstance: getPoolInstance,
    doDatabase: doDatabaseQuery,
};

function getPoolInstance() {
    if (!pgPool) {
        instantiatePool();
    }

    return pgPool;
}

function doDatabaseQuery(query, params) {
    return new Promise((resolve, reject) => {
        getPoolInstance()
        .connect()
        .then((client) => {
            return client.query(query, params)
            .then((res) => {
                client.release();
                resolve(res);
            })
            .catch((err) => {
                client.release();
                reject(err);
            });
        });
    });
}

function instantiatePool() {
    pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
        // user: process.env.USER,
        // host: 'localhost',
        // database: 'mmbn',
        // post: 5432,
    });

    console.log(process.env.DATABASE_URL);

    pgPool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
    });
}