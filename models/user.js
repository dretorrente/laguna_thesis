var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var Moment = require('moment-timezone');
var datetime = require('node-datetime');
var dt;

dt = datetime.create();
var formatted = dt.format('m/d/Y');

var dateTodo = Moment().tz('Singapore').format().replace(/T/, ' ').replace(/\+/g, ' ');
var dateStatus = Moment().tz('Singapore').format('ha z').slice(1,4);
var dateSlice = formatted + ' ' + dateTodo.slice(11,18) + dateStatus;
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },

    upload: {
        type: String,
        required: true
    },
    created_at: { type: String, default:  dateSlice},
    updated_at: {type: String, default:  dateSlice},

    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


UserSchema.plugin(uniqueValidator);
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
module.exports = mongoose.model('User', UserSchema);