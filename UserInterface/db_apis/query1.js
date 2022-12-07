const db = require('../services/database.js');
const tb = require('../table.js')

async function find(context) {
    const binds = {};
    let query = `with ValidCounties(coID, year) as (
                    select coID, year from (
                           (select coID from ${tb.tables.county} where avgHHLDIncome2000 < `;

    if (context.income) {
        binds.income = context.income;
        query += `:income)`;
    } else {
        query += `50000)`;
    }

    query += ` natural join
              (select County_ED_Year as year, coID, County_ED_Total from ${tb.tables.countyHasEduLevel}
                where Ed_Level = 'Bachelors')
                join
                (select County_Pop_Year as year, coID, County_Total from ${tb.tables.countyHasPop})
                using (year, coID)
                )
                where County_ED_Total / County_Total * 100 < `;

    if (context.percentage) {
        binds.percentage = context.percentage;
        query += `:percentage
        `;
    } else {
        //binds.income = 20;
        query += `30`
    }

    query += `)
                select year, avg(Cigarettes_per_day) as avgCigarettes from
                    (ValidCounties
                    join
                    (select bID, DOB_Y as year, mID, coID from ${tb.tables.birth})
                    using (coID, year))
                    join
                    (select mID, cigarettes_per_day from ${tb.tables.mother})
                    using (mID) `;

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
    group by year
    order by year`;

    console.log(query);
    const result = await db.simpleExecute(query, binds);
    return result.rows;
}

module.exports.find = find;
