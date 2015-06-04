/**
 * Created by user on 2/6/15.
 */
var express = require('express');
var router = express.Router();
var fibonacci = require('../models/fibonacci');

/* GET home page. */
router.get('/fib', function(req, res, next) {
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


});

module.exports = router;
