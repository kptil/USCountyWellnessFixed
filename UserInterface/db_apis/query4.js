const db = require('../services/database.js');
const tb = require('../table.js')

async function find(context) {
    const binds = {};
    let query = `with statepops(race_pop_year, state_name, pop) as (
    select county_pop_year, state_name, sum(county_total)
    from CountyHasPop natural join US_State
    group by county_pop_year, state_name
)
select DOB_Y, count(bID) as numBirths
from (
        select bID, DOB_Y from (Birth natural join (select coID, state_name from County))
        where state_name in (   select state_name
                                from statepops join StateHasPopByRace
                                using (state_name, race_pop_year)
                                where (DOB_Y = race_pop_year) and (race_count / pop > `;

    if (context.percent) {
        binds.percent = context.percent;
        query += `:percent) `;
    } else {
        binds.percent = .5;
        query += `.5) `;
    }

    query += `and (race != 'white' or hispanic = true)
                            )
      )
      natural join Receives_Prenatal_Care
where (care_adequacy = 'adequate') and `;

    if (context.fromTime && context.toTime) {
        query += `(DOB_Y >= :fromTime and DOB_Y <= :toTime)`;
        binds.fromTime = context.fromTime;
        binds.toTime = context.toTime;
    } else if (context.fromTime) {
        query += `(DOB_Y >= :fromTime)`;
        binds.fromTime = context.fromTime;
    } else if (context.toTime) {
        query += `(DOB_Y <= :toTime)`;
        binds.toTime = context.toTime;
    }

    query += `
group by DOB_Y`;

    const result = await db.simpleExecute(query, binds);
    return result.rows;
}

module.exports.find = find;