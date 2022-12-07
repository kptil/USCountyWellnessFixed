const db = require('../services/database.js');
const tb = require('../table.js')

async function find(context) {
    const binds = {};
    let query = `with statepops(race_pop_year, state_name, pop) as (
    select county_pop_year, state_name, sum(county_total)
    from ${tb.tables.countyHasPop} natural join ${tb.tables.us_State}
    group by county_pop_year, state_name
)
select DOB_Y, count(bID) as numBirths
from (
        select bID, DOB_Y from (${tb.tables.birth} natural join (select coID, state_name from ${tb.tables.county}))
        where state_name in (   select state_name
                                from statepops join ${tb.tables.stateHasPopByRace}
                                using (state_name, race_pop_year)
                                where (DOB_Y = race_pop_year) and (race_count / pop > `;

    if (context.percent) {
        binds.percent = context.percent;
        query += `:percent) `;
    } else {
        //binds.percent = .5;
        query += `.5) `;
    }

    query += `and (race != 'white' or hispanic = 1)
                            )
      )
      natural join ${tb.tables.receivesPNC}
where (care_adequacy = 'Adequate') `;

    if (context.fromTime && context.toTime) {
        query += `and (DOB_Y >= :fromTime and DOB_Y <= :toTime)`;
        binds.fromTime = context.fromTime;
        binds.toTime = context.toTime;
    } else if (context.fromTime) {
        query += `and (DOB_Y >= :fromTime)`;
        binds.fromTime = context.fromTime;
    } else if (context.toTime) {
        query += `and (DOB_Y <= :toTime)`;
        binds.toTime = context.toTime;
    }

    query += `
group by DOB_Y`;

    const result = await db.simpleExecute(query, binds);
    return result.rows;
}

module.exports.find = find;
