-- Query 1
-- Finds all counties with avg household input less than user input and where the percent of people who have
-- a Bachelors degree or higher is less than user input
with ValidCounties(coID, year) as (
      select coID, year from (
                   (select coID from KTILEY.COUNTY where avgHHLDIncome2000 < :income) natural join
      (select County_ED_Year as year, coID, County_ED_Total from KTILEY.COUNTYHASEDULEVEL
      where Ed_Level = 'Bachelors')
      join
      (select County_Pop_Year as year, coID, County_Total from KTILEY.COUNTYHASPOP)
      using (year, coID)
      )
      where County_ED_Total / County_Total * 100 < :percentage
)
select year, avg(Cigarettes_per_day) as avgCigarettes from
    (ValidCounties -- join with CDC data to get avg reported cigarettes_per_day
    join
    (select bID, DOB_Y as year, mID, coID from WEISSB.BIRTH)
    using (coID, year))
    join
    (select mID, cigarettes_per_day from WEISSB.MOTHER)
    using (mID) where (year >= :fromTime and year <= :toTime)
    group by year
    order by year;

-- Query 2
SELECT state_name, county_em_year, num / denom as rate
from (
    -- Find sum(unemployed) / sum(labor_force) to get unemployment rate
    select state_name, county_em_year, sum(labor_force) as denom, sum(unemployed) as num
    from (
        (select coid, state_name from KTILEY.COUNTY where state_name = :state)
        natural join KTILEY.COUNTYHASEMPLOYMENT)
        group by state_name, county_em_year)
where (county_em_year >= :fromTime and county_em_year <= :toTime)
order by county_em_year;

-- Query 3
select DOB_Y, fetalDeaths / totalBirths as fetalDeathRate
from (
    -- sum up total births where child was either living or deceased
    (select DOB_Y, count(bID) as totalBirths
    from (select bID, DOB_Y, mID from WEISSB.BIRTH)
         natural join
         (select mID from WEISSB.MOTHER where race = :race)
    group by DOB_Y)
natural join
    -- sum up total births where child did not survive the birth
    (select DOB_Y, count(bID) as fetalDeaths
    from (select bID, DOB_Y, mID from WEISSB.BIRTH where bID not in (select bID from WEISSB.CHILD))
         natural join
         (select mID from WEISSB.MOTHER where race = :race)
    group by DOB_Y)
)
where (DOB_Y >= :fromTime and DOB_Y <= :toTime)
order by DOB_Y;

-- Query 4
with statepops(race_pop_year, state_name, pop) as (
    select county_pop_year, state_name, sum(county_total)
    from KTILEY.COUNTYHASPOP natural join KTILEY.US_STATE
    group by county_pop_year, state_name
),
stateminoritypops(race_pop_year, state_name, min_pop) as (
    select race_pop_year, state_name, sum(race_count)
    from WEISSB.STATEHASPOPBYRACE
    where race != 'white' or hispanic = 1
    group by race_pop_year, state_name
)
select DOB_Y, count(bID) as numBirths
from WEISSB.BIRTH natural join (select coID, state_name from KTILEY.COUNTY) natural join WEISSB.RECEIVES_PRENATAL_CARE
where state_name in (
    select state_name
    from statepops join stateminoritypops using (race_pop_year, state_name)
    where min_pop / pop > :percent)  and (care_adequacy = 'Adequate') and (DOB_Y >= :fromTime and DOB_Y <= :toTime)
group by DOB_Y
order by DOB_Y;

-- Query 5
-- Quotient operation performed in valid mothers
with ValidMothers(mID) as (
    select mID from WEISSB.MOTHERHASRISKFACTOR where risk_factor in (select risk_factor from KTILEY.KEYMOTHERRISKS)
    minus
    select mID from (
    select mID, risk_factor from (select mID from WEISSB.MOTHERHASRISKFACTOR where risk_factor in (select risk_factor from KTILEY.KEYMOTHERRISKS)), KTILEY.KEYMOTHERRISKS
    minus
    select mID, risk_factor from WEISSB.MOTHERHASRISKFACTOR where risk_factor in (select risk_factor from KTILEY.KEYMOTHERRISKS)
    )
)
select year, count(distinct mID) as numMothers
from (
(select DOB_Y as year, bID, mID, coID from WEISSB.BIRTH)
natural join
ValidMothers
natural join
(select coID from KTILEY.COUNTY where state_name = :state)
        )
    where bID in (select bID from WEISSB.CHILD) and (year >= :fromTime and year <= :toTime)
    group by year
    order by year