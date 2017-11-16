var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var User = require('../models/user');
var multer = require('multer');
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images/');
    },
    filename: function (req, file, callback) {
        callback(null,Date.now() + "-" + file.originalname);
    }
});
var uploads = multer({ storage : storage});

passport.use('local', new LocalStrategy({passReqToCallback:true, usernameField: 'email'},function(req, email, password, done) {
    var email = email.toLowerCase();
    User.findOne({ email: email }, function(err, user) {
        if (err)  return done(err);
        if (!user) return done(null, false, req.flash('error_msg', 'Unknown email.'));
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
                return next(err);
            } else{
                var collection = User.find();
                collection.update({ '_id': ObjectId(user._id) }, {$set: {is_login: true} }, function(err, entry) {
                    // User.find({email:user.email}).updateOne({$set:{is_login:true}});
                    return res.redirect('/dashboard');
                });
            }
            //
        });
    })(req, res, next);
});


router.get('/register', function(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/')
    }
    res.render('register',{title: 'Register'});
});


router.post('/register', uploads.single('upload'), function(req, res, next){
    var username = req.body.username && req.body.username.trim();
    var name = req.body.name && req.body.name.trim();
    var email = req.body.email && req.body.email.trim();
    var gender = req.body.gender && req.body.gender.trim();
    var password = req.body.password;
    var image    = req.file.filename;
    var user = new User({
        username: username,
        name: name,
        gender: gender,
        email: email.toLowerCase(),
        password: password,
        upload: image
    });
    var ext = image.substr(image.lastIndexOf('.') + 1);
    if(ext === 'jpg' || ext === 'png' || ext === 'jpeg') {
        user.save(function(err){
            if (err) {
                res.render('register', {
                    title: 'Register',
                    errors: err.errors.email.message,
                    data: {
                        username: username,
                        name: name,
                        gender: gender,
                        email: req.body.email
                    }
                });
            }else{
                req.flash('success_msg', 'You are now registered. Log-in to continue.');
                res.redirect('/auth/login');
            }
        });
    } else {
        res.render('register', {
            title: 'Register',
            invalid: {upload: 'invalid image'},
            data: {
                username: username,
                name: name,
                gender: gender,
                email: req.body.email
            }
        });
    }


});


router.get('/logout', function(req, res){
    var collection = User.find();
    collection.update({ '_id': ObjectId(req.user.id) }, {$set: {is_login: false} }, function(err, entry) {
        req.logout();
        req.flash('success_msg', 'You are logged out!');
        res.redirect('/auth/login');
    });

});

module.exports = router;