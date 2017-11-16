
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const videoSchema = new Schema({
    name:{
        type: String,
        required: [true,"Video is empty"]
    },
    created_at: { type: Date, default:  Date.now},
    updated_at: { type: Date, default:  Date.now}
});

module.exports = mongoose.model('Video', videoSchema);