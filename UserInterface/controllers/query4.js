const query4 = require('../db_apis/query4.js');

async function get(req, res, next) {

    try {
        const context = {};
        context.percent = req.params.percent;
        context.fromTime = req.params.fromTime;
        context.toTime = req.params.toTime;
        const rows = await query4.find(context);
        res.status(200).json(rows);

    } catch (err) {
        next(err);
    }
}
module.exports.get = get;