const db = require('../services/database.js');
const tb = require('../table.js')

async function find(context) {
    const binds = {};
    let query = `with motherRiskState(year, mID, risk_factor) as (
    select DOB_Y, mID, risk_factor
    from (
            (select DOB_Y, mID
            from Mother natural join Birth natural join County`;

    binds.state = context.state;
    if (context.state === 'All') {
        query += `)
        `;
    } else {
        query += `
        where state_name = :state)
        `;
    }

    query += `            natural join
            MotherHasRiskFactor
         )
)
select year, count(mID) as numMothers
from (
    ( select * from motherRiskState )
    minus
    (
        select year, mID, risk_factor
        from (
                (select * from (select year, mID from motherRiskState),
                               (select risk_factor from MotherHasRiskFactor))
                minus
                (select * from motherRiskState)
             )
    )
    )
`;
    if (context.fromTime && context.toTime) {
        query += `where (year >= :fromTime and year <= :toTime)`;
        binds.fromTime = context.fromTime;
        binds.toTime = context.toTime;
    } else if (context.fromTime) {
        query += `where (year >= :fromTime)`;
        binds.fromTime = context.fromTime;
    } else if (context.toTime) {
        query += `where (year <= :toTime)`;
        binds.toTime = context.toTime;
    }

    const result = await db.simpleExecute(query, binds);
    return result.rows;
}

module.exports.find = find;