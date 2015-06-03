/**
 * Created by user on 2/6/15.
 */
var express = require('express');
var router = express.Router();
var fibonacci = require('../models/fibonacci');

/* GET home page. */
router.get('/fib', function(req, res, next) {
    var n = Number(req.query.n);
    try {
        res.send(String(fibonacci.fibonacci(n)));
    } catch (e) {
        res
            .status(500)
            .send(e.message);
    }
});

module.exports = router;
