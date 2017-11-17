
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const messageSchema = new Schema({
	thread_id:
	sender_id:
	receiver_id:
	message:
	status:{
        type: String,
        required: [true,"Media is empty"]
    },

    created_at: { type: Date, default:  Date.now},
    updated_at: { type: Date, default:  Date.now}
});

module.exports = mongoose.model('Message', messageSchema);