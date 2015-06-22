/**
 * Created by user on 11/6/15.
 */

/**
 * Module dependencies.
 */
var express          = require('express');
var site             = require('./controllers/site');
var sign             = require('./controllers/sign');
var fibonacci        = require('./controllers/fibonacci');
var crawler          = require('./controllers/crawler');
var config           = require('./config');

var router           = express.Router();


// home page
router.get('/', site.index);
// sitemap
router.get('/sitemap.xml', site.sitemap);

if (config.allow_sign_up) {
    router.get('/signup', sign.showSignup); // 跳转到注册界面
    router.post('/signup', sign.signup);  // 提交注册信息
}


// fibonacci
router.get('/fibonacci/fib', fibonacci.index);

//crawler
router.get('/crawler', crawler.index);
router.get('/crawler/async', crawler.async);

module.exports = router;