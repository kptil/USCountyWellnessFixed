const query2All = require('../db_apis/query2All.js');

async function get(req, res, next) {

    try {
        const context = {};
        context.fromTime = req.params.fromTime;
        context.toTime = req.params.toTime;
        const rows = await query2All.find(context);
        res.status(200).json(rows);

    } catch (err) {
        next(err);
    }
}
module.exports.get = get;