const db = require('../services/database.js');
const tb = require('../table.js')

async function find(context) {
    const binds = {};
    let query = `select sum(count) as sum from (
select count(*) as count from WEISSB.Mother
union
select count(*) as count from WEISSB.Birth
union
select count(*) as count from WEISSB.Child
)`

    const result = await db.simpleExecute(query, binds);
    return result.rows;
}

module.exports.find = find;