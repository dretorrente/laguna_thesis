
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const messageSchema = new Schema({
    thread_id:{
        type: Schema.Types.ObjectId, ref: 'Thread',
        required: [true,"Thread id is undefined"]
    },
	sender_id: {
    	type: String,
		required: true,
	},
	receiver_id: {
    	type: String,
		required: true
	},
	message: {
    	type: String,
		required: true,
	},

    status: {
        type: String,
        enum: ['unread', 'read'],
		default: 'unread'
    },

    created_at: { type: Date, default:  Date.now},
    updated_at: { type: Date, default:  Date.now}
});

module.exports = mongoose.model('Message', messageSchema);