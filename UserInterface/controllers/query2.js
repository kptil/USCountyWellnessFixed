const query2 = require('../db_apis/query2.js');

async function get(req, res, next) {

    try {
        const context = {};
        context.state = req.params.state;
        context.fromTime = req.params.fromTime;
        context.toTime = req.params.toTime;
        const rows = await query2.find(context);
        res.status(200).json(rows);

    } catch (err) {
        next(err);
    }
}
module.exports.get = get;
