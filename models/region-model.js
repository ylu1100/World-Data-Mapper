const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		due_date: {
			type: String,
			required: true
		},
		assigned_to: {
			type: String,
			required: true
		},
		completed: {
			type: Boolean,
			required: true
		}
	}
);

const Region = model('Region', regionSchema);
module.exports = Region;