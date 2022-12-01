const db = require('../services/database.js');
const tb = require('../table.js')

async function find(context) {
    const binds = {};
    let query = `select DOB_Y, fetalDeaths / totalBirths as fetalDeathRate
from (
    (select DOB_Y, count(bID) as totalBirths
    from (select bID, DOB_Y from Birth where bID in (select bID from Child))
         natural join
         (select mID from Mother where race = `;

    binds.race = context.race;
    query += `:race)
    `;

    query += `group by DOB_Y)
natural join
    (select DOB_Y, count(bID) as fetalDeaths
    from (select bID, DOB_Y from Birth where bID not in (select bID from Child))
         natural join
         (select mID from Mother where race = :race)
    group by DOB_Y)
)
`;

    if (context.fromTime && context.toTime) {
        query += `where (DOB_Y >= :fromTime and DOB_Y <= :toTime)`;
        binds.fromTime = context.fromTime;
        binds.toTime = context.toTime;
    } else if (context.fromTime) {
        query += `where (DOB_Y >= :fromTime)`;
        binds.fromTime = context.fromTime;
    } else if (context.toTime) {
        query += `where (DOB_Y <= :toTime)`;
        binds.toTime = context.toTime;
    }

    const result = await db.simpleExecute(query, binds);
    return result.rows;
}

module.exports.find = find;