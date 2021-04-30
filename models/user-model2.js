const { model, Schema, ObjectId } = require('mongoose');

const userSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		fullName: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password:{
			type: String,
			required: true
		},
		maps:{
			type:Array
		},
	},
	{ timestamps: true }
);

const User = model('User', userSchema);
module.exports = User;