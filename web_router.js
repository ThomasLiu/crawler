/**
 * Created by user on 11/6/15.
 */

/**
 * Module dependencies.
 */
var express          = require('express');
var site             = require('./controllers/site');
var fibonacci        = require('./controllers/fibonacci');
var crawler          = require('./controllers/crawler');

var router           = express.Router();


// home page
router.get('/', site.index);
// sitemap
router.get('/sitemap.xml', site.sitemap);

// fibonacci
router.get('/fibonacci/fib', fibonacci.index);

//crawler
router.get('/crawler', crawler.index);
router.get('/crawler/async', crawler.async);

module.exports = router;