
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const likeSchema = new Schema({
    post_id:{
        type: Schema.Types.ObjectId, ref: 'Post',
        required: [true,"Post id is undefined"]
    },
    user_id:{
        type: Schema.Types.ObjectId, ref: 'User',
        required: [true,"User id is undefined"]
    },
    is_like: {
        type: Boolean,
        default: false
    },
    created_at: { type: Date, default:  Date.now},
    updated_at: { type: Date, default:  Date.now}
});

module.exports = mongoose.model('Like', likeSchema);