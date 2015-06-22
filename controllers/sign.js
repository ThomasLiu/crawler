/**
 * Created by user on 14/6/15.
 */
var validator = require('validator');
var eventproxy = require('eventproxy');
var tools = require('../common/tools');
var User = require('../proxy').User;
var utility        = require('utility');
var mail           = require('../common/mail');
var config         = require('../config');

//sign up
exports.showSignup = function (req, res) {
    res.render('sign/signup')
}

exports.signup = function (req, res, next) {
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var email = validator.trim(req.body.email).toLowerCase();
    var pass = validator.trim(req.body.pass);
    var rePass = validator.trim(req.body.re_pass);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        res.status(422);
        res.render('sign/signup', {error: msg, loginname: loginname, email: email});
    });

    // 验证信息的正确性
    if ([loginname, pass, rePass, email].some(function (item) { return item === '';})) {
        return ep.emit('prop_err', '信息不完整。');
    }
    if (loginname.length < 5) {
        return ep.emit('prop_err', '用户名至少需要5个字符。');
    }
    if (!tools.validateId(loginname)) {
        return ep.emit('prop_err', '用户名不合法。');
    }
    if (!validator.isEmail(email)) {
        return ep.emit('prop_err', '邮箱不合法。');
    }
    if (pass !== rePass) {
        return ep.emit('prop_err', '两次密码输入不一致。');
    }
    // END 验证信息的正确性

    User.getUsersByQuery({'$or': [
        {'loginname': loginname},
        {'email': email}
    ]}, {}, function (err, users) {
        if (err) {
            return next(err);
        }
        if (users.length > 0) {
            return ep.emit('prop_err', '用户名或邮箱已被使用。');
        }

        tools.bhash(pass, ep.done(function (passhash) {
            // create gracatar
            var avataUrl = User.makeGravatar(email);
            User.newAndSave(loginname, loginname, passhash, email, avataUrl, false, function (err) {
                if (err) {
                    return next(err);
                }
                // 发送激活邮件
                mail.sendActiveMail(email, utility.md5(email + passhash + config.session_secret), loginname);
                res.render('sign/signup', {
                    success: '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
                });
            });
        }));
    });

};