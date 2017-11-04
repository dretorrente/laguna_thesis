var Moment = require('moment-timezone');
var datetime = require('node-datetime');
var dt;

dt = datetime.create();
var formatted = dt.format('m/d/Y');

var dateTodo = Moment().tz('Singapore').format().replace(/T/, ' ').replace(/\+/g, ' ');
var dateStatus = Moment().tz('Singapore').format('ha z').slice(1,4);
var dateSlice = formatted + ' ' + dateTodo.slice(11,18) + dateStatus;
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const postSchema = new Schema({
    name:{
        type: String,
        required: [true,"Status is empty"]
    },
    user_id:{
        type: Schema.Types.ObjectId, ref: 'User',
        required: [true,"User id is undefined"]
    },
    created_at: { type: String, default:  dateSlice},
    updated_at: { type: String, default:  dateSlice}
});

module.exports = mongoose.model('Post', postSchema);