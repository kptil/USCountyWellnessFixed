const express = require('express');
const router = new express.Router();
const counties = require('../controllers/counties.js');
const mother = require('../controllers/mother.js');
const query2 = require('../controllers/query2.js');
const query2All = require('../controllers/query2All.js');
const query1 = require('../controllers/query1.js');

router.route('/counties/:FIPS?/:STATE?').
    get(counties.get);

router.route('/mother/').
    get(mother.get);

router.route('/query1/:percentage?/:income?/:fromTime?/:toTime?').
    get(query1.get);

router.route('/query2/:state?/:fromTime?/:toTime?').
    get(query2.get);

router.route('/query2All/:fromTime?/:toTime?').get(query2All.get);

module.exports = router;
