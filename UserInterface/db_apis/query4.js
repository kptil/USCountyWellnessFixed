const db = require('../services/database.js');
const tb = require('../table.js')

async function find(context) {
    const binds = {};
    let query = `with statepops(race_pop_year, state_name, pop) as (
    select county_pop_year, state_name, sum(county_total)
    from ${tb.tables.countyHasPop} natural join ${tb.tables.us_State}
    group by county_pop_year, state_name
),
stateminoritypops(race_pop_year, state_name, min_pop) as (
    select race_pop_year, state_name, sum(race_count)
    from ${tb.tables.stateHasPopByRace}
    where race != 'white' or hispanic = 1
    group by race_pop_year, state_name
)
select DOB_Y, count(bID) as numBirths
from ${tb.tables.birth} natural join (select coID, state_name from ${tb.tables.county}) natural join ${tb.tables.receivesPNC}
where state_name in (
    select state_name
    from statepops join stateminoritypops using (race_pop_year, state_name)
    where min_pop / pop > `;

    if (context.percent) {
        binds.percent = context.percent;
        query += `:percent) `;
    } else {
        query += `.02) `;
    }

    query += ` and (care_adequacy = 'Adequate')`

    if (context.fromTime && context.toTime) {
        query += ` and (DOB_Y >= :fromTime and DOB_Y <= :toTime)`;
        binds.fromTime = context.fromTime;
        binds.toTime = context.toTime;
    } else if (context.fromTime) {
        query += ` and (DOB_Y >= :fromTime)`;
        binds.fromTime = context.fromTime;
    } else if (context.toTime) {
        query += ` and (DOB_Y <= :toTime)`;
        binds.toTime = context.toTime;
    }

    query += `
group by DOB_Y
order by DOB_Y`;

    const result = await db.simpleExecute(query, binds);
    return result.rows;
}

module.exports.find = find;
