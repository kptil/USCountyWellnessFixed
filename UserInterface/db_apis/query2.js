const db = require('../services/database.js');
const tb = require('../table.js')

/*const baseQuery = `SELECT state_name, county_em_year, num / denom as rate
                    from (
                        select state_name, county_em_year, sum(labor_force) as denom, sum(unemployed) as num
                        from (
                            (select coid, state_name from ${tb.tables.countyTest} where state_name = 'Florida')
                            natural join ${tb.tables.countyHasEmploymentTest}
                        )
                    group by state_name, county_em_year
                    )
                    where (county_em_year >= 2000 and county_em_year <= 2005)`;*/

async function find(context) {
    let query = `SELECT state_name, county_em_year, num / denom as rate
                        from (
                            select state_name, county_em_year, sum(labor_force) as denom, sum(unemployed) as num
                            from (
                                (select coid, state_name from ${tb.tables.county}`;
    const binds = {};
    //binds.from = `where (county_em_year >= 2000 and county_em_year <= 2005)`;
    console.log(context);
    if (context.state){
      binds.state = context.state;
      if (context.state == `Florida`) {
        query += `\nwhere state_name = :state`;
      } else {
        query += `\nwhere state_name != :state`
      }
    }
    query += `) natural join ${tb.tables.countyHasEmp})\n`

    query += `\n  group by state_name, county_em_year)`;

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

    console.log(query);
    const result = await db.simpleExecute(query, binds);
    //console.log(result);
    return result.rows;
}

module.exports.find = find;
