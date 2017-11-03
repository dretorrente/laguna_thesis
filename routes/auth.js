var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');

// var configAuth = require('../config/passport');
var User = require('../models/user');

passport.use('local', new LocalStrategy({passReqToCallback:true},function(req, username, password, done) {
    var username = username.toLowerCase();
    User.findOne({ username: username }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, req.flash('error_msg', 'Unknown username.'));
        user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, req.flash('error_msg', 'Incorrect password.'));
            }
        });
    });
}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.get('/login', function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
    }
    res.render('login',{title: 'Login'});
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    }, function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.redirect('/auth/login')
        }
        req.logIn(user, function (err) {
            if (err){
                console.log(err);
                return next(err);
            }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});


router.get('/register', function(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/')
    }
    res.render('register',{title: 'Register'});
});


router.post('/register', function(req, res, next){
    var username = req.body.username && req.body.username.trim();
    var name = req.body.name && req.body.name.trim();
    var email = req.body.email && req.body.email.trim();
    var gender = req.body.gender && req.body.gender.trim();
    var password = req.body.password;

   
        var user = new User({
            username: username,
            name: name,
            gender: gender,
            email: email.toLowerCase(),
            password: password
        });

        user.save(function(err){
            if (err) {
                res.render('register', {
                    title: 'Register',
                    errors: err,
                    data: {
                        username: username,
                        name: name,
                        gender: gender,
                        email: email
                    }
                });

            } else {
                req.flash('success_msg', 'You are now registered. Log-in to continue.');
                res.redirect('/auth/login');
            }
        });

});



router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/auth/login');
});

// route middleware to ensure user is logged in
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated())
//         return next();
//
//     res.redirect('/');
// }

module.exports = router;