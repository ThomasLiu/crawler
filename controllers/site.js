/**
 * Created by user on 11/6/15.
 */

var xmlbuilder   = require('xmlbuilder');
var eventproxy   = require('eventproxy');
var cache        = require('../common/cache');

exports.index = function (req, res, next) {
    res.render('index', { title: 'Express'});
}

exports.sitemap = function (req, res, next){
    var urlset = xmlbuilder.create('urlset',
        {version: '1.0', encoding: 'UTF-8'});
    urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    var ep = new eventproxy();
    ep.fail(next);

    ep.all('sitemap', function (sitemap) {
       res.type('xml');
        res.send(sitemap);
    });
}