var args = require('minimist')(process.argv.slice(2), {
    string: ['port'],
    alias: {
        port: 'p'
    },
    default: {
        port: '9758'
    }
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var User = mongoose.model('User', {
    userId: String
});

var everyauth = require('everyauth');
everyauth.everymodule.findUserById(function(userId, callback) {
    User.findById(userId, callback);
});

var express = require('express');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'))
    .use("/", express.static(__dirname + "/public"))
    .use(cookieParser('Hello'))
    .use(session('World'))
    .use(everyauth.middleware(app));



app.engine('jade', require('jade').__express);

app.get('/', function(req, res) {
    console.log(req.user);
    res.render('home');
});

app.listen(parseInt(args.port), function() {
    console.log("listening on port", args.port);
});