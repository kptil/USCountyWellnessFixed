const express = require('express');
const router = new express.Router();
const counties = require('../controllers/counties.js');
const mother = require('../controllers/mother.js');
const query2 = require('../controllers/query2.js');
const query2All = require('../controllers/query2All.js');
const query1 = require('../controllers/query1.js');
const query3 = require('../controllers/query3.js');
const query4 = require('../controllers/query4.js');
const query5 = require('../controllers/query5.js');
const query6 = require('../controllers/query6.js');

router.route('/counties/:FIPS?/:STATE?').
    get(counties.get);

router.route('/mother/').
    get(mother.get);

router.route('/query1/:percentage?/:income?/:fromTime?/:toTime?').
    get(query1.get);

router.route('/query2/:state?/:fromTime?/:toTime?').
    get(query2.get);

router.route('/query2All/:fromTime?/:toTime?').get(query2All.get);

router.route('/query3/:race?/:fromTime?/:toTime?').get(query3.get);

router.route('/query4/:percent?/:fromTime?/:toTime?').get(query4.get);

router.route('/query5/:state?/:fromTime?/:toTime?').get(query5.get);

router.route('/query6').get(query6.get);

module.exports = router;
