var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require("url");
var debug = require('debug')('crawler:server');

/* GET crawler listing. */
exports.index = function (req, res, next) {
    var cnodeUrl = 'https://cnodejs.org/';
    superagent.get(cnodeUrl)
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }
            var topicUrls = [];
            var $ = cheerio.load(sres.text);

            $('#topic_list .topic_title').each(function (idx, element) {
                var $element = $(element);
                var href = url.resolve(cnodeUrl,$element.attr('href'));

                topicUrls.push(href);
            });
            var ep = new eventproxy();

            ep.after('topic_html',topicUrls.length, function(topics){
                topics = topics.map(function(topicPair){
                    var topicUrl = topicPair[0];
                    var topicHtml = topicPair[1];
                    var $ = cheerio.load(topicHtml);
                    return ({
                        title: $('.topic_full_title').text().trim(),
                        href: topicUrl,
                        comment1: $('.reply_content').eq(0).text().trim()
                    });
                });
                console.log('final:');
                console.log(topics);

                res.render('crawler', {
                    datas: topics
                });
            });

            topicUrls.forEach(function(topicUrl){
                superagent.get(topicUrl)
                    .end(function(err, res){
                        console.log('fetch ' + topicUrl + ' successful');
                        ep.emit('topic_html',[topicUrl, res.text]);
                    });
            });

        });
}

var async = require('async');

exports.async = function (req, res, next) {
    var cnodeUrl = 'https://cnodejs.org/';
    superagent.get(cnodeUrl)
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }
            var topicUrls = [];
            var $ = cheerio.load(sres.text);

            $('#topic_list .topic_title').each(function (idx, element) {
                var $element = $(element);
                var href = url.resolve(cnodeUrl, $element.attr('href'));

                topicUrls.push(href);
            });

            var ep = new eventproxy();

            ep.after('topic_html',topicUrls.length, function(topics){
                topics = topics.map(function(topicPair){
                    var topicUrl = topicPair[0];
                    var topicHtml = topicPair[1];
                    var $ = cheerio.load(topicHtml);
                    return ({
                        title: $('.topic_full_title').text().trim(),
                        href: topicUrl,
                        comment1: $('.reply_content').eq(0).text().trim()
                    });
                });
                console.log('final:');
                console.log(topics);

                res.render('crawler', {
                    datas: topics
                });
            });

            var concurrencyCount = 0;
            var fetchUrl = function (url, callback) {
                var delay = parseInt((Math.random() * 10000000) % 2000, 10);
                concurrencyCount++;
                console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
                superagent.get(url)
                    .end(function(err, res){
                        console.log('fetch ' + url + ' successful');
                        ep.emit('topic_html',[url, res.text]);
                    });
                setTimeout(function() {
                    concurrencyCount--;
                    callback(null, url + ' html content');
                }, delay);
            }

            async.mapLimit(topicUrls, 5, function(url,callback){
                fetchUrl(url, callback);
            }, function (err, result) {
                console.log('final:');
                console.log(result);
            });
        });

}




