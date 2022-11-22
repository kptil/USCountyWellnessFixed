const db = require('../services/database.js');
const tb = require('../table.js')

const baseQuery = `SELECT * FROM ${tb.tables.population}`;

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if (context.FIPS) {
        binds.FIPS = context.FIPS;
        query += ' WHERE FIPS = :FIPS'
    }
    //console.log(query);
    const result = await db.simpleExecute(baseQuery, binds);
    //console.log(result);
    return result.rows;
}

module.exports.find = find;