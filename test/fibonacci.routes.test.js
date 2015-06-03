/**
 * Created by user on 15/5/15.
 */

var app = require('../app');
var supertest = require('supertest');
var request = supertest(app);

var should = require('should');

describe('test/routes/fibonacci.routes.test.js', function () {
    it('should equal 0 when n === 0', function (done) {
        testFib(0, 200, '0', done);
    });

    it('should equal 1 when n === 1', function (done) {
        testFib(1, 200, '1', done);
    });

    it('should equal 55 when n === 10', function (done) {
        testFib(10, 200, '55', done);
    });

    it('should throw when n > 10', function (done) {
        testFib(11, 500, 'n should <= 10', done);
    });

    it('should throw when n < 0', function (done) {
        testFib(-1, 500, 'n should >= 0', done);
    });

    it('should throw when n isnt Number', function (done) {
        testFib('good', 500, 'n should be a Number', done);
    });

    it('should status 500 when error', function (done) {
        request.get('/fibonacci/fib')
            .query({n: 100})
            .expect(500)
            .end(function (err, res) {
                done(err);
            });
    });

    var testFib = function (n, statusCode, expect, done){
        request.get('/fibonacci/fib')
            .query({n: n})
            .expect(statusCode)
            .end(function (err, res) {
                res.text.should.equal(expect);
                done(err);
            })
    }
});