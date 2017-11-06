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

const imageSchema = new Schema({
    name:{
        type: String,
        required: [true,"Media is empty"]
    },
    created_at: { type: String, default:  dateSlice},
    updated_at: { type: String, default:  dateSlice}
});

module.exports = mongoose.model('Image', imageSchema);