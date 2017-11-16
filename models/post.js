var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const postSchema = new Schema({
    status:{
        type: String,
        required: [true,"Status is empty"]
    },
    user_id:{
        type: Schema.Types.ObjectId, ref: 'User',
        required: [true,"User id is undefined"]
    },
    image:{
        type: Schema.Types.ObjectId, ref: 'Image',
    },
    video:{
        type: Schema.Types.ObjectId, ref: 'Video',
    },
    is_share: {
      type: Boolean,
      default: false
    },
    user_shareid: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    created_at: { type: Date, default:  Date.now},
    updated_at: { type: Date, default:  Date.now}
});

module.exports = mongoose.model('Post', postSchema);