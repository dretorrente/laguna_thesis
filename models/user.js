var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    email: {
        index: true,
        type: String,
        lowercase: true,
        required: true,
        validate: {
            isAsync: true,
            validator: function(value, isValid) {
                const self = this;
                return self.constructor.findOne({ email: value })
                    .exec(function(err, user){
                        if(err){
                            throw err;
                        }
                        else if(user) {
                            if(self.id === user.id) {  // if finding and saving then it's valid even for existing email
                                return isValid(true);
                            }
                            return isValid(false);
                        }
                        else{
                            return isValid(true);
                        }

                    })
            },
            message:  'The email address is already taken!'
        },
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
    is_login: {
      type: Boolean,
      default: false
    },
    created_at: { type: Date, default:  Date.now},
    updated_at: { type: Date, default:  Date.now},

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