const query1 = require('../db_apis/query1.js');

async function get(req, res, next) {

    try {
        const context = {};
        context.percentage = req.params.percentage;
        context.income = req.params.income;
        context.fromTime = req.params.fromTime;
        context.toTime = req.params.toTime;
        const rows = await query1.find(context);
        res.status(200).json(rows);

    } catch (err) {
        next(err);
    }
}
module.exports.get = get;