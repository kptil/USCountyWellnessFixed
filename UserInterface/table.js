const cred = require('./config/database.js')

const table = (tableName) => {
    return cred.connection.user +'.'+ tableName;
};

const _mother = 'WEISSB.MOTHER';
const _hasRisk = 'WEISSB.MOTHERHASRISKFACTOR';
const _motherRisk = 'WEISSB.MOTHERRISKS';
const _birth = 'WEISSB.BIRTH';
const _birthComp = 'WEISSB.BIRTH_COMPLICATION';
const _hasBirthComp = 'WEISSB.HAS_BIRTH_COMPLICATION';
const _receivesPNC = 'WEISSB.RECEIVES_PRENATAL_CARE';
const _child = 'WEISSB.CHILD';
const _county = 'KTILEY.COUNTY';
const _countyHasEduLevel = 'KTILEY.COUNTYHASEDULEVEL';
const _countyHasPop = 'KTILEY.COUNTYHASPOP';
const _countyHasEmp = 'KTILEY.COUNTYHASEMPLOYMENT';
const _US_State = 'KTILEY.US_STATE';
const _stateHasPopByRace = 'WEISSB.STATEHASPOPBYRACE';

// created test tables to avoid key constraints on actual tables when entering dummy data
const _countyTest = 'KTILEY.COUNTYTEST';
const _countyHasEmploymentTest = 'KTILEY.COUNTYHASEMPLOYMENTTEST'
const _population = 'JWILLIAMS16.POPULATION';


module.exports = {
    tables : {
        mother : _mother,
        hasRisk : _hasRisk,
        motherRisk : _motherRisk,
        birth : _birth,
        birthComp : _birthComp,
        hasBirthComp : _hasBirthComp,
        receivesPNC : _receivesPNC,
        child : _child,
        population : _population,
        countyTest : _countyTest,
        countyHasEmploymentTest : _countyHasEmploymentTest,
        county : _county,
        countyHasEduLevel : _countyHasEduLevel,
        countyHasPop : _countyHasPop,
        countyHasEmp : _countyHasEmp,
        us_State : _US_State,
        stateHasPopByRace : _stateHasPopByRace
    }
}