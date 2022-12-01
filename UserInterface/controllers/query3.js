const query3 = require('../db_apis/query3.js');

async function get(req, res, next) {

    try {
        const context = {};
        context.race = req.params.race;
        context.fromTime = req.params.fromTime;
        context.toTime = req.params.toTime;
        const rows = await query3.find(context);
        res.status(200).json(rows);

    } catch (err) {
        next(err);
    }
}
module.exports.get = get;