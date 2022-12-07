const db = require('../services/database.js');
const tb = require('../table.js')

async function find(context) {
    const binds = {};
    let query = `with ValidMothers(mID) as (
    select mID from ${tb.tables.hasRisk} where risk_factor in (select risk_factor from ${tb.tables.keyMotherRisks})
    minus
    select mID from (
    select mID, risk_factor from (select mID from ${tb.tables.hasRisk} where risk_factor in (select risk_factor from ${tb.tables.keyMotherRisks})), ${tb.tables.keyMotherRisks}
    minus
    select mID, risk_factor from ${tb.tables.hasRisk} where risk_factor in (select risk_factor from ${tb.tables.keyMotherRisks})
    )
)
select year, count(distinct mID) as numMothers
from (
(select DOB_Y as year, bID, mID, coID from ${tb.tables.birth})
natural join
ValidMothers
natural join
(select coID from ${tb.tables.county} `;

    if (context.state === 'All') {
        query += `)
        `;
    } else {
        binds.state = context.state;
        query += `where state_name = :state)
        `;
    }

    query += `)
    where bID in (select bID from ${tb.tables.child})`;

    if (context.fromTime && context.toTime) {
        query += ` and (year >= :fromTime and year <= :toTime)`;
        binds.fromTime = context.fromTime;
        binds.toTime = context.toTime;
    } else if (context.fromTime) {
        query += ` and (year >= :fromTime)`;
        binds.fromTime = context.fromTime;
    } else if (context.toTime) {
        query += ` and (year <= :toTime)`;
        binds.toTime = context.toTime;
    }

    query += `
    group by year
    order by year`;

    /*
    let query = `with motherRiskState(year, mID, risk_factor) as (
    select DOB_Y, mID, risk_factor
    from (
            (select DOB_Y, mID
            from ${tb.tables.mother} natural join ${tb.tables.birth} natural join ${tb.tables.county}`;

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
            ${tb.tables.hasRisk}
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
                               (select risk_factor from ${tb.tables.hasRisk}))
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

    query += `
    group by year`;*/

    const result = await db.simpleExecute(query, binds);
    return result.rows;
}

module.exports.find = find;