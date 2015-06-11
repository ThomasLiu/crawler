/**
 * Created by user on 2/6/15.
 */
var fibonacci = require('../models/fibonacci');


exports.index = function (req, res, next) {
    var n = req.query.n;
    if (/\d+/.test(n)) {
        var numN = Number(n);
        try {
            res.send(String(fibonacci.fibonacci(numN)));
        } catch (e) {
            res
                .status(500)
                .send(e.message);
        }
    }else{
        res
            .status(500)
            .send('n should be a Number');
    }

}
