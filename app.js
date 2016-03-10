/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var multer  = require('multer');
var async = require('async');

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./routes/user');
var account = require('./routes/account');
var cpanel = require('./routes/cpanel');
var plan = require('./routes/plan');
var Match = require('./models/Match');
var Branch = require('./models/Branch');

var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: path.join(__dirname, 'uploads') }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//app.use(lusca({
//  csrf: true,
//  xframe: 'SAMEORIGIN',
//  xssProtection: true
//}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/user',function(req,res){
    res.send(200,{
        user:req.user
    });
});
app.get('/bleh',function(req,res){
    var obj = [
        {
            date:'15 march 2016',
            t1:'IND',
            t2:'NZ',
            venue:'Nagpur'
        },
        {
            date:'16 march 2016',
            t1:'WI',
            t2:'ENG',
            venue:'Mumbai'
        },
        {
            date:'16 march 2016',
            t1:'PAK',
            t2:'Q1A',
            venue:'Kolkata'
        },
        {
            date:'17 march 2016',
            t1:'SL',
            t2:'Q1B',
            venue:'Kolkata'
        },
        {
            date:'19 march 2016',
            t1:'AUS',
            t2:'NZ',
            venue:'Dharamsala'
        },
        {
            date:'18 march 2016',
            t1:'RSA',
            t2:'ENG',
            venue:'Mumbai'
        },
        {
            date:'19 march 2016',
            t1:'PAK',
            t2:'IND',
            venue:'Dharamsala'
        },
        {
            date:'20 march 2016',
            t1:'RSA',
            t2:'Q1B',
            venue:'Mumbai'
        },
        {
            date:'20 march 2016',
            t1:'SL',
            t2:'WI',
            venue:'Bengaluru'
        },
        {
            date:'21 march 2016',
            t1:'AUS',
            t2:'Q1A',
            venue:'Bengaluru'
        },
        {
            date:'22nd march 2016',
            t1:'PAK',
            t2:'NZ',
            venue:'Mohali'
        },
        {
            date:'23 march 2016',
            t1:'ENG',
            t2:'Q1B',
            venue:'New Delhi'
        },
        {
            date:'23 march 2016',
            t1:'IND',
            t2:'Q1A',
            venue:'Bengaluru'
        },
        {
            date:'25 march 2016',
            t1:'PAK',
            t2:'AUS',
            venue:'Mohali'
        },
        {
            date:'25 march 2016',
            t1:'RSA',
            t2:'WI',
            venue:'Nagpur'
        }
        ,{
            date:'26 march 2016',
            t1:'NZ',
            t2:'Q1A',
            venue:'Kolkata'
        },
        {
            date:'26 march 2016',
            t1:'ENG',
            t2:'SL',
            venue:'New Delhi'
        },
        {
            date:'27 march 2016',
            t1:'IND',
            t2:'AUS',
            venue:'Mohali'
        }
    ];
    async.each(obj,function(i,callback){
        var match = new Match({
            date: i.date,
            team1: i.t1,
            team2: i.t2,
            venue: i.venue
        });
        match.save(function(err){
            if(err){
                console.log(err);
                callback();
            }else{
                console.log("saved!!!!")
                callback();
            }
        });
    },function(err){
        if(!err){
            console.log("all the dat ahas been saved!!");
            res.send(200);
        }else{
            res.send(500);
        }
    })
});
app.get('/meh',function(req,res){
    var obj = [
        {
            city: "Nagpur",
            room:[{
                type: "Classic King Room",
                price: 2000,
                availableCount: 4
            },
                {
                    type: "Presedential Suite",
                    price: 3000,
                    availableCount: 3
                },
                {
                    type: "Deluxe Twin Room",
                    price: 8000,
                    availableCount: 2
                },

                {
                    type: "Suite",
                    price: 1000,
                    availableCount: 1
                }],
            airport: 600,
            tax: 20
        },
        {
            city: "New Delhi",
            room:[{
                type: "Classic King Room",
                price: 8000,
                availableCount: 2
            },
                {
                    type: "Presedential Suite",
                    price: 5000,
                    availableCount: 2
                },
                {
                    type: "Deluxe Twin Room",
                    price: 1000,
                    availableCount: 2
                },

                {
                    type: "Suite",
                    price: 2000,
                    availableCount: 2
                }],
            airport: 60,
            tax: 30
        },
        {
            city: "Mumbai",
            room:[{
                type: "Classic King Room",
                price: 2000,
                availableCount: 40
            },
                {
                    type: "Presedential Suite",
                    price: 300,
                    availableCount: 30
                },
                {
                    type: "Deluxe Twin Room",
                    price: 800,
                    availableCount: 20
                },

                {
                    type: "Suite",
                    price: 100,
                    availableCount: 10
                }],
            airport: 600,
            tax: 20
        },
        {
            city: "Kolkata",
            room:[{
                type: "Classic King Room",
                price: 2000,
                availableCount: 4
            },
                {
                    type: "Presedential Suite",
                    price: 13000,
                    availableCount: 31
                },
                {
                    type: "Deluxe Twin Room",
                    price: 18000,
                    availableCount: 21
                },

                {
                    type: "Suite",
                    price: 11000,
                    availableCount: 11
                }],
            airport: 600,
            tax: 20
        },
        {
            city: "Dharamsala",
            room:[{
                type: "Classic King Room",
                price: 2000,
                availableCount: 1
            },
                {
                    type: "Presedential Suite",
                    price: 1000,
                    availableCount: 2
                },
                {
                    type: "Deluxe Twin Room",
                    price: 2000,
                    availableCount: 3
                },

                {
                    type: "Suite",
                    price: 3000,
                    availableCount: 4
                }],
            airport: 100,
            tax: 10
        },
        {
            city: "Mohali",
            room:[{
                type: "Classic King Room",
                price: 1000,
                availableCount: 7
            },
                {
                    type: "Presedential Suite",
                    price: 2000,
                    availableCount: 2
                },
                {
                    type: "Deluxe Twin Room",
                    price: 6000,
                    availableCount: 10
                },

                {
                    type: "Suite",
                    price: 100,
                    availableCount: 5
                }],
            airport: 100,
            tax: 10
        }
    ];
    async.each(obj,function(i,callback){
        var branch = new Branch({
            city: i.city,
            room: i.room,
            airport: i.airport,
            tax: i.tax
        });
        branch.save(function(err){
            if(err){
                console.log(err);
                callback();
            }else{
                console.log("saved!!!!")
                callback();
            }
        });
    },function(err){
        if(!err){
            console.log("all the dat ahas been saved!!");
            res.send(200);
        }else{
            res.send(500);
        }
    })
});
app.get('/');
app.use('/plan', passportConf.isAuthenticated, plan);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.use('/account', account);
app.use('/user', passportConf.isAuthenticated, account);
app.use('/account/ask', passportConf.isAuthenticated, account);
app.post('/account/update', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.use('/controlPanel', cpanel);

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postTwitter);
app.get('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getVenmo);
app.post('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postVenmo);
app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);
app.get('/api/instagram', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getInstagram);
app.get('/api/yahoo', apiController.getYahoo);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
app.get('/api/bitgo', apiController.getBitGo);
app.post('/api/bitgo', apiController.postBitGo);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/account/ask');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/account/ask');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/account/ask');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/venmo');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
