
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const threadSchema = new Schema({
    created_at: { type: Date, default:  Date.now},
    updated_at: { type: Date, default:  Date.now}
});

module.exports = mongoose.model('Thread', threadSchema);