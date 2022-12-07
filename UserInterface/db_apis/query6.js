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
union
select count(*) as count from WEISSB.MOTHERHASRISKFACTOR
union
select count(*) as count from WEISSB.MOTHERRISKS
union
select count(*) as count from WEISSB.BIRTH_COMPLICATION
union
select count(*) as count from WEISSB.HAS_BIRTH_COMPLICATION
union
select count(*) as count from WEISSB.RECEIVES_PRENATAL_CARE
union
select count(*) as count from KTILEY.COUNTY
union
select count(*) as count from KTILEY.COUNTYHASEDULEVEL
union
select count(*) as count from KTILEY.COUNTYHASPOP
union
select count(*) as count from KTILEY.COUNTYHASEMPLOYMENT
union
select count(*) as count from KTILEY.US_STATE
union
select count(*) as count from WEISSB.STATEHASPOPBYRACE
union
select count(*) as count from KTILEY.KEYMOTHERRISKS
)`

    const result = await db.simpleExecute(query, binds);
    return result.rows;
}

module.exports.find = find;
