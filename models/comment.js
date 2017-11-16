
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const commmentSchema = new Schema({
    comment:{
        type: String,
        required: [true,"Comment is empty"]
    },
    post_id:{
        type: Schema.Types.ObjectId, ref: 'Post',
        required: [true,"Post id is undefined"]
    },
    user_id:{
        type: Schema.Types.ObjectId, ref: 'User',
        required: [true,"User id is undefined"]
    },
    created_at: { type: Date, default:  Date.now},
    updated_at: { type: Date, default:  Date.now}
});

module.exports = mongoose.model('Comment', commmentSchema);