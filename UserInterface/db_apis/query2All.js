const db = require('../services/database.js');
const tb = require('../table.js')

/*const baseQuery = `SELECT county_em_year, num / denom as rate
                    from (
                        select county_em_year, sum(labor_force) as denom, sum(unemployed) as num
                        from (
                            (select coid, state_name from ${tb.tables.countyTest})
                            natural join ${tb.tables.countyHasEmploymentTest}
                        )
                    group by county_em_year
                    )
                    where (county_em_year >= 2000 and county_em_year <= 2005)`;*/

async function find(context) {
    let query = `SELECT county_em_year, num / denom as rate
                        from (
                            select county_em_year, sum(labor_force) as denom, sum(unemployed) as num
                            from (
                                (select coid, state_name from ${tb.tables.county}`;
    const binds = {};

    console.log(context);

    query += `) natural join ${tb.tables.countyHasEmp})\n`

    query += `\n  group by county_em_year)`;

    if (context.fromTime && context.toTime) {
        query += `where (county_em_year >= :fromTime and county_em_year <= :toTime)`;
        binds.fromTime = context.fromTime;
        binds.toTime = context.toTime;
    } else if (context.fromTime) {
        query += `where (county_em_year >= :fromTime)`;
        binds.fromTime = context.fromTime;
    } else if (context.toTime) {
        query += `where (county_em_year <= :toTime)`;
        binds.toTime = context.toTime;
    }

    query += `
    order by county_em_year`;

    const result = await db.simpleExecute(query, binds);
    //console.log(result);
    return result.rows;
}

module.exports.find = find;