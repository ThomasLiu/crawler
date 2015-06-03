/**
 * Created by user on 15/5/15.
 */

var fibonacci = require('../models/fibonacci');
var should = require('should');

describe('test/models/fibonacci.models.test.js', function () {
    it('should equal 0 when n === 0', function () {
        fibonacci.fibonacci(0).should.equal(0);
    });

    it('should equal 1 when n === 1', function () {
        fibonacci.fibonacci(1).should.equal(1);
    });

    it('should equal 55 when n === 10', function () {
        fibonacci.fibonacci(10).should.equal(55);
    });

    it('should throw when n > 10', function () {
        (function () {
            fibonacci.fibonacci(11);
        }).should.throw('n should <= 10');
    });

    it('should throw when n < 0', function () {
        (function () {
            fibonacci.fibonacci(-1);
        }).should.throw('n should >= 0');
    });

    it('should throw when n isnt Number', function () {
        (function () {
            fibonacci.fibonacci('呵呵');
        }).should.throw('n should be a Number');
    });
});