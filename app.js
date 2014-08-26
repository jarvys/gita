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

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
        clientID: 'b7d35389f119c233543a',
        clientSecret: 'f9ce7b33c8e1ece52203fb7b267b812f3ffcb857',
        callbackURL: "http://gita.jarvys.me/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {

            // To keep the example simple, the user's GitHub profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the GitHub account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

var express = require('express');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'))
    .use("/", express.static(__dirname + "/public"))
    .use(cookieParser('Hello'))
    .use(session('World'))
    .use(passport.initialize())
    .use(passport.session())
    .engine('jade', require('jade').__express);

app.get('/', function(req, res) {
    console.log(req.user);
    res.json({
        hello: 'world'
    });
});

app.get('/auth/github',
    passport.authenticate('github'),
    function(req, res) {

    });

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });

app.listen(parseInt(args.port), function() {
    console.log("listening on port", args.port);
});

