
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const imageSchema = new Schema({
    name:{
        type: String,
        required: [true,"Media is empty"]
    },
    created_at: { type: Date, default:  Date.now},
    updated_at: { type: Date, default:  Date.now}
});

module.exports = mongoose.model('Image', imageSchema);