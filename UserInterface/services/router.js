const express = require('express');
const router = new express.Router();
const counties = require('../controllers/counties.js');
const mother = require('../controllers/mother.js');
const query2State = require('../controllers/query2.js');
const query2All = require('../controllers/query2All');

router.route('/counties/:FIPS?/:STATE?').
    get(counties.get);

router.route('/mother/').
    get(mother.get);

router.route('/query2/:state?/:fromTime?/:toTime?').
    get(query2State.get);

router.route('/query2/:fromTime?/:toTime?').get(query2All.get);

module.exports = router;
